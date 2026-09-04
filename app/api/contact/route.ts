import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createMensajeContacto } from "@/lib/contact-db"
import { parseJsonBody, stringInput } from "@/lib/api-validation"

const contactSchema = z.object({
  nombre: stringInput(z.string().trim().min(1, "Nombre, email y mensaje son obligatorios")),
  email: stringInput(z.string().trim().email("El email no es válido")),
  asunto: z.string().trim().optional(),
  mensaje: stringInput(z.string().trim().min(1, "Nombre, email y mensaje son obligatorios")),
  motivo: z.string().trim().optional(),
  programa: z.string().trim().optional(),
})

/**
 * Sustituye al `<form>` sin `onSubmit` que tenía `/contact-page` — validación
 * de obligatorios en servidor, nunca solo en cliente, mismo criterio que el
 * resto de endpoints públicos del sitio (`/api/leads`, `/api/admision`).
 *
 * 🔒 2026-09-04 (43) — validación con zod (`parseJsonBody`), mismos
 * mensajes de error que la versión anterior.
 */
export async function POST(request: NextRequest) {
  const parsed = await parseJsonBody(request, contactSchema)
  if (!parsed.success) return parsed.response
  const { nombre, email, asunto, mensaje, motivo, programa } = parsed.data

  try {
    const registro = await createMensajeContacto({
      nombre,
      email: email.toLowerCase(),
      asunto: asunto || null,
      mensaje,
      motivo: motivo || null,
      programa: programa || null,
    })

    return NextResponse.json({ success: true, id: registro.id })
  } catch (error) {
    console.error("[contacto] Error al procesar el mensaje:", error)
    return NextResponse.json(
      { error: "Error al enviar el mensaje. Por favor, inténtalo de nuevo." },
      { status: 500 },
    )
  }
}
