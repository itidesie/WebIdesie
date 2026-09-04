import type { Metadata } from "next"
import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/home/reveal"
import { StatCounter } from "@/components/home/stat-counter"
import { ProjectsCarousel } from "@/components/bim-consulting/projects-carousel"
import { Lightbulb, Settings, BarChart, ShieldCheck, TrendingUp, Handshake, CheckCircle, Award, Users, Zap, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Consultoría BIM | Servicios BIM para Empresas AEC",
  description:
    "Servicios de consultoría BIM para arquitectura, ingeniería y construcción: planificación y estrategia (BEP, ISO 19650), gestión del CDE, modelado y coordinación, BIM 4D/5D en obra y facility management. +100 proyectos, +15 años de experiencia.",
  alternates: { canonical: "/bim-consulting-page" },
  openGraph: {
    title: "Consultoría BIM | Servicios BIM para Empresas AEC",
    description:
      "Servicios de consultoría BIM para arquitectura, ingeniería y construcción: planificación, gestión de la información, modelado, coordinación en obra y facility management.",
    url: "/bim-consulting-page",
    type: "website",
    locale: "es_ES",
    siteName: "IDESIE Business & Technology School",
    images: [
      {
        url: "/images/team-analyzing-plans.jpg",
        width: 1200,
        height: 630,
        alt: "Equipo profesional de consultoría BIM analizando planos",
      },
    ],
  },
}

const services = [
  {
    icon: Lightbulb,
    title: "Planificación y Estrategia BIM",
    description:
      "Desarrollo y seguimiento del BEP, configuración de plantillas y protocolos basados en ISO 19650. Coordinación del flujo de trabajo entre disciplinas.",
  },
  {
    icon: Settings,
    title: "Gestión de la Información",
    description:
      "Configuración y administración del CDE, gestión de cambios y versiones, reportes de avance y coordinación de entregables.",
  },
  {
    icon: BarChart,
    title: "Diseño y Modelado",
    description:
      "Supervisión del desarrollo de modelos arquitectónicos, estructurales y MEP. Control de calidad y coordinación entre disciplinas.",
  },
  {
    icon: ShieldCheck,
    title: "Coordinación en Obra",
    description:
      "Integración de modelos BIM 4D/5D para control de avances y presupuesto. Verificación mediante captura de realidad digital.",
  },
  {
    icon: TrendingUp,
    title: "Innovación y Tecnología",
    description:
      "Automatización con Dynamo y Python, análisis con Business Intelligence, y exploración de tecnologías emergentes (AR/VR).",
  },
  {
    icon: Handshake,
    title: "Operación y Mantenimiento",
    description:
      "Preparación de modelos as-built para Facility Management, documentación de equipos y planificación del mantenimiento del activo.",
  },
]

const whyChooseUs = [
  {
    title: "Metodología Especializada",
    description: "Enfoque especializado en metodología BIM aplicada a todas las fases del proyecto.",
    icon: Award,
  },
  {
    title: "Certificación Garantizada",
    description: "Colaboración con entidades de certificación para garantizar el cumplimiento de ISO 19650.",
    icon: ShieldCheck,
  },
  {
    title: "Tecnología Avanzada",
    description: "Integración de tecnologías avanzadas: BIM 3D/4D/5D, CDE y captura de realidad digital.",
    icon: Zap,
  },
  {
    title: "Formación Continua",
    description: "Equipo en constante formación y actualización con las últimas tendencias del sector.",
    icon: Users,
  },
]

const stats = [
  { value: "100+", label: "Proyectos completados" },
  { value: "15+", label: "Años de experiencia" },
  { value: "50+", label: "Clientes satisfechos" },
  { value: "ISO", label: "Certificación 19650" },
]

/**
 * Dirección "El Expediente": página de servicio B2B, no de programa — cero
 * storytelling de recorrido, cero Roboto Mono + numeración de módulos, cero
 * scroll horizontal anclado. Prioriza prueba concreta (casos reales, cifras)
 * sobre narrativa. Detalle completo del diagnóstico y la dirección aprobada
 * en CLAUDE.md.
 *
 * Server Component: antes todo el archivo era "use client" solo por el
 * carrusel de proyectos, así que la página no podía exportar `metadata` y
 * heredaba título/canonical de la home (bug de SEO real, no solo de
 * arquitectura — confirmado con curl antes del rediseño). El carrusel vive
 * ahora aislado en components/bim-consulting/projects-carousel.tsx.
 */
