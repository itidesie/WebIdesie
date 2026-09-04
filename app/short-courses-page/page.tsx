import Header from "../../components/header"
import FooterSection from "../../components/footer-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Zap,
  Lightbulb,
  Award,
  Clock,
  BookOpen,
  TrendingUp,
  Building,
  HardHat,
  DollarSign,
  Globe,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cursos BIM Profesionales - Executive Education | IDESIE",
  description:
    "Cursos BIM especializados para profesionales. Certificaciones oficiales en Revit, Navisworks, BIM Management. Formación intensiva presencial y online. Actualiza tus competencias BIM.",
  keywords: [
    "cursos BIM profesionales",
    "executive education BIM",
    "certificación Revit",
    "curso Navisworks",
    "BIM Management course",
    "formación BIM intensiva",
    "cursos cortos BIM",
    "Building Information Modeling training",
    "BIM para infraestructuras",
    "Facility Management BIM",
    "ISO 19650 course",
  ],
  openGraph: {
    title: "Cursos BIM Profesionales - Executive Education | IDESIE",
    description:
      "Cursos BIM especializados para profesionales. Certificaciones oficiales, formación intensiva en Building Information Modeling.",
    url: "/short-courses-page",
    images: [
      {
        url: "/images/cursos_cortos_hero_image.jpg",
        width: 1200,
        height: 630,
        alt: "Cursos BIM profesionales - Executive Education IDESIE",
      },
    ],
  },
}

