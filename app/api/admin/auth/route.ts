import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { z } from "zod"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock } from "@/lib/mock-mode"
import { verifyAdminSecret } from "@/lib/admin-secret"
import { createAdminSession, revokeAdminSession } from "@/lib/admin-session"
import { parseJsonBody, stringInput } from "@/lib/api-validation"
import { isSameOriginRequest } from "@/lib/verify-origin"
import {
  checkRateLimit,
  getClientIp,
  padToMinDuration,
  RATE_LIMITS,
  resetRateLimit,
  tooManyRequestsResponse,
} from "@/lib/rate-limit"

/**
 * Las respuestas FALLIDAS del login tardan siempre al menos esto: iguala el
 * tiempo de "clave incorrecta" con independencia de cuántas filas de
 * `admin_users` compare bcrypt, y encarece cada intento de fuerza bruta.
 */
const FAILED_LOGIN_MIN_MS = 1500

async function failWithDelay(startedAt: number, body: { error: string }, status: number) {
  await padToMinDuration(startedAt, FAILED_LOGIN_MIN_MS)
  return NextResponse.json(body, { status })
}

const loginSchema = z.object({
  secretKey: stringInput(z.string().min(1, "Clave secreta requerida")),
  // Opcional: el formulario clásico solo pide la clave. Si viene, la comparación
  // se limita a esa cuenta y el límite de intentos es por IP + username.
  username: z.string().trim().max(64).optional(),
})

/**
 * Login de /admin. El formulario solo pide una "clave secreta" (sin
 * usuario), así que `verifyAdminSecret` compara contra el `password_hash`
 * de cada fila de `admin_users` salvo que se envíe un `username` opcional. La
 * verificación (solo bcrypt) vive en `lib/admin-secret.ts`, compartida con
 * `app/blog/actions.ts` y cualquier Server Action futura — ver CLAUDE.md §4.
 */
export async function POST(request: NextRequest) {
  const startedAt = Date.now()
  try {
    // 🔒 2026-09-04 (43) — comprobación de origen: este es el único
    // endpoint del proyecto que crea una sesión autenticada fuera de una
    // Server Action (que ya lleva la protección CSRF de Next.js de
    // fábrica) — ver `lib/verify-origin.ts`.
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Origen de la petición no válido" }, { status: 403 })
    }

    // 🔒 Bloqueo por fuerza bruta. Solo cuentan los intentos FALLIDOS: cada
    // petición consume un intento al entrar (así una ráfaga de peticiones en
    // paralelo no puede colarse antes de que se registre el primer fallo) y un
    // login CORRECTO borra los contadores (ver más abajo), de modo que el efecto
    // es el mismo que contar solo fallos.
    //   1) por IP: 15 / 15 min — antes de leer el cuerpo.
    //   2) por IP + username: 5 / 15 min — tras leerlo.
    // Dos contadores porque, con solo el combinado, cambiar de username en cada
    // intento daría 5 intentos nuevos por nombre.
    const ip = getClientIp(request.headers)
    const ipLimit = await checkRateLimit(RATE_LIMITS.adminLoginIp, ip)
    if (!ipLimit.allowed) {
      return tooManyRequestsResponse(ipLimit.retryAfterSeconds)
    }

    // Sin base de datos no hay forma de validar la clave. Denegamos en vez de
    // simular una sesión: un mock que devolviera éxito sería un bypass de
    // autenticación, y el riesgo no compensa la comodidad en desarrollo.
    if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json(
        { error: "Modo mock: autenticación de administrador no disponible sin base de datos" },
        { status: 503 },
      )
    }

    const parsed = await parseJsonBody(request, loginSchema)
    if (!parsed.success) return parsed.response
    const { secretKey } = parsed.data
    const username = parsed.data.username || undefined

    // Sin username (login clásico) la clave del contador es solo la IP + un marcador.
    const userKey = `${ip}|${username ? username.toLowerCase() : "-"}`
    const userLimit = await checkRateLimit(RATE_LIMITS.adminLoginUser, userKey)
    if (!userLimit.allowed) {
      return tooManyRequestsResponse(userLimit.retryAfterSeconds)
    }

    const matchedId = await verifyAdminSecret(secretKey, username)

    if (matchedId === null) {
      // Fallo: el intento ya está contado; retardo mínimo constante.
      return failWithDelay(startedAt, { error: "Invalid secret key" }, 401)
    }

    // Login correcto: los fallos previos de esta IP dejan de contar.
    await Promise.all([resetRateLimit(RATE_LIMITS.adminLoginUser, userKey), resetRateLimit(RATE_LIMITS.adminLoginIp, ip)])

    const supabase = getSupabaseServerClient()
    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", matchedId)

    // 🔒 2026-09-04 (42) — la cookie ya no vale un string fijo
    // ("authenticated"): es un token firmado que apunta a una fila real en
    // `admin_sessions`, con expiración propia y revocable de forma
    // individual (ver `lib/admin-session.ts`) — hallazgo MEDIO de la
    // auditoría de seguridad, ver CLAUDE.md §4.
    const sessionCookieValue = await createAdminSession(matchedId, {
      userAgent: request.headers.get("user-agent") ?? undefined,
      ipAddress: ip,
    })

    const cookieStore = await cookies()
    cookieStore.set("admin-auth", sessionCookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[admin/auth] Authentication error:", error)
    return failWithDelay(startedAt, { error: "Authentication failed" }, 500)
  }
}

export async function DELETE(request: NextRequest) {
  // Logout: mismo criterio de origen que el login — evita que un tercero
  // fuerce un cierre de sesión desde fuera del sitio.
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Origen de la petición no válido" }, { status: 403 })
  }

  // Revoca la sesión concreta en `admin_sessions` (no afecta a otras
  // sesiones activas del mismo admin) antes de borrar la cookie.
  const cookieStore = await cookies()
  const current = cookieStore.get("admin-auth")
  await revokeAdminSession(current?.value)
  cookieStore.delete("admin-auth")

  return NextResponse.json({ success: true })
}
