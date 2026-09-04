"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ModulosEditor } from "./modulos-editor"
import { ListaEditor } from "./lista-editor"
import { LISTAS_DETALLE, type ListaKey } from "@/lib/producto-detalle-config"
import type { Modulo } from "@/app/tienda/modulos-actions"
import type { ItemDetalle } from "@/app/tienda/detalle-actions"

interface DetalleTabsProps {
  productoId: number
  slug: string
  initialModulos: Modulo[]
  initialListas: Record<ListaKey, ItemDetalle[]>
}

/**
 * Contenido de detalle de la ficha (las 7 tablas de `scripts/023`), en
 * pestañas dentro de la misma página de edición — estructura aprobada desde
 * el principio de la ampliación del panel (ver CLAUDE.md §1). Una sola clave
 * secreta para toda la sección, compartida por cualquier pestaña: no tiene
 * sentido pedirla de nuevo al cambiar de tabla dentro del mismo producto.
 */
export function DetalleTabs({ productoId, slug, initialModulos, initialListas }: DetalleTabsProps) {
  const [secretKey, setSecretKey] = useState("")

  return (
    <div className="admin-layout admin-dark min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="pb-6 border-b border-[#262626]">
          <h2 className="text-2xl font-bold text-[#ededed]">Contenido de la ficha</h2>
          <p className="text-sm text-[#a1a1a1] mt-1">
            Módulos, dirigido a, objetivos, requisitos, FAQs y testimonios — se muestran en /producto/{slug}
          </p>
        </div>

        <div className="admin-card p-4 max-w-sm">
          <label className="text-sm font-medium text-[#ededed] block mb-2">Clave secreta</label>
          <Input
            type="password"
            className="admin-input"
            placeholder="Necesaria para guardar cambios de contenido"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
        </div>

        <Tabs defaultValue="modulos">
          <TabsList>
            <TabsTrigger value="modulos">Módulos</TabsTrigger>
            {(Object.keys(LISTAS_DETALLE) as ListaKey[]).map((key) => (
              <TabsTrigger key={key} value={key}>
                {LISTAS_DETALLE[key].etiqueta}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="modulos" className="pt-4">
            <ModulosEditor productoId={productoId} slug={slug} initialModulos={initialModulos} secretKey={secretKey} />
          </TabsContent>
          {(Object.keys(LISTAS_DETALLE) as ListaKey[]).map((key) => (
            <TabsContent key={key} value={key} className="pt-4">
              <ListaEditor
                config={LISTAS_DETALLE[key]}
                productoId={productoId}
                slug={slug}
                initialItems={initialListas[key]}
                secretKey={secretKey}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
