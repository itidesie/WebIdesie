import "server-only"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { getResend } from "@/lib/resend"
import { escapeHtml } from "@/lib/escape-html"

export interface CandidaturaData {
  ofertaId: number | null
  ofertaPuesto: string
  nombre: string
  email: string
  telefono: string
  mensaje: string | null
  cvUrl: string | null
}

export interface Candidatura {
  id: string
  created_at: string
}

/**
 * Inserta la candidatura y dispara los emails, en ese orden — mismo patrón
 * que `lib/leads-db.ts`: persistir primero significa que un fallo de envío
 * no se lleva por delante el único registro de que alguien aplicó. Antes de
 * esta tabla, una candidatura solo generaba un email (vía Brevo) que se
 * podía perder sin dejar rastro.
 */
export async function createCandidatura(data: CandidaturaData): Promise<Candidatura> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Candidaturas", `no persistida en Supabase → ${data.email} (${data.ofertaPuesto})`)
    await sendNotificationEmails(data)
    return { id: "mock", created_at: new Date().toISOString() }
  }

  const supabase = getSupabaseServerClient()
  const { data: row, error } = await supabase
    .from("candidaturas_empleo")
    .insert({
      oferta_id: data.ofertaId,
      oferta_puesto: data.ofertaPuesto,
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      mensaje: data.mensaje,
      cv_url: data.cvUrl,
    })
    .select("id, created_at")
    .single()

  if (error) {
    console.error("[candidaturas] Error al insertar en Supabase:", error.message)
    throw new Error("No se pudo guardar la candidatura")
  }

  await sendNotificationEmails(data)
  return row as Candidatura
}

/**
 * Dos emails, igual que hacía antes `/api/send-job-inquiry` con Brevo: aviso
 * al equipo y confirmación al candidato. Se cambia a Resend porque es el
 * estándar transaccional ya establecido del proyecto (leads, admisión) —
 * Brevo aquí se usaba fuera de su propósito real (CRM, no envío
 * transaccional).
 */
async function sendNotificationEmails(data: CandidaturaData): Promise<void> {
  const resend = getResend()
  const ofertaPuestoSafe = escapeHtml(data.ofertaPuesto)
  const cvLine = data.cvUrl ? `<p><strong>CV:</strong> <a href="${escapeHtml(data.cvUrl)}">${escapeHtml(data.cvUrl)}</a></p>` : ""

  try {
    await resend.emails.send({
      // TODO: sustituir por el remitente verificado real de IDESIE en Resend.
      from: "IDESIE <onboarding@resend.dev>",
      to: "info@idesie.com",
      replyTo: data.email,
      subject: `Nueva candidatura — ${data.ofertaPuesto}`,
      html: `<h2>Nueva candidatura: ${ofertaPuestoSafe}</h2>
<p><strong>Nombre:</strong> ${escapeHtml(data.nombre)}</p>
<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
<p><strong>Teléfono:</strong> ${escapeHtml(data.telefono)}</p>
${data.mensaje ? `<p><strong>Mensaje:</strong><br>${escapeHtml(data.mensaje).replace(/\n/g, "<br>")}</p>` : ""}
${cvLine}`,
    })
  } catch (err) {
    console.error("[candidaturas] No se pudo enviar el aviso al equipo:", err)
  }

  try {
    await resend.emails.send({
      from: "IDESIE <onboarding@resend.dev>",
      to: data.email,
      subject: `Confirmación: candidatura recibida para ${data.ofertaPuesto}`,
      html: `<p>Hola ${escapeHtml(data.nombre)},</p>
<p>Hemos recibido tu candidatura para <strong>${ofertaPuestoSafe}</strong>. Nuestro equipo la revisará y se pondrá en contacto contigo en breve.</p>
<p>Gracias por tu interés en IDESIE.</p>`,
    })
  } catch (err) {
    // Un fallo en la confirmación no debe tirar abajo la candidatura: el
    // dato ya está guardado y el equipo ya ha sido notificado.
    console.error("[candidaturas] No se pudo enviar la confirmación al candidato:", err)
  }
}
