import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createMensajeContacto } from "@/lib/contact-db"
import { parseJsonBody, stringInput } from "@/lib/api-validation"
import { checkRateLimit, getClientIp, RATE_LIMITS, tooManyRequestsResponse } from "@/lib/rate-limit"

const contactSchema = z.object({
  nombre: stringInput(z.string().trim().min(1, "Nombre, email y mensaje son obligatorios")),
  email: stringInput(z.string().trim().email("El email no es válido")),
  // Opcional (no todos quieren dejar teléfono) — igual que asunto/motivo/
  // programa, pero validando el formato si sí llega. El preprocess reduce
  // una cadena vacía a undefined antes de validar, para no rechazar un
  // campo simplemente dejado en blanco en el formulario.
  telefono: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().regex(/^[+\d][\d\s]{7,}$/, "Teléfono no válido").optional(),
  ),
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
  // 🔒 Rate limiting por IP + honeypot (este último dentro de parseJsonBody).
  const limit = await checkRateLimit(RATE_LIMITS.contactIp, getClientIp(request.headers))
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds)

  const parsed = await parseJsonBody(request, contactSchema)
  if (!parsed.success) return parsed.response
  const { nombre, email, telefono, asunto, mensaje, motivo, programa } = parsed.data

  try {
    const registro = await createMensajeContacto({
      nombre,
      email: email.toLowerCase(),
      telefono: telefono || null,
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
