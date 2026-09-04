"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { MOCK_BLOG_POSTS, MOCK_TAGS, type MockBlogPost } from "@/lib/mock-data"
import { verifyAdminSecret } from "@/lib/admin-secret"

export interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  slug: string
  author: string
  published: boolean
  featured_image_url: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

interface ActionResult {
  success: boolean
  message: string
  data?: any
}

/**
 * Mapea un post mock al mismo formato que devuelve Supabase. Se preserva a
 * propósito el comportamiento de siempre: `published` se fuerza a `true` sin
 * mirar el dato real — ver la nota en `getBlogPosts()` más abajo.
 */
function mapMockPost(post: MockBlogPost): BlogPost {
  return {
    ...post,
    published: true,
    created_at: post.created_at.toISOString(),
    updated_at: post.updated_at.toISOString(),
  }
}

const sortedMockPosts = () => [...MOCK_BLOG_POSTS].sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

async function verifySecretKey(secretKey: string): Promise<boolean> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    // Igual que antes de migrar: nunca se simula una clave válida. Un mock que
    // devolviera éxito sería un bypass de autenticación.
    logMock("Admin", "verificación de clave simulada — siempre inválida")
    return false
  }
  try {
    // Delegado a lib/admin-secret.ts: es la misma verificación (bcrypt +
    // migración perezosa de contraseñas heredadas) que usa el login en
    // /api/admin/auth. Antes esta función tenía su propia comparación en
    // texto plano, duplicada — cuando se migró el login a bcrypt esta copia
    // se quedó rota (comparaba en claro contra un hash ya migrado), y crear/
    // editar/borrar posts empezaba a fallar en cuanto un admin iniciaba
    // sesión. No reimplementar la comparación aquí ni en ningún otro sitio.
    const matchedId = await verifyAdminSecret(secretKey)
    return matchedId !== null
  } catch (error) {
    console.error("[blog] Error verifying secret key:", error)
    return false
  }
}

