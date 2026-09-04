"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { verifyAdminSecret } from "@/lib/admin-secret"

export type EstadoSolicitud = "pendiente" | "revisado" | "aceptado" | "rechazado"

export interface Solicitud {
  id: string
  nombre_completo: string
  email: string
  telefono: string
  pais: string | null
  ciudad: string | null
  fecha_nacimiento: string | null
  titulacion_previa: string | null
  universidad_origen: string | null
  programa_solicitado: string
  origen: string
  cv_url: string | null
  mensaje: string | null
  estado: EstadoSolicitud
  created_at: string
}

interface ActionResult {
  success: boolean
  message: string
}

const SOLICITUD_COLUMNS =
  "id, nombre_completo, email, telefono, pais, ciudad, fecha_nacimiento, titulacion_previa, universidad_origen, programa_solicitado, origen, cv_url, mensaje, estado, created_at"

/** Misma verificación compartida que blog/tienda/empleo — nunca reimplementada. */
async function verifySecretKey(secretKey: string): Promise<boolean> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Admisiones", "verificación de clave simulada — siempre inválida")
    return false
  }
  try {
    return (await verifyAdminSecret(secretKey)) !== null
  } catch (error) {
    console.error("[admision] Error verifying secret key:", error)
    return false
  }
}

/** Todas las solicitudes, más recientes primero — para /admin/admisiones. */
export async function getAdminSolicitudes(): Promise<Solicitud[]> {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Admisiones", "listado de admin simulado")
    return []
  }
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("solicitudes_admision")
      .select(SOLICITUD_COLUMNS)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error("[admision] Error fetching admin solicitudes:", error)
    return []
  }
}

/** Cambia el estado de gestión de una solicitud (pendiente/revisado/aceptado/rechazado). */
export async function updateEstadoSolicitud(formData: FormData): Promise<ActionResult> {
  const secretKey = formData.get("secretKey") as string
  if (!(await verifySecretKey(secretKey))) {
    return { success: false, message: "Clave secreta inválida." }
  }

  const id = formData.get("id") as string
  const estado = formData.get("estado") as string
  const ESTADOS: EstadoSolicitud[] = ["pendiente", "revisado", "aceptado", "rechazado"]
  if (!id || !ESTADOS.includes(estado as EstadoSolicitud)) {
    return { success: false, message: "Id y estado válidos son obligatorios." }
  }

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    return { success: false, message: "Modo mock: no se puede actualizar sin conexión a Supabase." }
  }

  try {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.from("solicitudes_admision").update({ estado }).eq("id", id)
    if (error) throw error

    revalidatePath("/admin/admisiones")

    return { success: true, message: "Estado actualizado correctamente." }
  } catch (error) {
    console.error("[admision] Error updating estado:", error)
    return { success: false, message: "Error al actualizar el estado." }
  }
}
