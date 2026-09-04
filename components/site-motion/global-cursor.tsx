"use client"

import { useEffect, useRef } from "react"
import { loadGsapCore } from "@/lib/gsap-core"

/** Elementos "accionables": el punto crece encima de ellos. */
const GROWS_ON = "a, button, [role='button'], summary"

/** Campos de texto: el punto se apaga del todo, no solo deja de crecer.
 *  Encima de un formulario largo (checkout, contacto, admisión) un punto
 *  creciendo sobre cada input añade ruido visual sin aportar nada — el
 *  cursor de texto nativo ya comunica "aquí se escribe" mejor que un punto
 *  azul. Fuera de esos campos, el punto vuelve a aparecer con normalidad. */
const TEXT_ENTRY = "input, textarea, select"

/**
 * Punto de cursor global — el mismo que ya usaba `/mbim-page`
 * (`components/programa/motion-root.tsx`), extraído para montarse una sola
 * vez desde el layout raíz y aplicar a todas las páginas.
 *
 * No sustituye al cursor nativo del sistema operativo en ningún momento
 * (nunca se pone `cursor: none`): es un acento puramente decorativo,
 * `pointer-events: none`, así que no puede interferir con clics ni con la
 * escritura en un campo de texto — solo con lo que se ve.
 *
 * Se auto-gestiona: no necesita que nada lo monte condicionalmente. Con
 * `prefers-reduced-motion: reduce` no llega a descargar GSAP; en puntero
 * grueso (táctil) tampoco, y el propio `<div>` se oculta con `hidden md:block`
 * como red adicional a nivel de CSS.
 */
export function GlobalCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const fine = window.matchMedia("(pointer: fine)")

    let disposers: Array<() => void> = []
    let cancelled = false

    const start = () => {
      if (cancelled || reduced.matches || !fine.matches || !dotRef.current) return

      loadGsapCore().then((gsap) => {
        if (cancelled || reduced.matches) return
        const dot = dotRef.current
        if (!dot) return

        const moveX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" })
        const moveY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" })

        let visible = false
        const onMove = (e: PointerEvent) => {
          const target = e.target as HTMLElement | null

          if (target?.closest?.(TEXT_ENTRY)) {
            if (visible) {
              visible = false
              gsap.to(dot, { autoAlpha: 0, duration: 0.2 })
            }
            return
          }

          if (!visible) {
            visible = true
            gsap.to(dot, { autoAlpha: 1, duration: 0.3 })
          }
          moveX(e.clientX)
          moveY(e.clientY)

          const overInteractive = !!target?.closest?.(GROWS_ON)
          gsap.to(dot, {
            scale: overInteractive ? 2.6 : 1,
            duration: 0.35,
            ease: "power3.out",
            overwrite: "auto",
          })
        }

        const onLeave = () => {
          visible = false
          gsap.to(dot, { autoAlpha: 0, duration: 0.2 })
        }

        window.addEventListener("pointermove", onMove, { passive: true })
        document.addEventListener("pointerleave", onLeave)
        disposers.push(() => {
          window.removeEventListener("pointermove", onMove)
          document.removeEventListener("pointerleave", onLeave)
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

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="site-cursor pointer-events-none fixed left-0 top-0 z-[70] hidden h-2 w-2 rounded-full bg-brand opacity-0 md:block"
    />
  )
}
