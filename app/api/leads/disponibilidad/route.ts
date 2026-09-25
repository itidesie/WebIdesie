import { NextResponse } from "next/server"

/**
 * 🔒 DESACTIVADO (410 Gone). Endpoint sin uso.
 *
 * Lo consultaba el selector de horarios (`TimeSlotPicker`) del antiguo
 * formulario de sesión informativa de `/landing`, sustituido por Calendly. Es
 * parte del mismo sistema que `POST /api/leads` (ver ese archivo): ningún
 * código lo llama. Además hacía una consulta a la base de datos por petición,
 * sin autenticación ni límite. La tabla `leads` no se toca.
 */
export async function GET() {
  return NextResponse.json(
    { error: "gone", message: "Este endpoint ha sido retirado." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  )
}
