import sanitizeHtmlLib from "sanitize-html"

/**
 * 🔒 2026-09-04 (42) — sustituye al sanitizador propio a base de regex
 * (hallazgo MEDIO de la auditoría de seguridad, ver CLAUDE.md §4): el
 * regex de manejadores de eventos exigía un espacio antes de `on\w+`
 * (`<svg/onload=...>` sin espacio no lo capturaba) y `href="javascript:..."`
 * no se filtraba en absoluto. Se parsea el HTML de verdad en vez de
 * intentar adivinarlo con expresiones regulares — no hay forma de
 * "saltarse" un parser real.
 *
 * Solo explotable hoy por un admin autenticado (el HTML llega vía el
 * editor de blog, gateado por `verifyAdminSecret`) — pero un admin
 * pegando contenido de una fuente externa comprometida ya bastaría para
 * XSS persistente contra cualquier visitante del blog. Cerrado igual,
 * como pidió el cliente explícitamente ("ciérralo ahora, no lo dejes como
 * deuda").
 *
 * 🔧 2026-09-05 — segundo cambio de motor en el mismo día. Primero
 * `isomorphic-dompurify` (envuelve `jsdom`): reventaba en producción
 * (Vercel) con `ERR_REQUIRE_ESM` — `jsdom` está en la lista de paquetes
 * que Next.js externaliza por defecto (`node_modules/next/dist/lib/
 * server-external-packages.jsonc`), así que se carga con `require()` real
 * en el runtime serverless en vez de pasar por el bundler. El árbol de
 * `jsdom` tiene VARIOS paquetes internos migrados a ESM puro sin salida
 * CJS (`@exodus/bytes` vía `html-encoding-sniffer`, luego
 * `@csstools/css-calc` vía `@asamuzakjp/css-color` en otra versión de
 * jsdom) — perseguir una versión "seguras" de jsdom es un juego perdido,
 * no es un paquete suelto, es un problema sistémico de todo ese árbol.
 * Se probó también `dompurify` + `linkedom` (DOM ligero para servidor) —
 * descartado de inmediato: `linkedom` no expone `NodeFilter`, y sin él
 * DOMPurify entra en su modo "no soportado" y **deja pasar el HTML sin
 * sanitizar nada, en silencio, sin lanzar ningún error** — detectado con
 * un test funcional antes de subirlo a ningún sitio, nunca llegó a
 * desplegarse.
 *
 * `sanitize-html` no usa ningún DOM — parsea con `htmlparser2` (parser de
 * texto puro, sin necesidad de excluir el paquete del bundling de
 * Next.js) y no aparece en absoluto en la lista de externos por defecto.
 * Su única dependencia que sí está en esa lista es `postcss` (usado para
 * validar el CSS del atributo `style`) — pero `postcss` en sí y sus 3
 * dependencias (`nanoid`, `picocolors`, `source-map-js`) son CJS estable
 * sin ningún paquete migrado a ESM puro, confirmado antes de adoptarlo.
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

const SANITIZE_OPTIONS: sanitizeHtmlLib.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: { "*": ALLOWED_ATTR },
  // Propiedades de CSS que el editor puede llegar a producir (color de
  // texto/fondo, alineación, tipografía) — deliberadamente sin `url(...)`,
  // `content`, `background-image` ni nada que pueda esconder una
  // referencia externa o un vector tipo `expression()`. `sanitize-html`
  // valida cada valor contra estos patrones vía `postcss`, no solo
  // comprueba el nombre de la propiedad.
  allowedStyles: {
    "*": {
      color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s,.%]+\)$/i, /^[a-z]+$/i],
      "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s,.%]+\)$/i, /^[a-z]+$/i],
      "font-weight": [/^(normal|bold|bolder|lighter|[1-9]00)$/i],
      "font-style": [/^(normal|italic|oblique)$/i],
      "text-align": [/^(left|right|center|justify)$/i],
      "text-decoration": [/^(none|underline|line-through)$/i],
    },
  },
  // Cualquier enlace que abra en pestaña nueva lleva `rel="noopener
  // noreferrer"` — sin esto, un `target="_blank"` en contenido de usuario
  // es un vector clásico de tabnabbing. Mismo comportamiento que el hook
  // `afterSanitizeAttributes` de la versión anterior (DOMPurify).
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.target === "_blank") {
        attribs.rel = "noopener noreferrer"
      }
      return { tagName, attribs }
    },
  },
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
    return sanitizeHtmlLib(html, SANITIZE_OPTIONS)
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
    return sanitizeHtmlLib(html, { allowedTags: [], allowedAttributes: {} }).trim()
  } catch (error) {
    console.error("[sanitize-html] Error reduciendo a texto plano:", error)
    return html.replace(/<[^>]*>/g, "").trim()
  }
}
