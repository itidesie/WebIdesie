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
import { ExperienceBand } from "@/components/programa/experience-band"
import { StatMonolith } from "@/components/programa/stat-monolith"
import { ModuleJourney } from "@/components/programa/module-journey"
import { SplitDay } from "@/components/programa/split-day"
import { ProofPanel } from "@/components/programa/proof-panel"
import { Outcomes } from "@/components/programa/outcomes"
import { FaqList } from "@/components/programa/faq-list"
import { ClosingCta } from "@/components/programa/closing-cta"

import { modulos, fasesInsercion, salidas, requisitos, faqs } from "./mbim-content"

/**
 * Máster BIM (MBIM) — página de programa.
 *
 * Estructurada como un recorrido de siete movimientos en vez de como trece
 * secciones apiladas. Los componentes viven en components/programa/ para poder
 * reutilizarlos en MBBE y EMBIM, que hoy repiten la misma estructura antigua.
 *
 * El dinamismo se concentra en tres puntos (recorrido de módulos, día partido y
 * salidas). El resto de la página está deliberadamente quieta: si todo se mueve,
 * nada destaca.
 */

/* Al dejar de ser Client Component la página puede exportar metadata, cosa que
   antes era imposible. Hasta ahora el programa insignia heredaba la del layout. */
export const metadata: Metadata = {
  title: "Máster BIM (MBIM) presencial en Madrid",
  description:
    "Máster BIM de 16 meses en Madrid: trabajas por la mañana con prácticas remuneradas garantizadas y te formas por la tarde. Certificado por Cualificam y alineado con ISO 19650.",
  alternates: { canonical: "/mbim-page" },
  openGraph: {
    title: "Máster BIM (MBIM) presencial en Madrid | IDESIE",
    description:
      "16 meses, prácticas remuneradas desde el primer mes y certificación Cualificam. Aprende a dirigir proyectos BIM.",
    url: "/mbim-page",
    type: "website",
    locale: "es_ES",
    siteName: "IDESIE Business & Technology School",
    images: [
      {
        url: "/images/mbim-hero-new.jpg",
        width: 1200,
        height: 630,
        alt: "Máster BIM (MBIM) presencial en Madrid - IDESIE",
      },
    ],
  },
}

