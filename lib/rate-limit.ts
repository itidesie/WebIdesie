import "server-only"
import { createHmac } from "node:crypto"
import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock } from "@/lib/mock-mode"
import { getRequiredSecret } from "@/lib/env"

/**
 * 🔒 Rate limiting reutilizable para endpoints públicos, Server Actions y el
 * login de admin. Una sola implementación: nunca contar a mano en cada ruta.
 *
 * Almacenamiento: función `public.rate_limit_hit` de `scripts/035_rate_limits.sql`
 * (atómica, compartida entre instancias serverless). Si no está aplicada o
 * Supabase falla, cae a un contador en memoria por instancia y lo registra en
 * el log: nunca se deja pasar todo en silencio ni se rompe el formulario.
 * (En memoria un atacante repartido entre instancias tiene más margen; por eso
 * hay que aplicar la migración.)
 *
 * La clave (IP, email) NO se guarda en claro: se envía un HMAC-SHA256 con
 * `RATE_LIMIT_SECRET` (propio, independiente de Supabase; sin fallback — si
 * falta, `getRequiredSecret` lanza un error, ver `lib/env.ts`).
 */

export interface RateLimitRule {
  /** Nombre lógico del contador, p. ej. "admin-login" o "send-catalog-ip". */
  bucket: string
  max: number
  windowSeconds: number
}

export interface RateLimitResult {
  allowed: boolean
  retryAfterSeconds: number
}

/** Límites en un solo sitio, para que sean fáciles de revisar y ajustar. */
export const RATE_LIMITS = {
  contactIp: { bucket: "contact-ip", max: 5, windowSeconds: 60 * 60 },
  admisionIp: { bucket: "admision-ip", max: 5, windowSeconds: 60 * 60 },
  candidaturaIp: { bucket: "candidatura-ip", max: 5, windowSeconds: 60 * 60 },
  // Una oficina/universidad comparte IP: el límite por IP es más holgado que el de email.
  catalogIp: { bucket: "send-catalog-ip", max: 10, windowSeconds: 60 * 60 },
  catalogEmail: { bucket: "send-catalog-email", max: 5, windowSeconds: 24 * 60 * 60 },
  bajaIp: { bucket: "baja-ip", max: 5, windowSeconds: 60 * 60 },
  bajaEmail: { bucket: "baja-email", max: 3, windowSeconds: 24 * 60 * 60 },
  checkoutOrderIp: { bucket: "checkout-order-ip", max: 10, windowSeconds: 15 * 60 },
  // Anti-enumeración de cupones: solo cuenta las verificaciones que traen un código.
  checkoutCouponIp: { bucket: "checkout-coupon-ip", max: 20, windowSeconds: 15 * 60 },
  leadsIp: { bucket: "leads-ip", max: 5, windowSeconds: 60 * 60 },
  // Solo consulta qué horas están libres — sin datos personales, pero se pide igual para que
  // no se pueda raspar el calendario completo a base de peticiones.
  leadsDisponibilidadIp: { bucket: "leads-disponibilidad-ip", max: 30, windowSeconds: 15 * 60 },
} satisfies Record<string, RateLimitRule>

function hashKey(bucket: string, identifier: string): string {
  const secret = getRequiredSecret("RATE_LIMIT_SECRET")
  return createHmac("sha256", secret).update(`${bucket}|${identifier}`).digest("hex")
}

// --- Respaldo en memoria (por instancia) ------------------------------------
const memoryCounters = new Map<string, { hits: number; resetAt: number }>()

function memoryHit(rule: RateLimitRule, keyHash: string): RateLimitResult {
  const now = Date.now()
  const mapKey = `${rule.bucket}|${keyHash}`
  const current = memoryCounters.get(mapKey)

  if (!current || current.resetAt <= now) {
    // Limpieza barata para que el mapa no crezca sin límite.
    if (memoryCounters.size > 5000) {
      for (const [k, v] of memoryCounters) if (v.resetAt <= now) memoryCounters.delete(k)
    }
    memoryCounters.set(mapKey, { hits: 1, resetAt: now + rule.windowSeconds * 1000 })
    return { allowed: true, retryAfterSeconds: rule.windowSeconds }
  }

  current.hits += 1
  return {
    allowed: current.hits <= rule.max,
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  }
}

/**
 * Cuenta UNA petición para `identifier` bajo `rule` y dice si cabe.
 * Cada llamada consume un intento, así que llámala una sola vez por petición y por regla.
 */
export async function checkRateLimit(rule: RateLimitRule, identifier: string): Promise<RateLimitResult> {
  const keyHash = hashKey(rule.bucket, identifier)

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return memoryHit(rule, keyHash)
  }

  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.rpc("rate_limit_hit", {
      p_bucket: rule.bucket,
      p_key_hash: keyHash,
      p_window_seconds: rule.windowSeconds,
      p_max: rule.max,
    })
    if (error) throw error

    const row = Array.isArray(data) ? data[0] : data
    if (!row) throw new Error("rate_limit_hit no devolvió ninguna fila")
    return { allowed: Boolean(row.allowed), retryAfterSeconds: Number(row.retry_after_seconds) || rule.windowSeconds }
  } catch (error) {
    console.error(
      `[rate-limit] No se pudo usar la BD para "${rule.bucket}" (¿scripts/035 sin aplicar?) — se usa el contador en memoria:`,
      error instanceof Error ? error.message : error,
    )
    return memoryHit(rule, keyHash)
  }
}

/**
 * Reinicia el contador de `identifier` bajo `rule` (todas sus ventanas). Se usa
 * tras un login correcto: los intentos fallidos previos dejan de contar.
 * Un fallo aquí nunca debe romper el login, así que solo se registra.
 */
export async function resetRateLimit(rule: RateLimitRule, identifier: string): Promise<void> {
  const keyHash = hashKey(rule.bucket, identifier)
  memoryCounters.delete(`${rule.bucket}|${keyHash}`)

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) return

  try {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.from("rate_limits").delete().eq("bucket", rule.bucket).eq("key_hash", keyHash)
    if (error) throw error
  } catch (error) {
    console.error(
      `[rate-limit] No se pudo reiniciar el contador de "${rule.bucket}":`,
      error instanceof Error ? error.message : error,
    )
  }
}

/**
 * IP del cliente. En Vercel la cabecera `x-forwarded-for` la fija la propia
 * plataforma (el cliente no puede falsearla); fuera de Vercel sería falsificable.
 * Si no hay ninguna, todos comparten el bucket "unknown" — mejor limitar de más
 * que no limitar.
 */
export function getClientIp(headers: { get(name: string): string | null }): string {
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  return headers.get("x-real-ip")?.trim() || "unknown"
}

export function tooManyRequestsResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    { error: "Demasiadas solicitudes. Inténtalo de nuevo más tarde." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  )
}

/**
 * Espera hasta que hayan pasado `minMs` desde `startedAt`. Se usa en las
 * respuestas FALLIDAS del login para que "clave incorrecta" tarde siempre lo
 * mismo, sin filtrar por tiempo cuántas filas comparó bcrypt.
 */
export async function padToMinDuration(startedAt: number, minMs: number): Promise<void> {
  const remaining = minMs - (Date.now() - startedAt)
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining))
}
