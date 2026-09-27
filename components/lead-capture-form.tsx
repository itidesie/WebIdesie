"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HoneypotField } from "@/components/honeypot-field"
import { HONEYPOT_FIELD } from "@/lib/honeypot"
import { trackMetaPixelEvent } from "@/components/meta-pixel"
import { LEAD_TIME_SLOTS } from "@/lib/leads-time-slots"
import { cn } from "@/lib/utils"

const PROGRAMAS = [
  { value: "MBIM", label: "Máster BIM (MBIM)" },
  { value: "MBBE", label: "Máster BIM & Building Engineering (MBBE)" },
  { value: "EMBIM", label: "Executive Máster BIM (EMBIM)" },
  { value: "Online", label: "Máster BIM Online" },
] as const

/**
 * Fecha y hora actuales en España (Europe/Madrid), calculadas por nombre de zona horaria
 * en vez de con la zona del navegador de quien visita la página — así "hoy" y "ahora mismo"
 * significan lo mismo para alguien en Madrid que para alguien conectado desde otro país.
 * Se trabaja con enteros año/mes/día (nunca con `Date` + zona local) para que la aritmética de
 * días y el día de la semana no dependan de en qué huso horario esté el propio navegador.
 */
function fechaHoraMadridActual(): { y: number; m: number; d: number; hhmm: string } {
  const ahora = new Date()
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(ahora).split("-").map(Number)
  const hhmm = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", hour12: false }).format(ahora)
  return { y, m, d, hhmm }
}
function diaSemanaUTC(y: number, m: number, d: number): number {
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() // 0 = domingo, 6 = sábado
}
function sumarDiasUTC(y: number, m: number, d: number, n: number): { y: number; m: number; d: number } {
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + n)
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() }
}
function isoFecha(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

/** Próximos `n` días HÁBILES (sin sábados ni domingos) desde hoy en Madrid, para el selector de fecha. */
function proximosDiasHabiles(n: number): { iso: string; label: string }[] {
  const hoy = fechaHoraMadridActual()
  const dias: { iso: string; label: string }[] = []
  for (let offset = 0; dias.length < n; offset++) {
    const { y, m, d } = sumarDiasUTC(hoy.y, hoy.m, hoy.d, offset)
    if (diaSemanaUTC(y, m, d) === 0 || diaSemanaUTC(y, m, d) === 6) continue // sin fines de semana
    const label = new Date(Date.UTC(y, m - 1, d))
      .toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })
      .replace(".", "")
    dias.push({ iso: isoFecha(y, m, d), label })
  }
  return dias
}

interface LeadCaptureFormProps {
  /** De qué página/sección viene — viaja tal cual al CRM en `origen`. */
  origen: string
  programaPreseleccionado?: (typeof PROGRAMAS)[number]["value"]
  /** Se llama tras un envío correcto (p. ej. para disparar el píxel de Meta desde la página). */
  onSuccess?: () => void
  className?: string
}

/**
 * Formulario propio de captación — sustituye al embed de Calendly en todo el
 * sitio (2026-09-28). Los datos básicos son obligatorios; agendar una
 * llamada a una hora concreta es OPCIONAL, con su propio interruptor: quien
 * lo activa elige día y franja (10:00–19:00) con disponibilidad real
 * (`GET /api/leads/disponibilidad`); quien no, simplemente deja sus datos
 * para que un asesor le contacte. Persiste en `public.leads`
 * (`POST /api/leads`) y de ahí llega al CRM como entrada `lead_legacy`
 * unificada por email — ver CLAUDE.md.
 */
