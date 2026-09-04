import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Linkedin } from "lucide-react"

export default function FooterSection() {
  return (
    <footer className="bg-black text-white py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
        <div className="flex flex-col items-start">
          <Image
            src="/images/idesie-logo-footer.jpg"
            alt="IDESIE Business & Technology School Logo"
            width={180}
            height={70}
            className="mb-4"
          />
          <p className="text-base text-gray-400">
            © 2025 IDESIE Business & Technology School. Todos los derechos reservados.
          </p>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Programas</h3>
          <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
            <li>
              <Link href="/mbim-page" className="hover:underline hover:text-white transition-colors">
                Master BIM
              </Link>
            </li>
            <li>
              <Link href="/mbim-online-page" className="hover:underline hover:text-white transition-colors">
                Master Online
              </Link>
            </li>
            <li>
              <Link href="/short-courses-page" className="hover:underline hover:text-white transition-colors">
                Cursos Cortos
              </Link>
            </li>
            <li>
              <Link href="/in-company-page" className="hover:underline hover:text-white transition-colors">
                Formación In Company
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Enlaces Rápidos</h3>
          <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
            <li>
              <Link href="/financiacion-y-becas-page" className="hover:underline hover:text-white transition-colors">
                Admisiones
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:underline hover:text-white transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/bolsa-de-empleo-page" className="hover:underline hover:text-white transition-colors">
                Bolsa de Empleo
              </Link>
            </li>
            <li>
              <Link href="/contact-page" className="hover:underline hover:text-white transition-colors">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Legal</h3>
          <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
            <li>
              <Link
                href="/politica-cookies-page"
                scroll={true}
                className="hover:underline hover:text-white transition-colors"
              >
                Política de Cookies
              </Link>
            </li>
            <li>
              <Link
                href="/politica-privacidad-page"
                scroll={true}
                className="hover:underline hover:text-white transition-colors"
              >
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link
                href="/aviso-legal-page"
                scroll={true}
                className="hover:underline hover:text-white transition-colors"
              >
                Aviso Legal
              </Link>
            </li>
            <li>
              <Link
                href="/solicitud-baja-page"
                scroll={true}
                className="hover:underline hover:text-white transition-colors"
              >
                Solicitud de Baja
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Síguenos</h3>
          <div className="flex space-x-5">
            <Link
              href="https://www.instagram.com/idesiebs/"
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              data-magnetic-strength="0.2"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram className="w-7 h-7" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://www.facebook.com/idesie/"
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              data-magnetic-strength="0.2"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Facebook className="w-7 h-7" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://www.linkedin.com/school/idesie-business-school/"
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              data-magnetic-strength="0.2"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-7 h-7" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
