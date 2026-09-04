import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <div className="mb-4 sm:mb-6">
              <Image
                src="/images/logo_idesie_azul.png"
                alt="IDESIE Business & Technology School"
                width={150}
                height={45}
                className="brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
              IDESIE Business & Technology School es una institucion lider en formacion especializada en BIM, tecnologia
              y gestion empresarial.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-[#006cff] transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="https://www.instagram.com/idesiebs/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#006cff] transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#006cff] transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Programas */}
          <div>
            <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-6 text-white">Programas</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/mbim-page" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  MBIM
                </Link>
              </li>
              <li>
                <Link href="/mbbe-page" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  MBBE
                </Link>
              </li>
              <li>
                <Link href="/mdee-page" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  MDEE
                </Link>
              </li>
              <li>
                <Link href="/embim-page" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  EMBIM
                </Link>
              </li>
              <li>
                <Link href="/short-courses-page" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  Cursos Cortos
                </Link>
              </li>
              <li>
                <Link href="/in-company-page" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  In Company
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-6 text-white">Recursos</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/bolsa-de-empleo-page" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  Bolsa de Empleo
                </Link>
              </li>
              <li>
                <Link
                  href="/financiacion-y-becas-page"
                  className="text-gray-300 hover:text-[#006cff] transition-colors"
                >
                  Financiación y Becas
                </Link>
              </li>
              <li>
                <Link
                  href="https://campusvirtual.idesie.com/"
                  className="text-gray-300 hover:text-[#006cff] transition-colors"
                >
                  Campus Virtual
                </Link>
              </li>
              <li>
                <Link href="/tienda" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  Tienda
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-6 text-white">Legal</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/politica-cookies" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidad" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/aviso-legal" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link href="/solicitud-baja" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  Solicitud de Baja
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-6 text-white">Contacto</h3>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#006cff] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  Calle San Aquilino 13
                  <br />
                  28029 Madrid, España
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#006cff] flex-shrink-0" />
                <Link href="tel:+34912345678" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  +34 91 234 56 78
                </Link>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#006cff] flex-shrink-0" />
                <Link href="mailto:info@idesie.com" className="text-gray-300 hover:text-[#006cff] transition-colors">
                  info@idesie.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="text-xs sm:text-sm text-gray-400 text-center">
              2025 IDESIE Business & Technology School. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
