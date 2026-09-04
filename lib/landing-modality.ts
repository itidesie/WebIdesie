export type ModalityCategory = "presencial" | "ejecutivo" | "online"

/**
 * Deriva la categoría real de modalidad desde `m.modality` (ya existente,
 * nunca un dato nuevo) — mismo criterio que ya usa la etiqueta de la
 * tarjeta (`m.modality.split("·")[0]`), solo que categorizado para elegir
 * color en vez de solo mostrar texto.
 *
 * Extraído de `masters-comparison.tsx` (2026-09-04 (31)) a este módulo
 * compartido en el rediseño de 2026-09-05 — `masters-cta-strip.tsx`
 * reutiliza ahora la misma paleta de acento por modalidad en sus píldoras,
 * en vez de duplicar la lógica.
 */
export function getModalityCategory(modality: string): ModalityCategory {
  const lower = modality.toLowerCase()
  if (lower.includes("ejecutivo")) return "ejecutivo"
  if (lower.includes("online")) return "online"
  return "presencial"
}

/**
 * Paleta de acento por modalidad — aprobada por el cliente 2026-09-04 (31).
 * Presencial y Ejecutivo reutilizan tokens de marca ya existentes en
 * `globals.css` (`--color-brand`/`--secondary`, este último definido desde
 * el principio del proyecto pero apenas usado hasta ahora) — ningún color
 * nuevo inventado para esos dos. Online reutiliza el verde que ya usa
 * `/comparativa-masters-page` para la misma modalidad (mismo tono, no uno
 * ligeramente distinto que generaría inconsistencia entre páginas).
 */
export const MODALITY_STYLES: Record<ModalityCategory, { accent: string; badge: string; number: string }> = {
  presencial: {
    accent: "bg-brand",
    badge: "bg-brand/10 text-brand-strong",
    number: "text-brand/10",
  },
  ejecutivo: {
    accent: "bg-secondary",
    badge: "bg-secondary/20 text-amber-700",
    number: "text-secondary/25",
  },
  online: {
    accent: "bg-green-600",
    badge: "bg-green-100 text-green-700",
    number: "text-green-600/15",
  },
}
