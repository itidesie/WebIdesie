"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown, Mail, Phone, Search } from "lucide-react"
import type { Candidatura } from "@/app/empleo/actions"

interface CandidaturasTableProps {
  candidaturas: Candidatura[]
}

export function CandidaturasTable({ candidaturas }: CandidaturasTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = candidaturas.filter((c) => {
    const term = searchTerm.toLowerCase()
    return (
      c.nombre.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      (c.oferta_puesto ?? "").toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, email o oferta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-600">
        Mostrando {filtered.length} de {candidaturas.length} candidaturas
      </p>

      <Card>
        <CardContent className="p-0">
          {filtered.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Oferta</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">CV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <p className="font-medium">{c.nombre}</p>
                      {c.mensaje && <p className="text-sm text-gray-500 max-w-xs truncate">{c.mensaje}</p>}
                    </TableCell>
                    <TableCell>{c.oferta_puesto || "Candidatura espontánea"}</TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-1.5 text-gray-700">
                          <Mail className="w-3.5 h-3.5" /> {c.email}
                        </p>
                        <p className="flex items-center gap-1.5 text-gray-700">
                          <Phone className="w-3.5 h-3.5" /> {c.telefono}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(c.created_at).toLocaleDateString("es-ES", { dateStyle: "medium" })}
                    </TableCell>
                    <TableCell className="text-right">
                      {c.cv_url ? (
                        <a href={c.cv_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <FileDown className="w-3 h-3" />
                          </Button>
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">Sin CV</span>
                      )}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron candidaturas</h3>
              <p className="text-gray-500">
                {searchTerm ? "Intenta ajustar la búsqueda" : "Todavía no ha llegado ninguna candidatura"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