// Helper para formatear fecha
function formatDateForDisplay(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Helper para generar URL con fecha
export async function generatePostUrl(post: { created_at: string | Date; slug: string }): Promise<string> {
  const date = new Date(post.created_at)

  if (isNaN(date.getTime())) {
    // Fallback to current date if invalid
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `/blog/${year}/${month}/${day}/${post.slug}`
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `/blog/${year}/${month}/${day}/${post.slug}`
}

const POST_COLUMNS = "id, title, content, excerpt, slug, author, featured_image_url, tags, created_at, updated_at"

/**
 * ⚠️ No filtra por `published` — trae todas las filas y fuerza
 * `published: true` en la respuesta, pase lo que pase el dato real. Así se
 * comportaba ya antes de migrar a Supabase (comprobado antes de mover el
 * código) y se decidió preservarlo tal cual, no corregirlo de paso. Si algún día
 * se quiere que el blog público solo muestre posts publicados de verdad,
 * añadir `.eq("published", true)` aquí — la RLS de `blog_posts`
 * (`scripts/022`) ya lo exige para lecturas con la `anon` key; esta función
 * usa `service_role` (bypassa RLS) precisamente para mantener el
 * comportamiento actual.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Blog", "listado de posts simulado")
    return sortedMockPosts().map(mapMockPost)
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("blog_posts").select(POST_COLUMNS).order("created_at", { ascending: false })
    if (error) throw error

    return (data ?? []).map((post) => ({
      ...post,
      created_at: new Date(post.created_at).toISOString(),
      updated_at: new Date(post.updated_at).toISOString(),
      tags: Array.isArray(post.tags) ? post.tags : [],
      published: true,
    }))
  } catch (error) {
    console.error("[blog] Error fetching blog posts:", error)
    return []
  }
}

export async function getAllBlogPostsWithDates(): Promise<BlogPost[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Blog", "listado de posts (con fechas raw) simulado")
    return sortedMockPosts().map((post) => ({
      ...post,
      published: true,
      created_at: post.created_at.toISOString(),
      updated_at: post.updated_at.toISOString(),
    })) as unknown as BlogPost[]
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("blog_posts").select(POST_COLUMNS).order("created_at", { ascending: false })
    if (error) throw error

    return (data ?? []).map((post) => ({
      ...post,
      published: true,
      featured_image_url: post.featured_image_url || null,
      tags: Array.isArray(post.tags) ? post.tags : [],
      created_at: post.created_at, // Devolver fecha raw para generar URLs
      updated_at: post.updated_at,
    }))
  } catch (error) {
    console.error("[blog] Error fetching blog posts with dates:", error)
    return []
  }
}

export async function getBlogPostBySlugAndDate(
  slug: string,
  year: string,
  month: string,
  day: string,
): Promise<BlogPost | null> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Blog", `post simulado por slug+fecha → ${slug}`)
    const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug)
    return post ? { ...mapMockPost(post), created_at: formatDateForDisplay(post.created_at), updated_at: formatDateForDisplay(post.updated_at) } : null
  }
  try {
    const startDate = new Date(`${year}-${month}-${day}T00:00:00Z`)
    const endDate = new Date(`${year}-${month}-${day}T23:59:59Z`)

    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_COLUMNS)
      .eq("slug", slug)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .limit(1)
    if (error) throw error

    const post = data?.[0]
    if (!post) return null

    return {
      ...post,
      published: true,
      featured_image_url: post.featured_image_url || null,
      tags: Array.isArray(post.tags) ? post.tags : [],
      created_at: formatDateForDisplay(post.created_at),
      updated_at: formatDateForDisplay(post.updated_at),
    }
  } catch (error) {
    console.error("[blog] Error fetching blog post:", error)
    return null
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Blog", `post simulado por slug → ${slug}`)
    const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug)
    return post ? { ...mapMockPost(post), created_at: formatDateForDisplay(post.created_at), updated_at: formatDateForDisplay(post.updated_at) } : null
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("blog_posts").select(POST_COLUMNS).eq("slug", slug).limit(1)
    if (error) throw error

    const post = data?.[0]
    if (!post) return null

    return {
      ...post,
      published: true,
      featured_image_url: post.featured_image_url || null,
      tags: Array.isArray(post.tags) ? post.tags : [],
      created_at: formatDateForDisplay(post.created_at),
      updated_at: formatDateForDisplay(post.updated_at),
    }
  } catch (error) {
    console.error("[blog] Error fetching blog post:", error)
    return null
  }
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Blog", `posts simulados por tag → ${tag}`)
    return sortedMockPosts()
      .filter((p) => p.tags.includes(tag))
      .map((post) => ({ ...mapMockPost(post), created_at: formatDateForDisplay(post.created_at), updated_at: formatDateForDisplay(post.updated_at) }))
  }
  try {
    const supabase = getSupabaseServerClient()
    // `.contains()` con un array JS lo serializa como literal de array de
    // Postgres (`{tag}`), válido para columnas `text[]` pero no para `jsonb`
    // (nuestro caso): PostgREST intenta parsear cada elemento sin comillas
    // como JSON y falla ("Token ... is invalid"). Hay que pasar el propio
    // JSON codificado para que el operador `cs` (`@>`) lo compare como jsonb.
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_COLUMNS)
      .filter("tags", "cs", JSON.stringify([tag]))
      .order("created_at", { ascending: false })
    if (error) throw error

    return (data ?? []).map((post) => ({
      ...post,
      published: true,
      featured_image_url: post.featured_image_url || null,
      tags: Array.isArray(post.tags) ? post.tags : [],
      created_at: formatDateForDisplay(post.created_at),
      updated_at: formatDateForDisplay(post.updated_at),
    }))
  } catch (error) {
    console.error("[blog] Error fetching posts by tag:", error)
    return []
  }
}

/**
 * Posts relacionados por etiquetas compartidas, para el cierre del
 * artículo. Reutiliza `getBlogPosts()` (todos los posts) y puntúa por
 * número de etiquetas en común en vez de una consulta SQL aparte — con el
 * volumen de posts de este blog no compensa una consulta más compleja
 * (mismo criterio que ya justifica `getAllTags()` más abajo).
 */
export async function getRelatedPosts(currentSlug: string, tags: string[], limit = 3): Promise<BlogPost[]> {
  if (tags.length === 0) return []

  const allPosts = await getBlogPosts()

  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      post,
      shared: post.tags.filter((tag) => tags.includes(tag)).length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared || new Date(b.post.created_at).getTime() - new Date(a.post.created_at).getTime())
    .slice(0, limit)
    .map(({ post }) => post)
}

/**
 * Antes era `SELECT DISTINCT UNNEST(tags)...` en una sola consulta SQL. El
 * cliente de Supabase no tiene un equivalente directo a UNNEST, así que se
 * trae la columna `tags` de todos los posts y se aplana/deduplica en JS —
 * el volumen de posts de este blog no justifica una función de Postgres
 * aparte solo para esto.
 */
export async function getAllTags(): Promise<string[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Blog", "listado de tags simulado")
    return [...MOCK_TAGS].sort()
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("blog_posts").select("tags").not("tags", "is", null)
    if (error) throw error

    const tags = new Set<string>()
    for (const row of data ?? []) {
      if (Array.isArray(row.tags)) row.tags.forEach((t: string) => tags.add(t))
    }
    return Array.from(tags).sort()
  } catch (error) {
    console.error("[blog] Error fetching tags:", error)
    return []
  }
}

