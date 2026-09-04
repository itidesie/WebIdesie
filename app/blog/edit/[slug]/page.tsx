"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// Import getBlogPostBySlug from database actions
import { getBlogPostBySlug, updateBlogPost, type BlogPost } from "../../actions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useFormStatus } from "react-dom"
import Header from "../../../../components/header"
import FooterSection from "../../../../components/footer-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"

interface EditBlogPostPageProps {
  params: { slug: string }
}

// Componente para el estado de envío del formulario
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full bg-[#006cff] hover:bg-[#005bbd]">
      {pending ? "Guardando..." : "Guardar Cambios"}
    </Button>
  )
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const router = useRouter()
  // Update state to use BlogPost type from database
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  // Fetch post data from database on component mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getBlogPostBySlug(params.slug)
        setPost(fetchedPost)
      } catch (error) {
        console.error("Error fetching post:", error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  useEffect(() => {
    if (!loading && !post) {
      router.push("/blog") // Redirigir si el post no se encuentra
    }
  }, [post, loading, router])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p>Cargando...</p>
        </main>
        <FooterSection />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p>Artículo no encontrado...</p>
        </main>
        <FooterSection />
      </div>
    )
  }

  const handleSubmit = async (formData: FormData) => {
    setMessage("")
    setIsError(false)

    // Añadir el slug actual al FormData para el Server Action
    formData.append("slug", post.slug)

    const result = await updateBlogPost(formData)

    if (result.success) {
      setMessage(result.message)
      // Update post state with new data structure
      if (result.data) {
        const updatedPost = {
          ...result.data,
          tags: Array.isArray(result.data.tags) ? result.data.tags : [],
          created_at: new Date(result.data.created_at).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          updated_at: new Date(result.data.updated_at).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }
        setPost(updatedPost)
      }
      // Opcional: Redirigir de vuelta a la vista del blog después de un tiempo
      setTimeout(() => router.push(`/blog/${post.slug}`), 2000)
    } else {
      setMessage(result.message)
      setIsError(true)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-3xl">
        <Button asChild variant="ghost" className="mb-8 text-[#006cff] hover:text-[#005bbd] group">
          <Link href={`/blog/${post.slug}`}>
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> Cancelar Edición
          </Link>
        </Button>
        <Card className="p-8 rounded-xl shadow-lg bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-4 text-gray-900 text-center">
              Editar Artículo: {post.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {message && (
              <div
                className={`mb-4 p-3 rounded-md text-center ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
              >
                {message}
              </div>
            )}
            <form action={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </Label>
                <Input id="title" name="title" defaultValue={post.title} required className="w-full" />
              </div>
              <div>
                <Label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Autor
                </Label>
                <Input id="author" name="author" defaultValue={post.author} required className="w-full" />
              </div>
              {/* Add excerpt field for database */}
              <div>
                <Label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  Extracto (opcional)
                </Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  defaultValue={post.excerpt || ""}
                  placeholder="Breve descripción del artículo..."
                  rows={3}
                  className="w-full"
                />
              </div>
              {/* Update field name to match database schema */}
              <div>
                <Label htmlFor="featuredImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la Imagen Destacada (opcional)
                </Label>
                <Input
                  id="featuredImageUrl"
                  name="featuredImageUrl"
                  defaultValue={post.featured_image_url || ""}
                  placeholder="/placeholder.svg?height=400&width=600"
                  className="w-full"
                />
              </div>
              {/* Add tags field for database */}
              <div>
                <Label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Etiquetas (separadas por comas)
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={post.tags.join(", ")}
                  placeholder="BIM, Construcción, Tecnología"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido (Markdown)
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={post.content}
                  required
                  rows={15}
                  className="w-full min-h-[300px]"
                />
              </div>
              {/* Add published status field */}
              <div>
                <Label htmlFor="published" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Publicación
                </Label>
                <select
                  id="published"
                  name="published"
                  defaultValue={post.published ? "true" : "false"}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="true">Publicado</option>
                  <option value="false">Borrador</option>
                </select>
              </div>
              <div>
                <Label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Clave Secreta para Editar
                </Label>
                <Input
                  id="secretKey"
                  name="secretKey"
                  type="password"
                  placeholder="Introduce la clave secreta"
                  required
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usa la clave secreta configurada en las variables de entorno.
                </p>
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </main>
      <FooterSection />
    </div>
  )
}
