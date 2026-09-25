/**
 * Hook de arranque de Next. Se ejecuta una vez por proceso de servidor.
 * Lo usamos para (1) abortar el arranque si falta algún secreto obligatorio y
 * (2) avisar de qué servicios están simulados.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  // 🔒 Sin ADMIN_SESSION_SECRET / RATE_LIMIT_SECRET la app NO arranca: nada de
  // fallbacks silenciosos que dejarían sesiones firmadas con una clave conocida.
  const { assertRequiredEnv } = await import("./lib/env")
  assertRequiredEnv()

  const { warnMockServices } = await import("./lib/mock-mode")
  warnMockServices()

  // 🔒 Aviso (no aborta) si el remitente de Resend no está bien configurado.
  const { checkResendSender } = await import("./lib/resend")
  checkResendSender()
}
