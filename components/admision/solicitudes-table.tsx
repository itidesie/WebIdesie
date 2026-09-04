"use client"

import { useState, useTransition } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDown, Mail, Phone, Search } from "lucide-react"
import { updateEstadoSolicitud, type EstadoSolicitud, type Solicitud } from "@/app/admision/solicitudes-actions"

interface SolicitudesTableProps {
  solicitudes: Solicitud[]
}

const ESTADOS: { value: EstadoSolicitud; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "revisado", label: "Revisado" },
  { value: "aceptado", label: "Aceptado" },
  { value: "rechazado", label: "Rechazado" },
]

const ESTADO_BADGE: Record<EstadoSolicitud, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  revisado: "bg-blue-100 text-blue-800",
  aceptado: "bg-green-100 text-green-800",
  rechazado: "bg-red-100 text-red-800",
}

/**
 * Tabla de solicitudes de admisión — mismo patrón que `CandidaturasTable`
 * (bolsa de empleo), pero con una pieza que esa no necesita: cambio de
 * estado (pendiente/revisado/aceptado/rechazado) inline por fila, vía
 * `updateEstadoSolicitud`. Una única "Clave secreta" compartida para toda
 * la tabla, mismo criterio que `detalle-tabs.tsx` en tienda — no tiene
 * sentido pedirla de nuevo por cada fila.
 */
export function SolicitudesTable({ solicitudes: initialSolicitudes }: SolicitudesTableProps) {
  const [solicitudes, setSolicitudes] = useState(initialSolicitudes)
  const [searchTerm, setSearchTerm] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const filtered = solicitudes.filter((s) => {
    const term = searchTerm.toLowerCase()
    return (
      s.nombre_completo.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.programa_solicitado.toLowerCase().includes(term)
    )
  })

  const handleEstadoChange = (id: string, estado: EstadoSolicitud) => {
    if (!secretKey.trim()) {
      setError("Indica la clave secreta antes de cambiar un estado.")
      return
    }
    setError("")
    setPendingId(id)

    const formData = new FormData()
    formData.set("secretKey", secretKey)
    formData.set("id", id)
    formData.set("estado", estado)

    startTransition(async () => {
      const result = await updateEstadoSolicitud(formData)
      if (result.success) {
        setSolicitudes((prev) => prev.map((s) => (s.id === id ? { ...s, estado } : s)))
      } else {
        setError(result.message)
      }
      setPendingId(null)
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#111111] border-[#262626]">
        <CardHeader>
          <CardTitle className="text-lg text-[#ededed]">Buscar y autenticar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
            <Input
              placeholder="Buscar por nombre, email o programa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#ededed]">Clave secreta</label>
            <Input
              type="password"
              placeholder="Requerida para cambiar el estado de una solicitud"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="admin-input max-w-sm"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </CardContent>
      </Card>

      <p className="text-sm text-[#999999]">
        Mostrando {filtered.length} de {solicitudes.length} solicitudes
      </p>

      <Card className="bg-[#111111] border-[#262626]">
        <CardContent className="p-0">
          {filtered.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Programa</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Origen</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">CV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <p className="font-medium">{s.nombre_completo}</p>
                      {(s.titulacion_previa || s.universidad_origen) && (
                        <p className="max-w-xs truncate text-xs text-[#999999]">
                          {[s.titulacion_previa, s.universidad_origen].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {s.mensaje && <p className="max-w-xs truncate text-sm text-[#999999]">{s.mensaje}</p>}
                    </TableCell>
                    <TableCell>{s.programa_solicitado}</TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-1.5 text-[#cccccc]">
                          <Mail className="h-3.5 w-3.5" /> {s.email}
                        </p>
                        <p className="flex items-center gap-1.5 text-[#cccccc]">
                          <Phone className="h-3.5 w-3.5" /> {s.telefono}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm capitalize text-[#999999]">{s.origen}</TableCell>
                    <TableCell className="text-sm text-[#999999]">
                      {new Date(s.created_at).toLocaleDateString("es-ES", { dateStyle: "medium" })}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={s.estado}
                        onValueChange={(value) => handleEstadoChange(s.id, value as EstadoSolicitud)}
                        disabled={isPending && pendingId === s.id}
                      >
                        <SelectTrigger className={`h-8 w-[130px] text-xs font-medium ${ESTADO_BADGE[s.estado]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ESTADOS.map((e) => (
                            <SelectItem key={e.value} value={e.value}>
                              {e.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      {s.cv_url ? (
                        <a href={s.cv_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <FileDown className="h-3 w-3" />
                          </Button>
                        </a>
                      ) : (
                        <span className="text-xs text-[#666666]">Sin CV</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 text-[#666666]">
                <Search className="mx-auto h-12 w-12" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-[#ededed]">No se encontraron solicitudes</h3>
              <p className="text-[#999999]">
                {searchTerm ? "Intenta ajustar la búsqueda" : "Todavía no ha llegado ninguna solicitud"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
