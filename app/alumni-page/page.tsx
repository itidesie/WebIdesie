import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import type { Metadata } from "next"
import { LegadoHero } from "@/components/alumni/legado-hero"
import { LegadoStats } from "@/components/alumni/legado-stats"
import { LegadoSpotlights } from "@/components/alumni/legado-spotlights"
import { LegadoClosing } from "@/components/alumni/legado-closing"
import { hero, stats, legacies, closing } from "./alumni-content"

export const metadata: Metadata = {
  title: "Alumnos | Talento que Transforma la Industria AEC | IDESIE",
  description:
    "Conoce las trayectorias de los alumnos de IDESIE tras el máster BIM: de estudiantes a BIM Manager, Coordinador BIM y Modelador BIM Senior en empresas líderes como Ferrovial, ACCIONA y TYPSA.",
  keywords: ["alumnos IDESIE", "egresados BIM", "casos de éxito BIM", "salidas profesionales BIM", "empleabilidad BIM"],
  alternates: { canonical: "/alumni-page" },
  openGraph: {
    title: "Alumnos | Talento que Transforma la Industria AEC | IDESIE",
    description: "Trayectorias reales de alumnos de IDESIE tras el máster BIM, en empresas líderes del sector AEC.",
    type: "website",
    locale: "es_ES",
    url: "/alumni-page",
    images: [{ url: "/images/alumni-hero-updated.jpg", width: 1200, height: 630, alt: "Alumnos de IDESIE" }],
  },
}

export default function AlumnosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main role="main" aria-label="Contenido principal de Alumnos IDESIE">
        <LegadoHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} ctaLabel={hero.ctaLabel} ctaHref={hero.ctaHref} />

        <LegadoStats stats={stats} />

        <LegadoSpotlights eyebrow="El legado" title="Su programa, su trayectoria" legacies={legacies} />

        <LegadoClosing
          title={closing.title}
          text={closing.text}
          primaryLabel={closing.primaryLabel}
          primaryHref={closing.primaryHref}
          secondaryLabel={closing.secondaryLabel}
          secondaryHref={closing.secondaryHref}
        />
      </main>

      <FooterSection />
    </div>
  )
}
