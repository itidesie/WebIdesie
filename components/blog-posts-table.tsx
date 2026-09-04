"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteBlogPost } from "@/app/blog/actions"
import { Edit, Eye, Trash2, Search, Calendar } from "lucide-react"
import Link from "next/link"

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

interface BlogPostsTableProps {
  posts: BlogPost[]
}

export function BlogPostsTable({ posts }: BlogPostsTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [secretKey, setSecretKey] = useState("")

  // Filter posts based on search and status
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && post.published) ||
      (statusFilter === "draft" && !post.published)

    return matchesSearch && matchesStatus
  })

  const handleDelete = async (postId: number, slug: string) => {
    if (!secretKey.trim()) {
      setError("Debes ingresar la clave secreta para eliminar posts")
      return
    }

    setDeleteLoading(postId)
    setError("")

    try {
      const formData = new FormData()
      formData.set("slug", slug)
      formData.set("secretKey", secretKey)
      const result = await deleteBlogPost(formData)
      if (!result.success) {
        setError(result.message)
        return
      }
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al eliminar el post")
    } finally {
      setDeleteLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por título, autor o etiquetas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los posts</SelectItem>
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Mostrando {filteredPosts.length} de {posts.length} posts
        </p>
        <div className="flex gap-2">
          <Badge variant="outline">{posts.filter((p) => p.published).length} Publicados</Badge>
          <Badge variant="outline">{posts.filter((p) => !p.published).length} Borradores</Badge>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Posts Table */}
      <Card>
        <CardContent className="p-0">
          {filteredPosts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Etiquetas</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</p>
                      </div>
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Publicado" : "Borrador"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(post.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {post.published && (
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/posts/edit/${post.slug}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar post?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El post "{post.title}" será eliminado permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="my-4">
                              <Input
                                type="password"
                                placeholder="Clave secreta para confirmar"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(post.id, post.slug)}
                                disabled={deleteLoading === post.id}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deleteLoading === post.id ? "Eliminando..." : "Eliminar"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron posts</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No hay posts creados aún"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link href="/admin/posts/new">
                  <Button>Crear tu primer post</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
