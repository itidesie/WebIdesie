"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { trackMetaPixelEvent } from "@/components/landing/meta-pixel"
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Globe,
  GraduationCap,
  Landmark,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react"
import type { OrigenAdmision, ProgramaAdmision } from "@/lib/admision-db"

interface AdmisionModalProps {
  /** Preselecciona el programa según la página desde la que se abre — editable por el usuario. */
  programaPreseleccionado?: ProgramaAdmision
  /** Página de origen, para saber qué botón generó la solicitud. */
  origen: OrigenAdmision
  children: React.ReactNode
}

const PROGRAMAS: { value: ProgramaAdmision; label: string }[] = [
  { value: "MBIM", label: "Máster BIM (MBIM)" },
  { value: "MBBE", label: "Máster BIM & Building Engineering (MBBE)" },
  { value: "EMBIM", label: "Executive Máster BIM (EMBIM)" },
  { value: "Online", label: "Máster BIM Online" },
]

interface FormState {
  nombreCompleto: string
  email: string
  telefono: string
  pais: string
  ciudad: string
  fechaNacimiento: string
  titulacionPrevia: string
  universidadOrigen: string
  programaSolicitado: ProgramaAdmision | ""
  mensaje: string
  rgpdAceptado: boolean
}

function emptyForm(programaPreseleccionado?: ProgramaAdmision): FormState {
  return {
    nombreCompleto: "",
    email: "",
    telefono: "",
    pais: "",
    ciudad: "",
    fechaNacimiento: "",
    titulacionPrevia: "",
    universidadOrigen: "",
    programaSolicitado: programaPreseleccionado ?? "",
    mensaje: "",
    rgpdAceptado: false,
  }
}

/**
 * Formulario de solicitud de admisión — modal compartido entre /landing y
 * las 4 páginas de máster (MBIM, MBBE, EMBIM, Online).
 *
 * Reescrito de cero (2026-09-04 (40)) tras la auditoría de formularios:
 * antes reutilizaba la plantilla de `JobApplicationModal` sin más
 * personalidad que unos tokens sueltos. Ahora habla el mismo idioma que ya
 * tiene el resto del sitio — icono por campo (mismo patrón que
 * `PedidoCoupon`), radio y sombra de `.pedido-card`, `.btn-sweep` en el
 * envío, `--ease-spring` en la insignia de cabecera — sin inventar un
 * vocabulario nuevo, solo aplicando el que ya existe a un formulario que se
 * había quedado fuera.
 *
 * **Sin campo de CV** (2026-09-04 (40), decisión explícita del cliente): la
 * solicitud ya no pide currículum. La columna `cv_url` de
 * `solicitudes_admision` sigue existiendo (ya era nullable, no hizo falta
 * migrar nada) por si se reactiva más adelante — este componente
 * simplemente no la rellena.
 */
