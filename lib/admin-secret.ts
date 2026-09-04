import "server-only"
import bcrypt from "bcryptjs"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const BCRYPT_HASH_RE = /^\$2[aby]\$\d{2}\$/
const BCRYPT_COST = 12

/**
 * Verifica una clave de admin contra `admin_users.password_hash` y devuelve
 * el id de la fila que coincide (o `null`). Migra de forma perezosa las
 * filas heredadas en texto plano a bcrypt en el mismo paso — ver CLAUDE.md §4.
 *
 * Única implementación de esta comparación en todo el proyecto: antes vivía
 * duplicada en `app/api/admin/auth/route.ts` (login) y en
 * `app/blog/actions.ts` (`verifySecretKey`), y al migrar a bcrypt solo se
 * actualizó la primera — la segunda se quedó comparando en texto plano
 * contra un hash ya migrado, rompiendo crear/editar/borrar posts en cuanto
 * un admin iniciaba sesión. Cualquier Server Action nueva que necesite
 * reverificar la clave (tienda incluida) debe llamar a esta función, nunca
 * reimplementar la comparación.
 */
export async function verifyAdminSecret(secretKey: string): Promise<number | null> {
  if (!secretKey || typeof secretKey !== "string") return null

  const supabase = getSupabaseServerClient()
  const { data: admins, error } = await supabase.from("admin_users").select("id, password_hash")
  if (error) throw error

  for (const admin of admins ?? []) {
    if (BCRYPT_HASH_RE.test(admin.password_hash)) {
      if (await bcrypt.compare(secretKey, admin.password_hash)) return admin.id
    } else if (admin.password_hash === secretKey) {
      const upgradedHash = await bcrypt.hash(secretKey, BCRYPT_COST)
      await supabase.from("admin_users").update({ password_hash: upgradedHash }).eq("id", admin.id)
      return admin.id
    }
  }

  return null
}
