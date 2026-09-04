"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ChevronUp, ChevronDown, Save, ListPlus } from "lucide-react"
import {
  getModulosConTemas,
  saveModulo,
  deleteModulo,
  reorderModulo,
  saveTema,
  deleteTema,
  reorderTema,
  type Modulo,
} from "@/app/tienda/modulos-actions"

interface ModulosEditorProps {
  productoId: number
  slug: string
  initialModulos: Modulo[]
  secretKey: string
}

/**
 * Único editor con anidación de los 7 de tienda: cada módulo tiene sus
 * propios temas. Los campos son inputs controlados directamente sobre el
 * estado local (no react-hook-form, como el resto de tienda) porque la
 * lista es dinámica — se añaden y quitan filas, y cada fila se guarda por
 * separado, no todo el formulario a la vez.
 */
export function ModulosEditor({ productoId, slug, initialModulos, secretKey }: ModulosEditorProps) {
  const [modulos, setModulos] = useState<Modulo[]>(initialModulos)
  const [busyId, setBusyId] = useState<number | "nuevo" | null>(null)
  const [error, setError] = useState("")
  const [nuevo, setNuevo] = useState({ titulo: "", descripcion: "" })
  const [nuevoTema, setNuevoTema] = useState<Record<number, string>>({})

  const refresh = async () => setModulos(await getModulosConTemas(productoId))

  const requireSecret = () => {
    if (!secretKey.trim()) {
      setError("Introduce la clave secreta arriba antes de guardar cambios.")
      return false
    }
    return true
  }

  const updateModuloField = (id: number, field: "titulo" | "descripcion", value: string) => {
    setModulos((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const updateTemaTitulo = (moduloId: number, temaId: number, value: string) => {
    setModulos((prev) =>
      prev.map((m) =>
        m.id !== moduloId ? m : { ...m, temas: m.temas.map((t) => (t.id === temaId ? { ...t, titulo: value } : t)) },
      ),
    )
  }

  const handleSaveModulo = async (m: Modulo) => {
    if (!requireSecret()) return
    if (!m.titulo.trim()) {
      setError("El título del módulo es obligatorio.")
      return
    }
    setBusyId(m.id)
    setError("")
    const fd = new FormData()
    fd.set("id", String(m.id))
    fd.set("productoId", String(productoId))
    fd.set("slug", slug)
    fd.set("titulo", m.titulo)
    fd.set("descripcion", m.descripcion ?? "")
    fd.set("secretKey", secretKey)
    const result = await saveModulo(fd)
    if (!result.success) setError(result.message)
    else await refresh()
    setBusyId(null)
  }

  const handleAddModulo = async () => {
    if (!requireSecret()) return
    if (!nuevo.titulo.trim()) {
      setError("El título es obligatorio.")
      return
    }
    setBusyId("nuevo")
    setError("")
    const fd = new FormData()
    fd.set("productoId", String(productoId))
    fd.set("slug", slug)
    fd.set("titulo", nuevo.titulo)
    fd.set("descripcion", nuevo.descripcion)
    fd.set("secretKey", secretKey)
    const result = await saveModulo(fd)
    if (!result.success) setError(result.message)
    else {
      setNuevo({ titulo: "", descripcion: "" })
      await refresh()
    }
    setBusyId(null)
  }

  const handleDeleteModulo = async (id: number) => {
    if (!requireSecret()) return
    if (!confirm("¿Eliminar este módulo y todos sus temas?")) return
    setBusyId(id)
    setError("")
    const fd = new FormData()
    fd.set("id", String(id))
    fd.set("slug", slug)
    fd.set("secretKey", secretKey)
    const result = await deleteModulo(fd)
    if (!result.success) setError(result.message)
    else await refresh()
    setBusyId(null)
  }

  const handleReorderModulo = async (id: number, direction: "up" | "down") => {
    if (!requireSecret()) return
    setBusyId(id)
    setError("")
    const fd = new FormData()
    fd.set("id", String(id))
    fd.set("productoId", String(productoId))
    fd.set("slug", slug)
    fd.set("direction", direction)
    fd.set("secretKey", secretKey)
    const result = await reorderModulo(fd)
    if (!result.success) setError(result.message)
    else await refresh()
    setBusyId(null)
  }

  const handleSaveTema = async (moduloId: number, tema: { id: number; titulo: string }) => {
    if (!requireSecret()) return
    if (!tema.titulo.trim()) {
      setError("El título del tema es obligatorio.")
      return
    }
    setBusyId(moduloId)
    setError("")
    const fd = new FormData()
    fd.set("id", String(tema.id))
    fd.set("moduloId", String(moduloId))
    fd.set("slug", slug)
    fd.set("titulo", tema.titulo)
    fd.set("secretKey", secretKey)
    const result = await saveTema(fd)
    if (!result.success) setError(result.message)
    else await refresh()
    setBusyId(null)
  }

  const handleAddTema = async (moduloId: number) => {
    if (!requireSecret()) return
    const titulo = (nuevoTema[moduloId] ?? "").trim()
    if (!titulo) {
      setError("El título del tema es obligatorio.")
      return
    }
    setBusyId(moduloId)
    setError("")
    const fd = new FormData()
    fd.set("moduloId", String(moduloId))
    fd.set("slug", slug)
    fd.set("titulo", titulo)
    fd.set("secretKey", secretKey)
    const result = await saveTema(fd)
    if (!result.success) setError(result.message)
    else {
      setNuevoTema((prev) => ({ ...prev, [moduloId]: "" }))
      await refresh()
    }
    setBusyId(null)
  }

  const handleDeleteTema = async (moduloId: number, temaId: number) => {
    if (!requireSecret()) return
    setBusyId(moduloId)
    setError("")
    const fd = new FormData()
    fd.set("id", String(temaId))
    fd.set("slug", slug)
    fd.set("secretKey", secretKey)
    const result = await deleteTema(fd)
    if (!result.success) setError(result.message)
    else await refresh()
    setBusyId(null)
  }

  const handleReorderTema = async (moduloId: number, temaId: number, direction: "up" | "down") => {
    if (!requireSecret()) return
    setBusyId(moduloId)
    setError("")
    const fd = new FormData()
    fd.set("id", String(temaId))
    fd.set("moduloId", String(moduloId))
    fd.set("slug", slug)
    fd.set("direction", direction)
    fd.set("secretKey", secretKey)
    const result = await reorderTema(fd)
    if (!result.success) setError(result.message)
    else await refresh()
    setBusyId(null)
  }

  return (
    <div className="space-y-4">
      {error && <div className="bg-[#1f1f1f] border border-[#ef4444] rounded-lg p-3 text-sm text-[#ef4444]">{error}</div>}

      {modulos.length === 0 && <p className="text-sm text-[#a1a1a1]">Sin módulos todavía. Añade el primero abajo.</p>}

      {modulos.map((m, idx) => (
        <div key={m.id} className="admin-card p-4 space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-xs text-[#666666] pt-2 w-6 font-mono">{String(idx + 1).padStart(2, "0")}</span>
            <div className="flex-1 space-y-2">
              <Input
                className="admin-input"
                value={m.titulo}
                onChange={(e) => updateModuloField(m.id, "titulo", e.target.value)}
                placeholder="Título del módulo"
              />
              <Textarea
                className="admin-input"
                rows={2}
                value={m.descripcion ?? ""}
                onChange={(e) => updateModuloField(m.id, "descripcion", e.target.value)}
                placeholder="Descripción (opcional)"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={idx === 0 || busyId === m.id}
                onClick={() => handleReorderModulo(m.id, "up")}
              >
                <ChevronUp className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={idx === modulos.length - 1 || busyId === m.id}
                onClick={() => handleReorderModulo(m.id, "down")}
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
              disabled={busyId === m.id}
              onClick={() => handleDeleteModulo(m.id)}
            >
              <Trash2 className="w-3 h-3 mr-1" /> Eliminar módulo
            </Button>
            <Button type="button" size="sm" disabled={busyId === m.id} onClick={() => handleSaveModulo(m)}>
              <Save className="w-3 h-3 mr-1" /> {busyId === m.id ? "Guardando..." : "Guardar módulo"}
            </Button>
          </div>

          <div className="pl-8 space-y-2 border-l border-[#262626] ml-3">
            <p className="text-xs font-medium text-[#a1a1a1] uppercase tracking-wide">Temas</p>
            {m.temas.length === 0 && <p className="text-xs text-[#666666]">Sin temas.</p>}
            {m.temas.map((t, tIdx) => (
              <div key={t.id} className="flex items-center gap-2">
                <Input
                  className="admin-input flex-1"
                  value={t.titulo}
                  onChange={(e) => updateTemaTitulo(m.id, t.id, e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={tIdx === 0 || busyId === m.id}
                  onClick={() => handleReorderTema(m.id, t.id, "up")}
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={tIdx === m.temas.length - 1 || busyId === m.id}
                  onClick={() => handleReorderTema(m.id, t.id, "down")}
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busyId === m.id}
                  onClick={() => handleSaveTema(m.id, t)}
                >
                  <Save className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  disabled={busyId === m.id}
                  onClick={() => handleDeleteTema(m.id, t.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <Input
                className="admin-input flex-1"
                placeholder="Nuevo tema..."
                value={nuevoTema[m.id] ?? ""}
                onChange={(e) => setNuevoTema((prev) => ({ ...prev, [m.id]: e.target.value }))}
              />
              <Button type="button" variant="outline" size="sm" disabled={busyId === m.id} onClick={() => handleAddTema(m.id)}>
                <Plus className="w-3 h-3 mr-1" /> Añadir tema
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="admin-card p-4 space-y-3">
        <p className="text-sm font-semibold text-[#ededed] flex items-center gap-2">
          <ListPlus className="w-4 h-4" /> Nuevo módulo
        </p>
        <Input
          className="admin-input"
          placeholder="Título del módulo"
          value={nuevo.titulo}
          onChange={(e) => setNuevo((prev) => ({ ...prev, titulo: e.target.value }))}
        />
        <Textarea
          className="admin-input"
          rows={2}
          placeholder="Descripción (opcional)"
          value={nuevo.descripcion}
          onChange={(e) => setNuevo((prev) => ({ ...prev, descripcion: e.target.value }))}
        />
        <div className="flex justify-end">
          <Button type="button" disabled={busyId === "nuevo"} onClick={handleAddModulo}>
            <Plus className="w-3 h-3 mr-1" /> {busyId === "nuevo" ? "Añadiendo..." : "Añadir módulo"}
          </Button>
        </div>
      </div>
    </div>
  )
}
