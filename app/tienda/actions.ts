"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { MOCK_PRODUCTS, type MockProduct } from "@/lib/mock-data"
import { verifyAdminSecret } from "@/lib/admin-secret"

export interface Producto {
  id: number
  slug: string
  tipo: string
  categoria: string | null
  nombre: string
  descripcion_corta: string | null
  descripcion_larga: string | null
  precio_actual: number | null
  precio_original: number | null
  precio_matricula: number | null
  duracion_meses: number | null
  duracion_horas: number | null
  modalidad: string | null
  certificacion: string | null
  destacado: boolean
  imagen: string | null
  imagen_alt: string | null
  activo: boolean
  created_at: string
  updated_at: string
}

interface ActionResult {
  success: boolean
  message: string
  data?: unknown
}

const PRODUCTO_COLUMNS =
  "id, slug, tipo, categoria, nombre, descripcion_corta, descripcion_larga, precio_actual, precio_original, precio_matricula, duracion_meses, duracion_horas, modalidad, certificacion, destacado, imagen, imagen_alt, activo, created_at, updated_at"

/** Verifica la clave de admin igual que el blog — misma implementación
 * compartida, nunca una comparación propia. Ver lib/admin-secret.ts. */
async function verifySecretKey(secretKey: string): Promise<boolean> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Admin", "verificación de clave simulada — siempre inválida")
    return false
  }
  try {
    const matchedId = await verifyAdminSecret(secretKey)
    return matchedId !== null
  } catch (error) {
    console.error("[tienda] Error verifying secret key:", error)
    return false
  }
}

function mockToProducto(mock: MockProduct): Producto {
  return {
    ...mock,
    categoria: null,
    precio_original: mock.precio_original ?? null,
    precio_matricula: null,
    duracion_meses: mock.duracion_meses ?? null,
    duracion_horas: mock.duracion_horas ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

/** Todos los productos, activos e inactivos — para el listado de admin.
 * Distinto de `/api/productos`, que solo devuelve `activo = true`. */
export async function getAdminProductos(): Promise<Producto[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Productos", "listado de admin simulado")
    return MOCK_PRODUCTS.map(mockToProducto)
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("productos")
      .select(PRODUCTO_COLUMNS)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error("[tienda] Error fetching admin productos:", error)
    return []
  }
}

/** Un producto por slug, activo o no — para la página de edición. */
export async function getAdminProductoBySlug(slug: string): Promise<Producto | null> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Productos", `ficha de admin simulada → ${slug}`)
    const mock = MOCK_PRODUCTS.find((p) => p.slug === slug)
    return mock ? mockToProducto(mock) : null
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("productos").select(PRODUCTO_COLUMNS).eq("slug", slug).limit(1)
    if (error) throw error
    return data?.[0] ?? null
  } catch (error) {
    console.error("[tienda] Error fetching admin producto:", error)
    return null
  }
}

/** Productos activos, para /tienda y /api/productos — única fuente de esta
 * consulta; antes vivía duplicada en app/api/productos/route.ts. */
export async function getPublicProductos(): Promise<Producto[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Productos", "listado público simulado")
    return MOCK_PRODUCTS.filter((p) => p.activo)
      .sort((a, b) => Number(b.destacado) - Number(a.destacado) || a.id - b.id)
      .map(mockToProducto)
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("productos")
      .select(PRODUCTO_COLUMNS)
      .eq("activo", true)
      .order("destacado", { ascending: false })
      .order("id", { ascending: true })
    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error("[tienda] Error fetching public productos:", error)
    return []
  }
}

function readProductoFields(formData: FormData) {
  const precioActualRaw = formData.get("precioActual") as string
  const precioOriginalRaw = formData.get("precioOriginal") as string
  const precioMatriculaRaw = formData.get("precioMatricula") as string
  const duracionMesesRaw = formData.get("duracionMeses") as string
  const duracionHorasRaw = formData.get("duracionHoras") as string

  return {
    slug: (formData.get("slug") as string)?.trim(),
    tipo: formData.get("tipo") as string,
    categoria: (formData.get("categoria") as string) || null,
    nombre: (formData.get("nombre") as string)?.trim(),
    descripcionCorta: (formData.get("descripcionCorta") as string) || null,
    descripcionLarga: (formData.get("descripcionLarga") as string) || null,
    // NULL = sin precio publicado ("Precio no disponible, contactar"), no
    // confundir con 0 = gratuito. Antes precioActual era obligatorio (columna
    // NOT NULL) — ver scripts/026_precio_actual_nullable.sql.
    precioActual: precioActualRaw ? Number(precioActualRaw) : null,
    precioOriginal: precioOriginalRaw ? Number(precioOriginalRaw) : null,
    precioMatricula: precioMatriculaRaw ? Number(precioMatriculaRaw) : null,
    duracionMeses: duracionMesesRaw ? Number(duracionMesesRaw) : null,
    duracionHoras: duracionHorasRaw ? Number(duracionHorasRaw) : null,
    modalidad: (formData.get("modalidad") as string) || null,
    certificacion: (formData.get("certificacion") as string) || null,
    destacado: formData.get("destacado") === "true",
    imagen: (formData.get("imagen") as string) || null,
    imagenAlt: (formData.get("imagenAlt") as string) || null,
    activo: formData.get("activo") === "true",
  }
}

