import Header from "../components/header"
import FooterSection from "../components/footer-section"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle,
  GraduationCap,
  Lightbulb,
  Shield,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import LatestBlogPosts from "@/components/latest-blog-posts"
import { MainContentWrapper } from "@/components/main-content-wrapper"
import { SectionBadge } from "@/components/home/section-badge"
import { Highlight } from "@/components/home/highlight"
import { FeatureChip } from "@/components/home/feature-chip"
import { ValueCard, type Value } from "@/components/home/value-card"
import { ProgramCard, type Program } from "@/components/home/program-card"
import { ProgramMiniCard, type MiniProgram } from "@/components/home/program-mini-card"
import { VideoFacade } from "@/components/home/video-facade"
import { Reveal } from "@/components/home/reveal"
import { StatCounter } from "@/components/home/stat-counter"
import { TiltCard } from "@/components/home/tilt-card"
import { HeroPrimaryCta } from "@/components/home/hero-primary-cta"

export const metadata: Metadata = {
  title: "Inicio - Formación BIM Líder desde 2012",
  description:
    "IDESIE, pioneros en formación BIM desde 2012 en Madrid. Máster BIM presencial y online, consultoría BIM especializada en Madrid y España, certificaciones oficiales. 500+ profesionales formados, 100% empleabilidad. Escuela líder en Building Information Modeling en Madrid.",
  keywords: [
    "formación BIM",
    "Máster BIM Madrid",
    "Building Information Modeling",
    "BIM certification Spain",
    "arquitectura digital",
    "ingeniería BIM",
    "Autodesk training center",
    "BIM Manager course",
    "escuela BIM Madrid",
    "formación BIM Madrid España",
    "curso BIM presencial Madrid",
    "consultoría BIM Madrid",
    "certificación BIM Madrid",
    "BIM Manager Madrid",
    "arquitectura digital Madrid",
    "ingeniería construcción Madrid",
  ],
  openGraph: {
    title: "IDESIE - Formación BIM Líder desde 2012 en Madrid",
    description:
      "Pioneros en formación BIM en Madrid. Máster BIM presencial y online, consultoría especializada. 500+ profesionales formados.",
    url: "/",
    images: [
      {
        url: "/images/hero-background.jpg",
        width: 1200,
        height: 630,
        alt: "IDESIE - Formación BIM y Building Information Modeling en Madrid",
      },
    ],
  },
}

const HERO_STATS = [
  { value: "1250+", label: "Profesionales formados" },
  { value: "100%", label: "Empleabilidad" },
  { value: "12+", label: "Años experiencia" },
]

const VALUES: Value[] = [
  { icon: Shield, title: "Ética e Integridad", description: "Transparencia y honestidad" },
  { icon: Target, title: "Práctica Real", description: "Proyectos desde día 1" },
  { icon: Zap, title: "Innovación", description: "Tecnología BIM + IA" },
  { icon: Briefcase, title: "Visión 360", description: "Técnico + Empresarial" },
  { icon: TrendingUp, title: "Desarrollo", description: "Carrera profesional" },
]

const ABOUT_HIGHLIGHTS = ["Proyectos reales desde día 1", "Acompañamiento personalizado", "100% empleabilidad"]

const FEATURED_PROGRAMS: Program[] = [
  {
    href: "/mbim-page",
    image: "/images/mbim_online_hero.jpg",
    imageAlt: "Máster BIM Presencial",
    tag: "MÁS POPULAR",
    tone: "brand",
    title: "Máster BIM (MBIM)",
    meta: "16 meses · Presencial · Remunerado",
    description:
      "Programa completo con prácticas remuneradas desde el primer día. Metodología Learning by Working con 100% de empleabilidad.",
    features: ["Ingresos desde día 1", "Certificación oficial", "100% empleabilidad"],
  },
  {
    href: "/mbbe-page",
    image: "/images/mbbe_hero.jpg",
    imageAlt: "Máster BIM Building Engineering",
    tag: "ESPECIALIZACIÓN",
    tone: "accent",
    title: "MBBE",
    meta: "16 meses · Presencial · BIM + MEP (Estructuras)",
    description:
      "Especialización avanzada en instalaciones MEP y cálculo estructural. Alta demanda en el mercado laboral.",
    features: ["Modelado MEP", "Cálculo estructural", "Coordinación 3D"],
  },
]

