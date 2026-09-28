"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { MOCK_OFERTAS, type MockOferta } from "@/lib/mock-data"

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

const OFERTA_COLUMNS =
  "id, puesto, empresa, ubicacion, salario, tipo_contrato, descripcion, enlace_externo, destacada, activa, created_at, updated_at"

function mockToOferta(mock: MockOferta): Oferta {
  return {
    ...mock,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
