"use server"

import { getResend } from "@/lib/resend"

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

export async function submitDeletionRequest(formData: FormData) {
  const nombre = formData.get("nombre") as string
  const email = formData.get("email") as string
  const motivo = formData.get("motivo") as string
  const comentarios = formData.get("comentarios") as string

  // Validate required fields
  if (!nombre || !email || !motivo) {
    return {
      success: false,
      message: "Por favor, completa todos los campos requeridos.",
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Por favor, introduce un correo electrónico válido.",
    }
  }

  try {
    // Send email notification using Resend
    await resend.emails.send({
      from: "IDESIE <onboarding@resend.dev>", // Replace with your verified domain
      to: "info@idesie.com", // Admin email
      replyTo: email,
      subject: `Solicitud de Baja de Base de Datos - ${nombre}`,
      html: `
        <h2>Nueva Solicitud de Baja de Base de Datos</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Motivo:</strong> ${motivo}</p>
        ${comentarios ? `<p><strong>Comentarios:</strong> ${comentarios}</p>` : ""}
        <hr />
        <p style="color: #666; font-size: 12px;">
          Esta solicitud fue enviada desde el formulario de Solicitud de Baja en idesie.com
        </p>
      `,
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: "IDESIE <onboarding@resend.dev>",
      to: email,
      subject: "Confirmación de Solicitud de Baja - IDESIE",
      html: `
        <h2>Hemos recibido tu solicitud de baja</h2>
        <p>Hola ${nombre},</p>
        <p>Hemos recibido tu solicitud de supresión de datos personales. Procesaremos tu solicitud en un plazo máximo de 30 días.</p>
        <p>Una vez completado el proceso, eliminaremos todos tus datos personales de nuestros sistemas de forma irreversible.</p>
        <p>Si tienes alguna duda, puedes contactarnos en <a href="mailto:info@idesie.com">info@idesie.com</a></p>
        <br />
        <p>Saludos,<br />Equipo IDESIE Business School</p>
      `,
    })

    return {
      success: true,
      message:
        "Tu solicitud ha sido enviada correctamente. Recibirás un correo de confirmación en breve. Procesaremos tu solicitud en un plazo máximo de 30 días.",
    }
  } catch (error) {
    console.error("[v0] Error sending deletion request:", error)
    return {
      success: false,
      message:
        "Ha ocurrido un error al enviar tu solicitud. Por favor, inténtalo de nuevo más tarde o contacta con nosotros en info@idesie.com",
    }
  }
}
