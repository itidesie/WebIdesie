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
