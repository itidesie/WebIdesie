/**
 * 🔒 2026-09-04 (42) — hallazgo MEDIO de la auditoría de seguridad: los
 * emails transaccionales (`lib/leads-db.ts`, `candidaturas-db.ts`,
 * `admision-db.ts`, `contact-db.ts`) interpolaban campos de usuario
 * directamente en plantillas HTML enviadas por Resend, sin escapar. Un
 * `nombre`/`mensaje` con `<img src=x onerror=...>` llegaba tal cual al
 * email real del equipo. Única implementación de este escape en el
 * proyecto — se usa en los 4 flujos, nunca reimplementada por archivo.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Deja un texto en UNA sola línea, sin caracteres de control ni separadores de
 * línea Unicode. Para valores del usuario que entran en un `subject` de email
 * (que no es HTML, así que `escapeHtml` no aplica): un salto de línea colado
 * no debe poder partir la cabecera.
 */
export function singleLine(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, " ").trim()
}

/**
 * Devuelve la URL solo si es `http:` o `https:`; en cualquier otro caso
 * (`javascript:`, `data:`, relativa, mal formada...) devuelve `null`.
 * `escapeHtml` evita romper el atributo `href`, pero NO impide que el valor sea
 * un esquema peligroso: para un enlace que un tercero controla (p. ej. la URL
 * de un CV) hay que validar además el protocolo.
 */
export function safeHttpUrl(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null
  } catch {
    return null
  }
}
