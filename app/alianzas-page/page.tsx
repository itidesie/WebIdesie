import Header from "../../components/header"
import FooterSection from "../../components/footer-section"
import type { Metadata } from "next"
import { ConvenioHero } from "@/components/alianzas/convenio-hero"
import { ConvenioBenefits } from "@/components/alianzas/convenio-benefits"
import { ConvenioCard } from "@/components/alianzas/convenio-card"
import { ConvenioClosing } from "@/components/alianzas/convenio-closing"
import { hero, benefits, alliances, closing } from "./alianzas-content"

export const metadata: Metadata = {
  title: "Alianzas Académicas Internacionales | IDESIE",
  description:
    "IDESIE colabora con universidades de prestigio internacional como la Universidad Panamericana de México y la Universidad Francisco de Vitoria para programas de intercambio y formación especializada BIM.",
  keywords: [
    "alianzas académicas IDESIE",
    "Universidad Panamericana México",
    "Universidad Francisco de Vitoria",
    "intercambio internacional BIM",
    "estancias internacionales arquitectura",
    "colaboración universitaria",
  ],
  alternates: { canonical: "/alianzas-page" },
  openGraph: {
    title: "Alianzas Académicas Internacionales | IDESIE",
    description: "Colaboraciones reales con universidades internacionales para programas de intercambio y formación BIM.",
    type: "website",
    locale: "es_ES",
    url: "/alianzas-page",
    images: [{ url: "/images/clase_bim_2.jpg", width: 1200, height: 630, alt: "Alianzas académicas de IDESIE" }],
  },
}

export default function AlianzasAcademicasPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <ConvenioHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} />

        <ConvenioBenefits title="Beneficios de la Cooperación Académica" benefits={benefits} />

        <div id="universidades">
          {alliances.map((alliance, index) => (
            <ConvenioCard key={alliance.name} alliance={alliance} index={index} />
          ))}
        </div>

        <ConvenioClosing title={closing.title} text={closing.text} ctaLabel={closing.ctaLabel} ctaHref={closing.ctaHref} />
      </main>
      <FooterSection />
    </div>
  )
}
