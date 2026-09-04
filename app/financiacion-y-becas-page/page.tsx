import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import { BalanceHero } from "@/components/financiacion/balance-hero"
import { BalanceStat } from "@/components/financiacion/balance-stat"
import { BalanceFinancingCards } from "@/components/financiacion/balance-financing-cards"
import { BalanceLedger } from "@/components/financiacion/balance-ledger"
import { BalanceAdvisory } from "@/components/financiacion/balance-advisory"
import { BalanceStatement } from "@/components/financiacion/balance-statement"
import { BalanceClosing } from "@/components/financiacion/balance-closing"
import {
  hero,
  stat,
  financingOptions,
  scholarshipLedger,
  scholarshipNote,
  scholarshipsCta,
  advisory,
  summary,
  closing,
} from "./financiacion-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Financiación y Becas | Ayudas para tu Formación | IDESIE",
  description:
    "Financiación y becas para estudiar en IDESIE Business School. Préstamos bancarios sin intereses, becas de excelencia hasta 50%, ayudas familiares y convenios empresariales. Haz realidad tu formación BIM con nuestras opciones de financiación flexibles.",
  alternates: { canonical: "/financiacion-y-becas-page" },
}

export default function FinanciacionYBecaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <BalanceHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} />

        <BalanceStat
          value={stat.value}
          suffix={stat.suffix}
          label={stat.label}
          claim={stat.claim}
          facts={stat.facts}
        />

        <BalanceFinancingCards
          eyebrow="Opciones de financiación"
          title="Tres vías, un mismo objetivo"
          intro="Estudiar en IDESIE requiere tanto planificación económica como de tiempo. Para los alumnos admitidos, ofrecemos diversas ayudas financieras y opciones de financiación."
          options={financingOptions}
        />

        <BalanceLedger
          eyebrow="Becas IDESIE"
          title="El libro de becas"
          groups={scholarshipLedger}
          note={scholarshipNote}
          ctaLabel={scholarshipsCta.label}
          ctaHref={scholarshipsCta.href}
        />

        <BalanceAdvisory
          eyebrow="Apoyo adicional"
          title="No decides esto solo"
          intro={advisory.intro}
          steps={advisory.steps}
        />

        <BalanceStatement eyebrow="En resumen" title="Tu estado de cuenta, de un vistazo" rows={summary} />

        <BalanceClosing
          title={closing.title}
          text={closing.text}
          ctaLabel={closing.ctaLabel}
          ctaHref={closing.ctaHref}
        />
      </main>
      <FooterSection />
    </div>
  )
}