export async function createProducto(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  const isValidKey = await verifySecretKey(secretKey)
  if (!isValidKey) {
    return { success: false, message: "Clave secreta inválida." }
  }

  const fields = readProductoFields(formData)

  if (!fields.slug || !fields.tipo || !fields.nombre) {
    return { success: false, message: "Slug, tipo y nombre son obligatorios." }
  }

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se pueden crear productos sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()

    const { data: existing } = await supabase.from("productos").select("id").eq("slug", fields.slug).limit(1)
    if (existing && existing.length > 0) {
      return { success: false, message: "Ya existe un producto con ese slug." }
    }

    const { data: newProducto, error } = await supabase
      .from("productos")
      .insert({
        slug: fields.slug,
        tipo: fields.tipo,
        categoria: fields.categoria,
        nombre: fields.nombre,
        descripcion_corta: fields.descripcionCorta,
        descripcion_larga: fields.descripcionLarga,
        precio_actual: fields.precioActual,
        precio_original: fields.precioOriginal,
        precio_matricula: fields.precioMatricula,
        duracion_meses: fields.duracionMeses,
        duracion_horas: fields.duracionHoras,
        modalidad: fields.modalidad,
        certificacion: fields.certificacion,
        destacado: fields.destacado,
        imagen: fields.imagen,
        imagen_alt: fields.imagenAlt,
        activo: fields.activo,
      })
      .select(PRODUCTO_COLUMNS)
      .single()
    if (error) throw error

    revalidatePath("/tienda")
    revalidatePath("/admin/tienda")
    revalidatePath("/sitemap.xml")

    return { success: true, message: "Producto creado correctamente.", data: newProducto }
  } catch (error) {
    console.error("[tienda] Error creating producto:", error)
    return {
      success: false,
      message: `Error al crear el producto: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}

export async function updateProducto(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  const isValidKey = await verifySecretKey(secretKey)
  if (!isValidKey) {
    return { success: false, message: "Clave secreta inválida." }
  }

  const originalSlug = formData.get("originalSlug") as string
  const fields = readProductoFields(formData)

  if (!originalSlug || !fields.slug || !fields.tipo || !fields.nombre) {
    return { success: false, message: "Slug, tipo y nombre son obligatorios." }
  }

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se pueden editar productos sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()

    if (fields.slug !== originalSlug) {
      const { data: existing } = await supabase.from("productos").select("id").eq("slug", fields.slug).limit(1)
      if (existing && existing.length > 0) {
        return { success: false, message: "Ya existe otro producto con ese slug." }
      }
    }

    const { data: updated, error } = await supabase
      .from("productos")
      .update({
        slug: fields.slug,
        tipo: fields.tipo,
        categoria: fields.categoria,
        nombre: fields.nombre,
        descripcion_corta: fields.descripcionCorta,
        descripcion_larga: fields.descripcionLarga,
        precio_actual: fields.precioActual,
        precio_original: fields.precioOriginal,
        precio_matricula: fields.precioMatricula,
        duracion_meses: fields.duracionMeses,
        duracion_horas: fields.duracionHoras,
        modalidad: fields.modalidad,
        certificacion: fields.certificacion,
        destacado: fields.destacado,
        imagen: fields.imagen,
        imagen_alt: fields.imagenAlt,
        activo: fields.activo,
      })
      .eq("slug", originalSlug)
      .select(PRODUCTO_COLUMNS)
      .single()

    if (error || !updated) {
      return { success: false, message: "Producto no encontrado." }
    }

    revalidatePath("/tienda")
    revalidatePath("/admin/tienda")
    revalidatePath(`/producto/${originalSlug}`)
    if (fields.slug !== originalSlug) revalidatePath(`/producto/${fields.slug}`)
    revalidatePath("/sitemap.xml")

    return { success: true, message: "Producto actualizado correctamente.", data: updated }
  } catch (error) {
    console.error("[tienda] Error updating producto:", error)
    return { success: false, message: "Error al actualizar el producto." }
  }
}

export async function deleteProducto(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  const isValidKey = await verifySecretKey(secretKey)
  if (!isValidKey) {
    return { success: false, message: "Clave secreta inválida." }
  }

  const slug = formData.get("slug") as string
  if (!slug) {
    return { success: false, message: "Slug es requerido." }
  }

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se pueden eliminar productos sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()
    // Las 7 tablas de detalle referencian productos.id con `on delete cascade`
    // (scripts/023) — borrar el producto borra automáticamente sus módulos,
    // temas, FAQs, etc. No hace falta borrarlos a mano.
    const { data: deleted, error } = await supabase
      .from("productos")
      .delete()
      .eq("slug", slug)
      .select(PRODUCTO_COLUMNS)
      .single()

    if (error || !deleted) {
      return { success: false, message: "Producto no encontrado." }
    }

    revalidatePath("/tienda")
    revalidatePath("/admin/tienda")
    revalidatePath("/sitemap.xml")

    return { success: true, message: "Producto eliminado correctamente.", data: deleted }
  } catch (error) {
    console.error("[tienda] Error deleting producto:", error)
    return { success: false, message: "Error al eliminar el producto." }
  }
}
