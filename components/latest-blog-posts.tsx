"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  author: string
  featured_image_url: string | null
  created_at: string
  tags: string[]
}

function stripHtml(html: string, truncate = true): string {
  if (!html) return ""

  try {
    let text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim()

    if (!truncate) return text
    return text.length > 150 ? text.substring(0, 150) + "..." : text
  } catch (error) {
    return ""
  }
}

function generatePostUrl(post: { created_at: string; slug: string }): string {
  const date = new Date(post.created_at)
  if (isNaN(date.getTime())) {
    const now = new Date()
    return `/blog/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}/${post.slug}`
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `/blog/${year}/${month}/${day}/${post.slug}`
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
  } catch (error) {
    return "Fecha no disponible"
  }
}

export default function LatestBlogPosts({ count = 3 }: { count?: number }) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`/api/blog/latest?count=${count}`)
        const data = await response.json()
        setPosts(data || [])
      } catch (error) {
        console.error("[v0] Error fetching posts:", error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [count])

  if (loading) {
    return null
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-300 text-lg">No hay artículos disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link key={post.id} href={generatePostUrl(post)}>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl group h-full">
            <div className="aspect-video bg-gradient-to-br from-gray-600 to-gray-800 rounded-t-lg relative overflow-hidden">
              {post.featured_image_url ? (
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 text-4xl font-bold">
                  BIM
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              {post.tags && post.tags.length > 0 && (
                <div className="absolute bottom-3 left-3 bg-[#006cff] text-white px-2 py-1 rounded text-xs font-semibold uppercase">
                  {post.tags[0]}
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <h4 className="font-semibold text-white mb-3 text-base leading-tight group-hover:text-cyan-300 transition-colors line-clamp-2">
                {stripHtml(post.title, false)}
              </h4>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{stripHtml(post.excerpt)}</p>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
