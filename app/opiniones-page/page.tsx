import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import type { Metadata } from "next"
import { VocesHero } from "@/components/opiniones/voces-hero"
import { VocesIntro } from "@/components/opiniones/voces-intro"
import { VocesTestimonials } from "@/components/opiniones/voces-testimonials"
import { VocesTrust } from "@/components/opiniones/voces-trust"
import { VocesAssociation } from "@/components/opiniones/voces-association"
import { VocesClosing } from "@/components/opiniones/voces-closing"
import { hero, talento, testimonials, companies, association, closing } from "./opiniones-content"

export const metadata: Metadata = {
  title: "Opiniones Máster BIM | IDESIE Business & Technology School",
  description:
    "Conoce las opiniones reales sobre los Máster BIM para arquitectos e ingenieros de IDESIE, tanto Máster Full-Time como Máster Executive.",
  alternates: { canonical: "/opiniones-page" },
  openGraph: {
    title: "Opiniones Máster BIM | IDESIE",
    description: "Opiniones reales de alumnos sobre los Máster BIM de IDESIE Business & Technology School.",
    type: "website",
    locale: "es_ES",
    url: "/opiniones-page",
    images: [{ url: "/images/alumnos_clase_2.jpg", width: 1200, height: 630, alt: "Estudiantes de IDESIE" }],
  },
}

export default function OpinionesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <VocesHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} />

        <VocesIntro title={talento.title} text={talento.text} />

        <VocesTestimonials title="Lo que dicen nuestros alumnos" testimonials={testimonials} />

        <VocesTrust title="Empresas que confían en nosotros" logos={companies} />

        <VocesAssociation title={association.title} text={association.text} stats={association.stats} />

        <VocesClosing title={closing.title} text={closing.text} ctaLabel={closing.ctaLabel} ctaHref={closing.ctaHref} />
      </main>

      <FooterSection />
    </div>
  )
}
