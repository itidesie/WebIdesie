import type { Metadata } from "next"
import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Política de Cookies | IDESIE Business & Technology School",
  description: "Información sobre el uso de cookies en nuestro sitio web",
}

export default function PoliticaCookiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-[#006cff] text-white py-16 md:py-20 pt-32 md:pt-40">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Política de Cookies</h1>
            <p className="text-lg md:text-xl">Información sobre el uso de cookies en nuestro sitio web</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="bg-blue-50 border-l-4 border-[#006cff] p-8 rounded-r-lg mb-12 shadow-sm">
              <p className="text-lg leading-relaxed text-gray-700">
                En IDESIE BUSINESS SCHOOL SE utilizamos cookies y tecnologías similares para mejorar tu experiencia de
                navegación, personalizar contenidos y anuncios, proporcionar funciones de redes sociales y analizar
                nuestro tráfico. Esta política explica qué son las cookies, cómo las utilizamos y cómo puedes
                gestionarlas.
              </p>
            </div>

            {/* ¿Qué son las cookies? */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">¿Qué son las cookies?</h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-700">
                <p>
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, tablet o
                  móvil) cuando visitas un sitio web. Estos archivos permiten que el sitio web recuerde tus acciones y
                  preferencias durante un periodo de tiempo, para que no tengas que volver a introducirlas cada vez que
                  regreses al sitio o navegues de una página a otra.
                </p>
                <p>
                  Las cookies son el medio técnico para la "usabilidad" y seguimiento de la navegación en los sitios
                  web. Son pequeños ficheros de texto que se facilitan en el ordenador del usuario y que permiten
                  recordar información sobre el usuario para que éste no tenga que volver a introducirla cada vez que
                  visite el sitio web.
                </p>
              </div>
            </div>

            {/* Tipos de cookies */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900">
                Tipos de cookies que utilizamos
              </h2>

              <div className="grid gap-6">
                <div className="bg-gray-50 border-l-4 border-[#006cff] p-6 rounded-r-lg hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-3 text-[#006cff]">Cookies Técnicas o Necesarias</h3>
                  <p className="text-lg leading-relaxed text-gray-700 mb-2">
                    Son esenciales para que el sitio web funcione correctamente. Permiten la navegación y el uso de
                    funciones básicas como el acceso a áreas seguras.
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Ejemplos:</span> Cookies de sesión, cookies de identificación
                  </p>
                </div>

                <div className="bg-gray-50 border-l-4 border-[#006cff] p-6 rounded-r-lg hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-3 text-[#006cff]">Cookies de Análisis</h3>
                  <p className="text-lg leading-relaxed text-gray-700 mb-2">
                    Recogen información sobre cómo los usuarios utilizan el sitio web. Nos ayudan a mejorar el
                    funcionamiento y la experiencia de usuario.
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Ejemplos:</span> Google Analytics, estadísticas de uso
                  </p>
                </div>

                <div className="bg-gray-50 border-l-4 border-[#006cff] p-6 rounded-r-lg hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-3 text-[#006cff]">Cookies de Funcionalidad</h3>
                  <p className="text-lg leading-relaxed text-gray-700 mb-2">
                    Permiten recordar las preferencias del usuario (como idioma u región) y ofrecer una experiencia más
                    personalizada.
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Ejemplos:</span> Preferencias de idioma, configuración regional
                  </p>
                </div>

                <div className="bg-gray-50 border-l-4 border-[#006cff] p-6 rounded-r-lg hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-3 text-[#006cff]">Cookies de Publicidad</h3>
                  <p className="text-lg leading-relaxed text-gray-700 mb-2">
                    Se utilizan para mostrar publicidad relevante para el usuario y medir la efectividad de las campañas
                    publicitarias.
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Ejemplos:</span> Google Ads, Facebook Pixel
                  </p>
                </div>
              </div>
            </div>

            {/* Tabla de cookies específicas */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">
                Cookies específicas que utilizamos
              </h2>
              <div className="overflow-x-auto rounded-lg shadow-sm">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-[#006cff] text-white">
                      <th className="border border-gray-300 px-4 py-3 text-left font-bold">Nombre</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-bold">Proveedor</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-bold">Finalidad</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-bold">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="border border-gray-300 px-4 py-3">_ga</td>
                      <td className="border border-gray-300 px-4 py-3">Google Analytics</td>
                      <td className="border border-gray-300 px-4 py-3">Análisis de tráfico</td>
                      <td className="border border-gray-300 px-4 py-3">2 años</td>
                    </tr>
                    <tr className="bg-gray-50 hover:bg-gray-100 transition-colors">
                      <td className="border border-gray-300 px-4 py-3">_gid</td>
                      <td className="border border-gray-300 px-4 py-3">Google Analytics</td>
                      <td className="border border-gray-300 px-4 py-3">Identificación de usuario</td>
                      <td className="border border-gray-300 px-4 py-3">24 horas</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="border border-gray-300 px-4 py-3">cookie_consent</td>
                      <td className="border border-gray-300 px-4 py-3">IDESIE</td>
                      <td className="border border-gray-300 px-4 py-3">Recordar preferencias de cookies</td>
                      <td className="border border-gray-300 px-4 py-3">1 año</td>
                    </tr>
                    <tr className="bg-gray-50 hover:bg-gray-100 transition-colors">
                      <td className="border border-gray-300 px-4 py-3">sessionid</td>
                      <td className="border border-gray-300 px-4 py-3">IDESIE</td>
                      <td className="border border-gray-300 px-4 py-3">Gestión de sesión</td>
                      <td className="border border-gray-300 px-4 py-3">Sesión</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cómo gestionar las cookies */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">Cómo gestionar las cookies</h2>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Configuración del navegador</h3>
                <p className="text-lg leading-relaxed text-gray-700 mb-4">
                  También puedes configurar tu navegador para aceptar o rechazar cookies automáticamente. A
                  continuación, te mostramos cómo hacerlo en los navegadores más comunes:
                </p>
                <ul className="space-y-2 text-lg text-gray-700 ml-6">
                  <li className="list-disc">
                    <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios
                  </li>
                  <li className="list-disc">
                    <strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio
                  </li>
                  <li className="list-disc">
                    <strong>Safari:</strong> Preferencias → Privacidad → Cookies y datos de sitios web
                  </li>
                  <li className="list-disc">
                    <strong>Edge:</strong> Configuración → Cookies y permisos del sitio → Administrar y eliminar cookies
                    y datos del sitio
                  </li>
                </ul>
              </div>

              {/* Warning Box */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg flex gap-4 shadow-sm">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900 mb-2">Importante</p>
                  <p className="text-gray-700 leading-relaxed">
                    Ten en cuenta que si desactivas o eliminas las cookies, es posible que algunas funciones del sitio
                    web no funcionen correctamente y que tu experiencia de navegación pueda verse afectada. Las cookies
                    técnicas son necesarias para el funcionamiento básico del sitio y no pueden ser desactivadas.
                  </p>
                </div>
              </div>
            </div>

            {/* Consentimiento y aceptación */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">Consentimiento y aceptación</h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-700">
                <p>
                  Al continuar navegando por este sitio web, modificar la configuración de tu navegador, aceptas el uso
                  de cookies de acuerdo con esta Política de Cookies. Puedes retirar tu consentimiento en cualquier
                  momento modificando la configuración de cookies.
                </p>
                <p>
                  De conformidad con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección
                  de Datos y Garantía de los Derechos Digitales (LOPDGDD), te informamos de que puedes ejercer tus
                  derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición enviando un correo
                  electrónico a{" "}
                  <Link href="mailto:info@idesie.es" className="text-[#006cff] hover:underline">
                    info@idesie.es
                  </Link>{" "}
                  o mediante carta a la dirección indicada al final de este documento.
                </p>
              </div>
            </div>

            {/* Actualización de la Política */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">
                Actualización de la Política de Cookies
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                IDESIE BUSINESS SCHOOL SE se reserva el derecho de modificar esta Política de Cookies en cualquier
                momento. Te recomendamos que revises esta página periódicamente para estar al tanto de cualquier cambio.
                La fecha de la última actualización aparecerá al final de este documento.
              </p>
            </div>

            {/* Dudas */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">
                ¿Tienes dudas sobre las cookies?
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-4">
                Si tienes alguna pregunta sobre nuestra Política de Cookies, no dudes en contactarnos:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <p className="text-lg text-gray-700">
                  <strong>Email:</strong>{" "}
                  <Link href="mailto:info@idesie.es" className="text-[#006cff] hover:underline">
                    info@idesie.es
                  </Link>
                </p>
                <p className="text-lg text-gray-700 mt-2">
                  <strong>Dirección:</strong> Calle Menéndez, 5. 1ª derecha, 28014 Madrid, España
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#006cff] text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">Información Relacionada</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/politica-privacidad-page"
                scroll={true}
                className="bg-white/10 hover:bg-white/20 transition-colors p-6 rounded-lg"
              >
                <h3 className="text-xl font-bold mb-2">Política de Privacidad</h3>
                <p className="text-gray-200">Cómo tratamos tus datos personales</p>
              </Link>
              <Link
                href="/aviso-legal-page"
                scroll={true}
                className="bg-white/10 hover:bg-white/20 transition-colors p-6 rounded-lg"
              >
                <h3 className="text-xl font-bold mb-2">Aviso Legal</h3>
                <p className="text-gray-200">Términos y condiciones de uso</p>
              </Link>
              <Link
                href="/solicitud-baja-page"
                scroll={true}
                className="bg-white/10 hover:bg-white/20 transition-colors p-6 rounded-lg"
              >
                <h3 className="text-xl font-bold mb-2">Solicitud de Baja</h3>
                <p className="text-gray-200">Ejercita tu derecho de supresión</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  )
}
