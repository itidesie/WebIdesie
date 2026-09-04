"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { MOCK_OFERTAS, type MockOferta } from "@/lib/mock-data"
import { verifyAdminSecret } from "@/lib/admin-secret"

export interface Oferta {
  id: number
  puesto: string
  empresa: string
  ubicacion: string | null
  salario: string | null
  tipo_contrato: string | null
  descripcion: string | null
  enlace_externo: string | null
  destacada: boolean
  activa: boolean
  created_at: string
  updated_at: string
}

interface ActionResult {
  success: boolean
  message: string
  data?: unknown
}

const OFERTA_COLUMNS =
  "id, puesto, empresa, ubicacion, salario, tipo_contrato, descripcion, enlace_externo, destacada, activa, created_at, updated_at"

/** Misma verificación compartida que blog y tienda — nunca reimplementada. */
async function verifySecretKey(secretKey: string): Promise<boolean> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Empleo", "verificación de clave simulada — siempre inválida")
    return false
  }
  try {
    return (await verifyAdminSecret(secretKey)) !== null
  } catch (error) {
    console.error("[empleo] Error verifying secret key:", error)
    return false
  }
}

function mockToOferta(mock: MockOferta): Oferta {
  return {
    ...mock,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

/** Todas las ofertas, activas e inactivas — para el listado de admin. */
export async function getAdminOfertas(): Promise<Oferta[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Empleo", "listado de admin simulado")
    return MOCK_OFERTAS.map(mockToOferta)
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("ofertas_empleo")
      .select(OFERTA_COLUMNS)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error("[empleo] Error fetching admin ofertas:", error)
    return []
  }
}

/** Una oferta por id, activa o no — para la página de edición. */
export async function getAdminOfertaById(id: number): Promise<Oferta | null> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Empleo", `ficha de admin simulada → ${id}`)
    const mock = MOCK_OFERTAS.find((o) => o.id === id)
    return mock ? mockToOferta(mock) : null
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("ofertas_empleo").select(OFERTA_COLUMNS).eq("id", id).limit(1)
    if (error) throw error
    return data?.[0] ?? null
  } catch (error) {
    console.error("[empleo] Error fetching admin oferta:", error)
    return null
  }
}

/** Ofertas activas, para /bolsa-de-empleo-page. */
export async function getPublicOfertas(): Promise<Oferta[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Empleo", "listado público simulado")
    return MOCK_OFERTAS.filter((o) => o.activa)
      .sort((a, b) => Number(b.destacada) - Number(a.destacada) || a.id - b.id)
      .map(mockToOferta)
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("ofertas_empleo")
      .select(OFERTA_COLUMNS)
      .eq("activa", true)
      .order("destacada", { ascending: false })
      .order("id", { ascending: true })
    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error("[empleo] Error fetching public ofertas:", error)
    return []
  }
}

function readOfertaFields(formData: FormData) {
  return {
    puesto: (formData.get("puesto") as string)?.trim(),
    empresa: (formData.get("empresa") as string)?.trim(),
    ubicacion: (formData.get("ubicacion") as string) || null,
    salario: (formData.get("salario") as string) || null,
    tipoContrato: (formData.get("tipoContrato") as string) || null,
    descripcion: (formData.get("descripcion") as string) || null,
    enlaceExterno: (formData.get("enlaceExterno") as string) || null,
    destacada: formData.get("destacada") === "true",
    activa: formData.get("activa") === "true",
  }
}

