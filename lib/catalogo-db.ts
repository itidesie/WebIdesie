import "server-only"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { getResend } from "@/lib/resend"
import { escapeHtml } from "@/lib/escape-html"

export interface DescargaCatalogoData {
  nombre: string
  email: string
  telefono: string
  catalogoId: string
  catalogoNombre: string | null
  programa: "MBIM" | "MBBE" | "EMBIM" | "Online"
  rgpdAceptado: boolean
  pdfBuffer: Buffer
  pdfFileName: string
}

export interface DescargaCatalogo {
  id: string
  created_at: string
}

/**
 * Inserta la solicitud y dispara el email con el catálogo adjunto, en ese
 * orden — mismo patrón que `lib/contact-db.ts`/`lib/leads-db.ts`: persistir
 * primero significa que un fallo de envío (Resend caído, adjunto
 * rechazado...) no se lleva por delante el único registro de que alguien lo
 * pidió. Pendiente dejado explícitamente sin resolver en (46), cerrado aquí.
 */
export async function createDescargaCatalogo(data: DescargaCatalogoData): Promise<DescargaCatalogo> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Descargas de catálogo", `no persistido en Supabase → ${data.email} (${data.programa})`)
    await sendCatalogEmail(data)
    return { id: "mock", created_at: new Date().toISOString() }
  }

  const supabase = getSupabaseServerClient()
  const { data: row, error } = await supabase
    .from("descargas_catalogo")
    .insert({
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      catalogo_id: data.catalogoId,
      catalogo_nombre: data.catalogoNombre,
      programa: data.programa,
      rgpd_aceptado: data.rgpdAceptado,
    })
    .select("id, created_at")
    .single()

  if (error) {
    console.error("[descargas-catalogo] Error al insertar en Supabase:", error.message)
    throw new Error("No se pudo guardar la solicitud")
  }

  await sendCatalogEmail(data)
  return row as DescargaCatalogo
}

/**
 * Best-effort, igual que el resto de flujos: el dato ya quedó guardado antes
 * de llegar aquí, así que un fallo de Resend se registra pero no se propaga
 * como error al usuario.
 */
async function sendCatalogEmail(data: DescargaCatalogoData): Promise<void> {
  const safeName = escapeHtml(data.nombre)
  const safeCatalogName = escapeHtml(data.catalogoNombre || "IDESIE")
  const resend = getResend()

  try {
    await resend.emails.send({
      // TODO: sustituir por el remitente verificado real de IDESIE en Resend.
      from: "IDESIE <onboarding@resend.dev>",
      to: data.email,
      subject: `Tu catálogo de ${safeCatalogName} - IDESIE`,
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #006cff; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin: 0;">¡Aquí está tu catálogo!</h1>
      </div>
      <div class="content">
        <p>Hola ${safeName},</p>
        <p>Te enviamos el catálogo de <strong>${safeCatalogName}</strong> que solicitaste.</p>
        <p>El archivo PDF está adjunto a este email. Puedes descargarlo y revisarlo en cualquier momento.</p>
        <p>Si tienes alguna pregunta sobre el programa o necesitas más información, no dudes en contactarnos:</p>
        <ul style="list-style: none; padding: 0;">
          <li>📧 Email: <a href="mailto:info@idesie.com">info@idesie.com</a></li>
          <li>🌐 Web: <a href="https://www.idesie.com">www.idesie.com</a></li>
        </ul>
        <p style="margin-top: 30px;">Saludos cordiales,<br>
        <strong>Equipo de IDESIE Business & Tech School</strong></p>
      </div>
    </div>
  </body>
</html>`,
      attachments: [
        {
          content: data.pdfBuffer,
          filename: data.pdfFileName,
        },
      ],
    })
  } catch (err) {
    console.error("[descargas-catalogo] No se pudo enviar el email con el catálogo:", err)
  }
}
