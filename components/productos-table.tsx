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
import { deleteProducto, type Producto } from "@/app/tienda/actions"
import { Edit, Eye, Trash2, Search } from "lucide-react"
import Link from "next/link"

interface ProductosTableProps {
  productos: Producto[]
}

export function ProductosTable({ productos }: ProductosTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [secretKey, setSecretKey] = useState("")

  const filteredProductos = productos.filter((producto) => {
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.slug.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "activo" && producto.activo) ||
      (statusFilter === "inactivo" && !producto.activo)

    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: number, slug: string) => {
    if (!secretKey.trim()) {
      setError("Debes ingresar la clave secreta para eliminar productos")
      return
    }

    setDeleteLoading(id)
    setError("")

    try {
      const formData = new FormData()
      formData.set("slug", slug)
      formData.set("secretKey", secretKey)
      const result = await deleteProducto(formData)
      if (!result.success) {
        setError(result.message)
        return
      }
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al eliminar el producto")
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <div className="space-y-6">
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
                  placeholder="Buscar por nombre o slug..."
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
                <SelectItem value="all">Todos los productos</SelectItem>
                <SelectItem value="activo">Publicados</SelectItem>
                <SelectItem value="inactivo">Despublicados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Mostrando {filteredProductos.length} de {productos.length} productos
        </p>
        <div className="flex gap-2">
          <Badge variant="outline">{productos.filter((p) => p.activo).length} Publicados</Badge>
          <Badge variant="outline">{productos.filter((p) => !p.activo).length} Despublicados</Badge>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0">
          {filteredProductos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Modalidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProductos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{producto.nombre}</p>
                        <p className="text-sm text-gray-500">/producto/{producto.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{producto.tipo}</TableCell>
                    <TableCell>
                      {producto.precio_actual == null ? (
                        <span className="text-amber-600 text-sm">Sin precio</span>
                      ) : (
                        <>
                          {Boolean(producto.precio_original) && producto.precio_original! > producto.precio_actual && (
                            <span className="text-gray-400 line-through text-xs mr-2">
                              {producto.precio_original}€
                            </span>
                          )}
                          {producto.precio_actual}€
                        </>
                      )}
                    </TableCell>
                    <TableCell>{producto.modalidad || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant={producto.activo ? "default" : "secondary"}>
                          {producto.activo ? "Publicado" : "Despublicado"}
                        </Badge>
                        {producto.destacado && <Badge variant="outline">Destacado</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {producto.activo && (
                          <Link href={`/producto/${producto.slug}`} target="_blank">
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/tienda/${producto.slug}/editar`}>
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
                              <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El producto "{producto.nombre}" y todo su contenido
                                de detalle (módulos, FAQs, requisitos, testimonios...) será eliminado permanentemente.
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
                                onClick={() => handleDelete(producto.id, producto.slug)}
                                disabled={deleteLoading === producto.id}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deleteLoading === producto.id ? "Eliminando..." : "Eliminar"}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No hay productos creados aún"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
