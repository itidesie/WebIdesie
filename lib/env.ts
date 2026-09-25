/**
 * 🔒 Secretos propios de la aplicación, independientes de Supabase.
 *
 * Antes, la firma de las cookies de sesión de admin y el hash del limitador se
 * derivaban de `SUPABASE_SERVICE_ROLE_KEY`: rotar la clave de la base de datos
 * invalidaba las sesiones, y cualquier fuga de esa clave permitía además
 * FALSIFAR una cookie de admin. Ahora cada uso tiene su variable:
 *
 *   ADMIN_SESSION_SECRET  → firma y verifica la cookie `admin-auth`
 *   RATE_LIMIT_SECRET     → HMAC de las claves (IP, email) del limitador
 *
 * Generar cada una con:  openssl rand -base64 48
 *
 * Sin valores por defecto ni fallbacks: si falta una, o es demasiado corta, se
 * lanza un error. `assertRequiredEnv()` lo hace al arrancar el servidor
 * (instrumentation.ts) y `getRequiredSecret()` vuelve a comprobarlo en cada uso
 * (imprescindible en el middleware, que corre en el runtime Edge y no pasa por
 * el arranque).
 *
 * Sin `server-only` a propósito: lo importa `middleware.ts` (Edge).
 */

export type SecretName = "ADMIN_SESSION_SECRET" | "RATE_LIMIT_SECRET"

const REQUIRED_SECRETS: readonly SecretName[] = ["ADMIN_SESSION_SECRET", "RATE_LIMIT_SECRET"]

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
    "Genera cada secreto con:  openssl rand -base64 48",
    `Y defínelos en .env.local (desarrollo) y en las variables de entorno de Vercel: ${names.join(", ")}.`,
    "Deben ser DISTINTOS entre sí y distintos de cualquier clave de Supabase.",
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

  // Deben ser independientes: reutilizar un valor entre usos o copiar una clave
  // de Supabase reintroduce exactamente el acoplamiento que se quiere evitar.
  if (problems.length === 0) {
    const values = REQUIRED_SECRETS.map((n) => process.env[n] as string)
    if (new Set(values).size !== values.length) {
      problems.push(`${REQUIRED_SECRETS.join(" y ")} tienen el mismo valor; deben ser secretos distintos`)
    }
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (supabaseKey && values.includes(supabaseKey)) {
      problems.push("un secreto de la aplicación es igual a SUPABASE_SERVICE_ROLE_KEY; deben ser independientes")
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
