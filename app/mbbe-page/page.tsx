import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import AdmisionSection from "@/components/admision-section"
import CourseSchema from "@/components/course-schema"
import FAQSchema from "@/components/faq-schema"

import { MotionRoot } from "@/components/programa/motion-root"
import { JourneyHero } from "@/components/programa/journey-hero"
import { StatMonolith } from "@/components/programa/stat-monolith"
import { ModuleJourney } from "@/components/programa/module-journey"
import { SplitDay } from "@/components/programa/split-day"
import { ProofPanel } from "@/components/programa/proof-panel"
import { Outcomes } from "@/components/programa/outcomes"
import { ExperienceBand } from "@/components/programa/experience-band"
import { FaqList } from "@/components/programa/faq-list"
import { ClosingCta } from "@/components/programa/closing-cta"

import { modulos, fasesInsercion, salidas, requisitos, faqs } from "./mbbe-content"

/**
 * Máster BIM & Building Engineering (MBBE) — página de programa.
 *
 * Misma estructura de siete movimientos y mismos componentes que /mbim-page.
 * Lo único que cambia son los datos, que son los reales del MBBE:
 *  · 5 módulos en vez de 9, en fases Técnica / Gestión / Cierre.
 *  · 3 salidas profesionales con horquillas más altas (la especialización MEP
 *    está mejor pagada que el BIM generalista).
 *  · El pin del carril se activa solo si hay desbordamiento real: con 5 módulos
 *    en pantalla ancha el recorrido cabe entero y anclar no tendría sentido.
 */
export const metadata: Metadata = {
  title: "Máster BIM & Building Engineering (MBBE) en Madrid",
  description:
    "Máster de 16 meses en Madrid especializado en instalaciones MEP con metodología BIM: trabajas por la mañana con prácticas remuneradas y te formas por la tarde. Título propio IDESIE.",
  alternates: { canonical: "/mbbe-page" },
  openGraph: {
    title: "Máster BIM & Building Engineering (MBBE) | IDESIE",
    description:
      "Especialízate en instalaciones MEP con BIM. 16 meses, prácticas remuneradas garantizadas y título propio IDESIE.",
    url: "/mbbe-page",
    type: "website",
    locale: "es_ES",
    siteName: "IDESIE Business & Technology School",
    images: [
      {
        url: "/images/mbbe-hero-new.jpg",
        width: 1200,
        height: 630,
        alt: "Máster BIM & Building Engineering (MBBE) - IDESIE",
      },
    ],
  },
}

