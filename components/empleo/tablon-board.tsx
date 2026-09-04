"use client"

import { useMemo, useState } from "react"
import type { Oferta } from "@/app/empleo/actions"
import { OfertaCard } from "./oferta-card"
import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface TablonBoardProps {
  ofertas: Oferta[]
}

const TODOS = "todos"

/**
 * ★ Momento de mayor dinamismo de la página: el filtro es real (compara
 * `ubicacion`/`tipo_contrato` reales, no substrings decorativos como tenía
 * la versión anterior) y cada tarjeta visible se "clava" en el tablón con un
 * pequeño giro aleatorio + rebote, en vez de un fundido genérico. Se
 * re-anima al cambiar de filtro (a diferencia del ledger de Financiación,
 * aquí el propio filtrado es la interacción principal de la sección, así
 * que repetir el gesto refuerza que la lista cambió de verdad).
 */
export function TablonBoard({ ofertas }: TablonBoardProps) {
  const [ubicacion, setUbicacion] = useState(TODOS)
  const [tipoContrato, setTipoContrato] = useState(TODOS)

  const ubicaciones = useMemo(
    () => Array.from(new Set(ofertas.map((o) => o.ubicacion).filter((v): v is string => Boolean(v)))).sort(),
    [ofertas],
  )
  const tiposContrato = useMemo(
    () => Array.from(new Set(ofertas.map((o) => o.tipo_contrato).filter((v): v is string => Boolean(v)))).sort(),
    [ofertas],
  )

  const filtradas = ofertas.filter((o) => {
    const matchesUbicacion = ubicacion === TODOS || o.ubicacion === ubicacion
    const matchesTipo = tipoContrato === TODOS || o.tipo_contrato === tipoContrato
    return matchesUbicacion && matchesTipo
  })

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <FiltroSelect
          label="Ubicación"
          value={ubicacion}
          onChange={setUbicacion}
          options={ubicaciones}
          allLabel="Todas las ubicaciones"
        />
        <FiltroSelect
          label="Tipo de contrato"
          value={tipoContrato}
          onChange={setTipoContrato}
          options={tiposContrato}
          allLabel="Todos los contratos"
        />
        <p className="tablon-mono ml-auto text-xs text-white/50">
          {filtradas.length} de {ofertas.length} ofertas
        </p>
      </div>

      {filtradas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/20 p-12 text-center text-white/60">
          No hay ofertas que coincidan con este filtro.
        </div>
      ) : (
        <PinnedGrid key={`${ubicacion}|${tipoContrato}`} ofertas={filtradas} />
      )}
    </div>
  )
}

/**
 * Aislado en su propio componente para que el `key` del padre lo remonte
 * entero al cambiar el filtro — es lo que hace que el gesto de "clavado" se
 * repita cada vez que la lista cambia de verdad, no solo la primera vez que
 * la sección entra en pantalla.
 */
function PinnedGrid({ ofertas }: { ofertas: Oferta[] }) {
  const scopeRef = useGsapEffect<HTMLDivElement>(({ gsap }, scope) => {
    const cards = scope.querySelectorAll("[data-card]")
    gsap.fromTo(
      cards,
      { opacity: 0, y: 22, rotate: () => gsap.utils.random(-3, 3), scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        rotate: () => gsap.utils.random(-1.2, 1.2),
        scale: 1,
        duration: 0.55,
        stagger: 0.07,
        ease: "back.out(1.7)",
        // `once` evalúa la posición actual al crearse: si ya está a la
        // vista (p. ej. al cambiar de filtro con la sección ya visible),
        // dispara de inmediato en vez de esperar un scroll que no va a
        // llegar.
        scrollTrigger: { trigger: scope, start: "top 90%", once: true },
      },
    )
  })

  return (
    <div ref={scopeRef} className="grid grid-cols-1 gap-8 pt-2 sm:grid-cols-2 xl:grid-cols-3">
      {ofertas.map((oferta) => (
        <OfertaCard key={oferta.id} oferta={oferta} />
      ))}
    </div>
  )
}

interface FiltroSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  allLabel: string
}

function FiltroSelect({ label, value, onChange, options, allLabel }: FiltroSelectProps) {
  if (options.length === 0) return null
  return (
    <label className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white">
      <span className="tablon-mono text-[0.65rem] uppercase tracking-wide text-white/50">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm font-medium text-white outline-none [&>option]:text-gray-950"
      >
        <option value={TODOS}>{allLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}
