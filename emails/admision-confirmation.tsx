import { Button, Section, Text } from "react-email"
import { EmailLayout } from "./_components/email-layout"
import { DetailCard } from "./_components/detail-card"
import { emailAssets } from "./_components/brand"

export type ProgramaAdmision = "MBIM" | "MBBE" | "EMBIM" | "Online"

export interface AdmisionConfirmationEmailProps {
  nombreCompleto: string
  programaSolicitado: ProgramaAdmision
}

/** Ruta real de cada programa (ver el mapa de sitio en CLAUDE.md §1) — para
 * el CTA "Conoce el programa" de este email. */
const PROGRAMA_HREF: Record<ProgramaAdmision, string> = {
  MBIM: "/mbim-page",
  MBBE: "/mbbe-page",
  EMBIM: "/embim-page",
  Online: "/mbim-online-page",
}

/** Nombre completo del programa, para el cuerpo del texto. */
const PROGRAMA_LABEL: Record<ProgramaAdmision, string> = {
  MBIM: "Máster BIM (MBIM)",
  MBBE: "Máster BIM & Building Engineering (MBBE)",
  EMBIM: "Executive Máster BIM (EMBIM)",
  Online: "Máster BIM Online",
}

/**
 * Confirmación al solicitante tras enviar el formulario de admisión
 * (AdmisionModal → /api/admision). Vista previa con datos de ejemplo abajo
 * (`AdmisionConfirmationEmail.PreviewProps`) — visible en `pnpm email`.
 */
export function AdmisionConfirmationEmail({
  nombreCompleto,
  programaSolicitado,
}: AdmisionConfirmationEmailProps) {
  const primerNombre = nombreCompleto.trim().split(/\s+/)[0] || nombreCompleto

  return (
    <EmailLayout previewText={`Hemos recibido tu solicitud de admisión para el ${programaSolicitado}`}>
      <Text className="m-0 mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-brand">
        Solicitud de admisión recibida
      </Text>

      <Text className="m-0 mb-4 text-2xl font-bold leading-[30px] text-ink">
        ¡Gracias, {primerNombre}!
      </Text>

      <Text className="m-0 mb-6 text-[15px] leading-[24px] text-ink">
        Hemos recibido tu solicitud de admisión. Nuestro equipo de admisiones la revisará y se pondrá en contacto
        contigo en breve para acompañarte en los próximos pasos.
      </Text>

      <DetailCard rows={[{ label: "Programa solicitado", value: PROGRAMA_LABEL[programaSolicitado] }]} />

      <Section className="mt-7 mb-2 text-center">
        <Button
          href={`${emailAssets.siteUrl}${PROGRAMA_HREF[programaSolicitado]}`}
          className="rounded-lg bg-brand px-6 py-3 text-[15px] font-semibold text-white no-underline"
        >
          Conoce el programa
        </Button>
      </Section>

      <Text className="m-0 mt-6 text-sm leading-[22px] text-muted">
        ¿Tienes alguna duda mientras tanto? Escríbenos a{" "}
        <a href="mailto:info@idesie.com" style={{ color: "#006cff" }}>
          info@idesie.com
        </a>
        .
      </Text>

      <Text className="m-0 mt-6 text-sm leading-[22px] text-ink">
        Un saludo,
        <br />
        El equipo de Admisiones de IDESIE
      </Text>
    </EmailLayout>
  )
}

AdmisionConfirmationEmail.PreviewProps = {
  nombreCompleto: "Marcos Luengo",
  programaSolicitado: "MBIM",
} satisfies AdmisionConfirmationEmailProps

export default AdmisionConfirmationEmail
