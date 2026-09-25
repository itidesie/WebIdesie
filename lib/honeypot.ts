/**
 * 🔒 Honeypot anti-bots compartido por todos los formularios públicos.
 *
 * Cada formulario incluye un campo oculto (`components/honeypot-field.tsx`) que
 * una persona nunca ve ni rellena, pero que la mayoría de bots rellenan por
 * inercia. Si llega con contenido, el servidor descarta la petición SIN
 * procesarla y responde igual que si hubiera ido bien (así el bot no aprende
 * que ha sido detectado). Ver `parseJsonBody` en `lib/api-validation.ts`.
 *
 * Sin `server-only` a propósito: el nombre del campo lo importa tanto el
 * cliente (formularios) como el servidor (endpoints y Server Actions).
 */
export const HONEYPOT_FIELD = "company_website"

export function isHoneypotTriggered(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0
}
