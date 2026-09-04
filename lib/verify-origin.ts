import "server-only"
import type { NextRequest } from "next/server"

/**
 * 🔒 2026-09-04 (43) — hallazgo BAJO de la auditoría (CSRF), abordado ahora
 * a petición del cliente en vez de dejarlo como mejora futura.
 *
 * Las Server Actions de este proyecto (tienda/empleo/admisión) ya llevan
 * la protección automática de Next.js contra CSRF: compara la cabecera
 * `Origin` contra `Host` en cada invocación y rechaza si no coinciden —
 * no hace falta ningún código para eso, es de fábrica desde Next.js 14.
 *
 * `/api/admin/auth` es distinto: es un Route Handler plano (`POST`/`DELETE`
 * normales), no una Server Action, así que Next.js no le aplica esa
 * protección automática — y es el único endpoint del proyecto que
 * crea/destruye una sesión autenticada fuera de una Server Action. Por
 * eso es el único sitio donde hacía falta añadir esta comprobación a mano.
 *
 * El resto de endpoints públicos (`/api/leads`, `/api/contact`,
 * `/api/admision`, `/api/empleo/candidatura`...) no necesitan esto: no hay
 * ninguna sesión ni acción privilegiada que un atacante pudiera forjar —
 * son formularios públicos que cualquiera puede enviar de todos modos.
 */
export function isSameOriginRequest(request: NextRequest): boolean {
  const host = request.headers.get("host")
  if (!host) return false

  // Origin es lo que manda cualquier navegador real en un POST/DELETE.
  // Referer como respaldo por si algún navegador antiguo no lo incluye.
  const candidate = request.headers.get("origin") || request.headers.get("referer")
  if (!candidate) {
    // Un navegador SIEMPRE manda al menos uno de los dos en una petición
    // real que muta estado. Sin ninguno, más seguro rechazar que asumir.
    return false
  }

  try {
    return new URL(candidate).host === host
  } catch {
    return false
  }
}
