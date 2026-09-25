import { NextResponse } from "next/server"

/**
 * 🔒 DESACTIVADO (410 Gone). Endpoint sin uso.
 *
 * Era el backend de las solicitudes de sesión informativa del antiguo
 * `InfoRequestModal`/`TimeSlotPicker` de `/landing` (calendario de
 * disponibilidad propio). Ese formulario se sustituyó por el embed de
 * Calendly y desde entonces NINGÚN componente, página ni Server Action llama a
 * `POST /api/leads` (comprobado por búsqueda en todo el repo). Como era un
 * endpoint público sin captcha ni rate limiting, cualquiera podía crear filas
 * en `leads` y ocupar franjas de un calendario que ya no existe.
 *
 * Qué se conserva a propósito (no se ha borrado nada):
 *   - la tabla `leads` y su índice único `leads_slot_unico` (scripts/020, 033);
 *   - `lib/leads-db.ts`, `lib/leads-time-slots.ts` y `emails/lead-confirmation.tsx`,
 *     que serán el punto de partida de un sistema de reservas propio.
 *
 * Para reactivarlo: restaurar el handler desde el historial de git
 * (commit anterior a "security: desactivar /api/leads") y AÑADIR antes
 * `checkRateLimit` + honeypot como el resto de endpoints públicos.
 */
export async function POST() {
  return NextResponse.json(
    { error: "gone", message: "Este endpoint ha sido retirado." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  )
}
