import Header from "../../components/header"
import FooterSection from "../../components/footer-section"
import SolicitudBajaClient from "./solicitud-baja-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Solicitud de Baja de Base de Datos | IDESIE",
  description:
    "Ejercita tu derecho de supresión de datos personales conforme al RGPD y la LOPD. Solicita la eliminación de tus datos de nuestra base de datos.",
  robots: "noindex, nofollow",
}

export default function SolicitudBajaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <section className="relative w-full bg-[#006cff] pt-32 md:pt-40 pb-16 md:pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Solicitud de Baja de Base de Datos
            </h1>
            <p className="text-lg md:text-xl leading-relaxed">Ejercita tu derecho de supresión de datos personales</p>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="bg-blue-50 border-l-4 border-[#006cff] p-8 rounded-r-lg mb-12 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Tu derecho a la protección de datos</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Conforme al Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos
                (LOPD), tienes derecho a solicitar la supresión de tus datos personales de nuestra base de datos.
              </p>
            </div>

            {/* Form Component */}
            <SolicitudBajaClient />

            {/* Contact Section */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-lg text-gray-700 mb-3">¿Tienes dudas sobre este proceso?</p>
              <a
                href="mailto:info@idesie.com"
                className="text-[#006cff] hover:text-blue-700 font-semibold text-lg transition-colors"
              >
                Contacta con nosotros: info@idesie.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  )
}
