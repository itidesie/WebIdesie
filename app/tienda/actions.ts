"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { MOCK_PRODUCTS, type MockProduct } from "@/lib/mock-data"

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

const PRODUCTO_COLUMNS =
  "id, slug, tipo, categoria, nombre, descripcion_corta, descripcion_larga, precio_actual, precio_original, precio_matricula, duracion_meses, duracion_horas, modalidad, certificacion, destacado, imagen, imagen_alt, activo, created_at, updated_at"

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
