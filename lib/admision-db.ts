import "server-only"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { getResend } from "@/lib/resend"
import { escapeHtml } from "@/lib/escape-html"

export type ProgramaAdmision = "MBIM" | "MBBE" | "EMBIM" | "Online"
export type OrigenAdmision = "landing" | "mbim" | "mbbe" | "embim" | "online"

export interface SolicitudAdmisionData {
  nombreCompleto: string
  email: string
  telefono: string
  pais: string | null
  ciudad: string | null
  fechaNacimiento: string | null
  titulacionPrevia: string | null
  universidadOrigen: string | null
  programaSolicitado: ProgramaAdmision
  origen: OrigenAdmision
  /** Ya no se pide en el formulario (2026-09-04 (40)) — se conserva la columna por si se reactiva. */
  cvUrl: string | null
  mensaje: string | null
  rgpdAceptado: boolean
}

export interface SolicitudAdmision {
  id: string
  created_at: string
}

/**
 * Inserta la solicitud y dispara los emails, en ese orden — mismo patrón que
 * `lib/candidaturas-db.ts`/`lib/leads-db.ts`: persistir primero significa
 * que un fallo de envío no se lleva por delante el único registro de que
 * alguien solicitó admisión.
 */
export async function createSolicitudAdmision(data: SolicitudAdmisionData): Promise<SolicitudAdmision> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Solicitudes de admisión", `no persistida en Supabase → ${data.email} (${data.programaSolicitado})`)
    await sendNotificationEmails(data)
    return { id: "mock", created_at: new Date().toISOString() }
  }

  const supabase = getSupabaseServerClient()
  const { data: row, error } = await supabase
    .from("solicitudes_admision")
    .insert({
      nombre_completo: data.nombreCompleto,
      email: data.email,
      telefono: data.telefono,
      pais: data.pais,
      ciudad: data.ciudad,
      fecha_nacimiento: data.fechaNacimiento,
      titulacion_previa: data.titulacionPrevia,
      universidad_origen: data.universidadOrigen,
      programa_solicitado: data.programaSolicitado,
      origen: data.origen,
      cv_url: data.cvUrl,
      mensaje: data.mensaje,
      rgpd_aceptado: data.rgpdAceptado,
    })
    .select("id, created_at")
    .single()

  if (error) {
    console.error("[admision] Error al insertar en Supabase:", error.message)
    throw new Error("No se pudo guardar la solicitud")
  }

  await sendNotificationEmails(data)
  return row as SolicitudAdmision
}

/**
 * Dos emails, mismo patrón que `candidaturas-db.ts`: aviso al equipo y
 * confirmación al solicitante. En modo mock (`RESEND_API_KEY` ausente),
 * `getResend()` ya devuelve un cliente simulado — se ve reflejado en el
 * log del servidor, sin fallar la solicitud.
 */
async function sendNotificationEmails(data: SolicitudAdmisionData): Promise<void> {
  const resend = getResend()

  const programaSafe = escapeHtml(data.programaSolicitado)

  try {
    await resend.emails.send({
      // TODO: sustituir por el remitente verificado real de IDESIE en Resend.
      from: "IDESIE <onboarding@resend.dev>",
      to: "info@idesie.com",
      replyTo: data.email,
      subject: `Nueva solicitud de admisión — ${data.programaSolicitado}`,
      html: `<h2>Nueva solicitud de admisión: ${programaSafe}</h2>
<p><strong>Nombre:</strong> ${escapeHtml(data.nombreCompleto)}</p>
<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
<p><strong>Teléfono:</strong> ${escapeHtml(data.telefono)}</p>
${data.pais || data.ciudad ? `<p><strong>Residencia:</strong> ${escapeHtml([data.ciudad, data.pais].filter(Boolean).join(", "))}</p>` : ""}
${data.fechaNacimiento ? `<p><strong>Fecha de nacimiento:</strong> ${escapeHtml(data.fechaNacimiento)}</p>` : ""}
${data.titulacionPrevia ? `<p><strong>Titulación previa:</strong> ${escapeHtml(data.titulacionPrevia)}</p>` : ""}
${data.universidadOrigen ? `<p><strong>Universidad de origen:</strong> ${escapeHtml(data.universidadOrigen)}</p>` : ""}
<p><strong>Origen:</strong> ${escapeHtml(data.origen)}</p>
${data.mensaje ? `<p><strong>Mensaje:</strong><br>${escapeHtml(data.mensaje).replace(/\n/g, "<br>")}</p>` : ""}
${data.cvUrl ? `<p><strong>CV:</strong> <a href="${escapeHtml(data.cvUrl)}">${escapeHtml(data.cvUrl)}</a></p>` : ""}`,
    })
  } catch (err) {
    console.error("[admision] No se pudo enviar el aviso al equipo:", err)
  }

  try {
    await resend.emails.send({
      from: "IDESIE <onboarding@resend.dev>",
      to: data.email,
      subject: `Confirmación: solicitud de admisión recibida — ${data.programaSolicitado}`,
      html: `<p>Hola ${escapeHtml(data.nombreCompleto)},</p>
<p>Hemos recibido tu solicitud de admisión para <strong>${programaSafe}</strong>. Nuestro equipo de admisiones la revisará y se pondrá en contacto contigo en breve.</p>
<p>Gracias por tu interés en IDESIE.</p>`,
    })
  } catch (err) {
    // Un fallo en la confirmación no debe tirar abajo la solicitud: el dato
    // ya está guardado y el equipo ya ha sido notificado.
    console.error("[admision] No se pudo enviar la confirmación al solicitante:", err)
  }
}
