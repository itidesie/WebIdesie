import Header from "../../components/header"
import FooterSection from "../../components/footer-section"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { ArrowRight, Handshake, Lightbulb, Users, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Empresas colaboradoras | Colaboradores IDESIE | IDESIE Business & Tech School",
  description:
    "IDESIE colabora con empresas líderes del sector AEC organizaciones tecnológicas. Colaboramos con Ferrovial, Autodesk, Bentley y más de 50 partners para impulsar la innovación BIM y la empleabilidad de nuestros alumnos.",
}

export default function EmpresasPage() {
  const partnerLogos = [
    {
      src: "/images/descarga-20-281-29.png",
      alt: "C95 Creative",
    },
    {
      src: "/images/captura-20de-20pantalla-202025-08-11-20191856.png",
      alt: "EOS",
    },
    {
      src: "/images/1631368132530.jpeg",
      alt: "CONURMA Ingenieros Consultores",
    },
    {
      src: "/images/daikinlogo-converted.png",
      alt: "Daikin Air Conditioners",
    },
    {
      src: "/images/1590573051uponor-01.png",
      alt: "Uponor",
    },
    {
      src: "/images/descarga-20-282-29.png",
      alt: "Bexel Manager",
    },
    {
      src: "/images/descarga-20-284-29.png",
      alt: "northBIM",
    },
    {
      src: "/images/captura-20de-20pantalla-202025-08-11-20193546.png",
      alt: "QUARK",
    },
    {
      src: "/images/descarga-20-283-29.png",
      alt: "Optimia Compliance Services",
    },
    {
      src: "/images/1631364293763.jpeg",
      alt: "Proingest",
    },
    {
      src: "/images/descarga-20-2810-29.png",
      alt: "ISOVER SAINT-GOBAIN",
    },
    {
      src: "/images/descarga-20-288-29.png",
      alt: "LKS Next",
    },
    {
      src: "/images/descarga.png",
      alt: "ferrovial",
    },
    {
      src: "/images/descarga-20-289-29.png",
      alt: "L35",
    },
    {
      src: "/images/descarga-20-286-29.png",
      alt: "INGENIERIA VALLADARES",
    },
    {
      src: "/images/descarga-20-285-29.png",
      alt: "LYNIKA",
    },
    {
      src: "/images/descarga-20-2811-29.png",
      alt: "RIB Spain",
    },
    {
      src: "/images/descarga-20-2812-29.png",
      alt: "3g office",
    },
    {
      src: "/images/grundfos-logo-png-seeklogo-377956.png",
      alt: "GRUNDFOS",
    },
    {
      src: "/images/descarga-20-287-29.png",
      alt: "TROX",
    },
    {
      src: "/images/logo-efebe.png",
      alt: "EFEBÉ",
    },
    {
      src: "/images/logo-philips.webp",
      alt: "PHILIPS",
    },
    {
      src: "/images/inespro-logo-cabecera.png",
      alt: "INESPRO",
    },
    {
      src: "/images/images.png",
      alt: "CiTD",
    },
    {
      src: "/images/jglogodark-final-402x.png",
      alt: "ingenieros JG",
    },
    
    {
      src: "/images/logo-prysmian-group.jpeg",
      alt: "PRYSMIAN",
    },
    {
      src: "/images/images.jpeg",
      alt: "Grupo Lobe Passivhaus",
    },
    {
      src: "/images/logo-homu-project.png",
      alt: "HOMU PROJECT",
    },
    {
      src: "/images/lamela1.png",
      alt: "ESTUDIO LAMELA ARQUITECTOS",
    },
    {
      src: "/images/wolf-logo-baja-resoluci-c3-b3n.jpeg",
      alt: "WOLF",
    },
    {
      src: "/images/taxonomies-14-1-m.png",
      alt: "ACV",
    },
    {
      src: "/images/presto.png",
      alt: "Presto iTWO",
    },
    {
      src: "/images/thumb-26922-agency-logo-desktop-standart.jpeg",
      alt: "aestudio",
    },
    {
      src: "/images/viking.gif",
      alt: "VIKING",
    },
    {
      src: "/images/ta.jpeg",
      alt: "TA HYDRONICS",
    },
    {
      src: "/images/r-urculo-ingenieros-consultores-s-a-logo.jpeg",
      alt: "Úrculo Ingenieros",
    },
  ]

  const collabBenefits = [
    {
      icon: <Handshake className="w-8 h-8 text-[#006cff]" />,
      title: "Innovación Colaborativa",
      description:
        "Desarrollamos proyectos de investigación y desarrollo conjuntos para impulsar el futuro del sector AEC.",
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-[#006cff]" />,
      title: "Talento y Empleabilidad",
      description:
        "Conectamos a nuestros alumnos con las mejores oportunidades laborales y de prácticas en empresas líderes.",
    },
    {
      icon: <Users className="w-8 h-8 text-[#006cff]" />,
      title: "Formación a Medida",
      description:
        "Diseñamos programas de formación In Company y cursos especializados para las necesidades de nuestros partners.",
    },
    {
      icon: <Globe className="w-8 h-8 text-[#006cff]" />,
      title: "Impacto Global",
      description:
        "Ampliamos nuestra red de influencia y contribuimos al desarrollo de la industria a nivel internacional.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full min-h-[80vh] sm:min-h-[90vh] md:min-h-[100vh] overflow-hidden flex items-center justify-center text-center pt-28 md:pt-32 pb-12">
          <Image
            src="/images/teamwork-meeting.jpg"
            alt="Grupo de profesionales colaborando en oficina moderna"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40" aria-hidden="true" />
          <div className="relative z-10 text-white px-4 py-12 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-snug">
              Empresas <span className="bg-[#006cff] text-white px-3 py-1 rounded-lg">Colaboradoras</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              En IDESIE, creemos en el poder de la colaboracion. Nos asociamos con empresas, instituciones y lideres del
              sector para impulsar la innovacion, el talento y el desarrollo en la industria AEC.
            </p>
            <Button asChild size="lg" className="w-full sm:w-auto px-6 py-3 text-sm font-semibold">
              <Link href="/contact-page">
                Colabora con nosotros <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Partner Logos Section */}
        <section id="partners" className="w-full py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
              Empresas y Organizaciones Colaboradoras
            </h2>

            {/* Static Logo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
              {partnerLogos.map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100 aspect-square"
                >
                  <Image
                    src={logo.src || "/placeholder.svg"}
                    alt={logo.alt}
                    width={160}
                    height={160}
                    className="object-contain max-w-full max-h-full transition-all duration-300 hover:scale-105"
                    style={{
                      maxWidth: "140px",
                      maxHeight: "140px",
                      width: "auto",
                      height: "auto",
                    }}
                  />
                </div>
              ))}
            </div>

            <p className="text-center text-gray-600 mt-12 text-lg">
              Trabajamos de la mano con más de 35 líderes de la industria para ofrecer la mejor formación y
              oportunidades.
            </p>
          </div>
        </section>

        {/* Benefits of Collab Section */}
        <section className="w-full py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
              Beneficios de Colaborar con nosotros
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {collabBenefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="flex flex-col items-center text-center p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-50 border border-gray-100"
                >
                  <div className="mb-4">{benefit.icon}</div>
                  <CardTitle className="text-xl font-semibold mb-2 text-gray-800">{benefit.title}</CardTitle>
                  <CardDescription className="text-gray-600">{benefit.description}</CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="contact" className="w-full py-16 md:py-24 bg-[#006cff] text-white text-center">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              ¿Quieres formar parte de nuestra red de colaboradores?
            </h2>
            <p className="text-lg md:text-xl mb-8">
              Contacta con nosotros para explorar oportunidades de colaboración y crecimiento mutuo.
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto px-6 py-3 text-sm font-semibold">
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
