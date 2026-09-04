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
import { deleteOferta, type Oferta } from "@/app/empleo/actions"
import { Edit, Eye, Trash2, Search } from "lucide-react"
import Link from "next/link"

interface OfertasTableProps {
  ofertas: Oferta[]
}

export function OfertasTable({ ofertas }: OfertasTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [secretKey, setSecretKey] = useState("")

  const filteredOfertas = ofertas.filter((oferta) => {
    const matchesSearch =
      oferta.puesto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oferta.empresa.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "activa" && oferta.activa) ||
      (statusFilter === "inactiva" && !oferta.activa)

    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: number) => {
    if (!secretKey.trim()) {
      setError("Debes ingresar la clave secreta para eliminar ofertas")
      return
    }

    setDeleteLoading(id)
    setError("")

    try {
      const formData = new FormData()
      formData.set("id", String(id))
      formData.set("secretKey", secretKey)
      const result = await deleteOferta(formData)
      if (!result.success) {
        setError(result.message)
        return
      }
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al eliminar la oferta")
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
                  placeholder="Buscar por puesto o empresa..."
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
                <SelectItem value="all">Todas las ofertas</SelectItem>
                <SelectItem value="activa">Publicadas</SelectItem>
                <SelectItem value="inactiva">Despublicadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Mostrando {filteredOfertas.length} de {ofertas.length} ofertas
        </p>
        <div className="flex gap-2">
          <Badge variant="outline">{ofertas.filter((o) => o.activa).length} Publicadas</Badge>
          <Badge variant="outline">{ofertas.filter((o) => !o.activa).length} Despublicadas</Badge>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0">
          {filteredOfertas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Puesto</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOfertas.map((oferta) => (
                  <TableRow key={oferta.id}>
                    <TableCell>
                      <p className="font-medium">{oferta.puesto}</p>
                    </TableCell>
                    <TableCell>{oferta.empresa}</TableCell>
                    <TableCell>{oferta.ubicacion || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant={oferta.activa ? "default" : "secondary"}>
                          {oferta.activa ? "Publicada" : "Despublicada"}
                        </Badge>
                        {oferta.destacada && <Badge variant="outline">Destacada</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {oferta.activa && (
                          <Link href="/bolsa-de-empleo-page" target="_blank">
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/empleo/${oferta.id}/editar`}>
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
                              <AlertDialogTitle>¿Eliminar oferta?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. La oferta "{oferta.puesto}" en {oferta.empresa} será
                                eliminada permanentemente. Las candidaturas ya recibidas para esta oferta se
                                conservan.
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
                                onClick={() => handleDelete(oferta.id)}
                                disabled={deleteLoading === oferta.id}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deleteLoading === oferta.id ? "Eliminando..." : "Eliminar"}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron ofertas</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No hay ofertas creadas aún"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
