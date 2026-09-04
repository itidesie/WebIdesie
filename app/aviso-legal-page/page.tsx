import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aviso Legal | IDESIE Business School",
  description: "Información sobre las condiciones de uso del sitio web de IDESIE Business School.",
}

export default function AvisoLegalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full min-h-[80vh] sm:min-h-[90vh] md:min-h-[100vh] overflow-hidden flex items-center justify-center text-center pt-28 md:pt-32 pb-12">
        <Image
          src="/images/hero_image_building_information_modeling_idesie.jpg"
          alt="Aviso Legal IDESIE"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40" />
        <div className="relative z-10 text-white px-4 py-12 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-snug">Aviso Legal</h1>
          <p className="text-lg md:text-xl text-white/90">Informacion sobre las condiciones de uso del sitio web</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Intro Box */}
          <div className="bg-blue-50 border-l-4 border-[#006cff] p-8 rounded-r-lg mb-16 shadow-sm">
            <p className="text-lg leading-relaxed text-gray-700">
              En cumplimiento con el deber de información estipulado en artículo 10 de la Ley 34/2002, de 11 de julio,
              de Servicios de la Sociedad de la Información y del Comercio Electrónico, IDESIE BUSINESS SCHOOL SL, en
              calidad de titular del sitio web <span className="font-semibold text-[#006cff]">WWW.IDESIE.COM</span>,
              hace constar:
            </p>
          </div>

          {/* Section 1 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">1. DATOS IDENTIFICATIVOS</h2>
            <div className="space-y-3 text-lg leading-relaxed text-gray-700">
              <p>
                <span className="font-semibold">Denominación social:</span> IDESIE BUSINESS SCHOOL SL
              </p>
              <p>
                <span className="font-semibold">Domicilio social:</span> Calle Montalbán 3, 1º derecha 28014 Madrid,
                España
              </p>
              <p>
                <span className="font-semibold">CIF:</span> B86143210
              </p>
              <p>
                <span className="font-semibold">Email:</span> info@idesie.com
              </p>
              <p>
                <span className="font-semibold">Datos de inscripción en el Registro Mercantil de Madrid:</span> Tomo
                28534, Libro 0, Folio 206, Sección 8, Hoja M 513103, Inscripción 1, Fecha: 22/01/2011
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">2. DEFINICIONES</h2>
            <div className="space-y-4 text-lg leading-relaxed text-gray-700">
              <p>
                <span className="font-semibold">"Página":</span> dominio IDESIE.COM que se pone a disposición de los
                Usuarios de Internet.
              </p>
              <p>
                <span className="font-semibold">"Usuario":</span> persona física o jurídica que utiliza o navega por la
                Página.
              </p>
              <p>
                <span className="font-semibold">"Contenido":</span> son las páginas que conforman la totalidad del
                dominio IDESIE.COM, las cuales conforman la información y los servicios que IDESIE BUSINESS SCHOOL SL
                pone a disposición de los Usuarios de Internet.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">3. CONDICIONES DE USO</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              El acceso y/o uso de este sitio web de WWW.IDESIE.COM atribuye la condición de USUARIO, que acepta, desde
              dicho acceso y/o uso, los presentes términos de uso. Si el Usuario no estuviera conforme con las cláusulas
              y condiciones de uso del Aviso Legal, se abstendrá de utilizar la Página.
            </p>
          </div>

          {/* Section 4 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">4. USO DEL SITIO WEB</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              El USUARIO asume la responsabilidad del uso de la web. El USUARIO se compromete a hacer un uso adecuado de
              los contenidos de WWW.IDESIE.COM ofrece a través de su web, a no emplearlos para incurrir en actividades
              ilícitas, ilegales o contrarias a la buena fe y al orden público.
            </p>
          </div>

          {/* Section 5 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">5. POLÍTICA DE PRIVACIDAD</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              IDESIE BUSINESS SCHOOL SL es consciente de la importancia de la protección de datos, así como de la
              privacidad de EL USUARIO y por ello ha implementado una política de tratamiento de datos orientada a
              proveer la máxima seguridad en el uso y recogida de los mismos. Para más información, consultar nuestra{" "}
              <Link href="/politica-privacidad-page" className="text-[#006cff] hover:underline font-semibold">
                Política de Privacidad
              </Link>
              .
            </p>
          </div>

          {/* Section 6 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">6. HIPERENLACES</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Nuestro sitio web puede contener hiperenlaces a otros sitios que no son operados o controlados por IDESIE
              BUSINESS SCHOOL SL. Por ello, no garantizamos ni nos hacemos responsables de la licitud, fiabilidad,
              utilidad, veracidad y actualidad de los contenidos de tales sitios web.
            </p>
          </div>

          {/* Section 7 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">
              7. PROPIEDAD INTELECTUAL E INDUSTRIAL
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              IDESIE BUSINESS SCHOOL SL es titular de todos los derechos de propiedad intelectual e industrial de la
              página web, así como de los elementos contenidos en la misma. Quedan expresamente prohibidas la
              reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de
              la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y
              por cualquier medio técnico, sin la autorización de IDESIE BUSINESS SCHOOL SL.
            </p>
          </div>

          {/* Section 8 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">8. COOKIES</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              IDESIE BUSINESS SCHOOL SL informa de que podrá utilizar cookies con la finalidad de elaborar estadísticas
              de utilización del sitio web así como para identificar al PC del Usuario. En todo caso, el usuario puede
              configurar su navegador para que no permita el uso de cookies. Para más información, consulte nuestra{" "}
              <Link href="/politica-cookies-page" className="text-[#006cff] hover:underline font-semibold">
                Política de Cookies
              </Link>
              .
            </p>
          </div>

          {/* Section 9 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">9. LIMITACIÓN DE RESPONSABILIDAD</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              IDESIE BUSINESS SCHOOL SL no garantiza la inexistencia de interrupciones o errores en el acceso a la
              Página. Excluye cualquier responsabilidad por los daños y perjuicios de toda naturaleza que puedan deberse
              a la falta de disponibilidad o de continuidad del funcionamiento de la Página y de los Contenidos.
            </p>
          </div>

          {/* Section 10 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">10. JURISDICCIÓN</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Para cuantas cuestiones se susciten sobre la interpretación, aplicación y cumplimiento de este Aviso
              Legal, todas las partes intervinientes se someten a los Jueces y Tribunales de Madrid renunciando de forma
              expresa a cualquier otro fuero que pudiera corresponderles.
            </p>
          </div>

          {/* Section 11 */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">11. LEGISLACIÓN APLICABLE</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Las presentes condiciones se rigen por la legislación española.
            </p>
          </div>

          <div className="text-center text-gray-600 pt-8 border-t border-gray-200">
            <p className="text-lg">
              <strong>Última actualización:</strong> Septiembre 2021
            </p>
          </div>
        </div>
      </section>

      {/* Información Relacionada */}
      <section className="bg-[#006cff] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">Información Relacionada</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/politica-cookies-page"
              scroll={true}
              className="bg-white/10 hover:bg-white/20 transition-colors p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold mb-2">Política de Cookies</h3>
              <p className="text-gray-200">Uso de cookies en nuestro sitio</p>
            </Link>
            <Link
              href="/politica-privacidad-page"
              scroll={true}
              className="bg-white/10 hover:bg-white/20 transition-colors p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold mb-2">Política de Privacidad</h3>
              <p className="text-gray-200">Cómo tratamos tus datos personales</p>
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

      <FooterSection />
    </div>
  )
}
