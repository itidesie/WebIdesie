import type { Metadata } from "next"
import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import { getPublicOfertas } from "@/app/empleo/actions"
import { TablonHero } from "@/components/empleo/tablon-hero"
import { TablonSteps } from "@/components/empleo/tablon-steps"
import { TablonBoard } from "@/components/empleo/tablon-board"
import { TablonCvCta } from "@/components/empleo/tablon-cv-cta"
import { hero, steps, cvCta } from "./bolsa-content"

export const metadata: Metadata = {
  title: "Bolsa de Empleo | Oportunidades Profesionales AEC | IDESIE",
  description:
    "Bolsa de empleo especializada en el sector AEC (Arquitectura, Ingeniería y Construcción). Ofertas de trabajo para BIM Managers, ingenieros, arquitectos y especialistas en Building Information Modeling. Conecta con las mejores empresas del sector.",
  alternates: { canonical: "/bolsa-de-empleo-page" },
}

export default async function BolsaDeEmpleoPage() {
  const ofertas = await getPublicOfertas()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <TablonHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} />
        <TablonSteps steps={steps} />

        <section id="ofertas" className="w-full bg-gray-950 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="tablon-eyebrow text-brand">Ofertas activas</p>
              <h2 className="tablon-title mt-3 text-white">El tablón de anuncios</h2>
            </div>

            {ofertas.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/20 p-12 text-center text-white/60">
                No hay ofertas publicadas ahora mismo — vuelve pronto.
              </div>
            ) : (
              <TablonBoard ofertas={ofertas} />
            )}
          </div>
        </section>

        <TablonCvCta title={cvCta.title} text={cvCta.text} ctaLabel={cvCta.ctaLabel} />
      </main>
      <FooterSection />
    </div>
  )
}
