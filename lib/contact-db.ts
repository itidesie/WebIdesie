import "server-only"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { getResend } from "@/lib/resend"
import { escapeHtml } from "@/lib/escape-html"

export interface MensajeContactoData {
  nombre: string
  email: string
  asunto: string | null
  mensaje: string
  motivo: string | null
  programa: string | null
}

export interface MensajeContacto {
  id: string
  created_at: string
}

/**
 * Inserta el mensaje y dispara los emails, en ese orden — mismo patrón que
 * `lib/leads-db.ts`/`lib/candidaturas-db.ts`: persistir primero significa
 * que un fallo de envío no se lleva por delante el único registro de que
 * alguien escribió. Antes, el formulario de contacto no tenía `onSubmit`
 * en absoluto — no se sustituye un email-only, se sustituye la nada.
 */
export async function createMensajeContacto(data: MensajeContactoData): Promise<MensajeContacto> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Contacto", `no persistido en Supabase → ${data.email}`)
    await sendNotificationEmails(data)
    return { id: "mock", created_at: new Date().toISOString() }
  }

  const supabase = getSupabaseServerClient()
  const { data: row, error } = await supabase
    .from("mensajes_contacto")
    .insert({
      nombre: data.nombre,
      email: data.email,
      asunto: data.asunto,
      mensaje: data.mensaje,
      motivo: data.motivo,
      programa: data.programa,
    })
    .select("id, created_at")
    .single()

  if (error) {
    console.error("[contacto] Error al insertar en Supabase:", error.message)
    throw new Error("No se pudo guardar el mensaje")
  }

  await sendNotificationEmails(data)
  return row as MensajeContacto
}

/**
 * Dos emails, mismo patrón que `candidaturas-db.ts`/`admision-db.ts`: aviso
 * al equipo (con `replyTo` al remitente, para poder responder directamente)
 * y confirmación al propio remitente.
 */
async function sendNotificationEmails(data: MensajeContactoData): Promise<void> {
  const resend = getResend()

  try {
    await resend.emails.send({
      // TODO: sustituir por el remitente verificado real de IDESIE en Resend.
      from: "IDESIE <onboarding@resend.dev>",
      to: "info@idesie.com",
      replyTo: data.email,
      subject: `Nuevo mensaje de contacto${data.asunto ? ` — ${data.asunto}` : ""}`,
      html: `<h2>Nuevo mensaje de contacto</h2>
<p><strong>Nombre:</strong> ${escapeHtml(data.nombre)}</p>
<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
${data.asunto ? `<p><strong>Asunto:</strong> ${escapeHtml(data.asunto)}</p>` : ""}
${data.programa ? `<p><strong>Programa:</strong> ${escapeHtml(data.programa)}</p>` : ""}
<p><strong>Mensaje:</strong><br>${escapeHtml(data.mensaje).replace(/\n/g, "<br>")}</p>`,
    })
  } catch (err) {
    console.error("[contacto] No se pudo enviar el aviso al equipo:", err)
  }

  try {
    await resend.emails.send({
      from: "IDESIE <onboarding@resend.dev>",
      to: data.email,
      subject: "Hemos recibido tu mensaje — IDESIE",
      html: `<p>Hola ${escapeHtml(data.nombre)},</p>
<p>Hemos recibido tu mensaje y nuestro equipo se pondrá en contacto contigo en breve.</p>
<p>Gracias por escribirnos.</p>`,
    })
  } catch (err) {
    // Un fallo en la confirmación no debe tirar abajo el envío: el dato ya
    // está guardado y el equipo ya ha sido notificado.
    console.error("[contacto] No se pudo enviar la confirmación al remitente:", err)
  }
}
