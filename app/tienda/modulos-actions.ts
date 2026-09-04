"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { verifyAdminSecret } from "@/lib/admin-secret"

interface ActionResult {
  success: boolean
  message: string
}

export interface Tema {
  id: number
  modulo_id: number
  titulo: string
  orden: number
}

export interface Modulo {
  id: number
  producto_id: number
  titulo: string
  descripcion: string | null
  orden: number
  temas: Tema[]
}

/** Misma verificación compartida que el resto de tienda — ver lib/admin-secret.ts. */
async function checkSecret(secretKey: string): Promise<boolean> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Tienda — módulos", "verificación de clave simulada — siempre inválida")
    return false
  }
  try {
    return (await verifyAdminSecret(secretKey)) !== null
  } catch (error) {
    console.error("[tienda/modulos] Error verifying secret key:", error)
    return false
  }
}

type SupabaseClient = ReturnType<typeof getSupabaseServerClient>

/**
 * Intercambia el `orden` de un elemento con su vecino inmediato — la unidad
 * mínima que necesita cualquier control "subir/bajar". Compartido por
 * módulos y temas, que son dos tablas distintas pero con el mismo problema.
 */
async function swapOrden(
  supabase: SupabaseClient,
  tabla: "producto_modulos" | "modulo_temas",
  siblings: { id: number; orden: number }[],
  id: number,
  direction: "up" | "down",
): Promise<ActionResult> {
  const index = siblings.findIndex((s) => s.id === id)
  if (index === -1) return { success: false, message: "Elemento no encontrado." }

  const swapIndex = direction === "up" ? index - 1 : index + 1
  if (swapIndex < 0 || swapIndex >= siblings.length) {
    return { success: true, message: "Ya está en el extremo." }
  }

  const a = siblings[index]
  const b = siblings[swapIndex]

  const { error: errorA } = await supabase.from(tabla).update({ orden: b.orden }).eq("id", a.id)
  if (errorA) return { success: false, message: errorA.message }

  const { error: errorB } = await supabase.from(tabla).update({ orden: a.orden }).eq("id", b.id)
  if (errorB) return { success: false, message: errorB.message }

  return { success: true, message: "Orden actualizado." }
}

function revalidateProducto(slug: string) {
  revalidatePath(`/admin/tienda/${slug}/editar`)
  revalidatePath(`/producto/${slug}`)
}

/** Módulos de un producto con sus temas anidados, ambos ordenados por `orden`. */
export async function getModulosConTemas(productoId: number): Promise<Modulo[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Tienda — módulos", `listado simulado para producto ${productoId}`)
    return []
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("producto_modulos")
      .select("*, temas:modulo_temas(*)")
      .eq("producto_id", productoId)
      .order("orden", { ascending: true })
      .order("orden", { ascending: true, foreignTable: "modulo_temas" })
    if (error) throw error
    return (data ?? []) as Modulo[]
  } catch (error) {
    console.error("[tienda/modulos] Error fetching módulos:", error)
    return []
  }
}

export async function saveModulo(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  if (!(await checkSecret(secretKey))) return { success: false, message: "Clave secreta inválida." }

  const idRaw = formData.get("id") as string
  const productoId = Number(formData.get("productoId"))
  const slug = formData.get("slug") as string
  const titulo = (formData.get("titulo") as string)?.trim()
  const descripcion = (formData.get("descripcion") as string)?.trim() || null

  if (!titulo) return { success: false, message: "El título del módulo es obligatorio." }
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se puede guardar sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()
    if (idRaw) {
      const { error } = await supabase
        .from("producto_modulos")
        .update({ titulo, descripcion })
        .eq("id", Number(idRaw))
      if (error) throw error
    } else {
      const { count } = await supabase
        .from("producto_modulos")
        .select("id", { count: "exact", head: true })
        .eq("producto_id", productoId)
      const { error } = await supabase
        .from("producto_modulos")
        .insert({ producto_id: productoId, titulo, descripcion, orden: count ?? 0 })
      if (error) throw error
    }
    revalidateProducto(slug)
    return { success: true, message: "Módulo guardado." }
  } catch (error) {
    console.error("[tienda/modulos] Error saving módulo:", error)
    return {
      success: false,
      message: `Error al guardar el módulo: ${error instanceof Error ? error.message : "desconocido"}`,
    }
  }
}

