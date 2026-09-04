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

import { modulos, ventajasFormato, salidas, requisitos, faqs } from "./embim-content"

/**
 * Executive Master BIM (EMBIM) — página de programa.
 *
 * Misma estructura de siete movimientos y mismos componentes que MBIM y MBBE,
 * pero es **el programa que más se aparta del patrón**:
 *
 *  · 12 meses (no 16) y 18.000 € (no 15.000 €).
 *  · 10 módulos, el que más.
 *  · Exige 5+ años de experiencia previa.
 *  · **El M4 va reencuadrado**: aquí no existe Learning by Working ni hay
 *    prácticas remuneradas. El alumno conserva su empleo sénior y el contraste
 *    real es "entre semana lideras / el fin de semana te formas". Las tres
 *    paradas de la línea de tiempo son las ventajas del formato ejecutivo, no
 *    fases de inserción laboral.
 *  · **El M6 no lleva cifra de empleabilidad**: no existe ninguna en el
 *    contenido original y no se inventa. Las cifras ancla son la duración y el
 *    tamaño del grupo; el peso lo llevan las horquillas salariales, que son las
 *    más altas de los tres programas.
 */
export const metadata: Metadata = {
  title: "Executive Master BIM (EMBIM) en Madrid",
  description:
    "Programa ejecutivo de 12 meses en Madrid para profesionales sénior del sector AEC con más de 5 años de experiencia. Formato de fin de semana compatible con tu carrera. Título propio IDESIE.",
  alternates: { canonical: "/embim-page" },
  openGraph: {
    title: "Executive Master BIM (EMBIM) | IDESIE",
    description:
      "12 meses, formato ejecutivo de fin de semana y grupo de 25 profesionales sénior. Lidera la transformación digital del sector AEC.",
    url: "/embim-page",
    type: "website",
    locale: "es_ES",
    siteName: "IDESIE Business & Technology School",
    images: [
      {
        url: "/images/embim_hero_image.jpg",
        width: 1200,
        height: 630,
        alt: "Executive Master BIM (EMBIM) - IDESIE",
      },
    ],
  },
}

