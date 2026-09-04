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

interface AdmissionFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  institution: string
  degree: string
  experience: string
}

export async function submitAdmissionForm(formData: AdmissionFormData) {
  const { firstName, lastName, email, phone, country, institution, degree, experience } = formData

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !country) {
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
    // Send email notification to admin using Resend
    await resend.emails.send({
      from: "IDESIE <onboarding@resend.dev>",
      to: "info@idesie.com",
      replyTo: email,
      subject: `Nueva Solicitud de Admisión - ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="background-color: #006cff; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Nueva Solicitud de Admisión</h1>
            <p style="margin: 10px 0 0 0;">Master BIM IDESIE</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 20px;">
              <h3 style="color: #006cff; margin-bottom: 10px;">Información Personal</h3>
              <p><strong>Nombre:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Teléfono:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p><strong>País:</strong> ${country}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #006cff; margin-bottom: 10px;">Información Académica y Profesional</h3>
              <p><strong>Institución de procedencia:</strong> ${institution || "No especificado"}</p>
              <p><strong>Título/Grado:</strong> ${degree || "No especificado"}</p>
              <p><strong>Experiencia profesional:</strong> ${experience || "No especificado"}</p>
            </div>

            <div style="margin-top: 30px; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #006cff; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px;">
                <strong>📅 Fecha de solicitud:</strong> ${new Date().toLocaleString("es-ES", {
                  timeZone: "Europe/Madrid",
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        </div>
      `,
    })

    // Send confirmation email to applicant
    await resend.emails.send({
      from: "IDESIE <onboarding@resend.dev>",
      to: email,
      subject: "Confirmación de Solicitud - Master BIM IDESIE",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="background-color: #006cff; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">¡Solicitud Recibida!</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Hola <strong>${firstName}</strong>,</p>
            
            <p>Hemos recibido tu solicitud de admisión para el <strong>Master BIM</strong> de IDESIE Business & Tech School.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #006cff; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0;">Nuestro equipo de admisiones revisará tu solicitud y nos pondremos en contacto contigo en breve para programar una entrevista personal con uno de nuestros profesores.</p>
            </div>
            
            <p>Mientras tanto, si tienes alguna pregunta, no dudes en contactarnos en <a href="mailto:info@idesie.com">info@idesie.com</a>.</p>
            
            <p style="margin-top: 30px;">Saludos cordiales,<br>
            <strong>Equipo de Admisiones - IDESIE Business & Tech School</strong></p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #666;">
              <p>IDESIE Business & Tech School<br>
              Madrid, España<br>
              <a href="https://www.idesie.com">www.idesie.com</a></p>
            </div>
          </div>
        </div>
      `,
    })

    return {
      success: true,
      message:
        "Tu solicitud ha sido enviada correctamente. Recibirás un correo de confirmación y nuestro equipo de admisiones se pondrá en contacto contigo en breve.",
    }
  } catch (error) {
    console.error("[v0] Error sending admission form:", error)
    return {
      success: false,
      message:
        "Ha ocurrido un error al enviar tu solicitud. Por favor, inténtalo de nuevo más tarde o contacta con nosotros en info@idesie.com",
    }
  }
}
