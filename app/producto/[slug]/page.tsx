import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import { FichaContent } from "@/components/producto/ficha-content"
import { FichaSidebar } from "@/components/producto/ficha-sidebar"
import { AddToCartButton } from "@/components/add-to-cart-button"
import Image from "next/image"
import Link from "next/link"

async function getProductBySlug(slug: string) {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Productos", `ficha simulada → ${slug}`)
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug && p.activo)
    if (!product) return null
    return { ...product, precio: product.precio_actual, imagen_principal: product.imagen }
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("productos").select("*").eq("slug", slug).eq("activo", true).limit(1)
    if (error) throw error
    const product = data?.[0]
    if (!product) return null
    return { ...product, precio: product.precio_actual, imagen_principal: product.imagen }
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: "Producto no encontrado" }
  }

  const title = `${product.nombre} | Tienda IDESIE`
  const description =
    product.descripcion_corta ||
    (product.descripcion_larga ? product.descripcion_larga.slice(0, 160) : `${product.nombre} — formación certificada por IDESIE.`)
  const image = product.imagen_principal || "/images/hero-background.jpg"

  return {
    title,
    description,
    alternates: { canonical: `/producto/${slug}` },
    openGraph: {
      title,
      description,
      url: `/producto/${slug}`,
      type: "website",
      locale: "es_ES",
      siteName: "IDESIE Business & Technology School",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.imagen_alt || product.nombre,
        },
      ],
    },
  }
}

/**
 * Formas de datos reales, sin campos fantasma. Antes `getDirigidoA` y
 * `getObjetivos` aliasaban la misma columna (`perfil`, `objetivo`) a la vez
 * como `titulo` y como `descripcion` — el mismo texto se mostraba dos veces,
 * una en negrita y otra en gris. `getRequisitos` inyectaba un `tipo` que no
 * existe como columna (siempre `'previos'`), agrupando visualmente algo que
 * nunca estuvo agrupado en los datos. Se simplifican a listas planas de
 * texto, que es lo que estas tres tablas realmente son. Ver CLAUDE.md.
 */

/**
 * Antes era un solo `SELECT` con `LEFT JOIN modulo_temas` + `json_agg`. El
 * embedding anidado de PostgREST (`producto_modulos → modulo_temas`) hace lo
 * mismo declarativamente: una sola llamada, sin N+1. `duracion` no es (ni
 * fue nunca) una columna real de esta tabla — no se declara ni se muestra.
 */
async function getModulos(productId: number) {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Productos", `módulos simulados (vacío) → producto ${productId}`)
    return []
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("producto_modulos")
      .select("id, titulo, descripcion, orden, temas:modulo_temas(titulo, orden)")
      .eq("producto_id", productId)
      .order("orden", { ascending: true })
      .order("orden", { ascending: true, referencedTable: "modulo_temas" })
    if (error) throw error

    return (data ?? []).map((m) => ({
      id: m.id,
      titulo: m.titulo,
      descripcion: m.descripcion,
      temas: Array.isArray(m.temas) ? m.temas.map((t: { titulo: string }) => t.titulo) : [],
    }))
  } catch (error) {
    console.error("Error fetching modulos:", error)
    return []
  }
}

async function getDirigidoA(productId: number): Promise<string[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) return []
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("producto_dirigido")
      .select("perfil")
      .eq("producto_id", productId)
      .order("orden", { ascending: true })
    if (error) throw error
    return (data ?? []).map((r) => r.perfil)
  } catch (error) {
    console.error("Error fetching dirigido:", error)
    return []
  }
}

async function getObjetivos(productId: number): Promise<string[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) return []
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("producto_objetivos")
      .select("objetivo")
      .eq("producto_id", productId)
      .order("orden", { ascending: true })
    if (error) throw error
    return (data ?? []).map((r) => r.objetivo)
  } catch (error) {
    console.error("Error fetching objetivos:", error)
    return []
  }
}

async function getFAQs(productId: number) {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) return []
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("producto_faqs")
      .select("id, pregunta, respuesta")
      .eq("producto_id", productId)
      .order("orden", { ascending: true })
    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error("Error fetching faqs:", error)
    return []
  }
}

async function getRequisitos(productId: number): Promise<string[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) return []
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("producto_requisitos")
      .select("requisito")
      .eq("producto_id", productId)
      .order("orden", { ascending: true })
    if (error) throw error
    return (data ?? []).map((r) => r.requisito)
  } catch (error) {
    console.error("Error fetching requisitos:", error)
    return []
  }
}

