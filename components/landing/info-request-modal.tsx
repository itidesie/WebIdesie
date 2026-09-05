"use client"

import { useRef, useState } from "react"
import { CheckCircle2, Loader2, Mail, PhoneCall, Phone, ShieldCheck, User } from "lucide-react"
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

/** "martes, 14 de octubre" — `toLocaleDateString` en es-ES devuelve el día
 * de la semana en minúscula, se capitaliza para usarlo como inicio de frase
 * en la confirmación de éxito. */
function formatFechaEs(fecha: Date): string {
  const raw = fecha.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
  return raw.charAt(0).toUpperCase() + raw.slice(1)
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
 *
 * 🎨 2026-09-06 — rediseño visual al mismo nivel que `AdmisionModal` (este
 * es el formulario que de verdad convierte en `/landing`, y hasta ahora se
 * había quedado con los primitivos genéricos mientras el otro modal ya tenía
 * icono por campo, insignia animada, agrupación por eyebrow y `.btn-sweep`).
 * Mismo vocabulario, cero cambios de validación/lógica.
 *
 * Continuidad de mensaje con el CTA que abre este modal ("Agendar mi llamada
 * gratuita"): título, botón de envío y confirmación de éxito hablan ahora de
 * "llamada", no de "solicitud de información" — y el éxito confirma la
 * fecha/hora reales que el usuario acaba de elegir, no un genérico "enviado".
 */
export function InfoRequestModal({ open, onOpenChange, context }: InfoRequestModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")
  const [refreshToken, setRefreshToken] = useState(0)
  const firstFieldRef = useRef<HTMLInputElement>(null)

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
      <DialogContent
        data-lenis-prevent
        className="max-h-[90vh] overflow-y-auto rounded-2xl border-border/80 shadow-2xl sm:max-w-lg"
        onOpenAutoFocus={(e) => {
          // Enfoca el primer campo de texto real, no el disparador del
          // propio Dialog — mismo patrón que AdmisionModal.
          e.preventDefault()
          firstFieldRef.current?.focus()
        }}
      >
        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <span className="animate-in zoom-in-50 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand duration-500 [animation-timing-function:var(--ease-spring)]">
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <DialogTitle>¡Llamada confirmada!</DialogTitle>
            <DialogDescription>
              {form.fecha
                ? `Te llamamos el ${formatFechaEs(form.fecha)} a las ${form.hora}. Te enviamos la confirmación también por email.`
                : "Te confirmaremos la sesión por email y por teléfono. Gracias por tu interés."}
            </DialogDescription>
            <Button onClick={() => resetAndClose(false)} className="mt-2 bg-brand text-white hover:bg-brand-strong">
              Cerrar
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <span className="animate-in zoom-in-50 mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand duration-500 [animation-timing-function:var(--ease-spring)]">
                <PhoneCall className="h-5.5 w-5.5" />
              </span>
              <DialogTitle>Agenda tu llamada gratuita</DialogTitle>
              <DialogDescription>Elige el día y la hora que mejor te vengan. 30 minutos, sin compromiso.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="space-y-3.5">
                <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-brand-strong">
                  Tus datos
                </p>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <Label htmlFor="nombre" className="text-sm font-medium">
                      Nombre
                    </Label>
                    <div className="relative mt-1.5">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        ref={firstFieldRef}
                        id="nombre"
                        autoComplete="given-name"
                        value={form.nombre}
                        onChange={(e) => setField("nombre")(e.target.value)}
                        aria-invalid={!!errors.nombre}
                        className="pl-10"
                      />
                    </div>
                    {errors.nombre && <p className="mt-1 text-xs text-destructive">{errors.nombre}</p>}
                  </div>
                  <div>
                    <Label htmlFor="apellidos" className="text-sm font-medium">
                      Apellidos
                    </Label>
                    <div className="relative mt-1.5">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="apellidos"
                        autoComplete="family-name"
                        value={form.apellidos}
                        onChange={(e) => setField("apellidos")(e.target.value)}
                        aria-invalid={!!errors.apellidos}
                        className="pl-10"
                      />
                    </div>
                    {errors.apellidos && <p className="mt-1 text-xs text-destructive">{errors.apellidos}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <Label htmlFor="telefono" className="text-sm font-medium">
                      Teléfono
                    </Label>
                    <div className="relative mt-1.5">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="telefono"
                        type="tel"
                        autoComplete="tel"
                        value={form.telefono}
                        onChange={(e) => setField("telefono")(e.target.value)}
                        aria-invalid={!!errors.telefono}
                        className="pl-10"
                      />
                    </div>
                    {errors.telefono && <p className="mt-1 text-xs text-destructive">{errors.telefono}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Correo electrónico
                    </Label>
                    <div className="relative mt-1.5">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setField("email")(e.target.value)}
                        aria-invalid={!!errors.email}
                        className="pl-10"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-3.5">
                <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-brand-strong">
                  Elige tu horario
                </p>
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
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-sweep flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  "Confirmar mi llamada"
                )}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Tus datos se envían de forma segura y solo se usan para tu sesión informativa.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
