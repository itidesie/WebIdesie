import "server-only"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"

/**
 * Sesiones reales de administrador — sustituye la cookie de valor fijo
 * `"authenticated"` (hallazgo MEDIO de la auditoría de seguridad, ver
 * CLAUDE.md §4). Cada login crea una fila en `admin_sessions`; la cookie es
 * un token firmado (`<id>.<firma HMAC-SHA256>`) que apunta a esa fila —
 * expira sola (`expires_at`) y se puede revocar individualmente (logout,
 * o a mano) sin tocar el resto de sesiones del mismo admin.
 *
 * 🔒 Escrito con **Web Crypto API** (`crypto.subtle`), no el módulo `crypto`
 * de Node (`createHmac`/`timingSafeEqual`) — este archivo lo usa
 * `middleware.ts`, que corre en el runtime Edge por defecto, donde el
 * módulo `crypto` de Node no está disponible. `crypto.subtle` sí lo está,
 * tanto en Edge como en Node (Node lo expone desde la v15), así que el
 * mismo código sirve en los dos sitios sin tener que forzar el middleware
 * a runtime `nodejs`.
 *
 * La clave de firma se deriva de `SUPABASE_SERVICE_ROLE_KEY` (ya
 * obligatoria en producción) en vez de introducir una variable de entorno
 * nueva que pudiera faltar en un despliegue real.
 */

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24h, mismo que la cookie anterior

function getSigningKeyMaterial(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "dev-mock-admin-session-signing-key"
}

let cachedKey: CryptoKey | null = null
async function getHmacKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey
  const keyData = new TextEncoder().encode(getSigningKeyMaterial())
  cachedKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ])
  return cachedKey
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function sign(sessionId: string): Promise<string> {
  const key = await getHmacKey()
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(sessionId))
  return toHex(signature)
}

/** Comparación en tiempo constante — evita filtrar por timing si la firma casi coincide. */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function buildSessionCookieValue(sessionId: string): Promise<string> {
  return `${sessionId}.${await sign(sessionId)}`
}

/** Verifica la firma del valor de la cookie — null si no coincide. No comprueba aún la base de datos. */
async function verifySignature(cookieValue: string): Promise<string | null> {
  const dotIndex = cookieValue.lastIndexOf(".")
  if (dotIndex === -1) return null
  const sessionId = cookieValue.slice(0, dotIndex)
  const signature = cookieValue.slice(dotIndex + 1)
  if (!sessionId || !signature) return null
  const expected = await sign(sessionId)
  if (!timingSafeEqualHex(signature, expected)) return null
  return sessionId
}

export interface AdminSession {
  id: string
  adminId: number
}

/**
 * Crea una sesión nueva tras un login válido — inserta la fila en
 * `admin_sessions` y devuelve el valor firmado a poner en la cookie
 * `admin-auth`.
 */
export async function createAdminSession(
  adminId: number,
  meta?: { userAgent?: string; ipAddress?: string },
): Promise<string> {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString()

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Admin session", `sesión simulada para admin ${adminId} — no persistida`)
    return buildSessionCookieValue(sessionId)
  }

  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("admin_sessions").insert({
    id: sessionId,
    admin_id: adminId,
    expires_at: expiresAt,
    user_agent: meta?.userAgent ?? null,
    ip_address: meta?.ipAddress ?? null,
  })
  if (error) {
    console.error("[admin-session] Error creando sesión:", error.message)
    throw new Error("No se pudo crear la sesión de administrador")
  }

  return buildSessionCookieValue(sessionId)
}

/**
 * Verifica una cookie de sesión de principio a fin: firma válida, la fila
 * existe, no está revocada, no ha caducado. Es la única fuente de verdad —
 * la llaman tanto `middleware.ts` (edge) como `lib/admin-auth.ts` (server
 * components/Route Handlers), nunca se reimplementa la comprobación.
 */
export async function verifyAdminSession(cookieValue: string | undefined | null): Promise<AdminSession | null> {
  if (!cookieValue) return null
  const sessionId = await verifySignature(cookieValue)
  if (!sessionId) return null

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Admin session", "verificación simulada — siempre inválida sin Supabase real")
    return null
  }

  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("admin_sessions")
    .select("id, admin_id, expires_at, revoked_at")
    .eq("id", sessionId)
    .maybeSingle()

  if (error || !data) return null
  if (data.revoked_at) return null
  if (new Date(data.expires_at).getTime() < Date.now()) return null

  return { id: data.id, adminId: data.admin_id }
}

/**
 * Revoca UNA sesión concreta (logout) — el resto de sesiones activas del
 * mismo admin (si las hubiera, p. ej. otra pestaña u otro dispositivo) no
 * se ven afectadas. No borra la fila, solo marca `revoked_at`.
 */
export async function revokeAdminSession(cookieValue: string | undefined | null): Promise<void> {
  if (!cookieValue) return
  const sessionId = await verifySignature(cookieValue)
  if (!sessionId) return

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Admin session", `revocación simulada → ${sessionId}`)
    return
  }

  const supabase = getSupabaseServerClient()
  const { error } = await supabase
    .from("admin_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", sessionId)
  if (error) console.error("[admin-session] Error revocando sesión:", error.message)
}
