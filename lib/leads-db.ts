import "server-only"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { getResend } from "@/lib/resend"
import { escapeHtml } from "@/lib/escape-html"

export interface LeadData {
  firstName: string
  lastName: string
  phone: string
  email: string
  /** Máster de interés (MBIM/MBBE/EMBIM/Online) o null si el CTA no era de un máster concreto. */
  masterInteres: string | null
  sessionDate: string // "YYYY-MM-DD"
  sessionTime: string // "HH:00", franja de una hora
  /** De qué página/sección vino el lead — "Landing · Hero", "Landing · Cierre", etc. */
  origen: string
}

export interface Lead {
  id: string
  created_at: string
}

/**
 * Inserta un lead y dispara el email de confirmación.
 *
 * Ambos pasos son independientes en modo mock (cada uno respeta su propia
 * variable de entorno — se puede tener Supabase real sin tener aún Resend
 * real, que es exactamente la situación de hoy: `SUPABASE_SERVICE_ROLE_KEY`
 * puesta, `RESEND_API_KEY` todavía no).
 *
 * 🔴 RESEND EN MODO MOCK A PROPÓSITO — el cliente (`getResend()`, en
 * `lib/resend.ts`) ya decide solo entre mock y real según si
 * `RESEND_API_KEY` está puesta. **No hay nada que cambiar aquí** cuando esa
 * clave llegue: añadir la variable de entorno basta, tal como pidió el
 * encargo. Mientras tanto, cada lead nuevo imprime
 * `[MOCK] Resend — email no enviado → …` en vez de fallar o intentar
 * conectar de verdad.
 */
export async function createLead(data: LeadData): Promise<Lead> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Leads", `no persistido en Supabase → ${data.email} (${data.masterInteres ?? "sin máster concreto"})`)
    await sendConfirmationEmail(data)
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
      session_date: data.sessionDate,
      session_time: data.sessionTime,
      origen: data.origen,
    })
    .select("id, created_at")
    .single()

  if (error) {
    console.error("[leads] Error al insertar en Supabase:", error.message)
    throw new Error("No se pudo guardar la solicitud")
  }

  await sendConfirmationEmail(data)
  return row as Lead
}

/**
 * Email de confirmación al propio lead. TODO cuando llegue RESEND_API_KEY:
 * revisar el remitente (`from`) — hoy usa un dominio de ejemplo porque no hay
 * ningún dominio verificado en Resend todavía; cámbialo por el remitente real
 * de IDESIE antes de activar el envío de verdad.
 */
async function sendConfirmationEmail(data: LeadData): Promise<void> {
  const resend = getResend()
  const sesion = `${formatFecha(data.sessionDate)} a las ${data.sessionTime}`

  try {
    await resend.emails.send({
      // TODO: sustituir por el remitente verificado real de IDESIE en Resend.
      from: "IDESIE <onboarding@resend.dev>",
      to: data.email,
      subject: "Hemos recibido tu solicitud — IDESIE",
      html: `<p>Hola ${escapeHtml(data.firstName)},</p>
<p>Hemos recibido tu solicitud de sesión informativa${data.masterInteres ? ` sobre el ${escapeHtml(data.masterInteres)}` : ""} para el <strong>${sesion}</strong> (hora española).</p>
<p>Te confirmaremos por teléfono o email antes de la sesión. Gracias por tu interés en IDESIE.</p>`,
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
