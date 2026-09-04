"use client"

import { useEffect, useRef } from "react"
import { loadGsap, type GsapBundle } from "@/lib/gsap"
import { useLenis } from "lenis/react"

/**
 * Motor de movimiento propio de las páginas de programa.
 *
 * Hasta 2026-09-03 (22) esto creaba su PROPIA instancia de Lenis y su propio
 * punto de cursor, cada vez que se montaba una página de programa — cuatro
 * páginas, cuatro Lenis distintas, nunca compartidas. Al llevar cursor + Lenis
 * a todo el sitio (`components/site-motion/`), montar una segunda Lenis aquí
 * habría creado DOS instancias peleando por el mismo scroll en estas cuatro
 * páginas. Ahora `MotionRoot` no crea nada de eso: usa `useLenis()` de
 * `lenis/react` para engancharse a la instancia ÚNICA que ya vive en
 * `app/layout.tsx`, y deja el cursor por completo al componente global
 * (`GlobalCursor`) — de ahí que el div del cursor haya desaparecido de aquí.
 *
 * Lo que sigue siendo exclusivo de esta página:
 *  1. Sincronizar la Lenis compartida con ScrollTrigger. Sin esto, Lenis
 *     interpola el scroll por su cuenta y ScrollTrigger lee la posición
 *     nativa: el parallax va a destiempo y se percibe como tirones.
 *  2. Pintar la barra de progreso de lectura, ligada al scroll con scrub.
 *
 * Si `useLenis()` no encuentra ninguna instancia activa (usuario con
 * `prefers-reduced-motion`, o puntero táctil — casos en los que
 * `SiteMotionProvider` ni siquiera monta Lenis), su callback no llega a
 * registrarse y este componente simplemente no sincroniza nada: el resto de
 * la página sigue funcionando con scroll nativo.
 */
export function MotionRoot() {
  const progressRef = useRef<HTMLDivElement>(null)
  // Poblada una sola vez por el `useEffect` de abajo cuando `loadGsap()`
  // resuelve. El callback de `useLenis` se dispara en cada tick de scroll,
  // así que no puede permitirse volver a resolver un import en cada uno —
  // solo lee esta ref, ya cacheada.
  const scrollTriggerRef = useRef<GsapBundle["ScrollTrigger"] | null>(null)

  useLenis(() => {
    scrollTriggerRef.current?.update()
  })

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")

    let disposers: Array<() => void> = []
    let cancelled = false

    const start = () => {
      if (cancelled || media.matches) return

      loadGsap().then(({ gsap, ScrollTrigger }) => {
        if (cancelled || media.matches) return

        scrollTriggerRef.current = ScrollTrigger
        disposers.push(() => {
          scrollTriggerRef.current = null
        })

        /* ---- Barra de progreso de lectura -------------------------------- */
        if (progressRef.current) {
          gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" })
          const trigger = ScrollTrigger.create({
            start: 0,
            end: () => document.documentElement.scrollHeight - window.innerHeight,
            scrub: 0.3,
            onUpdate: (self) => {
              gsap.set(progressRef.current, { scaleX: self.progress })
            },
          })
          disposers.push(() => trigger.kill())
        }

        // Las imágenes cambian la altura del documento al cargar; sin esto los
        // triggers quedan calculados sobre una página más corta.
        const onLoad = () => ScrollTrigger.refresh()
        window.addEventListener("load", onLoad)
        disposers.push(() => window.removeEventListener("load", onLoad))
      })
    }

    const teardown = () => {
      disposers.forEach((dispose) => dispose())
      disposers = []
    }

    const onPreferenceChange = () => {
      if (media.matches) teardown()
      else start()
    }

    start()
    media.addEventListener("change", onPreferenceChange)

    return () => {
      cancelled = true
      media.removeEventListener("change", onPreferenceChange)
      teardown()
    }
  }, [])

  return (
    <>
      {/* Barra de progreso. Sin JS se queda a scaleX(0) y es invisible: no
          estorba ni ocupa espacio. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
      >
        <div ref={progressRef} className="h-full w-full origin-left scale-x-0 bg-brand" />
      </div>
    </>
  )
}
