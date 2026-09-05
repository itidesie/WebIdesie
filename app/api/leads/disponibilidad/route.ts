import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { LEAD_TIME_SLOTS } from "@/lib/leads-time-slots"

const fechaSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida")
  .refine((v) => !Number.isNaN(new Date(`${v}T00:00:00`).getTime()), "Fecha no válida")

/**
 * Franjas libres para una fecha — consultado por `TimeSlotPicker` cada vez
 * que el usuario cambia de día en el calendario de `/landing`.
 *
 * Pública, sin autenticación (como `/api/productos`): no devuelve ningún
 * dato personal, solo qué horas de las 10 posibles ya están ocupadas ese
 * día. Es una comprobación de UX, no la barrera real contra dobles
 * reservas — esa es el índice único parcial de `scripts/033` en la propia
 * tabla `leads`; esta ruta puede decir "libre" y aun así el POST siguiente
 * puede chocar con otro lead que reservó un instante antes (ver 409 en
 * `POST /api/leads`).
 */
export async function GET(request: NextRequest) {
  const fechaParam = request.nextUrl.searchParams.get("fecha")
  const parsed = fechaSchema.safeParse(fechaParam)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Fecha no válida" }, { status: 400 })
  }
  const fecha = parsed.data

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Leads", `disponibilidad consultada en mock → ${fecha}: las 10 franjas libres`)
    return NextResponse.json({ disponibles: LEAD_TIME_SLOTS })
  }

  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("leads")
    .select("session_time")
    .eq("session_date", fecha)
    .neq("status", "descartado")

  if (error) {
    console.error("[api/leads/disponibilidad] Error al consultar Supabase:", error.message)
    return NextResponse.json({ error: "No se pudo comprobar la disponibilidad" }, { status: 500 })
  }

  const ocupadas = new Set((data ?? []).map((row) => String(row.session_time).slice(0, 5)))
  const disponibles = LEAD_TIME_SLOTS.filter((slot) => !ocupadas.has(slot))

  return NextResponse.json({ disponibles })
}
