"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ChevronUp, ChevronDown, Save } from "lucide-react"
import { getListaItems, saveListaItem, deleteListaItem, reorderListaItem, type ItemDetalle } from "@/app/tienda/detalle-actions"
import type { ListaConfig } from "@/lib/producto-detalle-config"

interface ListaEditorProps {
  config: ListaConfig
  productoId: number
  slug: string
  initialItems: ItemDetalle[]
  secretKey: string
}

/**
 * Un único editor para las 5 tablas de detalle que comparten la misma forma
 * (`producto_id`, 1-3 campos de texto, `orden`) — la configuración de cada
 * tabla (nombre, campos, etiquetas) vive en `lib/producto-detalle-config.ts`,
 * nunca duplicada aquí. Mismo patrón de estado que `ModulosEditor`: inputs
 * controlados sobre el estado local, refetch tras cada guardado en vez de
 * mutar a mano, sin `react-hook-form` por ser una lista dinámica.
 */
export function ListaEditor({ config, productoId, slug, initialItems, secretKey }: ListaEditorProps) {
  const [items, setItems] = useState<ItemDetalle[]>(initialItems)
  const [busyId, setBusyId] = useState<number | "nuevo" | null>(null)
  const [error, setError] = useState("")
  const [nuevo, setNuevo] = useState<Record<string, string>>({})

  const refresh = async () => setItems(await getListaItems(config.tabla, productoId))

  const requireSecret = () => {
    if (!secretKey.trim()) {
      setError("Introduce la clave secreta arriba antes de guardar cambios.")
      return false
    }
    return true
  }

  const updateField = (id: number, key: string, value: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  const validar = (values: Record<string, string | number | null>) => {
    for (const campo of config.campos) {
      const raw = values[campo.key]
      if (campo.requerido && !(typeof raw === "string" ? raw.trim() : raw)) {
        return `${campo.label} es obligatorio.`
      }
    }
    return null
  }

  const buildFormData = (extra: Record<string, string>) => {
    const fd = new FormData()
    fd.set("tabla", config.tabla)
    fd.set("productoId", String(productoId))
    fd.set("slug", slug)
    fd.set("secretKey", secretKey)
    for (const [key, value] of Object.entries(extra)) fd.set(key, value)
    return fd
  }

  const handleSave = async (item: ItemDetalle) => {
    if (!requireSecret()) return
    const invalido = validar(item)
    if (invalido) {
      setError(invalido)
      return
    }
    setBusyId(item.id)
    setError("")
    const extra: Record<string, string> = { id: String(item.id) }
    for (const campo of config.campos) extra[campo.key] = String(item[campo.key] ?? "")
    const result = await saveListaItem(buildFormData(extra))
    if (!result.success) setError(result.message)
    else await refresh()
    setBusyId(null)
  }

  const handleAdd = async () => {
    if (!requireSecret()) return
    const invalido = validar(nuevo)
    if (invalido) {
      setError(invalido)
      return
    }
    setBusyId("nuevo")
    setError("")
    const result = await saveListaItem(buildFormData(nuevo))
    if (!result.success) setError(result.message)
    else {
      setNuevo({})
      await refresh()
    }
    setBusyId(null)
  }

  const handleDelete = async (id: number) => {
    if (!requireSecret()) return
    if (!confirm(`¿Eliminar este elemento de "${config.etiqueta}"?`)) return
    setBusyId(id)
    setError("")
    const result = await deleteListaItem(buildFormData({ id: String(id) }))
    if (!result.success) setError(result.message)
    else await refresh()
    setBusyId(null)
  }

  const handleReorder = async (id: number, direction: "up" | "down") => {
    if (!requireSecret()) return
    setBusyId(id)
    setError("")
    const result = await reorderListaItem(buildFormData({ id: String(id), direction }))
    if (!result.success) setError(result.message)
    else await refresh()
    setBusyId(null)
  }

  const renderCampo = (
    value: string,
    onChange: (value: string) => void,
    campo: ListaConfig["campos"][number],
  ) =>
    campo.tipo === "textarea" ? (
      <Textarea className="admin-input" rows={2} placeholder={campo.label} value={value} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <Input className="admin-input" placeholder={campo.label} value={value} onChange={(e) => onChange(e.target.value)} />
    )

  return (
    <div className="space-y-4">
      {error && <div className="bg-[#1f1f1f] border border-[#ef4444] rounded-lg p-3 text-sm text-[#ef4444]">{error}</div>}

      {items.length === 0 && <p className="text-sm text-[#a1a1a1]">{config.vacio}</p>}

      {items.map((item, idx) => (
        <div key={item.id} className="admin-card p-4 space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-xs text-[#666666] pt-2 w-6 font-mono">{String(idx + 1).padStart(2, "0")}</span>
            <div className="flex-1 space-y-2">
              {config.campos.map((campo) => (
                <div key={campo.key}>
                  <label className="text-xs text-[#a1a1a1] block mb-1">{campo.label}</label>
                  {renderCampo(String(item[campo.key] ?? ""), (value) => updateField(item.id, campo.key, value), campo)}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={idx === 0 || busyId === item.id}
                onClick={() => handleReorder(item.id, "up")}
              >
                <ChevronUp className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={idx === items.length - 1 || busyId === item.id}
                onClick={() => handleReorder(item.id, "down")}
              >
                <ChevronDown className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              disabled={busyId === item.id}
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 className="w-3 h-3 mr-1" /> Eliminar
            </Button>
            <Button type="button" size="sm" disabled={busyId === item.id} onClick={() => handleSave(item)}>
              <Save className="w-3 h-3 mr-1" /> {busyId === item.id ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      ))}

      <div className="admin-card p-4 space-y-3">
        <p className="text-sm font-semibold text-[#ededed]">Nuevo elemento</p>
        {config.campos.map((campo) => (
          <div key={campo.key}>
            <label className="text-xs text-[#a1a1a1] block mb-1">{campo.label}</label>
            {renderCampo(nuevo[campo.key] ?? "", (value) => setNuevo((prev) => ({ ...prev, [campo.key]: value })), campo)}
          </div>
        ))}
        <div className="flex justify-end">
          <Button type="button" disabled={busyId === "nuevo"} onClick={handleAdd}>
            <Plus className="w-3 h-3 mr-1" /> {busyId === "nuevo" ? "Añadiendo..." : "Añadir"}
          </Button>
        </div>
      </div>
    </div>
  )
}
