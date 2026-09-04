import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import { CicloHero } from "@/components/metodologia/ciclo-hero"
import { CicloStats } from "@/components/metodologia/ciclo-stats"
import { CicloDiagram } from "@/components/metodologia/ciclo-diagram"
import { CicloBeneficios } from "@/components/metodologia/ciclo-beneficios"
import { CicloResultados } from "@/components/metodologia/ciclo-resultados"
import { CicloEmpresas } from "@/components/metodologia/ciclo-empresas"
import { CicloClosing } from "@/components/metodologia/ciclo-closing"
import { hero, stats, cycle, beneficios, resultadosEmpleo, partnerLogos, closing } from "./metodologia-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nuestra Metodología: Learning by Working | IDESIE Business & Tech School",
  description:
    "Descubre la metodología Learning by Working de IDESIE: combina formación teórica con experiencia laboral real desde el primer día. Prácticas remuneradas, proyectos reales y 100% empleabilidad.",
  keywords: [
    "Learning by Working",
    "metodología IDESIE",
    "prácticas remuneradas",
    "formación BIM",
    "experiencia laboral",
    "proyectos reales",
    "empleabilidad",
  ],
  alternates: { canonical: "/nuestra-metodologia-page" },
  openGraph: {
    title: "Nuestra Metodología: Learning by Working | IDESIE",
    description:
      "Learning by Working: formación teórica combinada con experiencia laboral real desde el primer día. Prácticas remuneradas, proyectos reales y 100% empleabilidad.",
    type: "website",
    locale: "es_ES",
    url: "/nuestra-metodologia-page",
    images: [{ url: "/images/alumnos_clase_2.jpg", width: 1200, height: 630, alt: "Alumnos de IDESIE en clase" }],
  },
}

export default function NuestraMetodologiaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <CicloHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          subtitle={hero.subtitle}
          intro={hero.intro}
          ctaLabel={hero.ctaLabel}
          ctaHref={hero.ctaHref}
        />

        <CicloStats stats={stats} />

        <CicloDiagram
          eyebrow="Learning by Working"
          title="Un ciclo, no una etapa"
          intro="No es estudiar para trabajar después: es trabajar mientras estudias, en un proceso que se repite con cada proyecto real hasta el final del programa."
          phases={cycle}
          loopLabel="El ciclo se repite con cada proyecto real"
        />

        <CicloBeneficios eyebrow="Resultado" title="Beneficios tangibles" beneficios={beneficios} />

        <CicloResultados
          eyebrow="Promoción 2024"
          title="Dónde trabajan nuestros alumnos"
          resultados={resultadosEmpleo}
        />

        <CicloEmpresas
          eyebrow="Empresas colaboradoras"
          title="El ciclo funciona porque ellas participan"
          intro="Trabajamos de la mano con más de 35 líderes de la industria para ofrecer proyectos reales, tutela profesional y oportunidades de empleo."
          logos={partnerLogos}
        />

        <CicloClosing
          title={closing.title}
          text={closing.text}
          primaryLabel={closing.primaryLabel}
          primaryHref={closing.primaryHref}
          secondaryLabel={closing.secondaryLabel}
          secondaryHref={closing.secondaryHref}
        />
      </main>
      <FooterSection />
    </>
  )
}
