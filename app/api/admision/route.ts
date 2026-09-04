import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createSolicitudAdmision } from "@/lib/admision-db"
import { parseJsonBody, stringInput } from "@/lib/api-validation"

const PROGRAMAS = ["MBIM", "MBBE", "EMBIM", "Online"] as const
const ORIGENES = ["landing", "mbim", "mbbe", "embim", "online"] as const

const admisionSchema = z.object({
  nombreCompleto: stringInput(z.string().trim().min(1, "Nombre completo, email y teléfono son obligatorios")),
  email: stringInput(z.string().trim().email("El email no es válido")),
  telefono: stringInput(z.string().trim().min(1, "Nombre completo, email y teléfono son obligatorios")),
  pais: z.string().trim().optional(),
  ciudad: z.string().trim().optional(),
  fechaNacimiento: z.string().trim().optional(),
  titulacionPrevia: z.string().trim().optional(),
  universidadOrigen: z.string().trim().optional(),
  programaSolicitado: stringInput(z.enum(PROGRAMAS, { message: "Selecciona un programa válido" })),
  origen: stringInput(z.enum(ORIGENES, { message: "Origen no válido" })),
  mensaje: z.string().trim().optional(),
  rgpdAceptado: z.preprocess(
    (v) => v ?? false,
    z.boolean().refine((v) => v === true, { message: "Debes aceptar la política de privacidad para continuar" }),
  ),
})

/**
 * Validación de todos los campos obligatorios EN SERVIDOR, nunca solo en el
 * cliente — mismo criterio ya aplicado a la verificación de importes en
 * `app/checkout/actions.ts`: lo que envía el formulario no es de fiar hasta
 * que este endpoint lo confirma.
 *
 * 🔴 2026-09-04 (40) — el CV dejó de pedirse (decisión explícita del
 * cliente, ver CLAUDE.md): ya no forma parte del cuerpo de la petición ni
 * de la validación. La columna `cv_url` de `solicitudes_admision` sigue
 * existiendo (ya era nullable) por si se reactiva más adelante —
 * `createSolicitudAdmision()` la escribe como `null` mientras tanto.
 *
 * 🔒 2026-09-04 (43) — validación con zod (`parseJsonBody`) en vez de
 * comprobaciones sueltas — `rgpdAceptado` como `z.literal(true)` hace
 * explícito en el propio esquema que solo `true` es válido, no solo
 * "verdadero" (un `1` o `"true"` como string ya no colarían).
 */
export async function POST(request: NextRequest) {
  const parsed = await parseJsonBody(request, admisionSchema)
  if (!parsed.success) return parsed.response
  const {
    nombreCompleto,
    email,
    telefono,
    pais,
    ciudad,
    fechaNacimiento,
    titulacionPrevia,
    universidadOrigen,
    programaSolicitado,
    origen,
    mensaje,
  } = parsed.data

  try {
    const solicitud = await createSolicitudAdmision({
      nombreCompleto,
      email: email.toLowerCase(),
      telefono,
      pais: pais || null,
      ciudad: ciudad || null,
      fechaNacimiento: fechaNacimiento || null,
      titulacionPrevia: titulacionPrevia || null,
      universidadOrigen: universidadOrigen || null,
      programaSolicitado,
      origen,
      cvUrl: null,
      mensaje: mensaje || null,
      rgpdAceptado: true,
    })

    return NextResponse.json({ success: true, id: solicitud.id })
  } catch (error) {
    console.error("[admision] Error al procesar la solicitud:", error)
    return NextResponse.json(
      { error: "Error al enviar la solicitud. Por favor, inténtalo de nuevo." },
      { status: 500 },
    )
  }
}
