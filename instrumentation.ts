/**
 * Hook de arranque de Next. Se ejecuta una vez por proceso de servidor.
 * Lo usamos solo para avisar de qué servicios están simulados.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return
  const { warnMockServices } = await import("./lib/mock-mode")
  warnMockServices()
}
