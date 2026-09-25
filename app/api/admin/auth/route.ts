import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { z } from "zod"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock } from "@/lib/mock-mode"
import { verifyAdminSecret } from "@/lib/admin-secret"
import { createAdminSession, revokeAdminSession } from "@/lib/admin-session"
import { parseJsonBody, stringInput } from "@/lib/api-validation"
import { isSameOriginRequest } from "@/lib/verify-origin"
import { checkRateLimit, getClientIp, padToMinDuration, RATE_LIMITS, tooManyRequestsResponse } from "@/lib/rate-limit"

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
})

/**
 * Login de /admin. El formulario solo pide una "clave secreta" (sin
 * usuario), así que `verifyAdminSecret` compara contra el `password_hash`
 * de cada fila de `admin_users` en vez de buscar por username. La
 * verificación (bcrypt + migración perezosa de contraseñas heredadas en
 * claro) vive en `lib/admin-secret.ts`, compartida con `app/blog/actions.ts`
 * y cualquier Server Action futura — ver CLAUDE.md §4.
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

    // 🔒 Rate limiting por IP: 5 intentos cada 15 min (cada POST cuenta, sea
    // correcto o no). Antes de tocar bcrypt ni la base de datos.
    const ip = getClientIp(request.headers)
    const limit = await checkRateLimit(RATE_LIMITS.adminLogin, ip)
    if (!limit.allowed) {
      return tooManyRequestsResponse(limit.retryAfterSeconds)
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

    const matchedId = await verifyAdminSecret(secretKey)

    if (matchedId === null) {
      return failWithDelay(startedAt, { error: "Invalid secret key" }, 401)
    }

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
