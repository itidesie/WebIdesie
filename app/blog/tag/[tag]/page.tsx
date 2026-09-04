import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, User, Tag as TagIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { getBlogPostsByTag, getAllTags, generatePostUrl } from "@/app/blog/actions"
import { sanitizeHtml } from "@/lib/sanitize-html"
import { notFound } from "next/navigation"

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({
    tag: tag.toLowerCase().replace(/ /g, '-')
  }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const tagName = decodeURIComponent(tag).replace(/-/g, ' ')
  
  return {
    title: `${tagName} | Blog IDESIE`,
    description: `Artículos sobre ${tagName} en el sector AEC, BIM y construcción digital.`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const tagSlug = decodeURIComponent(tag)
  const allTags = await getAllTags()
  
  // Find the actual tag name (case-insensitive match)
  const actualTag = allTags.find(t => t.toLowerCase().replace(/ /g, '-') === tagSlug.toLowerCase())
  
  if (!actualTag) {
    notFound()
  }
  
  const posts = await getBlogPostsByTag(actualTag)
  const postUrls = await Promise.all(
    posts.map((post) => generatePostUrl(post))
  )

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow" role="main">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-20 bg-gradient-to-r from-[#006cff] to-[#005bbd] text-white">
          <div className="container mx-auto px-6 md:px-8 max-w-5xl text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TagIcon className="w-8 h-8" />
              <h1 className="text-4xl md:text-5xl font-extrabold">
                {actualTag}
              </h1>
            </div>
            <p className="text-lg md:text-xl opacity-90">
              {posts.length} {posts.length === 1 ? 'artículo' : 'artículos'} sobre {actualTag}
            </p>
          </div>
        </section>

        {/* Posts Section */}
        <section className="w-full py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-6 md:px-8 max-w-5xl">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">No hay artículos con esta categoría todavía.</p>
                <Button asChild className="mt-4">
                  <Link href="/blog">
                    <ArrowRight className="mr-2 w-4 h-4" /> Ver todos los artículos
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => {
                  const cleanExcerpt = post.excerpt
                    ? sanitizeHtml(post.excerpt)
                        .replace(/<[^>]*>/g, "")
                        .substring(0, 150)
                    : sanitizeHtml(post.content)
                        .replace(/<[^>]*>/g, "")
                        .substring(0, 150)

                  const postUrl = postUrls[index]

                  return (
                    <Card
                      key={post.id}
                      className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white border border-gray-200"
                    >
                      <div className="relative w-full h-56">
                        <Image
                          src={post.featured_image_url || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="p-6">
                        <CardTitle className="text-2xl font-bold text-gray-900">{post.title}</CardTitle>
                        <CardDescription className="text-gray-600 text-sm mt-2 flex items-center space-x-4">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" /> {post.created_at}
                          </span>
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" /> {post.author}
                          </span>
                        </CardDescription>
                        {/* Other tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className={`px-2 py-1 rounded text-xs ${
                                  tag === actualTag
                                    ? 'bg-[#006cff] text-white'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-6 pt-0 mt-auto">
                        <p className="text-gray-800 mb-4 line-clamp-3">{cleanExcerpt}</p>
                        <Button
                          asChild
                          variant="link"
                          className="text-[#006cff] hover:text-[#005bbd] py-2 px-0 font-semibold flex items-center group transition-colors duration-300"
                        >
                          <Link href={postUrl}>
                            Leer Más{" "}
                            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* All Tags */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Todas las categorías:</h3>
              <div className="flex gap-3 flex-wrap">
                {allTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag.toLowerCase().replace(/ /g, '-'))}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      tag === actualTag
                        ? 'bg-[#006cff] text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Back to Blog */}
        <section className="w-full py-12 bg-white text-center">
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto mx-auto bg-transparent">
            <Link href="/blog">
              ← Volver al Blog
            </Link>
          </Button>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