const OTHER_PROGRAMS: MiniProgram[] = [
  {
    href: "/mbim-online-page",
    icon: BookOpen,
    tag: "ONLINE",
    tone: "success",
    title: "MBIM Online",
    description: "Flexibilidad total. Mismo contenido, tu ritmo.",
    meta: "12 meses",
  },
  {
    href: "/embim-page",
    icon: Briefcase,
    tag: "EJECUTIVO",
    tone: "neutral",
    title: "Executive MBIM",
    description: "Para directivos y líderes empresariales.",
    meta: "12 meses · Híbrido",
  },
  {
    href: "/bim-consulting-page#formacion-incompany",
    icon: Building2,
    tag: "EMPRESAS",
    tone: "brand",
    title: "Formación In-Company",
    description: "Programas a medida para equipos corporativos.",
    meta: "Personalizado",
  },
  {
    href: "/short-courses-page",
    icon: Lightbulb,
    tag: "CURSOS",
    tone: "warning",
    title: "Cursos Cortos",
    description: "Formación especializada en herramientas BIM.",
    meta: "Programas intensivos",
  },
]

const CONSULTING_SERVICES = [
  "Implementación BIM",
  "Certificación ISO 19650",
  "Formación In-Company",
  "Auditoría de procesos",
]

const ACCREDITATIONS = [
  { src: "/images/logo_cualificam.png", alt: "Cualificam", caption: "Fundación Madri+d", width: 160, height: 80 },
  { src: "/images/Logo-AEEN.png", alt: "AEEN", caption: "Escuelas de Negocios", width: 125, height: 55 },
  { src: "/images/euphe-logo.webp", alt: "Euphe", caption: "Educación Superior UE", width: 145, height: 72 },
]

