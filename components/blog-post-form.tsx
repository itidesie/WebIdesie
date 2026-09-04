"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { createBlogPost, updateBlogPost } from "@/app/blog/actions"
import { Save, Eye, ArrowLeft, X, Sparkles, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { RichTextEditor } from "@/components/rich-text-editor"

interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  slug: string
  author: string
  published: boolean
  tags: string[]
  featured_image_url: string | null
  created_at: string
  updated_at: string
}

interface BlogPostFormProps {
  mode: "create" | "edit"
  initialData?: BlogPost
}

export function BlogPostForm({ mode, initialData }: BlogPostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    slug: initialData?.slug || "",
    author: initialData?.author || "",
    published: initialData?.published || false,
    tags: initialData?.tags || [],
    featured_image_url: initialData?.featured_image_url || "",
  })

  const [newTag, setNewTag] = useState("")
  const [secretKey, setSecretKey] = useState("")

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: mode === "create" ? generateSlug(title) : prev.slug,
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    console.log("[v0] Form submission started", { mode, formData })

    try {
      // Create FormData object
      const formDataObj = new FormData()
      formDataObj.append("title", formData.title)
      formDataObj.append("content", formData.content)
      formDataObj.append("excerpt", formData.excerpt)
      formDataObj.append("slug", formData.slug)
      formDataObj.append("author", formData.author || "IDESIE Team")
      formDataObj.append("published", formData.published.toString())
      formDataObj.append("featuredImageUrl", formData.featured_image_url || "")
      formDataObj.append("tags", formData.tags.join(","))
      formDataObj.append("secretKey", secretKey)

      console.log("[v0] FormData created", {
        title: formData.title,
        slug: formData.slug,
        published: formData.published,
        tagsCount: formData.tags.length,
      })

      let result
      if (mode === "create") {
        console.log("[v0] Calling createBlogPost")
        result = await createBlogPost(formDataObj)
      } else {
        console.log("[v0] Calling updateBlogPost")
        result = await updateBlogPost(formDataObj)
      }

      console.log("[v0] Server action result", result)

      if (result.success) {
        setSuccess(result.message)
        setTimeout(() => {
          router.push("/admin/dashboard")
          router.refresh()
        }, 1500)
      } else {
        setError(result.message)
      }
    } catch (err) {
      console.error("[v0] Error in handleSubmit:", err)
      setError(err instanceof Error ? err.message : "Error al guardar el post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-dark admin-container">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-[var(--admin-border)]">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <button type="button" className="admin-button-secondary flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[var(--admin-text)] flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[var(--admin-accent)]" />
                {mode === "create" ? "Crear Nuevo Post" : "Editar Post"}
              </h1>
              <p className="text-sm text-[var(--admin-text-muted)] mt-1">
                {mode === "create"
                  ? "Crea contenido increíble con el editor enriquecido"
                  : `Editando: ${initialData?.title}`}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {formData.published && initialData && (
              <Link href={`/blog/${formData.slug}`} target="_blank">
                <button type="button" className="admin-button-secondary flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Vista Previa
                </button>
              </Link>
            )}
            <button type="submit" disabled={loading} className="admin-button-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              {loading ? "Guardando..." : mode === "create" ? "Publicar" : "Actualizar"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-[#1f1f1f] border border-[#ef4444] rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#ef4444]">Error</p>
              <p className="text-sm text-[#a1a1a1] mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-[#1f1f1f] border border-[#22c55e] rounded-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#22c55e]">Éxito</p>
              <p className="text-sm text-[#a1a1a1] mt-1">{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <div className="admin-card p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#ededed] mb-1">Contenido Principal</h2>
                <p className="text-sm text-[#a1a1a1]">Información básica del artículo</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-[#ededed] text-sm font-medium mb-2 block">
                    Título *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Título del post"
                    required
                    className="admin-input w-full"
                  />
                </div>

                {/* Excerpt Card */}
                <div>
                  <Label htmlFor="excerpt" className="text-[#ededed] text-sm font-medium mb-2 block">
                    Extracto *
                  </Label>
                  <div className="text-xs text-[#a1a1a1] mb-2">
                    Breve descripción que aparecerá en la lista de posts
                  </div>
                  <RichTextEditor
                    content={formData.excerpt}
                    onChange={(content) => setFormData((prev) => ({ ...prev, excerpt: content }))}
                    placeholder="Escribe un resumen atractivo del artículo..."
                  />
                </div>

                {/* Content Card */}
                <div>
                  <Label htmlFor="content" className="text-[#ededed] text-sm font-medium mb-2 block">
                    Contenido *
                  </Label>
                  <div className="text-xs text-[#a1a1a1] mb-2">
                    Contenido completo del artículo con formato enriquecido
                  </div>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData((prev) => ({ ...prev, content: content }))}
                    placeholder="Escribe el contenido completo del post aquí. Usa la barra de herramientas para dar formato al texto, añadir imágenes, enlaces y más."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="admin-card p-6">
              <h3 className="text-lg font-semibold text-[#ededed] mb-4">Acciones</h3>
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="admin-button-primary w-full flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Guardando..." : mode === "create" ? "Crear Post" : "Actualizar Post"}
                </Button>

                {formData.published && initialData && (
                  <Link href={`/blog/${formData.slug}`} target="_blank" className="block">
                    <Button
                      variant="outline"
                      type="button"
                      className="admin-button-secondary w-full flex items-center justify-center gap-2 bg-transparent"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Post Publicado
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Configuration Card */}
            <div className="admin-card p-6">
              <h3 className="text-lg font-semibold text-[#ededed] mb-4">Configuración</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="slug" className="text-[#ededed] text-sm font-medium mb-2 block">
                    Slug (URL) *
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-del-post"
                    required
                    className="admin-input w-full"
                  />
                  <p className="text-xs text-[#525252] mt-1">/blog/{formData.slug || "url-del-post"}</p>
                </div>

                <div>
                  <Label htmlFor="author" className="text-[#ededed] text-sm font-medium mb-2 block">
                    Autor *
                  </Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                    placeholder="Nombre del autor"
                    required
                    className="admin-input w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="featured_image_url" className="text-[#ededed] text-sm font-medium mb-2 block">
                    Imagen Destacada
                  </Label>
                  {formData.featured_image_url && (
                    <div className="mb-3 relative w-full h-48 rounded-lg overflow-hidden border border-[#262626]">
                      <img
                        src={formData.featured_image_url || "/placeholder.svg"}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    <Input
                      value={formData.featured_image_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, featured_image_url: e.target.value }))}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="admin-input w-full"
                    />
                  </div>
                  <p className="text-xs text-[#525252] mt-2">Pega la URL de una imagen ya alojada en algún sitio</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#1f1f1f] rounded-lg border border-[#262626]">
                  <div>
                    <Label htmlFor="published" className="text-[#ededed] text-sm font-medium">
                      Publicar post
                    </Label>
                    <p className="text-xs text-[#a1a1a1] mt-0.5">
                      {formData.published ? "Visible públicamente" : "Guardado como borrador"}
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, published: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Tags Card */}
            <div className="admin-card p-6">
              <h3 className="text-lg font-semibold text-[#ededed] mb-4">Etiquetas</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nueva etiqueta"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="admin-input flex-1"
                  />
                  <Button type="button" onClick={addTag} className="admin-button-secondary px-4">
                    Añadir
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-[#1f1f1f] text-[#ededed] border border-[#262626] hover:border-[#3b82f6] flex items-center gap-1.5 px-3 py-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-[#ef4444] transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Authentication Card */}
            <div className="admin-card p-6 border-[#3b82f6]">
              <h3 className="text-lg font-semibold text-[#ededed] mb-4">Autenticación</h3>
              <div>
                <Label htmlFor="secretKey" className="text-[#ededed] text-sm font-medium mb-2 block">
                  Clave Secreta *
                </Label>
                <Input
                  id="secretKey"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Ingresa tu clave secreta"
                  required
                  className="admin-input w-full"
                />
                <p className="text-xs text-[#525252] mt-2">Requerida para guardar cambios en la base de datos</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
