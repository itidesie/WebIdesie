"use client"

import { useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TimeSlotPicker, toIsoDateLocal } from "@/components/landing/time-slot-picker"
import { trackMetaPixelEvent } from "@/components/landing/meta-pixel"

interface InfoRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** De qué botón/máster vino el clic — para saber el origen del lead, no se muestra al usuario. */
  context: string
}

interface FormState {
  nombre: string
  apellidos: string
  telefono: string
  email: string
  fecha: Date | undefined
  hora: string
}

const EMPTY_FORM: FormState = { nombre: "", apellidos: "", telefono: "", email: "", fecha: undefined, hora: "" }

/**
 * Nombres de máster reales — para separar `context` ("MBIM", "Hero",
 * "Cierre"...) en las dos columnas que pide el esquema de `leads`:
 * `master_interes` (el máster, cuando el botón era de uno concreto) y
 * `origen` (la página/sección, siempre). Vive aquí y no en cada sección de
 * la landing para no tener que tocar los 5 componentes que ya pasan
 * `context` como una sola cadena.
 */
const MASTER_NAMES = new Set(["MBIM", "MBBE", "EMBIM", "Online"])

function splitContext(context: string): { masterInteres: string | null; origen: string } {
  if (MASTER_NAMES.has(context)) return { masterInteres: context, origen: "Landing" }
  return { masterInteres: null, origen: `Landing · ${context}` }
}

/**
 * Formulario de solicitud de sesión informativa. Genérico a propósito — el
 * `context` (qué botón lo abrió: "MBIM", "Cierre", "Hero"...) via `/api/leads`.
 *
 * Fecha: calendario visual (`TimeSlotPicker`), lunes a domingo, sin días
 * pasados. Hora: franjas fijas de 10:00 a 19:00 en punto, hora española —
 * pero solo se listan las que `/api/leads/disponibilidad` devuelve libres
 * para el día elegido; las ya reservadas por otro lead no aparecen, nunca
 * se muestran "ocupadas".
 *
 * Conectado a Supabase vía `/api/leads` → `lib/leads-db.ts`. El email de
 * confirmación sigue en modo mock (falta `RESEND_API_KEY`) — se ve reflejado
 * en la consola del servidor, no aquí.
 *
 * 🔒 La comprobación de disponibilidad es solo UX — la barrera real es el
 * índice único parcial de `scripts/033` en la propia tabla `leads`. Si dos
 * personas reservan la misma franja casi a la vez, el servidor devuelve 409
 * a quien pierde la carrera (`refreshToken` fuerza a `TimeSlotPicker` a
 * volver a consultar disponibilidad sin que la franja recién ocupada quede
 * huérfana en la rejilla).
 */
export function InfoRequestModal({ open, onOpenChange, context }: InfoRequestModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")
  const [refreshToken, setRefreshToken] = useState(0)

  const resetAndClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      // Pequeño retraso para no ver el formulario vaciarse mientras el diálogo cierra.
      setTimeout(() => {
        setForm(EMPTY_FORM)
        setErrors({})
        setStatus("idle")
      }, 200)
    }
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.nombre.trim()) next.nombre = "Indica tu nombre."
    if (!form.apellidos.trim()) next.apellidos = "Indica tus apellidos."
    if (!/^[+\d][\d\s]{7,}$/.test(form.telefono.trim())) next.telefono = "Indica un teléfono válido."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Indica un correo válido."
    if (!form.fecha) next.fecha = "Elige una fecha."
    if (!form.hora) next.hora = "Elige una hora."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !form.fecha) return

    setStatus("submitting")
    try {
      const { masterInteres, origen } = splitContext(context)
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.nombre,
          lastName: form.apellidos,
          phone: form.telefono,
          email: form.email,
          sessionDate: toIsoDateLocal(form.fecha),
          sessionTime: form.hora,
          masterInteres,
          origen,
        }),
      })

      if (res.status === 409) {
        const body = await res.json().catch(() => null)
        setErrors({ hora: body?.message || "Esa franja acaba de reservarse. Elige otra." })
        setForm((prev) => ({ ...prev, hora: "" }))
        // La franja ocupada desaparece de la rejilla sin recargar la página.
        setRefreshToken((n) => n + 1)
        setStatus("idle")
        return
      }
      if (!res.ok) throw new Error(await res.text())

      setStatus("success")
      // Conversión real de /landing — la única página con el Meta Pixel
      // (ver components/landing/meta-pixel.tsx). No lanza nada si el
      // píxel no cargó (localhost, desarrollo, o sin ID configurado).
      trackMetaPixelEvent("Lead")
    } catch {
      setStatus("idle")
      setErrors({ email: "Algo ha fallado. Inténtalo de nuevo." })
    }
  }

  const setField = (field: "nombre" | "apellidos" | "telefono" | "email") => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-lg">
        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-brand" />
            <DialogTitle>Solicitud enviada</DialogTitle>
            <DialogDescription>
              Te confirmaremos la sesión informativa por email y por teléfono. Gracias por tu interés.
            </DialogDescription>
            <Button onClick={() => resetAndClose(false)} className="mt-2 bg-brand text-white hover:bg-brand-strong">
              Cerrar
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Solicita información</DialogTitle>
              <DialogDescription>
                Déjanos tus datos y agenda una sesión informativa de 30 minutos, sin compromiso.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={form.nombre}
                    onChange={(e) => setField("nombre")(e.target.value)}
                    aria-invalid={!!errors.nombre}
                    className="mt-1.5"
                  />
                  {errors.nombre && <p className="mt-1 text-xs text-destructive">{errors.nombre}</p>}
                </div>
                <div>
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input
                    id="apellidos"
                    value={form.apellidos}
                    onChange={(e) => setField("apellidos")(e.target.value)}
                    aria-invalid={!!errors.apellidos}
                    className="mt-1.5"
                  />
                  {errors.apellidos && <p className="mt-1 text-xs text-destructive">{errors.apellidos}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => setField("telefono")(e.target.value)}
                  aria-invalid={!!errors.telefono}
                  className="mt-1.5"
                />
                {errors.telefono && <p className="mt-1 text-xs text-destructive">{errors.telefono}</p>}
              </div>

              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email")(e.target.value)}
                  aria-invalid={!!errors.email}
                  className="mt-1.5"
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>

              <TimeSlotPicker
                date={form.fecha}
                onDateChange={(fecha) => {
                  setForm((prev) => ({ ...prev, fecha, hora: "" }))
                  setErrors((prev) => ({ ...prev, fecha: undefined, hora: undefined }))
                }}
                time={form.hora}
                onTimeChange={(hora) => {
                  setForm((prev) => ({ ...prev, hora }))
                  setErrors((prev) => ({ ...prev, hora: undefined }))
                }}
                refreshToken={refreshToken}
                dateError={errors.fecha}
                timeError={errors.hora}
              />
              <p className="text-xs text-muted-foreground">Sesiones de lunes a domingo, de 10:00 a 20:00 (hora española).</p>

              <Button type="submit" disabled={status === "submitting"} className="w-full bg-brand text-white hover:bg-brand-strong">
                {status === "submitting" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  "Solicitar sesión informativa"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