const FINAL_CTA_GUARANTEES = ["Sin compromiso", "Asesoramiento personalizado", "Respuesta en 24h"]

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <MainContentWrapper>
        {/* Hero: cancela el padding del wrapper para ocupar la pantalla completa */}
        <section
          id="hero"
          className="relative w-full h-[100svh] overflow-hidden mt-[calc(var(--header-height)*-1)]"
          aria-labelledby="hero-heading"
        >
          <Image
            src="/images/hero-idesie-classroom.jpg"
            alt="Aula IDESIE - Estudiantes trabajando en proyectos BIM"
            fill
            sizes="100vw"
            className="hero-parallax object-cover object-top"
            priority
            // Explícito: es el elemento LCP y Lighthouse detectaba que no le
            // llegaba la pista de prioridad solo con `priority`.
            fetchPriority="high"
          />
          <div className="hero-scrim absolute inset-0 bg-gradient-to-b from-gray-900/85 via-gray-900/75 to-gray-900/85" />

          <div className="absolute inset-0 z-10 flex items-center justify-center pt-20 md:pt-32 pb-8 md:pb-12">
            <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
              <h1
                id="hero-heading"
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 text-white leading-tight text-balance"
              >
                Formación <br className="hidden sm:block" />y consultoría <Highlight>BIM</Highlight>
              </h1>

              <p className="text-sm sm:text-base md:text-xl mb-6 sm:mb-8 text-white/85 leading-relaxed max-w-3xl mx-auto px-2">
                El entorno actual obliga a las organizaciones a vivir en continuo proceso de adaptación. Formamos
                profesionales capaces de inspirar confianza, contagiar entusiasmo y construir un futuro sostenible.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0 mb-8 sm:mb-10">
                <HeroPrimaryCta />

                <Button
                  asChild
                  magnetic
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10 px-6 py-3 text-sm font-semibold w-full sm:w-auto"
                >
                  <Link href="#programs">
                    Ver programas <BookOpen className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto">
                {HERO_STATS.map((stat, index) => (
                  <div key={stat.label} className={`text-center ${index === 1 ? "border-x border-white/20" : ""}`}>
                    <StatCounter
                      value={stat.value}
                      className="text-xl sm:text-2xl md:text-3xl font-black text-white"
                    />
                    <div className="text-white/70 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sobre IDESIE: quiénes somos, el vídeo y los valores que nos definen */}
        <section id="about-overview" className="w-full py-16 md:py-20 bg-white" aria-labelledby="about-heading">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              <Reveal className="lg:col-span-3">
                <SectionBadge icon={Star}>Sobre IDESIE</SectionBadge>

                <h2
                  id="about-heading"
                  className="text-3xl md:text-4xl font-extrabold mt-6 mb-6 text-gray-900 leading-[1.3]"
                >
                  Más que una escuela, una <Highlight>comunidad</Highlight>
                </h2>

                <p className="text-gray-700 mb-5 leading-relaxed text-lg">
                  IDESIE ha conseguido reunir a prestigiosos profesionales con el objetivo de formar a los alumnos desde
                  el rigor académico, con una perspectiva global y un enfoque eminentemente práctico. Deseamos formar
                  profesionales que sean valorados por su eficacia, capacidad para trabajar en equipo y por el respeto a
                  los valores éticos.
                </p>

                <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                  Nuestro método <strong>Learning by Working</strong> nace de una convicción profunda: el respeto hacia
                  cada alumno como individuo único. Nuestros alumnos reciben una formación innovadora basada en el
                  conocimiento real de las instalaciones que integran una edificación.
                </p>

                <div className="flex flex-wrap gap-3">
                  {ABOUT_HIGHLIGHTS.map((highlight) => (
                    <FeatureChip key={highlight}>{highlight}</FeatureChip>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={140} className="lg:col-span-2">
                <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="text-center py-4 bg-gradient-to-r from-brand to-brand-strong">
                    <div className="text-xl font-bold text-white mb-1">IDESIE</div>
                    <div className="text-sm text-blue-100">Visión general</div>
                  </div>
                  <div className="aspect-video">
                    <VideoFacade
                      videoId="1121825390"
                      hash="604fae7cad"
                      title="IDESIE - Visión General de formación BIM"
                      poster="/images/alumnos_clase.jpg"
                    />
                  </div>
                </div>
              </Reveal>
            </div>

            <div id="values" className="mt-16 pt-12 border-t border-gray-200">
              <Reveal>
                <h3
                  id="values-heading"
                  className="text-center text-sm font-bold uppercase tracking-wide text-gray-500 mb-8"
                >
                  Lo que nos hace únicos
                </h3>
              </Reveal>
              <ul
                aria-labelledby="values-heading"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 list-none"
              >
                {VALUES.map((value, index) => (
                  <Reveal as="li" key={value.title} delay={index * 70}>
                    <ValueCard {...value} />
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Programas formativos */}
        <section id="programs" className="w-full py-20 md:py-24 bg-gray-50" aria-labelledby="programs-heading">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
            <Reveal className="text-center mb-16">
              <SectionBadge icon={GraduationCap}>Programas Formativos</SectionBadge>

              <h2
                id="programs-heading"
                className="text-3xl md:text-4xl font-extrabold mt-4 mb-6 text-gray-900 leading-snug"
              >
                Encuentra tu programa <Highlight>BIM</Highlight>
              </h2>

              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Formación especializada que se adapta a tus necesidades y objetivos profesionales
              </p>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {FEATURED_PROGRAMS.map((program, index) => (
                <Reveal key={program.href} delay={index * 90}>
                  <TiltCard>
                    <ProgramCard {...program} />
                  </TiltCard>
                </Reveal>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {OTHER_PROGRAMS.map((program, index) => (
                <Reveal key={program.href} delay={index * 60}>
                  <ProgramMiniCard {...program} />
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-12 text-center">
              <Link
                href="/comparativa-masters-page"
                className="inline-flex items-center gap-2 text-brand font-semibold hover:underline"
              >
                ¿No sabes cuál elegir? Compara todos los programas <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Consultoría BIM para empresas */}
        <section className="relative w-full overflow-hidden" aria-labelledby="consulting-heading">
          <Image
            src="/images/hero-certificacion-iso.jpg"
            alt="Certificación ISO 19650"
            fill
            sizes="100vw"
            className="section-parallax object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40" />

          <div className="relative container mx-auto px-4 md:px-8 lg:px-12 max-w-6xl py-16 md:py-20">
            <div className="max-w-xl">
              <Reveal>
                <span className="bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">
                  SERVICIOS PARA EMPRESAS
                </span>

                <h2
                  id="consulting-heading"
                  className="text-3xl md:text-4xl font-extrabold mt-4 mb-4 text-white leading-tight"
                >
                  Consultoría <Highlight>BIM</Highlight>
                </h2>

                <p className="text-gray-200 mb-6 leading-relaxed text-lg">
                  Acompañamos a tu empresa en la transformación digital mediante metodología BIM. Implementación,
                  formación y certificación ISO 19650.
                </p>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {CONSULTING_SERVICES.map((service, index) => (
                  <Reveal key={service} delay={120 + index * 80}>
                    <FeatureChip variant="dark">{service}</FeatureChip>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={460}>
                <Button
                  asChild
                  magnetic
                  size="lg"
                  className="bg-brand hover:bg-brand-strong text-white shadow-xl w-full sm:w-auto"
                >
                  <Link href="/bim-consulting-page">
                    Solicitar información <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Acreditaciones: banda compacta de prueba social */}
        <section className="w-full py-12 bg-white border-b border-gray-200" aria-labelledby="certifications-heading">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-6xl">
            <h2
              id="certifications-heading"
              className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500 mb-8"
            >
              <Award className="w-4 h-4 text-brand" />
              Certificaciones y acreditaciones
            </h2>

            {/* items-start + caja de altura fija: los logos tienen proporciones
                distintas y así los tres pies quedan alineados entre sí. */}
            <div className="flex flex-wrap justify-center items-start gap-10 sm:gap-16">
              {ACCREDITATIONS.map((accreditation, index) => (
                <Reveal key={accreditation.alt} delay={index * 90} className="w-44">
                  <div className="h-20 flex items-center justify-center">
                    <Image
                      src={accreditation.src}
                      alt={accreditation.alt}
                      width={accreditation.width}
                      height={accreditation.height}
                      className="object-contain max-h-full w-auto"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-3 font-medium">{accreditation.caption}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Últimas publicaciones del blog */}
        <section className="w-full py-20 bg-gray-900 relative overflow-hidden" aria-labelledby="blog-heading">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-6xl relative z-10">
            <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <SectionBadge icon={BookOpen} variant="dark">
                  Ideblog
                </SectionBadge>
                <h2 id="blog-heading" className="text-3xl md:text-4xl font-extrabold text-white mt-4 leading-relaxed">
                  Lo último en <Highlight>BIM</Highlight>
                </h2>
                <p className="text-gray-400 mt-3 max-w-xl">
                  Noticias, tendencias y recursos sobre metodología BIM y tecnología en construcción
                </p>
              </div>

              <Button asChild magnetic size="lg" className="bg-brand hover:bg-brand-strong text-white shrink-0">
                <Link href="/blog">
                  Ver todos los artículos <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Reveal>

            <Reveal delay={120}>
              <LatestBlogPosts count={3} />
            </Reveal>
          </div>
        </section>

        {/* CTA final */}
        <section
          className="w-full py-20 bg-gradient-to-br from-brand to-brand-strong relative overflow-hidden"
          aria-labelledby="final-cta-heading"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <Reveal className="container mx-auto px-4 md:px-8 lg:px-12 max-w-5xl text-center relative z-10">
            <h2 id="final-cta-heading" className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              ¿Listo para transformar tu carrera profesional?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Contacta con nosotros y te ayudaremos a encontrar el programa que mejor se adapta a tus objetivos. Da el
              primer paso hacia tu futuro en BIM.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                magnetic
                size="lg"
                className="bg-white text-brand hover:bg-gray-100 px-6 py-3 text-sm font-semibold shadow-xl transition-all"
              >
                <Link href="/contact-page">
                  Solicitar información <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>

              <Button
                asChild
                magnetic
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 text-sm font-semibold"
              >
                <Link href="/comparativa-masters-page">
                  Comparar programas <Target className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
              {FINAL_CTA_GUARANTEES.map((guarantee) => (
                <div key={guarantee} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{guarantee}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </MainContentWrapper>

      <FooterSection />
    </div>
  )
}
