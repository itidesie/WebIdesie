import Header from "../../components/header"
import FooterSection from "../../components/footer-section"
import ContactClientPage from "./contact-client-page" // Importar el nuevo Client Component
import { Card, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"
import type { Metadata } from "next"
import { Suspense } from "react"

// Metadata se exporta directamente desde este Server Component
export const metadata: Metadata = {
  title: "Contacto | IDESIE Business & Tech School Madrid",
  description:
    "Contacta con IDESIE Business & Tech School en Madrid para información sobre Máster BIM, consultoría especializada, formación in-company y programas de Building Information Modeling. Asesoramiento personalizado en Madrid, España. Llámanos o envía tu consulta online. Escuela BIM líder en Madrid desde 2012.",
  keywords: [
    "contacto IDESIE Madrid",
    "información Máster BIM Madrid",
    "consultoría BIM Madrid",
    "formación BIM Madrid España",
    "asesoramiento BIM Madrid",
    "escuela BIM Madrid contacto",
    "teléfono IDESIE Madrid",
    "dirección IDESIE Madrid",
  ],
  openGraph: {
    title: "Contacto - IDESIE Madrid | Formación BIM",
    description:
      "Contacta con la escuela BIM líder en Madrid. Información sobre Máster BIM y consultoría especializada.",
    url: "/contact-page",
  },
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full min-h-[80vh] sm:min-h-[90vh] md:min-h-[100vh] overflow-hidden flex items-center justify-center text-center pt-28 md:pt-32 pb-12">
          <Image
            src="/images/trabajo_conjunto.jpg"
            alt="Grupo de estudiantes colaborando en un proyecto de ingenieria"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40" aria-hidden="true" />
          <div className="relative z-10 text-white px-4 py-12 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-snug animate-fade-in-up">
              Contacta con <span className="bg-[#006cff] text-white px-3 py-1 rounded-lg">IDESIE</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 animate-fade-in-up delay-200">
              Estamos aquí para ayudarte. Envíanos un mensaje o agenda una llamada con nuestro equipo.
            </p>
          </div>
        </section>

        {/* Contact Options Section */}
        <section className="w-full py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            {/* Contact Info */}
            <Card className="p-8 rounded-xl shadow-lg bg-white border border-gray-200 mb-12">
              <CardTitle className="text-3xl font-extrabold mb-6 text-gray-900 text-center">
                Información de Contacto
              </CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg text-gray-700 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Mail className="w-8 h-8 text-[#006cff]" />
                  <span>info@idesie.com</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Phone className="w-8 h-8 text-[#006cff]" />
                  <span>+34 914 85 91 32</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <MapPin className="w-8 h-8 text-[#006cff]" />
                  <span>Calle San Aquilino 13, 28029, Madrid    </span>
                </div>
              </div>
            </Card>

            {/* Dynamic Contact Card (Client Component).
                Usa useSearchParams (?motivo=...), asi que necesita un limite de
                Suspense para no forzar el renderizado dinamico de toda la pagina. */}
            <Suspense
              fallback={
                <div className="h-[600px] rounded-xl border border-gray-200 bg-white shadow-lg" />
              }
            >
              <ContactClientPage />
            </Suspense>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
