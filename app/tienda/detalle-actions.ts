"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { verifyAdminSecret } from "@/lib/admin-secret"
import { isTablaDetalleValida, camposDeTabla } from "@/lib/producto-detalle-config"

interface ActionResult {
  success: boolean
  message: string
}

export interface ItemDetalle {
  id: number
  producto_id: number
  orden: number
  [campo: string]: string | number | null
}

async function checkSecret(secretKey: string): Promise<boolean> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Tienda — detalle", "verificación de clave simulada — siempre inválida")
    return false
  }
  try {
    return (await verifyAdminSecret(secretKey)) !== null
  } catch (error) {
    console.error("[tienda/detalle] Error verifying secret key:", error)
    return false
  }
}

function revalidateProducto(slug: string) {
  revalidatePath(`/admin/tienda/${slug}/editar`)
  revalidatePath(`/producto/${slug}`)
}

/** Filas de una de las 5 tablas de detalle genéricas, ordenadas por `orden`. */
export async function getListaItems(tabla: string, productoId: number): Promise<ItemDetalle[]> {
  if (!isTablaDetalleValida(tabla)) return []
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Tienda — detalle", `listado simulado de ${tabla} para producto ${productoId}`)
    return []
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from(tabla)
      .select("*")
      .eq("producto_id", productoId)
      .order("orden", { ascending: true })
    if (error) throw error
    return (data ?? []) as ItemDetalle[]
  } catch (error) {
    console.error(`[tienda/detalle] Error fetching ${tabla}:`, error)
    return []
  }
}

export async function saveListaItem(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  if (!(await checkSecret(secretKey))) return { success: false, message: "Clave secreta inválida." }

  const tabla = formData.get("tabla") as string
  if (!isTablaDetalleValida(tabla)) return { success: false, message: "Tabla no permitida." }

  const idRaw = formData.get("id") as string
  const productoId = Number(formData.get("productoId"))
  const slug = formData.get("slug") as string

  const payload: Record<string, string | null> = {}
  for (const campo of camposDeTabla(tabla)) {
    const raw = ((formData.get(campo.key) as string) ?? "").trim()
    if (campo.requerido && !raw) {
      return { success: false, message: `${campo.label} es obligatorio.` }
    }
    payload[campo.key] = raw || null
  }

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se puede guardar sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()
    if (idRaw) {
      const { error } = await supabase.from(tabla).update(payload).eq("id", Number(idRaw))
      if (error) throw error
    } else {
      const { count } = await supabase
        .from(tabla)
        .select("id", { count: "exact", head: true })
        .eq("producto_id", productoId)
      const { error } = await supabase.from(tabla).insert({ ...payload, producto_id: productoId, orden: count ?? 0 })
      if (error) throw error
    }
    revalidateProducto(slug)
    return { success: true, message: "Guardado." }
  } catch (error) {
    console.error(`[tienda/detalle] Error saving ${tabla}:`, error)
    return {
      success: false,
      message: `Error al guardar: ${error instanceof Error ? error.message : "desconocido"}`,
    }
  }
}

export async function deleteListaItem(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  if (!(await checkSecret(secretKey))) return { success: false, message: "Clave secreta inválida." }

  const tabla = formData.get("tabla") as string
  if (!isTablaDetalleValida(tabla)) return { success: false, message: "Tabla no permitida." }

  const id = Number(formData.get("id"))
  const slug = formData.get("slug") as string
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se puede eliminar sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.from(tabla).delete().eq("id", id)
    if (error) throw error
    revalidateProducto(slug)
    return { success: true, message: "Eliminado." }
  } catch (error) {
    console.error(`[tienda/detalle] Error deleting from ${tabla}:`, error)
    return { success: false, message: "Error al eliminar." }
  }
}

export async function reorderListaItem(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  if (!(await checkSecret(secretKey))) return { success: false, message: "Clave secreta inválida." }

  const tabla = formData.get("tabla") as string
  if (!isTablaDetalleValida(tabla)) return { success: false, message: "Tabla no permitida." }

  const id = Number(formData.get("id"))
  const productoId = Number(formData.get("productoId"))
  const slug = formData.get("slug") as string
  const direction = formData.get("direction") as "up" | "down"
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) return { success: false, message: "Modo mock." }

  try {
    const supabase = getSupabaseServerClient()
    const { data: siblings, error } = await supabase
      .from(tabla)
      .select("id, orden")
      .eq("producto_id", productoId)
      .order("orden", { ascending: true })
    if (error) throw error

    const list = (siblings ?? []) as { id: number; orden: number }[]
    const index = list.findIndex((s) => s.id === id)
    if (index === -1) return { success: false, message: "Elemento no encontrado." }

    const swapIndex = direction === "up" ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= list.length) return { success: true, message: "Ya está en el extremo." }

    const a = list[index]
    const b = list[swapIndex]
    const { error: errorA } = await supabase.from(tabla).update({ orden: b.orden }).eq("id", a.id)
    if (errorA) throw errorA
    const { error: errorB } = await supabase.from(tabla).update({ orden: a.orden }).eq("id", b.id)
    if (errorB) throw errorB

    revalidateProducto(slug)
    return { success: true, message: "Orden actualizado." }
  } catch (error) {
    console.error(`[tienda/detalle] Error reordering ${tabla}:`, error)
    return { success: false, message: "Error al reordenar." }
  }
}
