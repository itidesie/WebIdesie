/**
 * Modo mock para desarrollo sin credenciales.
 *
 * Un servicio entra en modo mock SOLO si se cumplen las dos condiciones:
 *   1. NODE_ENV !== "production"
 *   2. Falta su variable de entorno
 *
 * En producción nunca se activa: si allí falta una clave, el código falla
 * ruidosamente igual que antes, en vez de servir datos falsos en silencio.
 */

export const SERVICES = {
  // Puerta de mock única para TODO lo que pasa por Supabase — blog, admin,
  // productos, solicitudes de admisión y leads comparten la misma
  // credencial (un proyecto de Supabase, una service_role key), así que no
  // tiene sentido una llave de mock por funcionalidad como pasaba antes
  // (DATABASE_URL para blog/admin, POSTGRES_URL para productos, cada una
  // configurable por separado contra dos bases de datos distintas). Decisión
  // explícita del cliente: una sola llave para todo, más simple, más fiel a
  // cómo funciona Supabase de verdad. Ver CLAUDE.md §0.
  SUPABASE_SERVICE_ROLE_KEY: { label: "Supabase (blog, admin, tienda, solicitudes, leads)", effect: "datos de ejemplo / no persistido" },
  RESEND_API_KEY: { label: "Resend", effect: "emails no enviados" },
} as const

export type EnvVar = keyof typeof SERVICES

const isProduction = () => process.env.NODE_ENV === "production"

/** true si hay que sustituir el servicio por su equivalente simulado. */
export function isMock(envVar: EnvVar): boolean {
  return !isProduction() && !process.env[envVar]
}

/** Variables ausentes que han activado el modo mock. */
export function mockedServices(): EnvVar[] {
  return (Object.keys(SERVICES) as EnvVar[]).filter(isMock)
}

const alreadyLogged = new Set<string>()

/**
 * Registra una llamada interceptada. Se agrupa por clave para no inundar la
 * consola cuando una misma consulta se repite en cada render.
 */
export function logMock(scope: string, detail: string): void {
  const key = `${scope}:${detail}`
  if (alreadyLogged.has(key)) return
  alreadyLogged.add(key)
  console.warn(`[MOCK] ${scope} — ${detail}`)
}

/** Banner de arranque. Lo invoca instrumentation.ts una vez por proceso. */
export function warnMockServices(): void {
  const mocked = mockedServices()
  if (mocked.length === 0) return

  const width = Math.max(...mocked.map((v) => SERVICES[v].label.length))
  const lines = mocked.map((v) => `   · ${SERVICES[v].label.padEnd(width)}  →  ${SERVICES[v].effect}`)

  console.warn(
    [
      "",
      "⚠  MODO MOCK ACTIVO — los siguientes servicios NO son reales:",
      ...lines,
      "",
      "   Los datos que veas son ficticios y los envíos no salen a ningún sitio.",
      "   Copia .env.example a .env.local y rellena las claves para usar los servicios reales.",
      "",
    ].join("\n"),
  )
}
