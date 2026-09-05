import { Section, Text } from "react-email"
import { emailFonts } from "./brand"

interface DetailRow {
  label: string
  value: string
}

/**
 * Tarjeta de datos tipo "recibo" — misma idea que `.pedido-summary`/las
 * filas mono de la ficha de producto: etiqueta en mayúsculas pequeñas,
 * valor en monoespaciada. Sin tablas de verdad (mismo motivo que el resto
 * del layout): dos `Text` por fila dentro de una `Section` con borde.
 */
export function DetailCard({ rows }: { rows: DetailRow[] }) {
  return (
    <Section className="rounded-lg border border-solid border-line bg-paper px-5 py-4">
      {rows.map((row, i) => (
        <Section key={row.label} className={i > 0 ? "mt-3" : ""}>
          <Text className="m-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
            {row.label}
          </Text>
          <Text
            className="m-0 mt-0.5 text-base font-semibold text-ink"
            style={{ fontFamily: emailFonts.mono }}
          >
            {row.value}
          </Text>
        </Section>
      ))}
    </Section>
  )
}
