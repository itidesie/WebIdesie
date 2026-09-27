import "server-only"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { getResend, getResendFrom } from "@/lib/resend"
import { escapeHtml, singleLine } from "@/lib/escape-html"

export interface LeadData {
  firstName: string
  lastName: string
  phone: string
  email: string
  /** Máster de interés (MBIM/MBBE/EMBIM/Online) o null si no se especificó. */
  masterInteres: string | null
  /** Mensaje libre opcional (campo `mensaje` de scripts/037). */
  mensaje: string | null
  /**
   * Agendar llamada es OPCIONAL desde 2026-09-28: ambas van juntas — o las
   * dos con valor (persona que sí quiere que la llamen a una hora) o las
   * dos `null` (persona que solo deja sus datos, sin franja).
   */
  sessionDate: string | null // "YYYY-MM-DD"
  sessionTime: string | null // "HH:00", franja de una hora
  rgpdAceptado: boolean
  /** De qué página/sección vino el lead — "Landing · Agenda", "Contacto", etc. */
  origen: string
}

export interface Lead {
  id: string
  created_at: string
}

/**
 * Lanzado cuando la franja (fecha+hora) elegida acaba de ocuparse — el
 * índice único parcial `leads_slot_unico` (scripts/033) rechaza el INSERT
 * con el código Postgres 23505 (unique_violation). Solo puede ocurrir
 * cuando sí se pidió agendar llamada (sessionDate/sessionTime con valor):
 * dos leads sin franja (NULL, NULL) nunca chocan entre sí.
 * `app/api/leads/route.ts` la distingue de un error genérico para devolver
 * 409 en vez de 500, con un mensaje que el formulario puede mostrar tal cual.
 */
export class SlotUnavailableError extends Error {
  constructor() {
    super("Esa franja acaba de reservarse. Elige otra, por favor.")
    this.name = "SlotUnavailableError"
  }
}

/**
 * Inserta un lead y dispara los emails — mismo patrón que
 * `lib/contact-db.ts`/`candidaturas-db.ts`/`admision-db.ts`: aviso al
 * equipo (con `replyTo` al propio lead, para poder responder directamente)
 * y confirmación al lead. 🔴 2026-09-28 — antes solo se enviaba la
 * confirmación; el aviso al equipo no existía (hallazgo de la revisión del
 * formulario nuevo, ver CLAUDE.md "(54)"/"(55)").
 *
 * Ambos emails son independientes en modo mock (cada uno respeta su propia
 * variable de entorno — se puede tener Supabase real sin tener aún Resend
 * real).
 *
 * 🔴 RESEND EN MODO MOCK A PROPÓSITO — el cliente (`getResend()`, en
 * `lib/resend.ts`) ya decide solo entre mock y real según si
 * `RESEND_API_KEY` está puesta. Mientras tanto, cada lead nuevo imprime
 * `[MOCK] Resend — email no enviado → …` en vez de fallar o intentar
 * conectar de verdad.
 */
export async function createLead(data: LeadData): Promise<Lead> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock(
      "Leads",
      `no persistido en Supabase → ${data.email} (${data.masterInteres ?? "sin máster concreto"})` +
        (data.sessionDate ? ` · llamada ${data.sessionDate} ${data.sessionTime}` : " · sin agendar llamada"),
    )
    await sendNotificationEmails(data)
    return { id: "mock", created_at: new Date().toISOString() }
  }

  const supabase = getSupabaseServerClient()
  const { data: row, error } = await supabase
    .from("leads")
    .insert({
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      email: data.email,
      master_interes: data.masterInteres,
      mensaje: data.mensaje,
      session_date: data.sessionDate,
      session_time: data.sessionTime,
      rgpd_aceptado: data.rgpdAceptado,
      origen: data.origen,
    })
    .select("id, created_at")
    .single()

  if (error) {
    if (error.code === "23505") {
      throw new SlotUnavailableError()
    }
    console.error("[leads] Error al insertar en Supabase:", error.message)
    throw new Error("No se pudo guardar la solicitud")
  }

  await sendNotificationEmails(data)
  return row as Lead
}

/**
 * Dos emails, mismo patrón que `contact-db.ts`: aviso al equipo (con la
 * hora de la llamada en el propio asunto, si la hay, para que se note sin
 * abrir el correo) y confirmación al lead. TODO cuando llegue
 * RESEND_API_KEY: revisar el remitente (`from`) — hoy usa un dominio de
 * ejemplo porque no hay ningún dominio verificado en Resend todavía;
 * cámbialo por el remitente real de IDESIE antes de activar el envío de
 * verdad.
 */
async function sendNotificationEmails(data: LeadData): Promise<void> {
  const resend = getResend()
  const conLlamada = !!(data.sessionDate && data.sessionTime)
  const sesion = conLlamada ? `${formatFecha(data.sessionDate!)} a las ${data.sessionTime}` : null

  try {
    await resend.emails.send({
      from: getResendFrom(),
      to: "info@idesie.com",
      replyTo: data.email,
      subject: conLlamada
        ? `Llamada solicitada — ${singleLine(data.sessionDate!)} ${singleLine(data.sessionTime!)}`
        : "Nueva solicitud de información",
      html: `<h2>${conLlamada ? "Llamada solicitada" : "Nueva solicitud de información"}</h2>
<p><strong>Nombre:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</p>
<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
<p><strong>Teléfono:</strong> ${escapeHtml(data.phone)}</p>
${data.masterInteres ? `<p><strong>Programa:</strong> ${escapeHtml(data.masterInteres)}</p>` : ""}
${conLlamada ? `<p><strong>Llamada solicitada:</strong> ${escapeHtml(sesion!)} (hora española)</p>` : "<p><em>No ha pedido que le llamemos a una hora concreta.</em></p>"}
${data.mensaje ? `<p><strong>Mensaje:</strong><br>${escapeHtml(data.mensaje).replace(/\n/g, "<br>")}</p>` : ""}
<p><strong>Origen:</strong> ${escapeHtml(data.origen)}</p>`,
    })
  } catch (err) {
    // Un fallo al enviar el aviso interno no debe tirar abajo la creación
    // del lead: el dato ya está guardado, que es lo importante.
    console.error("[leads] No se pudo enviar el aviso al equipo:", err)
  }

  const cuerpoLlamada = conLlamada
    ? `<p>Te llamaremos el <strong>${escapeHtml(sesion!)}</strong> (hora española). Si no puede ser en ese momento, te confirmaremos otro por teléfono o email antes de la sesión.</p>`
    : `<p>Un asesor revisará tu solicitud y se pondrá en contacto contigo por teléfono o email en breve.</p>`

  try {
    await resend.emails.send({
      from: getResendFrom(),
      to: data.email,
      subject: "Hemos recibido tu solicitud — IDESIE",
      html: `<p>Hola ${escapeHtml(data.firstName)},</p>
<p>Hemos recibido tu solicitud de información${data.masterInteres ? ` sobre el ${escapeHtml(data.masterInteres)}` : ""}.</p>
${cuerpoLlamada}
<p>Gracias por tu interés en IDESIE.</p>`,
    })
  } catch (err) {
    // Un fallo al enviar la confirmación no debe tirar abajo la creación del
    // lead: el dato ya está guardado, que es lo importante.
    console.error("[leads] No se pudo enviar el email de confirmación:", err)
  }
}

function formatFecha(iso: string): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
  } catch {
    return iso
  }
}
