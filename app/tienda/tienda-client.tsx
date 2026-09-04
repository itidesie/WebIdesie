"use client"

import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Producto } from "@/app/tienda/actions"
import { CatalogoGrid } from "@/components/tienda/catalogo-grid"

interface TiendaClientProps {
  productos: Producto[]
}

/**
 * Dirección "El Catálogo Técnico": la tienda no vende una experiencia, deja
 * comparar y elegir. Sin hero de marketing con cifras grandes, sin sección
 * de testimonios genéricos — el catálogo mismo es la página. Ver CLAUDE.md.
 */
export default function TiendaClient({ productos }: TiendaClientProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section className="pt-32 md:pt-40 pb-10 md:pb-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="catalogo-eyebrow mb-3">Catálogo</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 mb-3 max-w-2xl">
              Másteres y cursos especializados en BIM
            </h1>
            <p className="text-gray-600 max-w-xl">
              Compara duración, modalidad y certificación de cada programa antes de elegir.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {productos.length === 0 ? (
              <div className="catalogo-filter-panel p-12 text-center text-gray-500">
                No hay programas publicados todavía.
              </div>
            ) : (
              <CatalogoGrid productos={productos} />
            )}
          </div>
        </section>

        <section className="py-14 md:py-16 bg-gray-950 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">¿No sabes cuál elegir?</h2>
            <p className="text-gray-300 mb-6">
              Cuéntanos tu perfil y te decimos con franqueza qué programa encaja contigo.
            </p>
            <Link
              data-magnetic
              href="/contact-page"
              style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}
              className="btn-sweep inline-flex items-center gap-2 bg-[#006cff] hover:bg-[#0052cc] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Contactar con un asesor
              <ArrowRight className="btn-arrow w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  )
}