export function LeadCaptureForm({ origen, programaPreseleccionado, onSuccess, className }: LeadCaptureFormProps) {
  const [nombre, setNombre] = useState("")
  const [apellidos, setApellidos] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [programa, setPrograma] = useState<string>(programaPreseleccionado ?? "")
  const [mensaje, setMensaje] = useState("")
  const [rgpd, setRgpd] = useState(false)

  const [agendar, setAgendar] = useState(false)
  const dias = useMemo(() => proximosDiasHabiles(14), [])
  const [fecha, setFecha] = useState(dias[0].iso)
  const [hora, setHora] = useState<string | null>(null)
  const [ocupadas, setOcupadas] = useState<Set<string>>(new Set())
  const [cargandoHoras, setCargandoHoras] = useState(false)

  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<{ tipo: "error"; texto: string } | { tipo: "ok" } | null>(null)

  // Disponibilidad real de la fecha elegida — solo se consulta si el bloque de llamada está abierto.
  useEffect(() => {
    if (!agendar) return
    let vivo = true
    setCargandoHoras(true)
    setHora(null)
    fetch(`/api/leads/disponibilidad?fecha=${fecha}`)
      .then((r) => r.json())
      .then((d) => {
        if (!vivo) return
        const libres = new Set<string>(d.disponibles ?? LEAD_TIME_SLOTS)
        setOcupadas(new Set(LEAD_TIME_SLOTS.filter((h) => !libres.has(h))))
      })
      .catch(() => vivo && setOcupadas(new Set()))
      .finally(() => vivo && setCargandoHoras(false))
    return () => {
      vivo = false
    }
  }, [agendar, fecha])

  /**
   * Refresco imperativo de disponibilidad — se llama después de un 409 (la hora que se
   * había elegido se acaba de ocupar): a diferencia del `useEffect` de arriba no depende de
   * que cambie `fecha`, así que sin esto la rejilla se habría quedado con la disponibilidad
   * vieja tras el error.
   */
  const refrescarDisponibilidad = async (f: string) => {
    setCargandoHoras(true)
    try {
      const r = await fetch(`/api/leads/disponibilidad?fecha=${f}`)
      const d = await r.json()
      const libres = new Set<string>(d.disponibles ?? LEAD_TIME_SLOTS)
      setOcupadas(new Set(LEAD_TIME_SLOTS.filter((h) => !libres.has(h))))
    } catch {
      // Si la comprobación falla, se deja la disponibilidad tal cual estaba — el 409 real
      // de un segundo intento seguiría protegiendo contra reservar la misma hora dos veces.
    } finally {
      setCargandoHoras(false)
    }
  }

  // Si el día elegido es HOY (en Madrid), las horas que ya han pasado no se muestran — no solo se
  // deshabilitan, se quitan de la rejilla. Se recalcula cada minuto para que, si alguien deja el
  // formulario abierto un rato, no se le siga ofreciendo una hora que ya pasó mientras miraba.
  const [horaMadridAhora, setHoraMadridAhora] = useState(() => fechaHoraMadridActual())
  useEffect(() => {
    const t = setInterval(() => setHoraMadridAhora(fechaHoraMadridActual()), 60_000)
    return () => clearInterval(t)
  }, [])
  const esHoyEnMadrid = fecha === isoFecha(horaMadridAhora.y, horaMadridAhora.m, horaMadridAhora.d)
  const horasVisibles = esHoyEnMadrid ? LEAD_TIME_SLOTS.filter((h) => h > horaMadridAhora.hhmm) : LEAD_TIME_SLOTS

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (agendar && !hora) {
      setResultado({ tipo: "error", texto: "Elige una hora para la llamada." })
      return
    }
    setEnviando(true)
    setResultado(null)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: nombre,
          lastName: apellidos,
          email,
          phone: telefono,
          masterInteres: programa || null,
          mensaje: mensaje || undefined,
          origen,
          agendarLlamada: agendar,
          sessionDate: agendar ? fecha : undefined,
          sessionTime: agendar ? hora : undefined,
          rgpdAceptado: rgpd,
          [HONEYPOT_FIELD]: formData.get(HONEYPOT_FIELD),
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        if (res.status === 409) {
          // La hora elegida se ocupó entre que se cargó la disponibilidad y que se envió el
          // formulario (dos personas mirando el mismo hueco). Se limpia la hora seleccionada
          // y se refresca la rejilla para que la persona vea de un vistazo qué queda libre
          // ahora — no basta con el mensaje, si no se refresca podría reintentar la misma hora.
          setHora(null)
          await refrescarDisponibilidad(fecha)
          throw new Error("Esa hora acaba de ocuparse. Elige otra, por favor.")
        }
        throw new Error(err.message || err.error || "No se pudo enviar la solicitud.")
      }

      setResultado({ tipo: "ok" })
      // Mismos dos eventos que disparaba el listener de `postMessage` de Calendly
      // (`calendly.event_scheduled` → "Schedule" + "Lead"): "Lead" siempre, y
      // "Schedule" solo si además se agendó una hora. Antes de este arreglo, sin
      // agendar llamada se disparaba "Lead" DOS veces (bug propio, no de Calendly).
      if (agendar) trackMetaPixelEvent("Schedule")
      trackMetaPixelEvent("Lead")
      onSuccess?.()
    } catch (error) {
      setResultado({ tipo: "error", texto: error instanceof Error ? error.message : "Ha ocurrido un error. Inténtalo de nuevo." })
    } finally {
      setEnviando(false)
    }
  }

  if (resultado?.tipo === "ok") {
    return (
      <div className={cn("flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-brand/5 via-white to-white p-10 text-center shadow-[0_1px_2px_rgba(16,24,40,0.06),0_24px_48px_-28px_rgba(16,24,40,0.18)] ring-1 ring-brand/10", className)}>
        <span className="flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_12px_24px_-8px_rgba(0,108,255,0.55)]">
          <CheckCircle2 className="size-7" strokeWidth={2.5} />
        </span>
        <div>
          <p className="text-xl font-bold tracking-tight text-gray-900">¡Solicitud recibida!</p>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-gray-600">
            {agendar
              ? "Te confirmaremos la llamada por email. Si el hueco no encaja, te proponemos otro."
              : "Un asesor revisará tu solicitud y se pondrá en contacto contigo muy pronto."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setResultado(null)}
          className="mt-2 text-sm font-semibold text-brand underline-offset-4 hover:underline"
        >
          Enviar otra solicitud
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_24px_48px_-28px_rgba(16,24,40,0.18)] ring-1 ring-gray-900/[0.06] sm:p-8",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-brand/[0.06] blur-3xl" />
      <HoneypotField />

      <div className="relative mb-6 flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <Sparkles className="size-5" />
        </span>
        <div>
          <p className="text-lg font-bold tracking-tight text-gray-900">Cuéntanos qué necesitas</p>
          <p className="text-sm text-gray-500">Respondemos por email o teléfono en menos de 24 h.</p>
        </div>
      </div>

      {resultado?.tipo === "error" && (
        <div role="alert" className="relative mb-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p className="leading-relaxed">{resultado.texto}</p>
        </div>
      )}

      <div className="relative grid gap-4 sm:grid-cols-2">
        <Field icon={User} label="Nombre" required>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required autoComplete="given-name" placeholder="Tu nombre" />
        </Field>
        <Field icon={User} label="Apellidos" required>
          <Input value={apellidos} onChange={(e) => setApellidos(e.target.value)} required autoComplete="family-name" placeholder="Tus apellidos" />
        </Field>
        <Field icon={Mail} label="Email" required>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="tu@email.com" />
        </Field>
        <Field icon={Phone} label="Teléfono" required>
          <Input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required autoComplete="tel" placeholder="+34 600 000 000" />
        </Field>
        <div className="sm:col-span-2">
          <Field icon={GraduationCap} label="Programa de interés (opcional)">
            <Select value={programa} onValueChange={setPrograma}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Aún no lo sé / varios" /></SelectTrigger>
              <SelectContent>{PROGRAMAS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field icon={MessageSquare} label="Mensaje (opcional)">
            <Textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={3} placeholder="¿Algo que debamos saber antes de llamarte?" />
          </Field>
        </div>
      </div>

      {/* Agendar llamada — bloque opcional */}
      <div className="relative mt-6 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors", agendar ? "bg-brand text-white" : "bg-white text-gray-400 ring-1 ring-gray-200")}>
              <CalendarClock className="size-[1.1rem]" />
            </span>
            <div>
              <Label htmlFor="agendar-llamada" className="cursor-pointer text-[15px] font-semibold text-gray-900">
                Prefiero agendar una llamada a una hora concreta
              </Label>
              <p className="mt-0.5 text-sm text-gray-500">Opcional — si no la activas, te contactamos igualmente.</p>
            </div>
          </div>
          <Switch id="agendar-llamada" checked={agendar} onCheckedChange={setAgendar} className="mt-1 shrink-0" />
        </div>

        <div
          className={cn("grid transition-[grid-template-rows] duration-500 [transition-timing-function:var(--ease-spring,cubic-bezier(0.34,1.56,0.64,1))]", agendar ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="mt-5 space-y-4 border-t border-gray-200/80 pt-4">
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Elige un día</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {dias.map((d) => (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setFecha(d.iso)}
                      className={cn(
                        "flex shrink-0 flex-col items-center rounded-xl px-3 py-2 text-xs font-semibold capitalize transition-all",
                        fecha === d.iso ? "bg-brand text-white shadow-[0_8px_16px_-6px_rgba(0,108,255,0.55)]" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-brand/40",
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  <Clock3 className="size-3.5" /> Hora (España) {cargandoHoras && <Loader2 className="size-3.5 animate-spin text-brand" />}
                </p>
                {horasVisibles.length === 0 ? (
                  <p className="text-sm text-gray-500">Hoy ya no queda ninguna hora libre — elige otro día.</p>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {horasVisibles.map((h) => {
                      const libre = !ocupadas.has(h)
                      return (
                        <button
                          key={h}
                          type="button"
                          disabled={!libre}
                          onClick={() => setHora(h)}
                          className={cn(
                            "rounded-xl py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-35 disabled:line-through",
                            hora === h ? "bg-brand text-white shadow-[0_8px_16px_-6px_rgba(0,108,255,0.55)]" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand/40",
                          )}
                        >
                          {h}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RGPD */}
      <label className={cn("relative mt-5 flex cursor-pointer items-start gap-3 rounded-2xl p-3.5 ring-1 ring-inset transition-colors", rgpd ? "bg-brand/5 ring-brand/20" : "bg-gray-50 ring-gray-200")}>
        <span
          role="checkbox"
          aria-checked={rgpd}
          tabIndex={0}
          onClick={() => setRgpd((v) => !v)}
          onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); setRgpd((v) => !v) } }}
          className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors", rgpd ? "border-brand bg-brand text-white" : "border-gray-300 bg-white")}
        >
          {rgpd && <Check className="size-3.5" strokeWidth={3} />}
        </span>
        <input type="checkbox" required checked={rgpd} onChange={(e) => setRgpd(e.target.checked)} className="sr-only" aria-hidden />
        <span className="text-sm leading-relaxed text-gray-600">
          He leído y acepto la{" "}
          <Link href="/politica-privacidad-page" target="_blank" className="font-semibold text-brand underline-offset-2 hover:underline">
            política de privacidad
          </Link>
          .
        </span>
      </label>

      <Button type="submit" size="lg" disabled={enviando} className="relative mt-5 w-full">
        {enviando ? <Loader2 className="animate-spin" /> : agendar ? <CalendarClock /> : <Sparkles />}
        {enviando ? "Enviando…" : agendar ? "Confirmar llamada" : "Enviar solicitud"}
      </Button>
    </form>
  )
}

function Field({ icon: Icon, label, required, children }: { icon: LucideIcon; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-[13px] font-medium text-gray-600">
        <Icon className="size-3.5 text-gray-400" />
        {label}
        {required && <span className="text-brand">*</span>}
      </Label>
      {children}
    </div>
  )
}
