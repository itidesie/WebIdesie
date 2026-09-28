/**
 * 🔒 Secretos propios de la aplicación, independientes de Supabase.
 *
 * Antes, el hash del limitador se derivaba de `SUPABASE_SERVICE_ROLE_KEY`:
 * rotar la clave de la base de datos invalidaba el limitador. Ahora tiene su
 * propia variable:
 *
 *   RATE_LIMIT_SECRET  → HMAC de las claves (IP, email) del limitador
 *
 * Generar con:  openssl rand -base64 48
 *
 * (El panel de administración y su `ADMIN_SESSION_SECRET` ya no existen en
 * el proyecto — eliminados por completo. Si algún día vuelve a hacer falta
 * un panel de gestión, este archivo es donde añadir su secreto de nuevo.)
 *
 * Sin valores por defecto ni fallbacks: si falta, o es demasiado corta, se
 * lanza un error. `assertRequiredEnv()` lo hace al arrancar el servidor
 * (instrumentation.ts) y `getRequiredSecret()` vuelve a comprobarlo en cada uso.
 */

export type SecretName = "RATE_LIMIT_SECRET"

const REQUIRED_SECRETS: readonly SecretName[] = ["RATE_LIMIT_SECRET"]

/** 32 caracteres = 192 bits con `openssl rand -base64 48` (64 caracteres); mínimo razonable. */
const MIN_SECRET_LENGTH = 32

function problemWith(name: SecretName): string | null {
  const value = process.env[name]
  if (value === undefined || value.trim() === "") return `${name} no está definida`
  if (value.length < MIN_SECRET_LENGTH) {
    return `${name} es demasiado corta (${value.length} caracteres; mínimo ${MIN_SECRET_LENGTH})`
  }
  return null
}

function fixHint(names: readonly string[]): string {
  return [
    "Genera el secreto con:  openssl rand -base64 48",
    `Y defínelo en .env.local (desarrollo) y en las variables de entorno de Vercel: ${names.join(", ")}.`,
    "Debe ser distinto de cualquier clave de Supabase.",
  ].join("\n")
}

/** Devuelve el secreto o lanza un error claro. Sin fallback. */
export function getRequiredSecret(name: SecretName): string {
  const problem = problemWith(name)
  if (problem) {
    throw new Error(`[env] ${problem}.\n${fixHint([name])}`)
  }
  return process.env[name] as string
}

/**
 * Comprueba TODOS los secretos obligatorios de una vez (para que el error
 * liste todo lo que falta, no solo lo primero). Se llama al arrancar.
 */
export function assertRequiredEnv(): void {
  const problems = REQUIRED_SECRETS.map(problemWith).filter((p): p is string => p !== null)

  // Debe ser independiente: reutilizar una clave de Supabase reintroduce
  // exactamente el acoplamiento que se quiere evitar.
  if (problems.length === 0) {
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const value = process.env.RATE_LIMIT_SECRET as string
    if (supabaseKey && value === supabaseKey) {
      problems.push("RATE_LIMIT_SECRET es igual a SUPABASE_SERVICE_ROLE_KEY; deben ser independientes")
    }
  }

  if (problems.length > 0) {
    throw new Error(
      [
        "",
        "[env] ⛔ La aplicación no puede arrancar: configuración de secretos inválida.",
        ...problems.map((p) => `  · ${p}`),
        fixHint(REQUIRED_SECRETS),
        "",
      ].join("\n"),
    )
  }
}