export default function EMBIMPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <CourseSchema
        name="Executive Master BIM (EMBIM)"
        description="Programa ejecutivo de 12 meses en Madrid para profesionales sénior del sector AEC con más de 5 años de experiencia. Formato de fin de semana compatible con tu carrera. Título propio IDESIE."
        provider="IDESIE Business & Technology School"
        duration="P12M"
        courseMode="onsite"
        price="18000"
        url="https://idesie.com/embim-page"
      />
      <FAQSchema faqs={faqs} />
      <MotionRoot />
      <Header />

      <main className="flex-grow" role="main">
        {/* ── Movimiento 1 · Apertura ─────────────────────────────────────── */}
        <JourneyHero
          eyebrow="Executive Master BIM · Madrid · 12 meses"
          titleTop="Ya diriges proyectos."
          titleBottom="Ahora dirige el cambio."
          intro="Programa ejecutivo para profesionales sénior del sector AEC. Viernes tarde y sábados mañana, sin dejar tu puesto."
          image="/images/embim_hero_image.jpg"
          imageAlt="Profesionales sénior del sector AEC en una sesión ejecutiva del Executive Master BIM de IDESIE"
          ctaHref="#contact"
          ctaLabel="Solicitar información"
        />

        {/* ── Movimiento 2 · La cifra ─────────────────────────────────────── */}
        <StatMonolith
          value="12"
          unit="meses, sin dejar tu trabajo"
          claim="Un formato pensado para quien ya tiene una carrera que no puede pausar."
          facts={[
            {
              value: "5+",
              label: "Años de experiencia mínima exigidos. Es un programa entre profesionales del mismo nivel.",
            },
            {
              value: "25",
              label: "Alumnos como máximo por promoción. El grupo reducido es parte del valor del programa.",
            },
            {
              value: "V + S",
              label: "Viernes de 15:30 a 20:30 y sábados de 9:00 a 14:00, en el campus de Madrid.",
            },
          ]}
        />

        {/* ── Movimiento 3 · El recorrido ★ ───────────────────────────────── */}
        <ModuleJourney
          eyebrow="El recorrido"
          title="Diez módulos, de los estándares ISO 19650 a la dirección de la transformación digital."
          intro="Recórrelos de izquierda a derecha. El peso se desplaza de la técnica a la estrategia."
          modulos={modulos}
        />

        {/* ── Movimiento 4 · El formato ejecutivo ★ ───────────────────────────
            Reencuadre del "día partido": aquí el contraste no es mañana/tarde
            sino semana/fin de semana, porque no hay prácticas. Ver embim-content. */}
        <SplitDay
          eyebrow="Formato ejecutivo"
          title="Tu semana no se detiene. Tu formación tampoco."
          morning={{
            time: "Entre semana",
            title: "Lideras",
            text: "Mantienes tu posición y tus proyectos. Lo que ves el fin de semana lo aplicas el lunes: muchos alumnos lideran la implantación BIM de su empresa durante el propio máster.",
            image: "/images/proyecto_modelado_ingenieria.jpg",
            imageAlt: "Profesional sénior dirigiendo la coordinación de un proyecto BIM complejo",
          }}
          afternoon={{
            time: "El fin de semana",
            title: "Te formas",
            text: "Viernes de 15:30 a 20:30 y sábados de 9:00 a 14:00 en Madrid, con profesores en activo en grandes proyectos internacionales.",
            image: "/images/alumnos_clase_2.jpg",
            imageAlt: "Sesión del Executive Master BIM con profesionales sénior en el campus de IDESIE",
          }}
          fases={ventajasFormato}
        />

        {/* ── Movimiento 5 · La prueba ────────────────────────────────────── */}
        {/* 2026-09-05 — la certificación Cualificam es exclusiva del MBIM
            (ver CLAUDE.md §5): se retira del EMBIM (logo, sellos ENQA/EQAR,
            y la mención en "Diploma normalizado"), se conserva el título
            propio IDESIE y la integración real con ISO 19650. */}
        <ProofPanel
          eyebrow="Certificación"
          title="Título propio IDESIE, alineado con ISO 19650."
          lead="El Executive Master BIM otorga el Título propio de IDESIE, con integración completa de la norma ISO 19650 que rige la gestión de la información en proyectos BIM. La certificación Cualificam de la Fundación para el Conocimiento Madri+d es exclusiva del Máster BIM Full Time (MBIM) entre los 4 programas de IDESIE."
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
              text: "Auditoría rigurosa del programa formativo, del profesorado y de los recursos para profesionales executive.",
            },
          ]}
          certificacion={{
            entidad: "IDESIE Business & Tech School",
            membresia: "Título propio, con integración completa de la norma ISO 19650 que rige la gestión de la información en proyectos BIM.",
            norma: "ISO 19650",
            normaLabel: "Norma de referencia",
          }}
        />

        {/* ── Movimiento 6 · La salida ★ ──────────────────────────────────────
            Sin cifra de empleabilidad: no existe en el contenido original del
            EMBIM y no se copia la de otros programas. Ver CLAUDE.md. */}
        <Outcomes
          eyebrow="La salida"
          title="Las posiciones mejor retribuidas del sector."
          stats={[
            {
              value: "110.000 €",
              label: "techo de la horquilla para Director de Transformación Digital, la posición más alta a la que da acceso el programa.",
            },
            {
              value: "10",
              label: "módulos, incluido un Proyecto Fin de Máster de alta complejidad defendido ante tribunal de expertos.",
            },
          ]}
          salidas={salidas}
          footnote="Horquillas de salario bruto anual, salvo el perfil de Consultor BIM Senior, que ejerce por cuenta propia y cuya cifra corresponde a tarifa por día."
        />

        {/* ── Movimiento 7 · Entrar ───────────────────────────────────────── */}
        <ExperienceBand programa="EMBIM" />

        {/* PENDIENTE (bloqueado por falta de datos reales — la migración a
            Supabase ya terminó, esto ya no depende de ninguna base de datos anterior): el slug de producto no está
            verificado, porque la tabla `productos` de Supabase sigue vacía.
            Como en el MBBE, compraLink y el enlace a tienda sí coinciden entre
            sí. NO tocar hasta insertar los productos reales. Ver CLAUDE.md. */}
        <AdmisionSection requisitos={requisitos} compraLink="/producto/executive-master-bim" programa="EMBIM" />

        <div className="mx-auto max-w-6xl px-6 pb-4 sm:px-8">
          <Link
            href="/producto/executive-master-bim"
            className="link-draw inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-brand"
          >
            Ver precios y matrícula en la tienda online
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <FaqList eyebrow="Preguntas" title="Lo que suelen preguntarnos." faqs={faqs} />

        <ClosingCta
          title="¿Listo para liderar la transformación digital?"
          text="Cuéntanos tu trayectoria y te decimos con franqueza si el EMBIM encaja con el punto en el que estás."
          image="/images/teamwork-meeting.jpg"
          imageAlt="Equipo directivo del sector AEC en una reunión de coordinación de proyecto"
          primaryHref="/contact-page?motivo=asesoria&programa=EMBIM"
          primaryLabel="Contacta con nosotros"
          catalogId="executive-master-bim"
          catalogName="Executive Master BIM (EMBIM)"
        />
      </main>

      <FooterSection />
    </div>
  )
}
