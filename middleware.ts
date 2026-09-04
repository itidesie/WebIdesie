import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAdminSession } from "@/lib/admin-session"

/**
 * Protege /admin/* automáticamente (salvo /admin/login, el propio formulario
 * de acceso). Antes de esto, cada page.tsx nueva bajo /admin tenía que
 * llamar a `checkAdminAuth()` a mano — el fallo más fácil de cometer al
 * añadir una página nueva (documentado en CLAUDE.md §4). Con este
 * middleware, olvidarlo ya no deja la página abierta: el middleware corre
 * antes de que el Server Component se ejecute.
 *
 * Las páginas de blog existentes conservan su `checkAdminAuth()` propio
 * como red de seguridad redundante (no hace daño, ver CLAUDE.md). Las
 * páginas nuevas (tienda, empleo, admisiones) no necesitan llamarlo — este
 * middleware basta, así que la comprobación de aquí tiene que ser la
 * completa, no una simplificada.
 *
 * 🔒 2026-09-04 (42) — pasa de comparar `cookie === "authenticated"` a
 * llamar a `verifyAdminSession()` (firma + fila real en `admin_sessions`,
 * no revocada, no caducada) — mismo verificador que usa
 * `lib/admin-auth.ts`, nunca reimplementado dos veces. Corre en el
 * runtime Edge por defecto, de ahí que `lib/admin-session.ts` esté escrito
 * con Web Crypto API (`crypto.subtle`) en vez del módulo `crypto` de Node,
 * que no está disponible aquí.
 *
 * Ojo: esto protege PÁGINAS bajo /admin/*, no rutas de API. Los endpoints
 * de escritura (`/api/productos/route.ts` para tienda, y los que se
 * añadan) siguen necesitando su propio `isAdminAuthenticated()` explícito,
 * porque no viven bajo /admin/* y este middleware no los cubre.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get("admin-auth")
  const session = await verifyAdminSession(authCookie?.value)
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
