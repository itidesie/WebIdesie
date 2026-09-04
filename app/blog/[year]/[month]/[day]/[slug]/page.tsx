import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, ArrowRight, Edit, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getBlogPostBySlugAndDate, getAllBlogPostsWithDates, getRelatedPosts, generatePostUrl } from "@/app/blog/actions"
import { notFound } from "next/navigation"
import { sanitizeHtml } from "@/lib/sanitize-html"
import { addHeadingIds } from "@/lib/extract-toc"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { ArticleToc } from "@/components/blog/article-toc"

interface BlogPostPageProps {
  params: Promise<{
    year: string
    month: string
    day: string
    slug: string
  }>
}

/** `getRelatedPosts()` usa `getBlogPosts()` internamente, que devuelve
 * `created_at` en ISO (el post principal, vía `getBlogPostBySlugAndDate`,
 * ya llega formateado) — mismo motivo que en app/blog/page.tsx. */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
}

export async function generateStaticParams() {
  const posts = await getAllBlogPostsWithDates()
  return posts.map((post) => {
    const date = new Date(post.created_at)
    return {
      year: date.getFullYear().toString(),
      month: String(date.getMonth() + 1).padStart(2, "0"),
      day: String(date.getDate()).padStart(2, "0"),
      slug: post.slug,
    }
  })
}

/**
 * Dirección "Cuaderno de Bitácora Técnico": titular serif, meta en Roboto
 * Mono, mini-índice lateral para artículos largos (extraído de los propios
 * h2/h3 del contenido) y "Artículos relacionados" por etiquetas compartidas
 * al final — antes no existía ninguna de las dos cosas. Ver CLAUDE.md.
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { year, month, day, slug } = await params
  const post = await getBlogPostBySlugAndDate(slug, year, month, day)

  if (!post) {
    notFound()
  }

  // El botón "Editar Artículo" solo debe verlo un admin con sesión activa —
  // antes se renderizaba para cualquier visitante público. Ver CLAUDE.md.
  const isAdmin = await isAdminAuthenticated()

  const sanitizedContent = sanitizeHtml(post.content)
  const { html: contentWithIds, toc } = addHeadingIds(sanitizedContent)

  const relatedPosts = await getRelatedPosts(post.slug, post.tags)
  const relatedUrls = await Promise.all(relatedPosts.map((p) => generatePostUrl(p)))

  const hasToc = toc.length >= 2

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <article className="container mx-auto px-6 md:px-8 py-12 md:py-20 max-w-5xl">
          <Button asChild variant="ghost" className="mb-8 text-[#006cff] hover:text-[#005bbd] group">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> Volver al Blog
            </Link>
          </Button>

          <div className={hasToc ? "grid lg:grid-cols-[1fr_14rem] gap-12" : "max-w-3xl mx-auto"}>
            <div>
              {post.featured_image_url && (
                <div className="relative w-full h-80 mb-8 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={post.featured_image_url || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <p className="bitacora-meta flex items-center gap-4 mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {post.created_at}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" /> {post.author}
                </span>
              </p>

              <h1 className="bitacora-headline text-4xl md:text-5xl text-gray-950 mb-6 leading-tight">
                {post.title}
              </h1>

              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-8 flex-wrap">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag.toLowerCase().replace(/ /g, "-"))}`}
                      className="bitacora-meta hover:text-[#006cff] transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              <div
                className="blog-content prose prose-lg max-w-none text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />

              {isAdmin && (
                <div className="mt-12 text-center">
                  <Button
                    asChild
                    className="px-8 py-3 text-lg bg-[#006cff] hover:bg-[#005bbd] text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    <Link href={`/admin/posts/edit/${post.slug}`}>
                      <Edit className="w-5 h-5 mr-2" /> Editar Artículo
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {hasToc && <ArticleToc entries={toc} />}
          </div>

          {relatedPosts.length > 0 && (
            <div className="max-w-3xl mx-auto mt-20 pt-12 border-t border-gray-200">
              <p className="bitacora-eyebrow mb-6">Artículos relacionados</p>
              <div className="grid sm:grid-cols-3 gap-6">
                {relatedPosts.map((related, index) => (
                  <Link key={related.id} href={relatedUrls[index]} className="bitacora-related-card block">
                    <p className="bitacora-meta mb-1.5">{formatDate(related.created_at)}</p>
                    <h3 className="bitacora-headline text-base text-gray-950 mb-2 leading-snug">{related.title}</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#006cff]">
                      Leer
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <FooterSection />
    </div>
  )
}
