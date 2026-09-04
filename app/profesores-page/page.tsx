import Header from "../../components/header"
import FooterSection from "../../components/footer-section"
import type { Metadata } from "next"
import { IndiceHero } from "@/components/profesores/indice-hero"
import { IndiceList } from "@/components/profesores/indice-list"
import { IndiceClosing } from "@/components/profesores/indice-closing"
import { hero, professors, closing } from "./profesores-content"

export const metadata: Metadata = {
  title: "Profesores | Claustro de Expertos | IDESIE Business & Tech School",
  description:
    "Conoce al claustro de IDESIE: dirección y profesionales en activo de empresas como Hill International, ISG, L35 y Sir Robert McAlpine que forman en BIM, Digitalización e Innovación.",
  keywords: ["profesores BIM", "claustro expertos", "docentes AEC", "formación BIM", "educación construcción digital"],
  alternates: { canonical: "/profesores-page" },
  openGraph: {
    title: "Profesores | Claustro de Expertos | IDESIE Business & Tech School",
    description:
      "Conoce al claustro de IDESIE: dirección y profesionales en activo de empresas líderes del sector AEC.",
    type: "website",
    locale: "es_ES",
    url: "/profesores-page",
    images: [{ url: "/images/claustro-hero.jpg", width: 1200, height: 630, alt: "Claustro de IDESIE" }],
  },
}

export default function ProfesoresPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow" role="main">
        <IndiceHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} ctaLabel={hero.ctaLabel} ctaHref={hero.ctaHref} />

        <IndiceList professors={professors} />

        <IndiceClosing title={closing.title} text={closing.text} ctaLabel={closing.ctaLabel} ctaHref={closing.ctaHref} />
      </main>
      <FooterSection />
    </div>
  )
}