export default function BIMConsultingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow" role="main">
        {/* Hero — corporativo y corto, no cinemático: texto a la izquierda
            sobre gray-950, foto como columna, no como fondo a sangre con
            velo. Prueba (cifras) visible ya en el hero, sin esperar a la
            sección 4. */}
        <section id="hero" className="relative w-full bg-gray-950 text-white pt-32 pb-16 md:pt-40 md:pb-20" aria-labelledby="hero-heading">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-4">
                  Servicios para empresas AEC
                </p>
                <h1 id="hero-heading" className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                  Consultoria <span className="bg-brand text-white px-3 py-1 rounded-lg">BIM</span>
                </h1>
                <p className="text-xl md:text-2xl font-semibold mb-4 text-white/90">
                  Transforma y Optimiza tus Proyectos AEC
                </p>
                <p className="text-base md:text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
                  En IDESIE, ofrecemos servicios de consultoria BIM especializados para impulsar la eficiencia, la
                  colaboracion y la rentabilidad en tus proyectos de arquitectura, ingenieria y construccion.
                </p>
                <Button asChild size="lg" className="bg-brand hover:bg-brand-strong text-white px-6 py-3 text-sm font-semibold mb-10">
                  <Link href="#contact">
                    Solicitar consultoria <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm text-white/60">
                  <span>
                    <strong className="text-white font-bold">100+</strong> proyectos
                  </span>
                  <span>
                    <strong className="text-white font-bold">15+</strong> años de experiencia
                  </span>
                  <span>
                    <strong className="text-white font-bold">50+</strong> clientes
                  </span>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src="/images/team-analyzing-plans.jpg"
                    alt="Equipo profesional colaborando en planes de construcción BIM"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Servicios — lista de capacidades con borde izquierdo (patrón ya
            existente en el sitio, admision-section.tsx/FAQ), no una rejilla
            de tarjetas con icono grande. */}
        <section id="services" className="w-full py-16 md:py-24 bg-white" aria-labelledby="services-heading">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand mb-3">Qué hacemos</p>
              <h2 id="services-heading" className="text-2xl md:text-3xl font-extrabold mb-12 text-gray-950">
                Nuestros Servicios de <span className="bg-brand text-white px-3 py-1 rounded-lg">Consultoría</span> BIM
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-2">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <Reveal key={service.title} delay={index * 60}>
                    <div className="flex gap-4 border-l-4 border-brand bg-gray-50 rounded-r-lg p-5 mb-4">
                      <Icon className="w-6 h-6 text-brand flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <h3 className="text-base font-bold text-gray-950 mb-1">{service.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Proyectos Destacados — sección 3, mantenida en contenido y
            estructura (carrusel manual de los 4 casos reales), solo
            reskinada al lenguaje "El Expediente". Ver
            components/bim-consulting/projects-carousel.tsx. */}
        <section id="featured-projects" className="w-full py-16 md:py-24 bg-gray-50" aria-labelledby="projects-heading">
          <div className="container mx-auto px-4 md:px-6">
            <Reveal>
              <div className="text-center mb-12">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand mb-3">Casos reales</p>
                <h2 id="projects-heading" className="text-2xl md:text-3xl font-extrabold text-gray-950 mb-4">
                  Proyectos <span className="bg-brand text-white px-3 py-1 rounded-lg">Destacados</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Descubre algunos de nuestros proyectos más relevantes donde hemos aplicado metodología BIM para lograr
                  resultados excepcionales en diferentes sectores del AEC. Explora las galerías completas de cada
                  proyecto.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <ProjectsCarousel />
            </Reveal>
          </div>
        </section>

        {/* Por qué elegirnos + cifras — antes 3 tratamientos distintos
            apilados (tarjetas + banner degradado con blobs + píldora
            flotante). Ahora: lista de razones ligera arriba, franja
            gray-950 única abajo que funde cifras + el mensaje de
            compromiso (mismo texto, sin fragmentar). */}
        <section id="why-choose-us" className="w-full py-16 md:py-24 bg-white" aria-labelledby="why-choose-heading">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand mb-3">Por qué IDESIE</p>
              <h2 id="why-choose-heading" className="text-2xl md:text-3xl font-extrabold mb-4 text-gray-950">
                ¿Por qué elegir <span className="bg-brand text-white px-3 py-1 rounded-lg">IDESIE</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mb-12">
                Somos tu socio estratégico en la transformación digital mediante metodología BIM.
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 gap-x-10 mb-20">
              {whyChooseUs.map((item, index) => {
                const Icon = item.icon
                return (
                  <Reveal key={item.title} delay={index * 60}>
                    <div className="flex gap-4 border-t border-gray-200 py-6">
                      <Icon className="w-5 h-5 text-brand flex-shrink-0 mt-1" aria-hidden="true" />
                      <div>
                        <h3 className="text-base font-bold text-gray-950 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>

            <Reveal>
              <div className="rounded-2xl bg-gray-950 text-white px-8 py-12 md:px-14 md:py-14">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-8 text-center">
                  Resultados que respaldan nuestra experiencia
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4">
                  {stats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className={`text-center px-4 py-2 ${index > 0 ? "md:border-l md:border-white/10" : ""}`}
                    >
                      <StatCounter value={stat.value} className="text-4xl md:text-5xl font-black mb-2" />
                      <p className="text-xs md:text-sm text-white/60">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-center gap-3 text-center">
                  <CheckCircle className="w-5 h-5 text-brand flex-shrink-0" />
                  <p className="text-white/80 text-sm md:text-base">
                    Compromiso con la transparencia y la generación de valor real para nuestros clientes
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA final — gray-950 en vez de azul solido, el azul queda como
            acento del boton. */}
        <section id="contact" className="w-full py-16 md:py-24 bg-gray-950 text-white text-center" aria-labelledby="cta-heading">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <Reveal>
              <h2 id="cta-heading" className="text-3xl font-extrabold mb-6">
                ¿Listo para la transformación digital con BIM?
              </h2>
              <p className="text-lg md:text-xl text-white/70 mb-8">
                Contacta con nuestro equipo de expertos BIM y descubre cómo podemos ayudarte a alcanzar tus objetivos.
              </p>
              <Button asChild size="lg" className="bg-brand hover:bg-brand-strong text-white px-6 py-3 text-sm font-semibold">
                <Link href="/contact-page">
                  Solicitar consultoria <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
