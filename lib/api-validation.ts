import { NextResponse } from "next/server"
import { z } from "zod"

/**
 * 🔒 2026-09-04 (43) — hallazgo BAJO de la auditoría de seguridad: los
 * endpoints públicos validaban campo a campo a mano — funcionalmente
 * correcto (probado toda la sesión), pero frágil a futuro: añadir un campo
 * nuevo sin acordarse de validarlo no da ningún error visible hasta que
 * llega el dato malo. Un esquema declarativo lo hace explícito.
 *
 * `parseJsonBody()` sustituye el `try { await request.json() } catch {...}`
 * + comprobaciones sueltas que repetía cada ruta — única implementación,
 * reutilizada por todos los endpoints públicos. Mismo formato de respuesta
 * que ya usaba cada uno (`{ error: "..." }`, 400) para no cambiar el
 * contrato que ya consumen los formularios del cliente.
 */
export async function parseJsonBody<S extends z.ZodTypeAny>(
  request: Request,
  schema: S,
): Promise<{ success: true; data: z.infer<S> } | { success: false; response: NextResponse }> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return { success: false, response: NextResponse.json({ error: "JSON inválido" }, { status: 400 }) }
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    const message = result.error.issues[0]?.message || "Datos inválidos"
    return { success: false, response: NextResponse.json({ error: message }, { status: 400 }) }
  }

  return { success: true, data: result.data }
}

/**
 * Envuelve cualquier validador de texto (`.min()`, `.email()`, `.regex()`)
 * para que un campo AUSENTE del JSON caiga en el mismo mensaje de error que
 * uno presente pero vacío o mal formado — sin esto, `z.string().min(1,
 * "msg")` solo aplica ese mensaje cuando la clave sí llega (aunque vacía);
 * si falta por completo, zod devuelve su "Required" genérico antes de
 * llegar a evaluar `.min()`/`.email()`/`.regex()`. El `preprocess`
 * normaliza `undefined`/`null` a `""` antes de esa validación, así que
 * ambos casos caen siempre en el mismo mensaje personalizado — descubierto
 * probando el propio endpoint con una petición sin el campo, no algo
 * hipotético (2026-09-04 (43)).
 */
export function stringInput<T extends z.ZodTypeAny>(schema: T): z.ZodEffects<T, z.output<T>, unknown> {
  return z.preprocess((value) => (typeof value === "string" ? value : value == null ? "" : value), schema)
}
