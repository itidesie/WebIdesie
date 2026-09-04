"use client"

import { useInView } from "@/hooks/use-in-view"
import { useEffect, useState } from "react"

interface StatCounterProps {
  /** Valor tal cual se muestra, p. ej. "1250+" o "100%". */
  value: string
  className?: string
}

/** Separa "1250+" en 1250 y "+". Si no hay número, se muestra el texto literal. */
function parse(value: string) {
  const match = value.match(/^(\D*)(\d[\d.,]*)(.*)$/)
  if (!match) return null
  return { prefix: match[1], target: Number(match[2].replace(/[.,]/g, "")), suffix: match[3] }
}

const DURATION = 1400

/**
 * Cuenta desde 0 hasta el valor final cuando entra en pantalla.
 *
 * El primer render (servidor y cliente) muestra ya el valor definitivo: sin JS
 * el dato es correcto, no hay salto de layout y el LCP no depende de esto. La
 * cuenta solo arranca tras la hidratación y si el usuario no pidió reducir
 * movimiento.
 */
export function StatCounter({ value, className = "" }: StatCounterProps) {
  const parsed = parse(value)
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.5 })
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (!parsed || !isInView) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    const start = performance.now()
    // easeOutExpo: arranca rápido y frena al final.
    const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1)
      const current = Math.round(parsed.target * ease(progress))
      setDisplay(`${parsed.prefix}${current}${parsed.suffix}`)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isInView, parsed?.target, parsed?.prefix, parsed?.suffix])

  return (
    <div ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </div>
  )
}
