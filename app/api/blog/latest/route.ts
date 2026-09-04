import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { MOCK_BLOG_POSTS } from "@/lib/mock-data"
import { sanitizeToPlainText } from "@/lib/sanitize-html"

const AVAILABLE_IMAGES = [
  "/images/3d-building-monitor.jpg",
  "/images/alumnos_clase.jpg",
  "/images/clase_bim_2.jpg",
  "/images/estudiantes_proyecto_grupal.jpg",
  "/images/hero-idesie-classroom.jpg",
  "/images/hero_image_building_information_modeling_idesie.jpg",
  "/images/project_modelado_ingenieria.jpg",
  "/images/teamwork-meeting.jpg",
  "/images/team-analyzing-plans.jpg",
  "/images/trabajo_conjunto.jpg",
  "/images/blog_hero_image.jpg",
]

// 🔒 2026-09-04 (42) — el regex propio se sustituyó por
// `sanitizeToPlainText()` (DOMPurify de verdad, vía `lib/sanitize-html.tsx`)
// — era una segunda reimplementación de la misma idea que `sanitizeHtml()`,
// con sus propias lagunas. `title`/`excerpt` no deben llevar HTML en
// absoluto, así que se reducen a texto plano, no a HTML "enriquecido".

export async function GET(request: NextRequest) {
  try {
    const count = request.nextUrl.searchParams.get("count") || "3"
    const limit = Math.min(parseInt(count), 50)

    let posts: { id: number; title: string; slug: string; excerpt: string; author: string; created_at: string; tags: string[] }[]

    if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
      logMock("Blog", `últimos ${limit} posts simulados`)
      posts = [...MOCK_BLOG_POSTS]
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
        .slice(0, limit)
        .map((p) => ({ ...p, created_at: p.created_at.toISOString() }))
    } else {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, author, created_at, tags")
        .order("created_at", { ascending: false })
        .limit(limit)
      if (error) throw error
      posts = data ?? []
    }

    // Asignar imágenes sin repeticiones
    let lastImage = ""
    const postsWithImages = posts.map((post, index) => {
      let image = AVAILABLE_IMAGES[index % AVAILABLE_IMAGES.length]
      
      // Si es igual a la anterior, usar la siguiente
      if (image === lastImage) {
        image = AVAILABLE_IMAGES[(index + 1) % AVAILABLE_IMAGES.length]
      }
      
      lastImage = image
      
      return {
        ...post,
        title: sanitizeToPlainText(post.title || ""),
        excerpt: sanitizeToPlainText(post.excerpt || ""),
        featured_image_url: image,
      }
    })

    return NextResponse.json(postsWithImages)
  } catch (error) {
    console.error("[v0] Error fetching latest blog posts:", error)
    return NextResponse.json([], { status: 200 })
  }
}
