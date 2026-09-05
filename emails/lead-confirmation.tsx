import { Button, Section, Text } from "react-email"
import { EmailLayout } from "./_components/email-layout"
import { DetailCard } from "./_components/detail-card"
import { emailAssets } from "./_components/brand"

export interface LeadConfirmationEmailProps {
  firstName: string
  /** Máster concreto de interés, o null si el CTA no era de uno en particular. */
  masterInteres: string | null
  /** Ya formateada en español, p. ej. "3 de septiembre de 2026" — se formatea
   * en el llamador (lib/leads-db.ts), no aquí, para no duplicar esa lógica. */
  sessionDateLabel: string
  /** "HH:00", franja de una hora, hora española. */
  sessionTime: string
}

/**
 * Confirmación al propio lead tras solicitar una sesión informativa desde
 * /landing (InfoRequestModal → /api/leads). Vista previa con datos de
 * ejemplo abajo (`LeadConfirmationEmail.PreviewProps`) — visible en
 * `pnpm email`.
 */
export function LeadConfirmationEmail({
  firstName,
  masterInteres,
  sessionDateLabel,
  sessionTime,
}: LeadConfirmationEmailProps) {
  return (
    <EmailLayout previewText={`Hemos recibido tu solicitud — te esperamos el ${sessionDateLabel}`}>
      <Text className="m-0 mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-brand">
        Solicitud recibida
      </Text>

      <Text className="m-0 mb-4 text-2xl font-bold leading-[30px] text-ink">
        ¡Gracias, {firstName}!
      </Text>

      <Text className="m-0 mb-6 text-[15px] leading-[24px] text-ink">
        Hemos recibido tu solicitud de sesión informativa
        {masterInteres ? (
          <>
            {" "}sobre el <strong>{masterInteres}</strong>
          </>
        ) : null}
        . Nuestro equipo te confirmará por teléfono o email antes de la sesión — no hace falta que hagas nada más.
      </Text>

      <DetailCard
        rows={[
          { label: "Fecha", value: sessionDateLabel },
          { label: "Hora (España)", value: sessionTime },
        ]}
      />

      <Section className="mt-7 mb-2 text-center">
        <Button
          href={`${emailAssets.siteUrl}/comparativa-masters-page`}
          className="rounded-lg bg-brand px-6 py-3 text-[15px] font-semibold text-white no-underline"
        >
          Ver todos los másteres
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
        El equipo de IDESIE
      </Text>
    </EmailLayout>
  )
}

LeadConfirmationEmail.PreviewProps = {
  firstName: "Marcos",
  masterInteres: "MBIM",
  sessionDateLabel: "12 de septiembre de 2026",
  sessionTime: "11:00",
} satisfies LeadConfirmationEmailProps

export default LeadConfirmationEmail