export default function ShortCoursesPage() {
  const keyBenefits = [
    {
      icon: <Zap className="w-8 h-8 text-[#006cff]" />,
      title: "Aprendizaje Rápido",
      description: "Adquiere habilidades clave en poco tiempo, con programas intensivos y enfocados.",
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-[#006cff]" />,
      title: "Contenido Práctico",
      description: "Enfocado en la aplicación real, con casos de estudio y herramientas del sector.",
    },
    {
      icon: <Clock className="w-8 h-8 text-[#006cff]" />,
      title: "Flexibilidad",
      description: "Diseñados para profesionales en activo, compatibles con tu horario laboral.",
    },
    {
      icon: <Award className="w-8 h-8 text-[#006cff]" />,
      title: "Certificación Profesional",
      description: "Valida tus nuevas competencias con un certificado de IDESIE.",
    },
  ]

  const courses = [
    {
      title: "BIM Fundamentals",
      description:
        "Introducción a la metodología BIM, estándares ISO 19650, herramientas básicas como Revit Architecture y roles profesionales.",
      hours: 40,
      price: "€1,200",
      modality: "Presencial/Online",
      icon: <BookOpen className="w-10 h-10 text-[#006cff]" />,
      link: "#",
    },
    {
      title: "Advanced BIM Management",
      description:
        "Gestión avanzada de proyectos BIM, coordinación multidisciplinar, uso de Navisworks y detección de interferencias, e implementación BIM en empresas.",
      hours: 60,
      price: "€1,800",
      modality: "Presencial",
      icon: <TrendingUp className="w-10 h-10 text-[#006cff]" />,
      link: "#",
    },
    {
      title: "BIM for Infrastructure",
      description:
        "BIM aplicado a infraestructuras, Civil 3D y herramientas especializadas, integración GIS + BIM y casos prácticos de obra lineal.",
      hours: 50,
      price: "€1,500",
      modality: "Híbrida",
      icon: <Building className="w-10 h-10 text-[#006cff]" />,
      link: "#",
    },
    {
      title: "Facility Management con BIM",
      description:
        "BIM 6D: Gestión de activos, software especializado como Archibus y Spacewell, mantenimiento predictivo y Digital Twin para FM.",
      hours: 35,
      price: "€1,100",
      modality: "Online",
      icon: <HardHat className="w-10 h-10 text-[#006cff]" />,
      link: "#",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow" role="main">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative w-full min-h-[80vh] sm:min-h-[90vh] md:min-h-[100vh] overflow-hidden flex items-center justify-center text-center pt-28 md:pt-32 pb-12"
          aria-labelledby="hero-heading"
        >
          <Image
            src="/images/cursos_cortos_hero_image.jpg"
            alt="Profesional estudiando cursos BIM en laptop con planos de construccion"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40" aria-hidden="true" />
          <div className="relative z-10 text-white px-4 py-12 max-w-4xl mx-auto">
            <h1 id="hero-heading" className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-snug">
              Cursos BIM <span className="bg-[#006cff] text-white px-3 py-1 rounded-lg">Profesionales</span>
            </h1>
            <p className="text-xl md:text-2xl font-semibold mb-2">Especializacion para Expertos</p>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Programas intensivos y especializados para profesionales que buscan actualizar sus conocimientos BIM y
              potenciar su carrera.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#006cff] hover:bg-[#005bbd] text-white rounded-lg shadow-lg transition-all w-full sm:w-auto px-6 py-3 text-sm font-semibold"
              aria-label="Explorar catalogo de cursos BIM profesionales"
            >
              <Link href="#explore-courses">
                Explorar cursos <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section id="benefits" className="w-full py-16 md:py-24 bg-gray-50" aria-labelledby="benefits-heading">
          <div className="container mx-auto px-4 md:px-6">
            <h2 id="benefits-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              ¿Por qué elegir nuestros Cursos BIM Cortos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyBenefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="flex flex-col items-center text-center p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200"
                >
                  <div className="mb-4" aria-hidden="true">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold mb-2 text-gray-800">{benefit.title}</CardTitle>
                  <CardDescription className="text-gray-600">{benefit.description}</CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Course Catalog Section */}
        <section id="explore-courses" className="w-full py-16 md:py-24 bg-white" aria-labelledby="courses-heading">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <h2 id="courses-heading" className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
              Catálogo de Cursos BIM Especializados
            </h2>
            
            {/* Coming Soon Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 md:p-12 text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Próximamente</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                Estamos preparando un catálogo completo de cursos cortos especializados en BIM a través de nuestra plataforma Class on Live. 
                Muy pronto podrás acceder a formación intensiva y certificaciones profesionales.
              </p>
              <p className="text-base text-gray-500">
                ¿Quieres ser el primero en enterarte cuando estén disponibles?
              </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-[#006cff] rounded-lg shadow-lg hover:bg-gray-100 transition-all w-full sm:w-auto px-6 py-3 text-sm font-semibold"
            >
              <Link href="/contact-page">
                Inscribete ahora <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-16 md:py-24 bg-gray-100" aria-labelledby="testimonials-heading">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Lo que dicen nuestros alumnos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6 rounded-xl shadow-lg bg-white border border-gray-200">
                <CardContent className="p-0">
                  <blockquote className="text-lg text-gray-700 italic mb-4">
                    "Realicé un curso corto de BIM y fue exactamente lo que necesitaba para mi proyecto actual. Muy
                    práctico y el profesorado excelente."
                  </blockquote>
                  <cite className="font-semibold text-gray-800 not-italic">- Carlos Ruiz, Arquitecto</cite>
                </CardContent>
              </Card>
              <Card className="p-6 rounded-xl shadow-lg bg-white border border-gray-200">
                <CardContent className="p-0">
                  <blockquote className="text-lg text-gray-700 italic mb-4">
                    "La flexibilidad de los cursos cortos de IDESIE me permitió aprender sobre IA en construcción sin
                    interferir con mi trabajo. ¡Muy recomendable!"
                  </blockquote>
                  <cite className="font-semibold text-gray-800 not-italic">- Marta Sánchez, Ingeniera</cite>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section
          id="contact"
          className="w-full py-16 md:py-24 bg-[#006cff] text-white text-center"
          aria-labelledby="cta-heading"
        >
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para potenciar tus habilidades BIM?
            </h2>
            <p className="text-lg md:text-xl mb-8">
              Explora nuestra oferta de cursos BIM cortos y da el siguiente paso en tu desarrollo profesional.
            </p>
            <div className="flex justify-center">
              <Button
                asChild
                className="px-6 py-3 text-sm font-semibold bg-white text-[#006cff] rounded-lg shadow-lg hover:bg-gray-100 transition-all"
                aria-label="Contactar para informacion sobre cursos BIM"
              >
                <Link href="/contact-page">
                  Contacta con nosotros <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