export default function MBBEPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <CourseSchema
        name="Máster BIM & Building Engineering (MBBE)"
        description="Máster de 16 meses en Madrid especializado en instalaciones MEP con metodología BIM: trabajas por la mañana con prácticas remuneradas y te formas por la tarde. Título propio IDESIE."
        provider="IDESIE Business & Technology School"
        duration="P16M"
        courseMode="onsite"
        price="15000"
        url="https://idesie.com/mbbe-page"
      />
      <FAQSchema faqs={faqs} />
      <MotionRoot />
      <Header />

      <main className="flex-grow" role="main">
        {/* ── Movimiento 1 · Apertura ─────────────────────────────────────── */}
        <JourneyHero
          eyebrow="Máster BIM & Building Engineering · Madrid · 16 meses"
          titleTop="Un edificio son sus instalaciones."
          titleBottom="Aprende a diseñarlas."
          intro="Especialízate en MEP con metodología BIM: hidráulica, eléctrica, térmica, PCI y renovables. Trabajas por la mañana, te formas por la tarde."
          image="/images/mbbe-hero-new.jpg"
          imageAlt="Instalaciones MEP de un edificio modeladas en BIM por alumnos de IDESIE en Madrid"
          ctaHref="#contact"
          ctaLabel="Solicitar información"
        />

        {/* ── Movimiento 2 · La cifra ─────────────────────────────────────── */}
        <StatMonolith
          value="16"
          unit="meses de recorrido"
          claim="Aprendes a calcular la instalación por la tarde y la coordinas en un proyecto real a la mañana siguiente."
          facts={[
            {
              value: "10 + 6",
              label: "Diez meses de formación con prácticas a media jornada, más seis de prácticas a jornada completa.",
            },
            {
              value: "11.000 €",
              label: "Ingresos aproximados durante el programa: 500 € al mes los primeros 10 meses y 1.200 € los 6 siguientes.",
            },
            {
              value: "1",
              // 2026-09-05 — corregido de "2" (título propio + Cualificam):
              // la certificación Cualificam es exclusiva del MBIM, el MBBE
              // solo otorga el título propio. Ver CLAUDE.md §5.
              label: "Certificación al terminar: título propio IDESIE.",
            },
          ]}
        />

        {/* ── Movimiento 3 · El recorrido ★ ───────────────────────────────── */}
        <ModuleJourney
          eyebrow="El recorrido"
          title="Cinco módulos: de la instalación al proyecto que defiendes ante un tribunal."
          intro="Primero la técnica, después la gestión. Cada módulo suma una capa sobre el mismo edificio."
          modulos={modulos}
        />

        {/* ── Movimiento 4 · El día partido ★ ─────────────────────────────── */}
        <SplitDay
          eyebrow="Learning by Working"
          title="Un día partido en dos. Esa es toda la metodología."
          morning={{
            time: "Por la mañana",
            title: "Trabajas",
            text: "Prácticas remuneradas en ingenierías especializadas en MEP, consultoras de instalaciones y departamentos técnicos de constructoras. Desde el primer mes, con contrato.",
            image: "/images/proyecto_modelado_ingenieria.jpg",
            imageAlt: "Técnico trabajando en el modelado de instalaciones de un proyecto de ingeniería",
          }}
          afternoon={{
            time: "Por la tarde",
            title: "Estudias",
            text: "Clases presenciales en Madrid con profesionales en activo. Cálculo real de instalaciones y modelado en Revit MEP, no solo manejo de software.",
            image: "/images/alumnos_clase.jpg",
            imageAlt: "Alumnos del Máster BIM & Building Engineering de IDESIE en clase presencial",
          }}
          fases={fasesInsercion}
        />

        {/* ── Movimiento 5 · La prueba ────────────────────────────────────── */}
        {/* 2026-09-05 — la certificación Cualificam es exclusiva del MBIM
            (ver CLAUDE.md §5): se retira del MBBE (logo, sellos ENQA/EQAR,
            y la mención en "Diploma normalizado"), se conserva el título
            propio IDESIE y la alineación real con ISO 19650. */}
        <ProofPanel
          eyebrow="Certificación"
          title="Título propio IDESIE, alineado con ISO 19650."
          lead="El MBBE otorga el Título propio de IDESIE, alineado con la norma ISO 19650 que rige la gestión de la información en proyectos BIM. La certificación Cualificam de la Fundación para el Conocimiento Madri+d es exclusiva del Máster BIM Full Time (MBIM) entre los 4 programas de IDESIE."
          points={[
            {
              label: "Diploma normalizado",
              text: "Título propio de IDESIE, con la misma trazabilidad documental que el resto de programas.",
            },
            {
              label: "Reconocimiento oficial",
              text: "Posibilidad de homologación por organismos nacionales e internacionales.",
            },
            {
              label: "Garantía de calidad",
              text: "Auditoría rigurosa del programa formativo, del profesorado y de los recursos.",
            },
          ]}
          certificacion={{
            entidad: "IDESIE Business & Tech School",
            membresia: "Título propio, alineado con la norma ISO 19650 que rige la gestión de la información en proyectos BIM.",
            norma: "ISO 19650",
            normaLabel: "Norma de referencia",
          }}
        />

        {/* ── Movimiento 6 · La salida ★ ──────────────────────────────────── */}
        <Outcomes
          eyebrow="La salida"
          title="Una de las especializaciones mejor pagadas del sector."
          stats={[
            {
              value: "100%",
              label: "de empleabilidad: todos nuestros alumni consiguen empleo al terminar el programa.",
            },
            {
              value: "100%",
              label: "de las prácticas están garantizadas: IDESIE asigna la empresa según tu perfil e intereses.",
            },
          ]}
          salidas={salidas}
          footnote="Horquillas de salario bruto anual. La combinación de conocimiento técnico profundo en instalaciones y competencias BIM es escasa en el mercado, y eso se refleja en la retribución."
        />

        {/* ── Movimiento 7 · Entrar ───────────────────────────────────────── */}

        {/* 7a · Vivirlo antes de decidir */}
        <ExperienceBand programa="MBBE" />

        {/* 7b · Admisión.
            PENDIENTE (bloqueado por falta de datos reales — la migración a
            Supabase ya terminó, esto ya no depende de ninguna base de datos anterior): el slug de producto no está
            verificado, porque la tabla `productos` de Supabase sigue vacía. A
            diferencia del MBIM, aquí compraLink y el enlace a tienda sí
            coinciden entre sí. NO tocar hasta insertar los productos reales.
            Ver CLAUDE.md > Estado de conexiones. */}
        <AdmisionSection
          requisitos={requisitos}
          compraLink="/producto/master-bim-building-engineering"
          programa="MBBE"
        />

        <div className="mx-auto max-w-6xl px-6 pb-4 sm:px-8">
          <Link
            href="/producto/master-bim-building-engineering"
            className="link-draw inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-brand"
          >
            Ver precios y matrícula en la tienda online
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 7c · Preguntas */}
        <FaqList eyebrow="Preguntas" title="Lo que suelen preguntarnos." faqs={faqs} />

        {/* 7d · Cierre único */}
        <ClosingCta
          title="¿Listo para especializarte en instalaciones?"
          text="Cuéntanos tu perfil y te decimos con franqueza si el MBBE encaja contigo."
          image="/images/estudiantes_proyecto_grupal.jpg"
          imageAlt="Estudiantes de IDESIE trabajando juntos en un proyecto de instalaciones MEP"
          primaryHref="/contact-page?motivo=asesoria&programa=MBBE"
          primaryLabel="Contacta con nosotros"
          catalogId="mbim-building-engineering"
          catalogName="Máster BIM & Building Engineering (MBBE)"
          catalogFile="catalogo_mbbe_2025.pdf"
        />
      </main>

      <FooterSection />
    </div>
  )
}
