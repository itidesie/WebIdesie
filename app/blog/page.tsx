import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { getBlogPosts, getAllTags, generatePostUrl } from "@/app/blog/actions"
import { sanitizeHtml } from "@/lib/sanitize-html"

export const metadata: Metadata = {
  title: "Blog | Noticias y Artículos del Sector AEC | IDESIE",
  description:
    "Blog especializado en BIM, construcción digital y tecnologías AEC. Artículos sobre Building Information Modeling, innovación en arquitectura e ingeniería, tendencias del sector construcción, análisis de herramientas BIM y casos de éxito. Mantente actualizado con IDESIE.",
  keywords:
    "blog BIM, noticias AEC, artículos construcción digital, tendencias BIM, innovación construcción, digitalización AEC",
  openGraph: {
    title: "Blog | Noticias y Artículos del Sector AEC | IDESIE",
    description:
      "Explora los últimos artículos, noticias y tendencias en Arquitectura, Ingeniería y Construcción (AEC), BIM, Digitalización e Innovación.",
    type: "website",
  },
}

/**
 * `getBlogPosts()` devuelve `created_at` en ISO (a diferencia de
 * `getBlogPostBySlug`/`getBlogPostsByTag`, que ya lo formatean) porque otros
 * consumidores (el sitemap, `getRelatedPosts`) necesitan hacer aritmética de
 * fechas con ese valor — formatear aquí, en la presentación, en vez de
 * cambiar el contrato de la función para todo el mundo.
 */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
}

function excerptOf(post: { excerpt: string; content: string }) {
  const raw = post.excerpt || post.content
  return sanitizeHtml(raw)
    .replace(/<[^>]*>/g, "")
    .substring(0, 180)
}

/**
 * Dirección "Cuaderno de Bitácora Técnico": el post más reciente se destaca
 * a tamaño grande, el resto vive en una lista compacta (no un grid uniforme
 * donde todos los posts pesan igual). Serif (Fraunces) para titulares,
 * Roboto Mono para fecha/autor/etiquetas. Ver CLAUDE.md.
 */
export default async function BlogPage() {
  const blogPosts = await getBlogPosts()
  const allTags = await getAllTags()

  const blogPostUrls = await Promise.all(blogPosts.map((post) => generatePostUrl(post)))

  const [featured, ...rest] = blogPosts
  const featuredUrl = blogPostUrls[0]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog IDESIE - Noticias y Artículos del Sector AEC",
    description:
      "Explora los últimos artículos, noticias y tendencias en Arquitectura, Ingeniería y Construcción (AEC), BIM, Digitalización e Innovación.",
    url: "https://idesie.com/blog",
    publisher: {
      "@type": "Organization",
      name: "IDESIE Business & Tech School",
      url: "https://idesie.com",
    },
    blogPost: blogPosts.map((post, index) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || post.content.split("\n")[0],
      url: `https://idesie.com${blogPostUrls[index]}`,
      datePublished: post.created_at,
      author: {
        "@type": "Person",
        name: post.author,
      },
    })),
  }

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Header />
      <main className="flex-grow" role="main">
        <section className="pt-32 md:pt-40 pb-10 md:pb-12 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <p className="bitacora-eyebrow mb-3">Cuaderno de bitácora</p>
            <h1 className="bitacora-headline text-4xl md:text-5xl text-gray-950 mb-4">Blog</h1>
            <p className="text-gray-600 max-w-xl">
              Noticias, análisis y tendencias del sector AEC, BIM y construcción digital.
            </p>
          </div>
        </section>

        {allTags.length > 0 && (
          <section className="border-b border-gray-100 py-5">
            <div className="max-w-4xl mx-auto px-6 md:px-8 flex items-center gap-3 flex-wrap">
              <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag.toLowerCase().replace(/ /g, "-"))}`}
                  className="bitacora-meta hover:text-[#006cff] transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="py-14 md:py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            {blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-2">No hay artículos publicados todavía.</p>
                <p className="text-gray-500">Aparecerán aquí una vez publicados desde el panel de administración.</p>
              </div>
            ) : (
              <>
                {/* Post destacado */}
                <Link href={featuredUrl} className="group block mb-16">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="relative h-56 md:h-72 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={featured.featured_image_url || "/placeholder.svg"}
                        alt={featured.title}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        priority
                      />
                    </div>
                    <div>
                      <p className="bitacora-meta flex items-center gap-4 mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> {formatDate(featured.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" /> {featured.author}
                        </span>
                      </p>
                      <h2 className="bitacora-headline text-2xl md:text-3xl text-gray-950 mb-3 group-hover:text-[#006cff] transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">{excerptOf(featured)}</p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#006cff]">
                        Leer artículo
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Lista compacta del resto */}
                {rest.length > 0 && (
                  <div>
                    {rest.map((post, index) => (
                      <Link key={post.id} href={blogPostUrls[index + 1]} className="bitacora-list-item group">
                        <p className="bitacora-meta whitespace-nowrap pt-1">{formatDate(post.created_at)}</p>
                        <div>
                          <h3 className="bitacora-headline text-xl text-gray-950 mb-1.5 group-hover:text-[#006cff] transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{excerptOf(post)}</p>
                          {post.tags.length > 0 && (
                            <p className="bitacora-meta mt-2">{post.tags.slice(0, 3).join(" · ")}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="py-14 md:py-16 bg-gray-950 text-white text-center">
          <div className="max-w-2xl mx-auto px-6 md:px-8">
            <h2 className="text-2xl font-bold mb-3">¿Interesado en más contenido?</h2>
            <p className="text-gray-300 mb-6">
              Suscríbete a nuestra newsletter para recibir las últimas novedades directamente en tu bandeja de
              entrada.
            </p>
            <Button asChild className="bg-[#006cff] hover:bg-[#0052cc] text-white rounded-lg px-6 py-3">
              <Link href="/contact-page">
                Suscríbete <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
