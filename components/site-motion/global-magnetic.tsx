"use client"

import { useEffect, useRef } from "react"
import { loadGsapCore } from "@/lib/gsap-core"

/**
 * Motor centralizado del magnetismo de botones — la versión "a escala" de
 * `hooks/use-magnetic.ts` (que sigue existiendo para los puntos donde ya se
 * usaba antes de este sistema, ver más abajo). En vez de que cada botón
 * cablee su propio `pointermove` a `window` (bien para 8 usos puntuales, no
 * para "todos los botones del sitio"), esto es UN solo listener delegado,
 * montado una vez desde `SiteMotionProvider`, que recorre los elementos
 * marcados con `data-magnetic` y anima el que esté bajo/cerca del cursor.
 *
 * Cómo se marca un elemento:
 * - `<Button magnetic>` (ver `components/ui/button.tsx`) para cualquier cosa
 *   que ya pase por el componente compartido — cubre admin, formularios,
 *   la mayoría de CTAs sin tocar nada más.
 * - `data-magnetic` a pelo en cualquier otro `<a>`/`<button>` que no use
 *   `<Button>` (triggers de Radix, links con clase `.btn-*` propia de cada
 *   vocabulario visual, iconos de redes en el footer...).
 * - `data-magnetic-strength="0.2"` para suavizar el tirón en elementos
 *   pequeños si el valor automático (ver `smallElementFactor` abajo) no
 *   basta. `data-magnetic="off"` excluye explícitamente un elemento que de
 *   otro modo coincidiría (p. ej. un hijo con `data-magnetic` heredado por
 *   error de un ancestro — no ocurre con el selector actual, pero queda la
 *   vía de escape).
 *
 * Por qué NO es un `querySelectorAll` en cada `pointermove`: eso repetiría
 * un recorrido del DOM entero 60 veces por segundo. En su lugar, la lista de
 * elementos candidatos se cachea y solo se refresca cuando el DOM cambia de
 * verdad (MutationObserver) o la ventana cambia de tamaño — el propio
 * `pointermove` solo hace aritmética sobre esa lista ya resuelta.
 */

const MAGNETIC_SELECTOR = "[data-magnetic]:not([data-magnetic='off'])"

/** Por debajo de este tamaño (px, el lado menor) el tirón se atenúa — un
 *  botón de icono (44px, `size="icon"` de `Button`) no debe desplazarse
 *  tanto como un CTA grande o el efecto se siente errático en algo tan
 *  pequeño. */
const SMALL_ELEMENT_THRESHOLD = 48
const SMALL_ELEMENT_FACTOR = 0.5
const DEFAULT_STRENGTH = 0.32

type Candidate = {
  el: HTMLElement
  moveX: (value: number) => void
  moveY: (value: number) => void
}

export function GlobalMagnetic() {
  const activeRef = useRef<Candidate | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const fine = window.matchMedia("(pointer: fine)")

    let disposers: Array<() => void> = []
    let cancelled = false

    const start = () => {
      if (cancelled || reduced.matches || !fine.matches) return

      loadGsapCore().then((gsap) => {
        if (cancelled || reduced.matches) return

        // gsap.quickTo por elemento, cacheado: reentrar en el mismo botón
        // reutiliza el mismo tween en vez de crear uno nuevo.
        const tweenCache = new WeakMap<HTMLElement, Candidate>()
        let elements: HTMLElement[] = []
        let rafId: number | null = null
        let pendingEvent: PointerEvent | null = null

        const getCandidate = (el: HTMLElement): Candidate => {
          const cached = tweenCache.get(el)
          if (cached) return cached
          const candidate: Candidate = {
            el,
            moveX: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }),
            moveY: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }),
          }
          tweenCache.set(el, candidate)
          return candidate
        }

        const rescan = () => {
          elements = Array.from(document.querySelectorAll<HTMLElement>(MAGNETIC_SELECTOR)).filter(
            (el) => !(el as HTMLButtonElement).disabled,
          )
        }

        const resetActive = () => {
          const active = activeRef.current
          if (!active) return
          active.moveX(0)
          active.moveY(0)
          activeRef.current = null
        }

        const processMove = (event: PointerEvent) => {
          rafId = null
          let nearest: { candidate: Candidate; offsetX: number; offsetY: number } | null = null
          let nearestDistance = Infinity

          for (const el of elements) {
            if (!el.isConnected) continue
            const rect = el.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const offsetX = event.clientX - centerX
            const offsetY = event.clientY - centerY
            const distance = Math.hypot(offsetX, offsetY)

            // Radio de influencia: media diagonal + margen, para que el tirón
            // empiece un poco antes de estar encima — mismo criterio que
            // `hooks/use-magnetic.ts`.
            const radius = Math.max(rect.width, rect.height) * 0.9 + 60
            if (distance > radius || distance >= nearestDistance) continue

            nearestDistance = distance
            nearest = { candidate: getCandidate(el), offsetX, offsetY }
          }

          if (!nearest) {
            resetActive()
            return
          }

          if (activeRef.current && activeRef.current.el !== nearest.candidate.el) {
            resetActive()
          }
          activeRef.current = nearest.candidate

          const el = nearest.candidate.el
          const rect = el.getBoundingClientRect()
          const explicitStrength = el.dataset.magneticStrength
            ? Number.parseFloat(el.dataset.magneticStrength)
            : null
          const strength =
            explicitStrength ??
            (Math.min(rect.width, rect.height) < SMALL_ELEMENT_THRESHOLD
              ? DEFAULT_STRENGTH * SMALL_ELEMENT_FACTOR
              : DEFAULT_STRENGTH)

          const radius = Math.max(rect.width, rect.height) * 0.9 + 60
          const falloff = 1 - nearestDistance / radius
          nearest.candidate.moveX(nearest.offsetX * strength * falloff)
          nearest.candidate.moveY(nearest.offsetY * strength * falloff)
        }

        const onMove = (event: PointerEvent) => {
          pendingEvent = event
          if (rafId != null) return
          rafId = requestAnimationFrame(() => {
            if (pendingEvent) processMove(pendingEvent)
          })
        }

        const onLeave = () => resetActive()

        rescan()
        window.addEventListener("pointermove", onMove, { passive: true })
        window.addEventListener("blur", onLeave)
        document.addEventListener("pointerleave", onLeave)
        window.addEventListener("resize", rescan)

        // Cubre altas/bajas dinámicas: menú móvil, paneles de Radix
        // (portal fuera del árbol original), filas añadidas en el admin.
        const observer = new MutationObserver(() => rescan())
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["data-magnetic"],
        })

        disposers.push(() => {
          if (rafId != null) cancelAnimationFrame(rafId)
          window.removeEventListener("pointermove", onMove)
          window.removeEventListener("blur", onLeave)
          document.removeEventListener("pointerleave", onLeave)
          window.removeEventListener("resize", rescan)
          observer.disconnect()
          resetActive()
        })
      })
    }

    const teardown = () => {
      disposers.forEach((dispose) => dispose())
      disposers = []
    }

    const onPreferenceChange = () => {
      if (reduced.matches) teardown()
      else start()
    }

    start()
    reduced.addEventListener("change", onPreferenceChange)

    return () => {
      cancelled = true
      reduced.removeEventListener("change", onPreferenceChange)
      teardown()
    }
  }, [])

  return null
}
