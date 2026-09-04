import type { Metadata } from "next"
import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import { Mail, MapPin, Globe, Shield, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Política de Privacidad | IDESIE Business School",
  description: "Protección de datos personales según el RGPD y la LOPDGDD",
}

export default function PoliticaPrivacidadPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-[#006cff] pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Política de Privacidad</h1>
          <p className="text-lg md:text-xl text-white/90">Protección de datos personales según el RGPD y la LOPDGDD</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
          {/* Compromiso Section */}
          <div className="bg-blue-50 border-l-4 border-[#006cff] p-8 rounded-r-lg mb-16 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Compromiso con la privacidad</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              En IDESIE BUSINESS SCHOOL SL, estamos comprometidos con la protección de la seguridad y la privacidad de
              los datos personales. En el ámbito de la Unión Europea, estos derechos están regulados por el Reglamento
              General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y
              Garantía de los Derechos Digitales (LOPDGDD).
            </p>
          </div>

          {/* 1. Responsable del Tratamiento */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#006cff] text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Responsable del Tratamiento</h2>
              </div>
            </div>
            <div className="ml-14 text-lg text-gray-700 leading-relaxed space-y-2">
              <p>
                <strong>Identidad:</strong> IDESIE BUSINESS SCHOOL SL
              </p>
              <p>
                <strong>CIF:</strong> B88145476
              </p>
              <p>
                <strong>Dirección:</strong> Calle Menéndez Pelayo, 8, 28009 Madrid
              </p>
              <p>
                <strong>Teléfono:</strong> +34 910 052 421
              </p>
              <p>
                <strong>Email:</strong> info@idesie.es
              </p>
              <p>
                <strong>Delegado de Protección de Datos:</strong> dpo@idesie.es
              </p>
            </div>
          </div>

          {/* 2. Datos que Recopilamos */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#006cff] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Datos que Recopilamos</h2>
              </div>
            </div>
            <div className="ml-14 text-lg text-gray-700 leading-relaxed">
              <p className="mb-3">Podemos recopilar los siguientes tipos de datos personales:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Datos de identificación: nombre, apellidos, DNI/NIE</li>
                <li>Datos de contacto: correo electrónico, teléfono, dirección postal</li>
                <li>Datos académicos: titulación, expediente académico, certificados</li>
                <li>Datos profesionales: experiencia laboral, CV</li>
                <li>Datos de navegación: cookies, dirección IP, logs de acceso</li>
                <li>Datos bancarios: para gestión de pagos (si aplica)</li>
              </ul>
            </div>
          </div>

          {/* 3. Finalidad del Tratamiento */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#006cff] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Finalidad del Tratamiento</h2>
              </div>
            </div>
            <div className="ml-14 text-lg text-gray-700 leading-relaxed">
              <p className="mb-3">Tratamos tus datos personales para las siguientes finalidades:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gestión de solicitudes de información sobre nuestros programas</li>
                <li>Proceso de admisión y matriculación</li>
                <li>Prestación de servicios educativos y formativos</li>
                <li>Comunicaciones comerciales sobre nuestros programas (con tu consentimiento)</li>
                <li>Gestión de la bolsa de empleo y prácticas profesionales</li>
                <li>Envío de newsletters y contenido de interés</li>
                <li>Mejora de nuestros servicios mediante análisis y estadísticas</li>
                <li>Cumplimiento de obligaciones legales</li>
              </ul>
            </div>
          </div>

          {/* 4. Base Legal */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#006cff] text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Base Legal del Tratamiento</h2>
              </div>
            </div>
            <div className="ml-14 text-lg text-gray-700 leading-relaxed">
              <p className="mb-3">La base legal para el tratamiento de tus datos es:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Consentimiento:</strong> para el envío de comunicaciones comerciales
                </li>
                <li>
                  <strong>Ejecución de contrato:</strong> para la prestación de servicios educativos
                </li>
                <li>
                  <strong>Interés legítimo:</strong> para la mejora de nuestros servicios
                </li>
                <li>
                  <strong>Obligación legal:</strong> para el cumplimiento de normativas aplicables
                </li>
              </ul>
            </div>
          </div>

          {/* 5. Conservación de Datos */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#006cff] text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Conservación de Datos</h2>
              </div>
            </div>
            <div className="ml-14 text-lg text-gray-700 leading-relaxed">
              <p className="mb-3">Los datos personales se conservarán durante:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>El tiempo necesario para cumplir con la finalidad para la que fueron recabados</li>
                <li>Mientras exista una relación contractual o educativa</li>
                <li>Durante los plazos legales de prescripción de responsabilidades</li>
                <li>Hasta que solicites su supresión o retires tu consentimiento</li>
              </ul>
              <p className="mt-4">
                Una vez finalizado el tratamiento, los datos serán eliminados o anonimizados de forma segura, salvo
                obligación legal de conservación.
              </p>
            </div>
          </div>

          {/* 6. Comunicación de Datos */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#006cff] text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Comunicación de Datos</h2>
              </div>
            </div>
            <div className="ml-14 text-lg text-gray-700 leading-relaxed">
              <p className="mb-3">Tus datos podrán ser comunicados a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Administraciones públicas: cuando exista obligación legal</li>
                <li>Entidades colaboradoras: universidades, empresas para prácticas (con tu consentimiento)</li>
                <li>
                  Proveedores de servicios: plataformas educativas, sistemas de pago (bajo contrato de encargado de
                  tratamiento)
                </li>
                <li>Empresas del grupo: para gestión administrativa y comercial</li>
              </ul>
              <p className="mt-4">
                No realizamos transferencias internacionales de datos fuera del Espacio Económico Europeo, salvo que sea
                necesario y con las garantías adecuadas.
              </p>
            </div>
          </div>

          {/* Tus Derechos RGPD */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">Tus Derechos RGPD</h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-8">
              Como titular de los datos, tienes los siguientes derechos:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Derecho de Acceso</h3>
                <p className="text-lg text-gray-700">
                  Obtener información sobre si estamos tratando tus datos y cómo lo hacemos.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Derecho de Rectificación</h3>
                <p className="text-lg text-gray-700">Corregir datos inexactos o incompletos.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Derecho de Supresión</h3>
                <p className="text-lg text-gray-700">
                  Solicitar la eliminación de tus datos cuando ya no sean necesarios.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Derecho de Oposición</h3>
                <p className="text-lg text-gray-700">
                  Oponerte al tratamiento de tus datos en determinadas circunstancias.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Derecho de Limitación</h3>
                <p className="text-lg text-gray-700">Solicitar la limitación del tratamiento de tus datos.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Derecho de Portabilidad</h3>
                <p className="text-lg text-gray-700">
                  Recibir tus datos en formato estructurado y transferirlos a otro responsable.
                </p>
              </div>
            </div>
          </div>

          {/* Cómo ejercer tus derechos */}
          <div className="bg-[#006cff] text-white p-8 md:p-12 rounded-lg mb-16 shadow-lg">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">¿Cómo ejercer tus derechos?</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Mail className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">Por Email</h3>
                <p className="text-white/90">
                  Envía tu solicitud a:
                  <br />
                  <a href="mailto:dpo@idesie.es" className="underline hover:text-white">
                    info@idesie.es
                  </a>
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <MapPin className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">Por Carta</h3>
                <p className="text-white/90">
                  Calle Menéndez Pelayo 8<br />
                  28009 Madrid, España
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Globe className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">Formulario Web</h3>
                <p className="text-white/90">
                  Accede a nuestro
                  <br />
                  formulario online
                </p>
              </div>
            </div>

            <p className="text-center text-white/90 mt-8 text-lg">
              <strong>Importante:</strong> Para ejercer tus derechos, deberás identificarte con copia de tu DNI/NIE.
              Responderemos a tu solicitud en el plazo máximo de 1 mes.
            </p>
          </div>

          {/* Medidas de Seguridad */}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-12">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Medidas de Seguridad</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              En IDESIE BUSINESS SCHOOL SL hemos implementado medidas técnicas y organizativas apropiadas para
              garantizar un nivel de seguridad adecuado al riesgo, que incluyen:
            </p>
            <ul className="space-y-2 text-lg text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span>Cifrado SSL/TLS en la transmisión de datos</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span>Control de acceso mediante autenticación</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span>Copias de seguridad periódicas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span>Protección de servidores mediante cortafuegos</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span>Formación del personal en protección de datos</span>
              </li>
            </ul>
          </div>

          {/* Protección de Menores */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Protección de Menores</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Nuestros servicios están dirigidos a mayores de 18 años. Si eres menor de edad, necesitarás el
              consentimiento de tus padres o tutores legales para proporcionarnos tus datos personales. Si detectamos
              que hemos recabado datos de un menor sin el consentimiento parental adecuado, eliminaremos dicha
              información de nuestros sistemas.
            </p>
          </div>

          {/* Derecho a Reclamación */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Derecho a Presentar una Reclamación
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Si consideras que el tratamiento de tus datos personales vulnera la normativa vigente, tienes derecho a
              presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD):
            </p>
            <div className="bg-white p-4 rounded border border-yellow-200">
              <p className="text-lg text-gray-900 font-semibold mb-2">Agencia Española de Protección de Datos (AEPD)</p>
              <p className="text-lg text-gray-700">
                <strong>Dirección:</strong> Calle Jorge Juan, 6, 28001 Madrid
                <br />
                <strong>Teléfono:</strong> +34 901 100 099 / +34 912 663 517
                <br />
                <strong>Web:</strong>{" "}
                <a
                  href="https://www.aepd.es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#006cff] hover:underline"
                >
                  www.aepd.es
                </a>
              </p>
            </div>
          </div>

          {/* Modificaciones */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Modificaciones de la Política de Privacidad
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              IDESIE BUSINESS SCHOOL SL se reserva el derecho de modificar esta Política de Privacidad en cualquier
              momento. Te recomendamos revisar estas páginas periódicamente para estar al tanto de cualquier cambio. La
              fecha de la última actualización aparecerá al final de este documento.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              Si realizamos cambios significativos en el tratamiento de tus datos personales, te notificaremos por
              correo electrónico o mediante un aviso destacado en nuestro sitio web.
            </p>
          </div>
        </div>
      </main>

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

      {/* Última actualización */}
      <div className="text-center text-gray-600">
        <p className="text-lg">
          <strong>Última actualización:</strong> 23 de octubre de 2025
        </p>
      </div>

      <FooterSection />
    </div>
  )
}
