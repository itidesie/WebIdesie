import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createLead, SlotUnavailableError, type LeadData } from "@/lib/leads-db"
import { parseJsonBody, stringInput } from "@/lib/api-validation"
import { LEAD_TIME_SLOTS } from "@/lib/leads-time-slots"

const leadSchema = z.object({
  firstName: stringInput(z.string().trim().min(1, "Nombre y apellidos son obligatorios")),
  lastName: stringInput(z.string().trim().min(1, "Nombre y apellidos son obligatorios")),
  phone: stringInput(z.string().trim().regex(/^[+\d][\d\s]{7,}$/, "Teléfono no válido")),
  email: stringInput(z.string().trim().email("Correo no válido")),
  sessionDate: stringInput(
    z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida")
      .refine((v) => !Number.isNaN(new Date(`${v}T00:00:00`).getTime()), "Fecha no válida"),
  ),
  sessionTime: stringInput(
    z.enum(LEAD_TIME_SLOTS, { message: "Hora no válida — debe ser una franja de 10:00 a 19:00" }),
  ),
  origen: z.string().trim().optional(),
  masterInteres: z.string().trim().nullable().optional(),
})

/**
 * Recibe las solicitudes de sesión informativa (hoy solo desde
 * `/landing`, pero genérica — cualquier página puede reutilizarla).
 *
 * Repite la validación del cliente en el servidor: nunca hay que fiarse de lo
 * que llega desde el navegador, aunque `InfoRequestModal` ya valide antes de
 * enviar.
 *
 * 🔒 2026-09-04 (43) — validación con zod (`parseJsonBody`) en vez de
 * comprobaciones sueltas campo a campo — mismos mensajes de error que
 * antes, para no cambiar lo que ya espera el cliente.
 */
export async function POST(request: NextRequest) {
  const parsed = await parseJsonBody(request, leadSchema)
  if (!parsed.success) return parsed.response
  const { firstName, lastName, phone, email, sessionDate, sessionTime, origen, masterInteres } = parsed.data

  const data: LeadData = {
    firstName,
    lastName,
    phone,
    email,
    masterInteres: masterInteres || null,
    sessionDate,
    sessionTime,
    origen: origen || "landing",
  }

  try {
    const lead = await createLead(data)
    return NextResponse.json({ ok: true, id: lead.id })
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      return NextResponse.json({ error: "slot_unavailable", message: error.message }, { status: 409 })
    }
    console.error("[api/leads] Error:", error)
    return NextResponse.json({ error: "No se pudo procesar la solicitud" }, { status: 500 })
  }
}
