import Header from "../../components/header"
import FooterSection from "../../components/footer-section"
import type { Metadata } from "next"
import SEOStructuredData from "../../components/seo-structured-data"
import { TrayectoriaHero } from "@/components/sobre-idesie/trayectoria-hero"
import { TrayectoriaTimeline } from "@/components/sobre-idesie/trayectoria-timeline"
import { TrayectoriaPrinciples } from "@/components/sobre-idesie/trayectoria-principles"
import { TrayectoriaReasons } from "@/components/sobre-idesie/trayectoria-reasons"
import { TrayectoriaClosing } from "@/components/sobre-idesie/trayectoria-closing"
import { hero, trayectoria, principles, reasons, closing } from "./sobre-idesie-content"

export const metadata: Metadata = {
  title: "Sobre IDESIE | Misión, Visión y Valores | IDESIE Business & Tech School",
  description:
    "Conoce IDESIE Business & Tech School: pioneros en formación BIM desde 2012. Nuestra misión, visión, valores y compromiso con la excelencia académica. Más de 500 profesionales formados, 100% empleabilidad y 10+ años liderando la educación en Building Information Modeling y tecnologías AEC.",
  keywords: [
    "sobre IDESIE",
    "historia IDESIE",
    "misión visión valores",
    "escuela BIM",
    "formación AEC",
    "líderes construcción",
    "innovación BIM",
    "educación tecnológica",
    "transformación digital construcción",
    "excelencia académica BIM",
  ],
  openGraph: {
    title: "Sobre IDESIE | Misión, Visión y Valores",
    description:
      "Conoce IDESIE Business & Tech School: nuestra misión, visión, valores y compromiso con la formación de líderes en BIM y tecnologías AEC.",
    type: "website",
    locale: "es_ES",
    url: "/sobre-idesie-page",
    images: [{ url: "/images/hero_image_sobre_idesie_colaboracion_proyecto_bim.jpg", width: 1200, height: 630, alt: "Campus de IDESIE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre IDESIE | Misión, Visión y Valores",
    description:
      "Conoce IDESIE Business & Tech School y nuestro compromiso con la formación de líderes en BIM y tecnologías AEC.",
  },
  alternates: {
    canonical: "/sobre-idesie-page",
  },
}

export default function SobreIdesiePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEOStructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "IDESIE Business & Tech School",
          description: "Escuela de negocios y tecnología especializada en formación BIM y tecnologías AEC",
          url: "https://idesie.com/sobre-idesie-page",
          foundingDate: "2012",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Madrid",
            addressCountry: "ES",
          },
        }}
      />

      <Header />

      <main role="main" aria-label="Contenido principal sobre IDESIE">
        <TrayectoriaHero eyebrow={hero.eyebrow} question={hero.question} intro={hero.intro} />

        <TrayectoriaTimeline eyebrow="Nuestra trayectoria" title="12 años formando al sector" milestones={trayectoria} />

        <TrayectoriaPrinciples eyebrow="Nuestra identidad" title="Misión, visión y valores" principles={principles} />

        <TrayectoriaReasons eyebrow="Por qué elegirnos" title="Por qué elegir IDESIE" reasons={reasons} />

        <TrayectoriaClosing title={closing.title} text={closing.text} ctaLabel={closing.ctaLabel} ctaHref={closing.ctaHref} />
      </main>
      <FooterSection />
    </div>
  )
}
