import { Button, Section, Text } from "react-email"
import { EmailLayout } from "./_components/email-layout"
import { DetailCard } from "./_components/detail-card"
import { ContactCallout } from "./_components/contact-callout"
import { emailAssets } from "./_components/brand"
import type { ProgramaAdmision } from "./admision-confirmation"

export interface AdmisionInternalNoticeEmailProps {
  nombreCompleto: string
  email: string
  telefono: string
  programaSolicitado: ProgramaAdmision
  origen: string
  pais: string | null
  ciudad: string | null
  fechaNacimiento: string | null
  titulacionPrevia: string | null
  universidadOrigen: string | null
  mensaje: string | null
  cvUrl: string | null
}

/**
 * Aviso interno a info@idesie.com por cada solicitud de admisión nueva —
 * tono operativo, no el cálido de cara al solicitante
 * (`admision-confirmation.tsx`): el teléfono y el email van primero y
 * grandes (`ContactCallout`), para poder llamar sin tener que leer el resto
 * del correo. El resto de datos, solo si existen — el formulario no obliga
 * a rellenar país/ciudad/titulación/universidad/mensaje.
 */
export function AdmisionInternalNoticeEmail({
  nombreCompleto,
  email,
  telefono,
  programaSolicitado,
  origen,
  pais,
  ciudad,
  fechaNacimiento,
  titulacionPrevia,
  universidadOrigen,
  mensaje,
  cvUrl,
}: AdmisionInternalNoticeEmailProps) {
  const rows = [
    { label: "Programa solicitado", value: programaSolicitado },
    { label: "Origen", value: origen },
    ...(pais || ciudad ? [{ label: "Residencia", value: [ciudad, pais].filter(Boolean).join(", ") }] : []),
    ...(fechaNacimiento ? [{ label: "Fecha de nacimiento", value: fechaNacimiento }] : []),
    ...(titulacionPrevia ? [{ label: "Titulación previa", value: titulacionPrevia }] : []),
    ...(universidadOrigen ? [{ label: "Universidad de origen", value: universidadOrigen }] : []),
  ]

  return (
    <EmailLayout previewText={`Nueva solicitud de admisión — ${programaSolicitado}: ${nombreCompleto}`}>
      <Text className="m-0 mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-brand">
        Nueva solicitud de admisión
      </Text>

      <ContactCallout nombre={nombreCompleto} telefono={telefono} email={email} />

      <DetailCard rows={rows} />

      {mensaje ? (
        <Section className="mt-4 rounded-lg border border-solid border-line px-5 py-4">
          <Text className="m-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Mensaje</Text>
          <Text className="m-0 mt-1 whitespace-pre-line text-[14px] leading-[21px] text-ink">{mensaje}</Text>
        </Section>
      ) : null}

      {cvUrl ? (
        <Text className="m-0 mt-4 text-sm leading-[22px] text-ink">
          CV:{" "}
          <a href={cvUrl} style={{ color: "#006cff" }}>
            {cvUrl}
          </a>
        </Text>
      ) : null}

      <Section className="mt-7 mb-2 text-center">
        <Button
          href={`${emailAssets.siteUrl}/admin/admisiones`}
          className="rounded-lg bg-brand px-6 py-3 text-[15px] font-semibold text-white no-underline"
        >
          Abrir panel de admisiones
        </Button>
      </Section>
    </EmailLayout>
  )
}

AdmisionInternalNoticeEmail.PreviewProps = {
  nombreCompleto: "Marcos Luengo",
  email: "marcos.luengo@idesie.com",
  telefono: "+34 600 000 000",
  programaSolicitado: "MBIM",
  origen: "landing",
  pais: "España",
  ciudad: "Madrid",
  fechaNacimiento: "1998-04-12",
  titulacionPrevia: "Grado en Arquitectura Técnica",
  universidadOrigen: "Universidad Politécnica de Madrid",
  mensaje: "Me interesa especialmente la modalidad de prácticas garantizadas. ¿Hay convocatoria en octubre?",
  cvUrl: null,
} satisfies AdmisionInternalNoticeEmailProps

export default AdmisionInternalNoticeEmail