export async function createBlogPost(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const slug = formData.get("slug") as string
  const author = (formData.get("author") as string) || "IDESIE Team"
  const featuredImageUrl = formData.get("featuredImageUrl") as string
  const tagsString = formData.get("tags") as string

  const isValidKey = await verifySecretKey(secretKey)
  if (!isValidKey) {
    return { success: false, message: "Clave secreta inválida." }
  }

  if (!title || !content || !slug) {
    return { success: false, message: "Título, contenido y slug son requeridos." }
  }

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    // No llegaríamos aquí de todos modos: verifySecretKey() ya deniega en
    // modo mock. Este bloque es solo para que el mensaje de error, si algún
    // día verifySecretKey cambia, sea explícito en vez de un fallo genérico.
    return { success: false, message: "Modo mock: no se pueden crear artículos sin conexión a Supabase." }
  }

  try {
    const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []
    const supabase = getSupabaseServerClient()

    const { data: existingPost } = await supabase.from("blog_posts").select("id").eq("slug", slug).limit(1)
    if (existingPost && existingPost.length > 0) {
      return { success: false, message: "Ya existe un artículo con ese slug." }
    }

    const { data: newPost, error } = await supabase
      .from("blog_posts")
      .insert({
        title,
        content,
        excerpt,
        slug,
        author,
        featured_image_url: featuredImageUrl || null,
        tags,
      })
      .select(POST_COLUMNS)
      .single()
    if (error) throw error

    revalidatePath("/blog")
    revalidatePath("/admin/posts")

    // Revalidar URL con fecha
    const date = new Date(newPost.created_at)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    revalidatePath(`/blog/${year}/${month}/${day}/${slug}`)

    return {
      success: true,
      message: "Artículo creado correctamente.",
      data: newPost,
    }
  } catch (error) {
    console.error("[blog] Error creating blog post:", error)
    return {
      success: false,
      message: `Error al crear el artículo: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}

export async function updateBlogPost(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  const slug = formData.get("slug") as string
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const author = formData.get("author") as string
  const featuredImageUrl = formData.get("featuredImageUrl") as string
  const tagsString = formData.get("tags") as string

  const isValidKey = await verifySecretKey(secretKey)
  if (!isValidKey) {
    return { success: false, message: "Clave secreta inválida." }
  }

  if (!slug || !title || !content) {
    return { success: false, message: "Slug, título y contenido son requeridos." }
  }

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se pueden editar artículos sin conexión a Supabase." }
  }

  try {
    const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []
    const supabase = getSupabaseServerClient()

    const { data: updatedPost, error } = await supabase
      .from("blog_posts")
      .update({
        title,
        content,
        excerpt,
        author,
        featured_image_url: featuredImageUrl || null,
        tags,
      })
      .eq("slug", slug)
      .select(POST_COLUMNS)
      .single()

    if (error || !updatedPost) {
      return { success: false, message: "Artículo no encontrado." }
    }

    revalidatePath("/blog")
    revalidatePath("/admin/posts")

    // Revalidar URL con fecha
    const date = new Date(updatedPost.created_at)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    revalidatePath(`/blog/${year}/${month}/${day}/${slug}`)

    return {
      success: true,
      message: "Artículo actualizado correctamente.",
      data: updatedPost,
    }
  } catch (error) {
    console.error("[blog] Error updating blog post:", error)
    return { success: false, message: "Error al actualizar el artículo." }
  }
}

export async function deleteBlogPost(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  const slug = formData.get("slug") as string

  const isValidKey = await verifySecretKey(secretKey)
  if (!isValidKey) {
    return { success: false, message: "Clave secreta inválida." }
  }

  if (!slug) {
    return { success: false, message: "Slug es requerido." }
  }

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se pueden eliminar artículos sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()
    const { data: deletedPost, error } = await supabase.from("blog_posts").delete().eq("slug", slug).select(POST_COLUMNS).single()

    if (error || !deletedPost) {
      return { success: false, message: "Artículo no encontrado." }
    }

    revalidatePath("/blog")
    revalidatePath("/admin/posts")

    return {
      success: true,
      message: "Artículo eliminado correctamente.",
      data: deletedPost,
    }
  } catch (error) {
    console.error("[blog] Error deleting blog post:", error)
    return { success: false, message: "Error al eliminar el artículo." }
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return getBlogPosts()
}