export async function createOferta(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  if (!(await verifySecretKey(secretKey))) {
    return { success: false, message: "Clave secreta inválida." }
  }

  const fields = readOfertaFields(formData)
  if (!fields.puesto || !fields.empresa) {
    return { success: false, message: "Puesto y empresa son obligatorios." }
  }

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se pueden crear ofertas sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()
    const { data: newOferta, error } = await supabase
      .from("ofertas_empleo")
      .insert({
        puesto: fields.puesto,
        empresa: fields.empresa,
        ubicacion: fields.ubicacion,
        salario: fields.salario,
        tipo_contrato: fields.tipoContrato,
        descripcion: fields.descripcion,
        enlace_externo: fields.enlaceExterno,
        destacada: fields.destacada,
        activa: fields.activa,
      })
      .select(OFERTA_COLUMNS)
      .single()
    if (error) throw error

    revalidatePath("/bolsa-de-empleo-page")
    revalidatePath("/admin/empleo")

    return { success: true, message: "Oferta creada correctamente.", data: newOferta }
  } catch (error) {
    console.error("[empleo] Error creating oferta:", error)
    return {
      success: false,
      message: `Error al crear la oferta: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}

export async function updateOferta(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  if (!(await verifySecretKey(secretKey))) {
    return { success: false, message: "Clave secreta inválida." }
  }

  const id = Number(formData.get("id"))
  const fields = readOfertaFields(formData)
  if (!id || !fields.puesto || !fields.empresa) {
    return { success: false, message: "Puesto y empresa son obligatorios." }
  }

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se pueden editar ofertas sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()
    const { data: updated, error } = await supabase
      .from("ofertas_empleo")
      .update({
        puesto: fields.puesto,
        empresa: fields.empresa,
        ubicacion: fields.ubicacion,
        salario: fields.salario,
        tipo_contrato: fields.tipoContrato,
        descripcion: fields.descripcion,
        enlace_externo: fields.enlaceExterno,
        destacada: fields.destacada,
        activa: fields.activa,
      })
      .eq("id", id)
      .select(OFERTA_COLUMNS)
      .single()

    if (error || !updated) {
      return { success: false, message: "Oferta no encontrada." }
    }

    revalidatePath("/bolsa-de-empleo-page")
    revalidatePath("/admin/empleo")

    return { success: true, message: "Oferta actualizada correctamente.", data: updated }
  } catch (error) {
    console.error("[empleo] Error updating oferta:", error)
    return { success: false, message: "Error al actualizar la oferta." }
  }
}

export interface Candidatura {
  id: string
  oferta_id: number | null
  oferta_puesto: string | null
  nombre: string
  email: string
  telefono: string
  mensaje: string | null
  cv_url: string | null
  created_at: string
}

/** Candidaturas recibidas, más recientes primero — para /admin/empleo/candidaturas. */
export async function getAdminCandidaturas(): Promise<Candidatura[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Empleo", "listado de candidaturas simulado")
    return []
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("candidaturas_empleo")
      .select("id, oferta_id, oferta_puesto, nombre, email, telefono, mensaje, cv_url, created_at")
      .order("created_at", { ascending: false })
    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error("[empleo] Error fetching candidaturas:", error)
    return []
  }
}

export async function deleteOferta(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  if (!(await verifySecretKey(secretKey))) {
    return { success: false, message: "Clave secreta inválida." }
  }

  const id = Number(formData.get("id"))
  if (!id) {
    return { success: false, message: "Id es requerido." }
  }

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se pueden eliminar ofertas sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()
    // candidaturas_empleo.oferta_id referencia con `on delete set null`: las
    // candidaturas ya recibidas se conservan (con oferta_puesto guardado
    // aparte) aunque se borre la oferta.
    const { data: deleted, error } = await supabase
      .from("ofertas_empleo")
      .delete()
      .eq("id", id)
      .select(OFERTA_COLUMNS)
      .single()

    if (error || !deleted) {
      return { success: false, message: "Oferta no encontrada." }
    }

    revalidatePath("/bolsa-de-empleo-page")
    revalidatePath("/admin/empleo")

    return { success: true, message: "Oferta eliminada correctamente.", data: deleted }
  } catch (error) {
    console.error("[empleo] Error deleting oferta:", error)
    return { success: false, message: "Error al eliminar la oferta." }
  }
}
