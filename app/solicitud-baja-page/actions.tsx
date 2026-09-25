"use server"

import { headers } from "next/headers"
import { getResend } from "@/lib/resend"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { escapeHtml } from "@/lib/escape-html"
import { isStrictEmail } from "@/lib/validate-email"
import { HONEYPOT_FIELD, isHoneypotTriggered } from "@/lib/honeypot"
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit"

// Perezoso a propósito: invocar getResend() a nivel de módulo repetía
// exactamente el bug de `next build` que ya rompía la conexión a la base de datos
// (CLAUDE.md §0) — aquí con Resend en vez de la base de datos. Este
// wrapper mantiene `resend.emails.send(...)` funcionando igual en el
// resto del archivo sin invocar getResend() hasta la primera petición.
const resend: ReturnType<typeof getResend> = {
  emails: {
    send: (payload) => getResend().emails.send(payload),
  },
}

const MOTIVOS = ["no_interes", "privacidad", "spam", "otro"] as const
type Motivo = (typeof MOTIVOS)[number]

const SUCCESS_MESSAGE =
  "Tu solicitud ha sido enviada correctamente. Recibirás un correo de confirmación en breve. Procesaremos tu solicitud en un plazo máximo de 30 días."

function readText(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

export async function submitDeletionRequest(formData: FormData) {
  // 🔒 Honeypot: un bot que rellena el campo trampa recibe un "éxito" falso y no
  // se procesa nada (ni BD ni emails).
  if (isHoneypotTriggered(formData.get(HONEYPOT_FIELD))) {
    console.warn("[honeypot] Solicitud de baja descartada (campo trampa relleno)")
    return { success: true, message: SUCCESS_MESSAGE }
  }

  // 🔒 Rate limiting por IP antes de hacer nada más.
  const ipLimit = await checkRateLimit(RATE_LIMITS.bajaIp, getClientIp(await headers()))
  if (!ipLimit.allowed) {
    return { success: false, message: "Has enviado demasiadas solicitudes. Inténtalo de nuevo más tarde." }
  }

  const nombre = readText(formData, "nombre")
  const email = readText(formData, "email").toLowerCase()
  const motivo = readText(formData, "motivo")
  const comentarios = readText(formData, "comentarios")

  // Validate required fields
  if (!nombre || !email || !motivo) {
    return {
      success: false,
      message: "Por favor, completa todos los campos requeridos.",
    }
  }

  // Validate email format (estricta: sin caracteres de control, longitudes RFC, TLD real)
  if (!isStrictEmail(email)) {
    return {
      success: false,
      message: "Por favor, introduce un correo electrónico válido.",
    }
  }

  if (!MOTIVOS.includes(motivo as Motivo)) {
    return { success: false, message: "Por favor, selecciona un motivo válido." }
  }

  if (nombre.length > 200 || comentarios.length > 2000) {
    return { success: false, message: "Alguno de los campos es demasiado largo." }
  }

  // 🔒 Límite por email: evita usar el formulario para bombardear a una dirección
  // ajena con correos de confirmación.
  const emailLimit = await checkRateLimit(RATE_LIMITS.bajaEmail, email)
  if (!emailLimit.allowed) {
    return { success: false, message: "Ya hemos recibido varias solicitudes para este correo. Inténtalo de nuevo más tarde." }
  }

  // Persistir PRIMERO, igual que el resto de formularios: es el único registro
  // de que alguien pidió la supresión de sus datos. Un fallo aquí no bloquea
  // el aviso por email (sigue siendo la vía por la que el equipo se entera),
  // pero se deja en el log porque significa que falta trazabilidad.
  let persisted = false
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Solicitudes de baja", `no persistida en Supabase → ${email}`)
  } else {
    try {
      const supabase = getSupabaseServerClient()
      const { error } = await supabase.from("solicitudes_baja").insert({ email, motivo })
      if (error) throw error
      persisted = true
    } catch (error) {
      console.error(
        "[baja] No se pudo guardar la solicitud en solicitudes_baja (¿scripts/036 sin aplicar?):",
        error instanceof Error ? error.message : error,
      )
    }
  }

  // Todo lo que viene del usuario se escapa antes de entrar en el HTML.
  const nombreSafe = escapeHtml(nombre)
  const emailSafe = escapeHtml(email)
  const motivoSafe = escapeHtml(motivo)
  // El asunto no es HTML, pero un salto de línea colado no debe poder romperlo.
  const nombreSubject = nombre.replace(/[\r\n]+/g, " ")

  let notified = false
  try {
    // Send email notification using Resend
    await resend.emails.send({
      from: "IDESIE <onboarding@resend.dev>", // Replace with your verified domain
      to: "info@idesie.com", // Admin email
      replyTo: email,
      subject: `Solicitud de Baja de Base de Datos - ${nombreSubject}`,
      html: `
        <h2>Nueva Solicitud de Baja de Base de Datos</h2>
        <p><strong>Nombre:</strong> ${nombreSafe}</p>
        <p><strong>Email:</strong> ${emailSafe}</p>
        <p><strong>Motivo:</strong> ${motivoSafe}</p>
        ${comentarios ? `<p><strong>Comentarios:</strong> ${escapeHtml(comentarios).replace(/\n/g, "<br>")}</p>` : ""}
        <hr />
        <p style="color: #666; font-size: 12px;">
          Esta solicitud fue enviada desde el formulario de Solicitud de Baja en idesie.com
        </p>
      `,
    })
    notified = true

    // Send confirmation email to user
    await resend.emails.send({
      from: "IDESIE <onboarding@resend.dev>",
      to: email,
      subject: "Confirmación de Solicitud de Baja - IDESIE",
      html: `
        <h2>Hemos recibido tu solicitud de baja</h2>
        <p>Hola ${nombreSafe},</p>
        <p>Hemos recibido tu solicitud de supresión de datos personales. Procesaremos tu solicitud en un plazo máximo de 30 días.</p>
        <p>Una vez completado el proceso, eliminaremos todos tus datos personales de nuestros sistemas de forma irreversible.</p>
        <p>Si tienes alguna duda, puedes contactarnos en <a href="mailto:info@idesie.com">info@idesie.com</a></p>
        <br />
        <p>Saludos,<br />Equipo IDESIE Business School</p>
      `,
    })
  } catch (error) {
    console.error("[baja] Error enviando los emails de la solicitud:", error)
  }

  // Éxito si la solicitud quedó registrada en algún sitio (BD o aviso al equipo).
  // Solo se muestra error si no se ha podido dejar constancia en ninguno de los dos.
  if (persisted || notified) {
    return { success: true, message: SUCCESS_MESSAGE }
  }

  return {
    success: false,
    message:
      "Ha ocurrido un error al enviar tu solicitud. Por favor, inténtalo de nuevo más tarde o contacta con nosotros en info@idesie.com",
  }
}
