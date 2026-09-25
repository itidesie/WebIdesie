import "server-only"
import bcrypt from "bcryptjs"
import { getSupabaseServerClient } from "@/lib/supabase/server"

/**
 * Formato bcrypt completo: `$2a|2b|2y$<coste>$<22 de sal + 31 de hash>` (60 caracteres).
 * Cualquier otro valor en `password_hash` (texto plano heredado, cadena vacía,
 * otro algoritmo...) NO es una credencial válida y esa fila no puede iniciar sesión.
 */
const BCRYPT_HASH_RE = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/

/**
 * Hash bcrypt (coste 12) de un valor aleatorio que no corresponde a ninguna
 * contraseña real. Solo sirve para gastar el mismo tiempo de CPU cuando no hay
 * ninguna fila con un hash válido contra la que comparar, de modo que la
 * respuesta no delate por tiempo si un usuario existe o tiene el hash roto.
 */
const DUMMY_BCRYPT_HASH = "$2b$12$tGEQSL2/2waXAj3GPCgRwunW16SiJbvRexDhY3pFCJbmMu6Nzw.6S"

/**
 * Verifica una clave de admin contra `admin_users.password_hash` y devuelve
 * el id de la fila que coincide (o `null`).
 *
 * 🔒 SOLO bcrypt. Se eliminó por completo la comparación en texto plano y la
 * migración automática a hash que existían por compatibilidad con filas
 * heredadas: una fila cuyo `password_hash` no sea un hash bcrypt válido no puede
 * entrar (hay que fijarle un hash con SQL, ver el procedimiento de rotación de
 * contraseña en el informe de seguridad).
 *
 * Con `username` se compara solo contra esa fila; sin él (el formulario de
 * login clásico solo pide la "clave secreta") se prueba contra todas.
 *
 * Única implementación de esta comparación en todo el proyecto — la usan el
 * login (`/api/admin/auth`) y la clave que piden las Server Actions de escritura.
 * Nunca reimplementarla en otro sitio.
 */
export async function verifyAdminSecret(secretKey: string, username?: string): Promise<number | null> {
  if (!secretKey || typeof secretKey !== "string") return null

  const supabase = getSupabaseServerClient()
  const name = username?.trim()
  let query = supabase.from("admin_users").select("id, password_hash")
  if (name) query = query.eq("username", name)

  const { data: admins, error } = await query
  if (error) throw error

  let comparedAny = false
  for (const admin of admins ?? []) {
    const hash = typeof admin.password_hash === "string" ? admin.password_hash : ""
    if (!BCRYPT_HASH_RE.test(hash)) continue // sin hash bcrypt válido → esta fila no puede entrar
    comparedAny = true
    if (await bcrypt.compare(secretKey, hash)) return admin.id
  }

  // Nada contra lo que comparar: gastar igualmente el tiempo de un bcrypt.
  if (!comparedAny) await bcrypt.compare(secretKey, DUMMY_BCRYPT_HASH)

  return null
}
