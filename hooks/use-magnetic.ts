"use client"

import { useEffect, useRef } from "react"
import { loadGsap } from "@/lib/gsap"

/**
 * Botón magnético: el elemento se desplaza levemente hacia el cursor cuando
 * este entra en su radio.
 *
 * Usa gsap.quickTo, que reutiliza el mismo tween en lugar de crear uno nuevo en
 * cada pointermove. Esa es la razón de que se sienta sedoso y no a tirones, y de
 * que no cueste nada en rendimiento.
 *
 * Solo con puntero fino: en táctil no hay cursor al que acercarse. Y nunca si el
 * usuario pidió reducir movimiento, en cuyo caso GSAP ni se descarga.
 */
export function useMagnetic<T extends HTMLElement = HTMLAnchorElement>(strength = 0.35) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const fine = window.matchMedia("(pointer: fine)")
    if (reduced.matches || !fine.matches) return

    let dispose: (() => void) | undefined
    let cancelled = false

    loadGsap().then(({ gsap }) => {
      if (cancelled) return

      const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" })
      const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" })

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        const offsetX = event.clientX - (rect.left + rect.width / 2)
        const offsetY = event.clientY - (rect.top + rect.height / 2)

        // Radio de influencia: media diagonal más un margen, para que el tirón
        // empiece antes de estar encima del botón.
        const radius = Math.max(rect.width, rect.height) * 0.9 + 60
        const distance = Math.hypot(offsetX, offsetY)

        if (distance > radius) {
          moveX(0)
          moveY(0)
          return
        }

        // Cuanto más cerca, más fuerte el tirón.
        const falloff = 1 - distance / radius
        moveX(offsetX * strength * falloff)
        moveY(offsetY * strength * falloff)
      }

      const onLeave = () => {
        moveX(0)
        moveY(0)
      }

      window.addEventListener("pointermove", onMove, { passive: true })
      window.addEventListener("blur", onLeave)

      dispose = () => {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("blur", onLeave)
        gsap.set(el, { x: 0, y: 0 })
      }
    })

    return () => {
      cancelled = true
      dispose?.()
    }
  }, [strength])

  return ref
}