export async function deleteModulo(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  if (!(await checkSecret(secretKey))) return { success: false, message: "Clave secreta inválida." }

  const id = Number(formData.get("id"))
  const slug = formData.get("slug") as string
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se puede eliminar sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()
    // `modulo_temas.modulo_id` referencia con `on delete cascade` (scripts/023)
    // — borrar el módulo se lleva sus temas sin ninguna consulta extra.
    const { error } = await supabase.from("producto_modulos").delete().eq("id", id)
    if (error) throw error
    revalidateProducto(slug)
    return { success: true, message: "Módulo eliminado." }
  } catch (error) {
    console.error("[tienda/modulos] Error deleting módulo:", error)
    return { success: false, message: "Error al eliminar el módulo." }
  }
}

export async function reorderModulo(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  if (!(await checkSecret(secretKey))) return { success: false, message: "Clave secreta inválida." }

  const id = Number(formData.get("id"))
  const productoId = Number(formData.get("productoId"))
  const slug = formData.get("slug") as string
  const direction = formData.get("direction") as "up" | "down"
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) return { success: false, message: "Modo mock." }

  try {
    const supabase = getSupabaseServerClient()
    const { data: siblings, error } = await supabase
      .from("producto_modulos")
      .select("id, orden")
      .eq("producto_id", productoId)
      .order("orden", { ascending: true })
    if (error) throw error

    const result = await swapOrden(supabase, "producto_modulos", siblings ?? [], id, direction)
    if (result.success) revalidateProducto(slug)
    return result
  } catch (error) {
    console.error("[tienda/modulos] Error reordering módulo:", error)
    return { success: false, message: "Error al reordenar el módulo." }
  }
}

export async function saveTema(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  if (!(await checkSecret(secretKey))) return { success: false, message: "Clave secreta inválida." }

  const idRaw = formData.get("id") as string
  const moduloId = Number(formData.get("moduloId"))
  const slug = formData.get("slug") as string
  const titulo = (formData.get("titulo") as string)?.trim()

  if (!titulo) return { success: false, message: "El título del tema es obligatorio." }
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se puede guardar sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()
    if (idRaw) {
      const { error } = await supabase.from("modulo_temas").update({ titulo }).eq("id", Number(idRaw))
      if (error) throw error
    } else {
      const { count } = await supabase
        .from("modulo_temas")
        .select("id", { count: "exact", head: true })
        .eq("modulo_id", moduloId)
      const { error } = await supabase.from("modulo_temas").insert({ modulo_id: moduloId, titulo, orden: count ?? 0 })
      if (error) throw error
    }
    revalidateProducto(slug)
    return { success: true, message: "Tema guardado." }
  } catch (error) {
    console.error("[tienda/modulos] Error saving tema:", error)
    return {
      success: false,
      message: `Error al guardar el tema: ${error instanceof Error ? error.message : "desconocido"}`,
    }
  }
}

export async function deleteTema(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  if (!(await checkSecret(secretKey))) return { success: false, message: "Clave secreta inválida." }

  const id = Number(formData.get("id"))
  const slug = formData.get("slug") as string
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se puede eliminar sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.from("modulo_temas").delete().eq("id", id)
    if (error) throw error
    revalidateProducto(slug)
    return { success: true, message: "Tema eliminado." }
  } catch (error) {
    console.error("[tienda/modulos] Error deleting tema:", error)
    return { success: false, message: "Error al eliminar el tema." }
  }
}

export async function reorderTema(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  if (!(await checkSecret(secretKey))) return { success: false, message: "Clave secreta inválida." }

  const id = Number(formData.get("id"))
  const moduloId = Number(formData.get("moduloId"))
  const slug = formData.get("slug") as string
  const direction = formData.get("direction") as "up" | "down"
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) return { success: false, message: "Modo mock." }

  try {
    const supabase = getSupabaseServerClient()
    const { data: siblings, error } = await supabase
      .from("modulo_temas")
      .select("id, orden")
      .eq("modulo_id", moduloId)
      .order("orden", { ascending: true })
    if (error) throw error

    const result = await swapOrden(supabase, "modulo_temas", siblings ?? [], id, direction)
    if (result.success) revalidateProducto(slug)
    return result
  } catch (error) {
    console.error("[tienda/modulos] Error reordering tema:", error)
    return { success: false, message: "Error al reordenar el tema." }
  }
}