export default function MBIMPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <CourseSchema
        name="Máster BIM (MBIM) presencial en Madrid"
        description="Máster BIM de 16 meses en Madrid: trabajas por la mañana con prácticas remuneradas garantizadas y te formas por la tarde. Certificado por Cualificam y alineado con ISO 19650."
        provider="IDESIE Business & Technology School"
        duration="P16M"
        courseMode="onsite"
        price="15000"
        url="https://idesie.com/mbim-page"
      />
      <FAQSchema faqs={faqs} />
      {/* Lenis sincronizado con ScrollTrigger, barra de progreso y cursor.
          Todo se carga tras la hidratación y nada si hay movimiento reducido. */}
      <MotionRoot />
      <Header />

      <main className="flex-grow" role="main">
        {/* ── Movimiento 1 · Apertura ─────────────────────────────────────── */}
        <JourneyHero
          eyebrow="Máster BIM · Presencial en Madrid · 16 meses"
          titleTop="El sector ya construye en digital."
          titleBottom="Aprende a dirigirlo."
          intro="Trabajas por la mañana, te formas por la tarde y sales siendo BIM Manager. Con prácticas remuneradas garantizadas desde el primer mes."
          image="/images/mbim-hero-new.jpg"
          imageAlt="Profesionales del sector AEC coordinando un modelo BIM en el campus de IDESIE en Madrid"
          ctaHref="#contact"
          ctaLabel="Solicitar información"
        />

        {/* ── Movimiento 2 · La cifra ─────────────────────────────────────── */}
        <StatMonolith
          value="16"
          unit="meses de recorrido"
          claim="No es un máster con prácticas al final. Es un trabajo y una formación que empiezan el mismo día."
          facts={[
            {
              value: "10 + 6",
              label: "Diez meses de formación con prácticas a media jornada, más seis de prácticas a jornada completa.",
            },
            {
              value: "11.000 €",
              label: "Ingresos aproximados mientras estudias, abonados mensualmente mediante nómina.",
            },
            {
              value: "2",
              label: "Certificaciones al terminar: título propio IDESIE y certificación Cualificam.",
            },
          ]}
        />

        {/* ── Movimiento 3 · El recorrido ★ ───────────────────────────────── */}
        <ModuleJourney
          eyebrow="El recorrido"
          title="Nueve módulos, del primer modelo al proyecto que defiendes ante un tribunal."
          intro="Recórrelos de izquierda a derecha. Cada uno añade una capa más de responsabilidad sobre el proyecto."
          modulos={modulos}
        />

        {/* ── Movimiento 4 · El día partido ★ ─────────────────────────────── */}
        <SplitDay
          eyebrow="Learning by Working"
          title="Un día partido en dos. Esa es toda la metodología."
          morning={{
            time: "Por la mañana",
            title: "Trabajas",
            text: "Prácticas remuneradas en una de las más de 200 empresas del sector con las que IDESIE tiene acuerdo. Desde el primer mes, no al final del programa.",
            image: "/images/team-analyzing-plans.jpg",
            imageAlt: "Equipo técnico revisando planos de un proyecto de edificación en una oficina",
          }}
          afternoon={{
            time: "Por la tarde",
            title: "Estudias",
            text: "Clases presenciales en Madrid, de lunes a viernes, con profesionales en activo del sector AEC. Lo que ves por la tarde lo aplicas a la mañana siguiente.",
            image: "/images/clase_bim_2.jpg",
            imageAlt: "Alumnos del Máster BIM de IDESIE durante una clase presencial en Madrid",
          }}
          fases={fasesInsercion}
        />

        {/* ── Movimiento 5 · La prueba ────────────────────────────────────── */}
        <ProofPanel
          eyebrow="Certificación"
          title="Certificado por Cualificam y alineado con ISO 19650."
          lead="El MBIM cuenta con la certificación Cualificam de la Fundación para el Conocimiento Madri+d, que evalúa y certifica programas de Máster Profesional bajo estándares del Espacio Europeo de Educación Superior."
          points={[
            {
              label: "Diploma normalizado",
              text: "Certificado con trazabilidad digital, incluido en el Registro de Programas Certificados Cualificam.",
            },
            {
              label: "Estándar internacional",
              text: "Programa alineado con ISO 19650, la norma que rige la gestión de la información en proyectos BIM.",
            },
            {
              label: "Red de más de 200 empresas",
              text: "Estudios de arquitectura, ingenierías, constructoras y empresas de facility management, españolas e internacionales.",
            },
          ]}
          certificacion={{
            logo: "/images/logo_cualificam.png",
            logoAlt: "Certificación Cualificam — Fundación para el Conocimiento Madri+d",
            entidad: "Fundación para el Conocimiento Madri+d",
            membresia:
              "Miembro de ENQA y del Registro Europeo de Agencias de Aseguramiento de la Calidad (EQAR).",
            sellos: ["EEES Compliance", "ENQA Member", "EQAR Registered"],
            norma: "ISO 19650",
            normaLabel: "Norma de referencia",
            nota: "La certificación Cualificam audita el diseño del programa, los recursos académicos, el profesorado y los resultados bajo estándares europeos de calidad. Es la única de los 4 másteres de IDESIE que la posee.",
          }}
        />

        {/* ── Movimiento 6 · La salida ★ ──────────────────────────────────── */}
        <Outcomes
          eyebrow="La salida"
          title="A dónde llegas cuando terminas."
          stats={[
            {
              value: "95%",
              label: "de los alumnos consigue empleo en los seis meses posteriores, muchos en la empresa donde hicieron prácticas.",
            },
            {
              value: "100%",
              label: "de las prácticas están garantizadas: IDESIE asigna la empresa según tu perfil y tu rendimiento.",
            },
          ]}
          salidas={salidas}
          footnote="Horquillas de salario bruto anual correspondientes a los perfiles profesionales a los que da acceso el programa."
        />

        {/* ── Movimiento 7 · Entrar ───────────────────────────────────────── */}

        {/* 7a · Vivirlo antes de decidir. Conserva los dos CTA que antes
            apuntaban a rutas inexistentes y ahora van a contacto con motivo. */}
        <ExperienceBand programa="MBIM" />

        {/* 7b · Admisión. Componente compartido con MBBE y EMBIM.
            PENDIENTE (bloqueado por falta de datos reales — la migración a
            Supabase ya terminó, esto ya no depende de ninguna base de datos anterior): el slug de compraLink y el de la
            tienda no coinciden y ninguno está verificado, porque la tabla
            `productos` de Supabase sigue vacía. NO tocar hasta insertar los
            productos reales. Ver CLAUDE.md > Estado de conexiones. */}
        <AdmisionSection requisitos={requisitos} compraLink="/producto/master-bim-full-time" programa="MBIM" />

        {/* Acceso a la ficha de producto. Antes era una sección entera con fondo
            azul y su propio titular; se reduce a un enlace porque duplicaba el
            CTA de compra que ya vive dentro de AdmisionSection.
            2026-09-05: corregido el slug — apuntaba a `/producto/master-bim-manager`,
            que nunca existió (404 real, confirmado en la auditoría pre-despliegue).
            El slug real y verificado es `master-bim-full-time`, el mismo que ya
            usa `compraLink` arriba. Ver CLAUDE.md §2/§7. */}
        <div className="mx-auto max-w-6xl px-6 pb-4 sm:px-8">
          <Link
            href="/producto/master-bim-full-time"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-brand"
          >
            Ver precios y matrícula en la tienda online
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 7c · Preguntas */}
        <FaqList eyebrow="Preguntas" title="Lo que suelen preguntarnos." faqs={faqs} />

        {/* 7d · Cierre único */}
        <ClosingCta
          title="¿Listo para dirigir proyectos BIM?"
          text="Cuéntanos tu perfil y te decimos con franqueza si el MBIM encaja contigo."
          image="/images/estudiantes_proyecto_grupal.jpg"
          imageAlt="Estudiantes de IDESIE trabajando juntos en un proyecto BIM"
          primaryHref="/contact-page?motivo=asesoria&programa=MBIM"
          primaryLabel="Contacta con nosotros"
          catalogId="mbim-fulltime"
          catalogName="Máster BIM (MBIM)"
          catalogFile="catalogoMBIM.pdf"
        />
      </main>

      <FooterSection />
    </div>
  )
}
