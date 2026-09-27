import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createLead, SlotUnavailableError, type LeadData } from "@/lib/leads-db"
import { parseJsonBody, stringInput } from "@/lib/api-validation"
import { checkRateLimit, getClientIp, RATE_LIMITS, tooManyRequestsResponse } from "@/lib/rate-limit"
import { LEAD_TIME_SLOTS } from "@/lib/leads-time-slots"

const PROGRAMAS = ["MBIM", "MBBE", "EMBIM", "Online"] as const

const leadSchema = z
  .object({
    firstName: stringInput(z.string().trim().min(1, "Nombre y apellidos son obligatorios")),
    lastName: stringInput(z.string().trim().min(1, "Nombre y apellidos son obligatorios")),
    phone: stringInput(z.string().trim().regex(/^[+\d][\d\s]{7,}$/, "Teléfono no válido")),
    email: stringInput(z.string().trim().email("Correo no válido")),
    masterInteres: z.enum(PROGRAMAS).nullable().optional(),
    mensaje: z.string().trim().max(2000).optional(),
    origen: z.string().trim().optional(),
    // Agendar llamada es OPCIONAL (2026-09-28): si `agendarLlamada` es true,
    // fecha y hora pasan a ser obligatorias; si es false, se ignoran aunque
    // lleguen (nunca se guarda una franja a medias).
    agendarLlamada: z.boolean().optional().default(false),
    sessionDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida")
      .refine((v) => !Number.isNaN(new Date(`${v}T00:00:00`).getTime()), "Fecha no válida")
      .optional(),
    sessionTime: z.enum(LEAD_TIME_SLOTS, { message: "Hora no válida — debe ser una franja de 10:00 a 19:00" }).optional(),
    rgpdAceptado: z.preprocess(
      (v) => v ?? false,
      z.boolean().refine((v) => v === true, { message: "Debes aceptar la política de privacidad para continuar" }),
    ),
  })
  .refine((v) => !v.agendarLlamada || !!v.sessionDate, { message: "Elige una fecha para la llamada", path: ["sessionDate"] })
  .refine((v) => !v.agendarLlamada || !!v.sessionTime, { message: "Elige una hora para la llamada", path: ["sessionTime"] })

/**
 * Recibe las solicitudes de información/llamada — reutilizable desde
 * cualquier página (`/landing`, `/contact-page`). Agendar una hora concreta
 * es OPCIONAL: sin `agendarLlamada`, se guarda como una solicitud normal sin
 * franja (ver `scripts/037_leads_agenda_opcional.sql`).
 *
 * Repite en servidor toda la validación que ya hace el formulario en
 * cliente — nunca hay que fiarse de lo que llega desde el navegador.
 *
 * 🔒 Reactivado el 2026-09-28 (antes devolvía 410: no tenía consumidores
 * desde que `/landing` pasó a usar el embed de Calendly). Al reactivarlo se
 * añade lo que pedía el propio comentario de desactivación: rate limiting
 * por IP + honeypot (dentro de `parseJsonBody`) — no existían en la versión
 * original.
 */
export async function POST(request: NextRequest) {
  const limit = await checkRateLimit(RATE_LIMITS.leadsIp, getClientIp(request.headers))
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds)

  const parsed = await parseJsonBody(request, leadSchema)
  if (!parsed.success) return parsed.response
  const { firstName, lastName, phone, email, masterInteres, mensaje, origen, agendarLlamada, sessionDate, sessionTime, rgpdAceptado } =
    parsed.data

  const data: LeadData = {
    firstName,
    lastName,
    phone,
    email: email.toLowerCase(),
    masterInteres: masterInteres || null,
    mensaje: mensaje || null,
    sessionDate: agendarLlamada ? sessionDate! : null,
    sessionTime: agendarLlamada ? sessionTime! : null,
    rgpdAceptado,
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
