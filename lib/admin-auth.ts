import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAdminSession } from "@/lib/admin-session"

export async function checkAdminAuth() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("admin-auth")
  const session = await verifyAdminSession(authCookie?.value)

  if (!session) {
    redirect("/admin/login")
  }

  return true
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("admin-auth")
  const session = await verifyAdminSession(authCookie?.value)

  return !!session
}

export class AdminAuthError extends Error {
  constructor() {
    super("No autorizado")
    this.name = "AdminAuthError"
  }
}

/**
 * 🔒 Comprobación de sesión de admin para Server Actions.
 *
 * `middleware.ts` solo protege las PÁGINAS de `/admin/*`; una Server Action
 * exportada desde un archivo `"use server"` es un endpoint POST en sí mismo y
 * no pasa por esa protección. Toda acción que lea o escriba datos
 * de gestión debe llamar a esta función como PRIMERA instrucción, antes de
 * cualquier acceso a datos y FUERA de cualquier try/catch que se trague
 * errores (varias acciones de lectura devuelven `[]` si algo falla: sin
 * esto, un fallo de autorización se convertiría en una lista vacía silenciosa
 * en vez de un error).
 *
 * Lanza `AdminAuthError` si no hay una sesión válida (firma correcta, fila
 * en `admin_sessions` activa, no revocada, no caducada). No sustituye a la
 * "clave secreta" que piden las escrituras: la complementa. Antes, esa clave
 * era lo único que protegía una escritura, y llamada como Server Action
 * directa no tenía ningún límite de intentos.
 */
export async function requireAdmin() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("admin-auth")
  const session = await verifyAdminSession(authCookie?.value)

  if (!session) {
    throw new AdminAuthError()
  }

  return session
}
