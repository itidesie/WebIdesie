import type { MetadataRoute } from "next"
import { getBlogPosts, generatePostUrl } from "./blog/actions"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock } from "@/lib/mock-mode"
import { MOCK_PRODUCTS } from "@/lib/mock-data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://idesie.com"

  // Get dynamic blog posts
  let blogPosts: Awaited<ReturnType<typeof getBlogPosts>> = []
  try {
    blogPosts = await getBlogPosts()
  } catch (error) {
    console.error("[v0] Error fetching blog posts for sitemap:", error)
    // Continue with empty blog posts array
  }

  // Get active products (mismo criterio que /api/productos: solo `activo = true`)
  let products: Array<{ slug: string; updated_at?: string | null }> = []
  try {
    if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
      products = MOCK_PRODUCTS.filter((p) => p.activo).map((p) => ({ slug: p.slug }))
    } else {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase.from("productos").select("slug, updated_at").eq("activo", true)
      if (error) throw error
      products = data ?? []
    }
  } catch (error) {
    console.error("[v0] Error fetching products for sitemap:", error)
    // Continue with empty products array
  }

  // Static pages
  const staticPages = [
    // Homepage - Highest priority
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },

    // Main programs - Very high priority
    {
      url: `${baseUrl}/mbim-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mbim-online-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/embim-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mbbe-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },

    // Services - High priority
    {
      url: `${baseUrl}/short-courses-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/empresas-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bim-consulting-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/in-company-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },

    // About - Medium-high priority
    {
      url: `${baseUrl}/sobre-idesie-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/nuestra-metodologia-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/profesores-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/alumni-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/alianzas-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/opiniones-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },

    // Student resources - Medium priority
    {
      url: `${baseUrl}/financiacion-y-becas-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/bolsa-de-empleo-page`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/comparativa-masters-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },

    // Tienda - Medium priority
    {
      url: `${baseUrl}/tienda`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },

    // Contact - Medium priority
    {
      url: `${baseUrl}/contact-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },

    // Legal pages - Low priority
    {
      url: `${baseUrl}/politica-privacidad-page`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-cookies-page`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/aviso-legal-page`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/solicitud-baja-page`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ]

  // Dynamic blog post pages — misma URL con fecha (`/blog/{year}/{month}/{day}/{slug}`)
  // que usa la página real (`app/blog/[year]/[month]/[day]/[slug]/page.tsx`).
  // Antes se generaba `/blog/{slug}` (un solo segmento), que ni siquiera es una
  // ruta real — desde que se corrigió el redirect de comodín (CLAUDE.md §2),
  // esa URL hace 308 a `/blog` en vez de servir el post.
  const blogPages = await Promise.all(
    blogPosts
      .filter((post) => post.slug) // Only include posts with valid slugs
      .map(async (post) => {
        // Validate and create a proper date
        let lastModified = new Date()
        try {
          const postDate = new Date(post.updated_at || post.created_at)
          // Check if date is valid
          if (!isNaN(postDate.getTime())) {
            lastModified = postDate
          }
        } catch (error) {
          // Use current date as fallback
          console.error("[v0] Invalid date for post:", post.slug)
        }

        const postUrl = await generatePostUrl({ created_at: post.created_at, slug: post.slug })

        return {
          url: `${baseUrl}${postUrl}`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }
      }),
  )

  // Dynamic product pages — solo productos activos, mismo criterio que /tienda.
  const productPages = products
    .filter((product) => product.slug)
    .map((product) => {
      let lastModified = new Date()
      if (product.updated_at) {
        const updatedDate = new Date(product.updated_at)
        if (!isNaN(updatedDate.getTime())) lastModified = updatedDate
      }
      return {
        url: `${baseUrl}/producto/${product.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }
    })

  return [...staticPages, ...blogPages, ...productPages]
}
