"use client"

import { useMemo, useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { trackMetaPixelEvent } from "@/components/landing/meta-pixel"

interface InfoRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** De qué botón/máster vino el clic — para saber el origen del lead, no se muestra al usuario. */
  context: string
}

/** 10:00, 11:00 … 19:00 — última sesión empieza a las 19:00 y termina a las 20:00. */
const TIME_SLOTS = Array.from({ length: 10 }, (_, i) => `${String(i + 10).padStart(2, "0")}:00`)

interface FormState {
  nombre: string
  apellidos: string
  telefono: string
  email: string
  fecha: string
  hora: string
}

const EMPTY_FORM: FormState = { nombre: "", apellidos: "", telefono: "", email: "", fecha: "", hora: "" }

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
 * Fecha: lunes a domingo, sin restricción de día (input nativo, con `min`
 * en hoy para no permitir fechas pasadas). Hora: franja fija 10:00–19:00 en
 * intervalos de una hora, hora española — son las reglas de negocio dadas,
 * no algo que el usuario pueda salirse.
 *
 * Conectado a Supabase vía `/api/leads` → `lib/leads-db.ts`. El email de
 * confirmación sigue en modo mock (falta `RESEND_API_KEY`) — se ve reflejado
 * en la consola del servidor, no aquí.
 */
export function InfoRequestModal({ open, onOpenChange, context }: InfoRequestModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")

  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

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
    else if (form.fecha < today) next.fecha = "Elige una fecha a partir de hoy."
    if (!form.hora) next.hora = "Elige una hora."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

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
          sessionDate: form.fecha,
          sessionTime: form.hora,
          masterInteres,
          origen,
        }),
      })
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

  const setField = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    min={today}
                    value={form.fecha}
                    onChange={(e) => setField("fecha")(e.target.value)}
                    aria-invalid={!!errors.fecha}
                    className="mt-1.5"
                  />
                  {errors.fecha && <p className="mt-1 text-xs text-destructive">{errors.fecha}</p>}
                </div>
                <div>
                  <Label htmlFor="hora">Hora (España)</Label>
                  <Select value={form.hora} onValueChange={setField("hora")}>
                    <SelectTrigger id="hora" className="mt-1.5 w-full" aria-invalid={!!errors.hora}>
                      <SelectValue placeholder="Elige una hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.hora && <p className="mt-1 text-xs text-destructive">{errors.hora}</p>}
                </div>
              </div>
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