export function AdmisionModal({ programaPreseleccionado, origen, children }: AdmisionModalProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(() => emptyForm(programaPreseleccionado))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")
  const [submitError, setSubmitError] = useState("")
  const firstFieldRef = useRef<HTMLInputElement>(null)

  const resetAndClose = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setTimeout(() => {
        setForm(emptyForm(programaPreseleccionado))
        setErrors({})
        setStatus("idle")
        setSubmitError("")
      }, 200)
    }
  }

  const setField = <K extends keyof FormState>(field: K) => (value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.nombreCompleto.trim()) next.nombreCompleto = "Indica tu nombre completo."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Indica un correo válido."
    if (!/^[+\d][\d\s]{7,}$/.test(form.telefono.trim())) next.telefono = "Indica un teléfono válido."
    if (!form.programaSolicitado) next.programaSolicitado = "Selecciona un programa."
    if (!form.rgpdAceptado) next.rgpdAceptado = "Debes aceptar la política de privacidad."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")
    if (!validate()) return

    setStatus("submitting")
    try {
      const res = await fetch("/api/admision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCompleto: form.nombreCompleto,
          email: form.email,
          telefono: form.telefono,
          pais: form.pais || undefined,
          ciudad: form.ciudad || undefined,
          fechaNacimiento: form.fechaNacimiento || undefined,
          titulacionPrevia: form.titulacionPrevia || undefined,
          universidadOrigen: form.universidadOrigen || undefined,
          programaSolicitado: form.programaSolicitado,
          origen,
          mensaje: form.mensaje || undefined,
          rgpdAceptado: form.rgpdAceptado,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Error al enviar la solicitud")
      }

      setStatus("success")
      // Este modal se usa en varias páginas (MBIM/MBBE/EMBIM/Online/landing),
      // pero el Meta Pixel solo carga en /landing — trackMetaPixelEvent()
      // no hace nada si window.fbq no existe, así que esta llamada es segura
      // en el resto de páginas (ver components/landing/meta-pixel.tsx).
      trackMetaPixelEvent("Lead")
    } catch (error) {
      setStatus("idle")
      setSubmitError(error instanceof Error ? error.message : "Ha ocurrido un error. Inténtalo de nuevo.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        data-lenis-prevent
        className="max-h-[90vh] overflow-y-auto rounded-2xl border-border/80 shadow-2xl sm:max-w-[580px]"
        onOpenAutoFocus={(e) => {
          // Enfoca el primer campo de texto real, no el disparador del
          // propio Dialog (que Radix enfocaría por defecto) — "primer campo"
          // en el sentido útil: donde el usuario va a escribir primero.
          e.preventDefault()
          firstFieldRef.current?.focus()
        }}
      >
        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <span className="animate-in zoom-in-50 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand duration-500 [animation-timing-function:var(--ease-spring)]">
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <DialogTitle>Solicitud enviada correctamente</DialogTitle>
            <DialogDescription>
              Hemos recibido tu solicitud de admisión. Nuestro equipo la revisará y se pondrá en contacto contigo en
              breve.
            </DialogDescription>
            <Button onClick={() => resetAndClose(false)} className="mt-2 bg-brand text-white hover:bg-brand-strong">
              Cerrar
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <span className="animate-in zoom-in-50 mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand duration-500 [animation-timing-function:var(--ease-spring)]">
                <GraduationCap className="h-5.5 w-5.5" />
              </span>
              <DialogTitle>Solicitud de admisión</DialogTitle>
              <DialogDescription>
                Completa tus datos. Nuestro equipo de admisiones revisará tu solicitud y se pondrá en contacto
                contigo.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {submitError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {submitError}
                </div>
              )}

              <div>
                <Label htmlFor="programaSolicitado" className="flex items-center gap-1.5 text-sm font-semibold">
                  <BookOpen className="h-3.5 w-3.5 text-brand" />
                  Programa al que aplicas <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.programaSolicitado}
                  onValueChange={(value) => setField("programaSolicitado")(value as ProgramaAdmision)}
                >
                  <SelectTrigger
                    id="programaSolicitado"
                    className="mt-1.5 w-full"
                    aria-invalid={!!errors.programaSolicitado}
                  >
                    <SelectValue placeholder="Elige un programa" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAMAS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.programaSolicitado && (
                  <p className="mt-1 text-xs text-destructive">{errors.programaSolicitado}</p>
                )}
              </div>

              <div className="space-y-3.5">
                <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-brand-strong">
                  Datos personales
                </p>

                <div>
                  <Label htmlFor="nombreCompleto" className="text-sm font-medium">
                    Nombre completo <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative mt-1.5">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      ref={firstFieldRef}
                      id="nombreCompleto"
                      autoComplete="name"
                      value={form.nombreCompleto}
                      onChange={(e) => setField("nombreCompleto")(e.target.value)}
                      aria-invalid={!!errors.nombreCompleto}
                      className="pl-10"
                    />
                  </div>
                  {errors.nombreCompleto && <p className="mt-1 text-xs text-destructive">{errors.nombreCompleto}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-destructive">*</span>
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
                  <div>
                    <Label htmlFor="telefono" className="text-sm font-medium">
                      Teléfono <span className="text-destructive">*</span>
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
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <Label htmlFor="ciudad" className="text-sm font-medium">
                      Ciudad de residencia
                    </Label>
                    <div className="relative mt-1.5">
                      <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="ciudad"
                        autoComplete="address-level2"
                        value={form.ciudad}
                        onChange={(e) => setField("ciudad")(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pais" className="text-sm font-medium">
                      País de residencia
                    </Label>
                    <div className="relative mt-1.5">
                      <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="pais"
                        autoComplete="country-name"
                        value={form.pais}
                        onChange={(e) => setField("pais")(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="fechaNacimiento" className="text-sm font-medium">
                    Fecha de nacimiento
                  </Label>
                  <div className="relative mt-1.5">
                    <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="fechaNacimiento"
                      type="date"
                      autoComplete="bday"
                      value={form.fechaNacimiento}
                      onChange={(e) => setField("fechaNacimiento")(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3.5">
                <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-brand-strong">
                  Datos académicos
                </p>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <Label htmlFor="titulacionPrevia" className="text-sm font-medium">
                      Titulación previa
                    </Label>
                    <div className="relative mt-1.5">
                      <GraduationCap className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="titulacionPrevia"
                        value={form.titulacionPrevia}
                        onChange={(e) => setField("titulacionPrevia")(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="universidadOrigen" className="text-sm font-medium">
                      Universidad de origen
                    </Label>
                    <div className="relative mt-1.5">
                      <Landmark className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="universidadOrigen"
                        value={form.universidadOrigen}
                        onChange={(e) => setField("universidadOrigen")(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="mensaje" className="text-sm font-medium">
                  Mensaje / motivación
                </Label>
                <div className="relative mt-1.5">
                  <MessageSquare className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="mensaje"
                    rows={3}
                    value={form.mensaje}
                    onChange={(e) => setField("mensaje")(e.target.value)}
                    className="resize-none pl-10"
                    placeholder="Cuéntanos brevemente por qué te interesa este programa (opcional)."
                  />
                </div>
              </div>

              <div
                data-invalid={!!errors.rgpdAceptado}
                className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 transition-colors duration-200 [transition-timing-function:var(--ease-out-quart)] data-[invalid=true]:border-destructive/40 data-[invalid=true]:bg-destructive/5"
              >
                <Checkbox
                  id="rgpdAceptado"
                  checked={form.rgpdAceptado}
                  onCheckedChange={(checked) => setField("rgpdAceptado")(checked === true)}
                  aria-invalid={!!errors.rgpdAceptado}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor="rgpdAceptado" className="text-sm font-normal leading-relaxed text-foreground">
                    Acepto la{" "}
                    <Link
                      href="/politica-privacidad-page"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-brand-strong underline hover:text-brand"
                    >
                      política de privacidad
                    </Link>{" "}
                    y el tratamiento de mis datos personales para el proceso de admisión.{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  {errors.rgpdAceptado && <p className="mt-1 text-xs text-destructive">{errors.rgpdAceptado}</p>}
                </div>
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
                  "Enviar solicitud"
                )}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Tus datos se envían de forma segura y solo se usan para tu proceso de admisión.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
