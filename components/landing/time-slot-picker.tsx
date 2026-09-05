"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface TimeSlotPickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  time: string
  onTimeChange: (time: string) => void
  /** Sube en +1 para forzar una nueva consulta de disponibilidad — se usa
   * tras un 409 (la franja elegida se acaba de ocupar). */
  refreshToken: number
  dateError?: string
  timeError?: string
}

type Availability =
  | { status: "idle" | "loading" | "error"; slots: string[] }
  | { status: "ready"; slots: string[] }

/** "YYYY-MM-DD" en hora LOCAL — `toISOString()` usa UTC y puede desplazar
 * el día (p. ej. medianoche en España cae en el día anterior en UTC). */
function toIsoDateLocal(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/**
 * Fecha → franjas disponibles, en dos pasos: primero el día (calendario
 * real, no un `<input type="date">"), luego las horas libres de ese día
 * como una rejilla de píldoras — las franjas ya reservadas por otro lead
 * simplemente no aparecen, nunca se muestran "ocupadas". La disponibilidad
 * se consulta a `/api/leads/disponibilidad` cada vez que cambia el día.
 */
export function TimeSlotPicker({
  date,
  onDateChange,
  time,
  onTimeChange,
  refreshToken,
  dateError,
  timeError,
}: TimeSlotPickerProps) {
  const [availability, setAvailability] = useState<Availability>({ status: "idle", slots: [] })

  const isoDate = date ? toIsoDateLocal(date) : null

  useEffect(() => {
    if (!isoDate) {
      setAvailability({ status: "idle", slots: [] })
      return
    }
    let cancelled = false
    setAvailability((prev) => ({ status: "loading", slots: prev.slots }))

    fetch(`/api/leads/disponibilidad?fecha=${isoDate}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo comprobar la disponibilidad")
        return res.json() as Promise<{ disponibles: string[] }>
      })
      .then((body) => {
        if (!cancelled) setAvailability({ status: "ready", slots: body.disponibles })
      })
      .catch(() => {
        if (!cancelled) setAvailability({ status: "error", slots: [] })
      })

    return () => {
      cancelled = true
    }
  }, [isoDate, refreshToken])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1.5 text-sm font-medium text-foreground">Fecha</p>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(next) => {
            onDateChange(next)
            onTimeChange("")
          }}
          disabled={{ before: today }}
          className="w-fit rounded-lg border p-2"
        />
        {dateError && <p className="mt-1 text-xs text-destructive">{dateError}</p>}
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-foreground">Hora (España)</p>

        {!date ? (
          <p className="text-sm text-muted-foreground">Elige primero una fecha.</p>
        ) : availability.status === "loading" ? (
          <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Comprobando franjas disponibles…
          </div>
        ) : availability.status === "error" ? (
          <p className="text-sm text-destructive">No se pudo comprobar la disponibilidad. Inténtalo de nuevo.</p>
        ) : availability.slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">No quedan franjas libres este día — elige otro día.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {availability.slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => onTimeChange(slot)}
                aria-pressed={time === slot}
                className={cn(
                  "rounded-lg border px-2 py-2 font-mono text-sm font-medium transition-colors",
                  time === slot
                    ? "border-brand bg-brand text-white"
                    : "border-input bg-background hover:border-brand/50 hover:bg-brand/5",
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        )}
        {timeError && <p className="mt-1 text-xs text-destructive">{timeError}</p>}
      </div>
    </div>
  )
}

export { toIsoDateLocal }