async function getTestimonios(productId: number) {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) return []
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("producto_testimonios")
      .select("id, nombre, cargo, testimonio")
      .eq("producto_id", productId)
      .order("orden", { ascending: true })
    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error("Error fetching testimonios:", error)
    return []
  }
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const modulos = await getModulos(product.id)
  const dirigidoA = await getDirigidoA(product.id)
  const objetivos = await getObjetivos(product.id)
  const faqs = await getFAQs(product.id)
  const requisitos = await getRequisitos(product.id)
  const testimonios = await getTestimonios(product.id)

  const duracion = product.duracion_meses
    ? `${product.duracion_meses} meses`
    : product.duracion_horas
      ? `${product.duracion_horas} h`
      : null

  // Navegación por anclas: solo las secciones que de verdad tienen
  // contenido — igual que antes decidía qué pestañas mostrar, pero ahora
  // todas las secciones con datos están montadas en el DOM.
  const sections = [
    { id: "descripcion", label: "Descripción" },
    ...(modulos.length > 0 ? [{ id: "programa", label: "Programa" }] : []),
    ...(dirigidoA.length > 0 ? [{ id: "dirigido", label: "Perfil" }] : []),
    ...(objetivos.length > 0 ? [{ id: "objetivos", label: "Objetivos" }] : []),
    ...(requisitos.length > 0 ? [{ id: "requisitos", label: "Requisitos" }] : []),
    ...(testimonios.length > 0 ? [{ id: "testimonios", label: "Testimonios" }] : []),
    ...(faqs.length > 0 ? [{ id: "faqs", label: "FAQ" }] : []),
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero — solo identidad y foto. Precio, CTA y datos técnicos viven
            en la barra lateral, que se queda fija mientras se lee el resto
            de la ficha, en vez de desaparecer nada más bajar. */}
        <section className="relative bg-gray-950 pt-32 md:pt-40 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="catalogo-mono inline-block bg-[#006cff] text-white text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded">
                    {product.tipo}
                  </span>
                  {product.destacado && (
                    <span className="catalogo-mono inline-block bg-amber-500 text-white text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded">
                      Destacado
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{product.nombre}</h1>

                {product.descripcion_corta && (
                  <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed max-w-lg">
                    {product.descripcion_corta}
                  </p>
                )}

                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {duracion && (
                    <div className="flex items-baseline gap-2">
                      <span className="catalogo-mono text-xs uppercase tracking-wide text-gray-500">Duración</span>
                      <span className="catalogo-mono text-sm font-semibold text-white">{duracion}</span>
                    </div>
                  )}
                  {product.modalidad && (
                    <div className="flex items-baseline gap-2">
                      <span className="catalogo-mono text-xs uppercase tracking-wide text-gray-500">Modalidad</span>
                      <span className="catalogo-mono text-sm font-semibold text-white">{product.modalidad}</span>
                    </div>
                  )}
                  {product.certificacion && (
                    <div className="flex items-baseline gap-2">
                      <span className="catalogo-mono text-xs uppercase tracking-wide text-gray-500">
                        Certificación
                      </span>
                      <span className="text-sm font-semibold text-white">{product.certificacion}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative order-first lg:order-last">
                <div className="relative h-56 md:h-80 lg:h-[26rem] rounded-lg overflow-hidden">
                  {product.imagen_principal ? (
                    <Image
                      src={product.imagen_principal}
                      alt={product.imagen_alt || product.nombre}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#006cff] via-blue-600 to-blue-700" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido + barra lateral fija */}
        <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_18rem] gap-12">
            <FichaContent
              tipo={product.tipo}
              descripcionLarga={product.descripcion_larga}
              modulos={modulos}
              dirigidoA={dirigidoA}
              objetivos={objetivos}
              requisitos={requisitos}
              testimonios={testimonios}
              faqs={faqs}
            />

            <FichaSidebar
              producto={{
                id: product.id,
                nombre: product.nombre,
                tipo: product.tipo,
                precio: product.precio,
                precio_original: product.precio_original,
                precio_matricula: product.precio_matricula,
                imagen: product.imagen_principal,
              }}
              sections={sections}
            />
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gray-950 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">¿Listo para empezar?</h2>
            <p className="text-gray-300 mb-6 md:mb-8">Inscríbete ahora y comienza tu formación profesional</p>
            {product.precio == null ? (
              <Link
                href={`/contact-page?motivo=asesoria&programa=${encodeURIComponent(product.nombre)}`}
                className="inline-block bg-[#006cff] hover:bg-[#0052cc] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Contactar para más información
              </Link>
            ) : (
              <AddToCartButton
                product={{ id: product.id, name: product.nombre, price: product.precio, category: product.tipo }}
                className="bg-[#006cff] hover:bg-[#0052cc] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              />
            )}
            <p className="text-sm text-gray-400 mt-6">
              ¿Tienes dudas? Contáctanos en{" "}
              <a href="mailto:info@idesie.com" className="underline hover:text-white">
                info@idesie.com
              </a>{" "}
              o llama al +34 915 39 47 82
            </p>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  )
}
