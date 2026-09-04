import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createCandidatura } from "@/lib/candidaturas-db"
import { parseJsonBody, stringInput } from "@/lib/api-validation"

const REQUIRED_MSG = "Todos los campos obligatorios deben ser completados"

const candidaturaSchema = z.object({
  ofertaId: z.number().int().nullable().optional(),
  ofertaPuesto: stringInput(z.string().trim().min(1, REQUIRED_MSG)),
  nombre: stringInput(z.string().trim().min(1, REQUIRED_MSG)),
  email: stringInput(z.string().trim().email(REQUIRED_MSG)),
  telefono: stringInput(z.string().trim().min(1, REQUIRED_MSG)),
  mensaje: z.string().trim().optional(),
  cvUrl: z.string().trim().nullable().optional(),
})

/**
 * Sustituye a `/api/send-job-inquiry` (Brevo, sin persistencia). Persiste en
 * Supabase primero, notifica por email después — mismo orden que
 * `/api/leads`.
 *
 * 🔒 2026-09-04 (43) — validación con zod (`parseJsonBody`).
 *
 * 2026-09-05 — la subida de CV (`/api/empleo/upload-cv`, Vercel Blob) se
 * eliminó por completo del sitio; `cvUrl` se queda como campo opcional
 * inerte (la columna `candidaturas_empleo.cv_url` ya era nullable, el CV
 * siempre fue opcional en el formulario) por si se retoma con otro
 * mecanismo más adelante, nunca poblado hoy.
 */
export async function POST(request: NextRequest) {
  const parsed = await parseJsonBody(request, candidaturaSchema)
  if (!parsed.success) return parsed.response
  const { ofertaId, ofertaPuesto, nombre, email, telefono, mensaje, cvUrl } = parsed.data

  try {
    const candidatura = await createCandidatura({
      ofertaId: ofertaId ?? null,
      ofertaPuesto,
      nombre,
      email,
      telefono,
      mensaje: mensaje || null,
      cvUrl: cvUrl || null,
    })

    return NextResponse.json({ success: true, id: candidatura.id })
  } catch (error) {
    console.error("[empleo] Error al procesar la candidatura:", error)
    return NextResponse.json({ error: "Error al enviar la candidatura. Por favor, inténtalo de nuevo." }, { status: 500 })
  }
}
