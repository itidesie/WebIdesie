import DOMPurify from "isomorphic-dompurify"

/**
 * 🔒 2026-09-04 (42) — sustituye al sanitizador propio a base de regex
 * (hallazgo MEDIO de la auditoría de seguridad, ver CLAUDE.md §4): el
 * regex de manejadores de eventos exigía un espacio antes de `on\w+`
 * (`<svg/onload=...>` sin espacio no lo capturaba) y `href="javascript:..."`
 * no se filtraba en absoluto. DOMPurify parsea el HTML de verdad (vía
 * jsdom en servidor, con `isomorphic-dompurify`) en vez de intentar
 * adivinarlo con expresiones regulares — no hay forma de "saltarse" un
 * parser que interpreta el árbol DOM real.
 *
 * Solo explotable hoy por un admin autenticado (el HTML llega vía el
 * editor de blog, gateado por `verifyAdminSecret`) — pero un admin
 * pegando contenido de una fuente externa comprometida ya bastaría para
 * XSS persistente contra cualquier visitante del blog. Cerrado igual,
 * como pidió el cliente explícitamente ("ciérralo ahora, no lo dejes como
 * deuda").
 */

// Acotada a lo que el editor de blog (`components/rich-text-editor.tsx`,
// basado en `document.execCommand`) puede generar realmente — nada más.
const ALLOWED_TAGS = [
  "p",
  "br",
  "div",
  "span",
  "b",
  "strong",
  "i",
  "em",
  "u",
  "s",
  "strike",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "a",
  "img",
]

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "width", "height", "style", "title"]

let hooksRegistered = false
function ensureHooks() {
  if (hooksRegistered) return
  hooksRegistered = true
  // Cualquier enlace que abra en pestaña nueva lleva `rel="noopener
  // noreferrer"` — sin esto, un `target="_blank"` en contenido de usuario
  // es un vector clásico de tabnabbing.
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
      node.setAttribute("rel", "noopener noreferrer")
    }
  })
}

/**
 * Sanitiza HTML enriquecido antes de renderizarlo con
 * `dangerouslySetInnerHTML` (contenido real de un post, no un título ni un
 * extracto). Conserva las etiquetas de la allowlist; quita todo lo demás
 * (`<script>`, manejadores de eventos, `javascript:`, `<iframe>`...) de
 * verdad, no por aproximación.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ""

  try {
    ensureHooks()
    return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR }) as unknown as string
  } catch (error) {
    console.error("[sanitize-html] Error sanitizando HTML:", error)
    // Igual que antes: si algo falla, mejor texto plano que HTML sin sanitizar.
    return html.replace(/<[^>]*>/g, "")
  }
}

/**
 * Reduce HTML a texto plano de verdad (quita todas las etiquetas, conserva
 * el texto) — para campos que nunca debieron llevar HTML en primer lugar
 * (título, extracto). Sustituye a `sanitizeContent()` de
 * `app/api/blog/latest/route.ts`, que reimplementaba esto mismo con su
 * propio regex, ligeramente distinto del de `sanitizeHtml()` — ahora hay
 * un único sanitizador real, no dos aproximaciones distintas.
 */
export function sanitizeToPlainText(html: string): string {
  if (!html) return ""

  try {
    return (DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) as unknown as string).trim()
  } catch (error) {
    console.error("[sanitize-html] Error reduciendo a texto plano:", error)
    return html.replace(/<[^>]*>/g, "").trim()
  }
}
