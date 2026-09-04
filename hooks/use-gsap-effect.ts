"use client"

import { useEffect, useRef } from "react"
import { loadGsap, prefersReducedMotion, type GsapBundle } from "@/lib/gsap"

type Setup = (bundle: GsapBundle, scope: HTMLElement) => void

/**
 * Ejecuta animaciones de GSAP acotadas a un elemento.
 *
 * Devuelve la ref que hay que colgar del contenedor de la sección. Todo lo que
 * el `setup` cree queda dentro de un gsap.context ligado a ese elemento, de modo
 * que al desmontar se revierte solo: sin ScrollTriggers huérfanos ni estilos
 * inline pegados.
 *
 * Si el usuario pide reducir movimiento, GSAP **ni siquiera se descarga** y el
 * `setup` no llega a ejecutarse. El marcado se queda tal cual lo pintó el
 * servidor, que ya es su estado final legible.
 */
export function useGsapEffect<T extends HTMLElement = HTMLDivElement>(setup: Setup) {
  const scopeRef = useRef<T>(null)
  // Guardamos el setup en una ref para no re-ejecutar el efecto en cada render
  // por culpa de una función recreada.
  const setupRef = useRef(setup)
  setupRef.current = setup

  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return

    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    let ctx: { revert: () => void } | undefined
    let cancelled = false

    const start = () => {
      if (cancelled || media.matches) return
      loadGsap().then(({ gsap, ScrollTrigger, SplitText }) => {
        if (cancelled || media.matches) return
        ctx = gsap.context(() => setupRef.current({ gsap, ScrollTrigger, SplitText }, scope), scope)
      })
    }

    /** Si el usuario cambia la preferencia en caliente, deshacemos o montamos. */
    const onPreferenceChange = () => {
      if (media.matches) {
        ctx?.revert()
        ctx = undefined
      } else if (!ctx) {
        start()
      }
    }

    start()
    media.addEventListener("change", onPreferenceChange)

    return () => {
      cancelled = true
      media.removeEventListener("change", onPreferenceChange)
      ctx?.revert()
    }
  }, [])

  return scopeRef
}

/** Versión sin ámbito, para efectos globales de página (barra de progreso, cursor). */
export function useGsapGlobal(setup: (bundle: GsapBundle) => void | (() => void)) {
  const setupRef = useRef(setup)
  setupRef.current = setup

  useEffect(() => {
    if (typeof window === "undefined") return

    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    let cleanup: void | (() => void)
    let ctx: { revert: () => void } | undefined
    let cancelled = false

    const start = () => {
      if (cancelled || media.matches) return
      loadGsap().then((bundle) => {
        if (cancelled || media.matches) return
        ctx = bundle.gsap.context(() => {
          cleanup = setupRef.current(bundle)
        })
      })
    }

    const teardown = () => {
      if (typeof cleanup === "function") cleanup()
      cleanup = undefined
      ctx?.revert()
      ctx = undefined
    }

    const onPreferenceChange = () => {
      if (media.matches) teardown()
      else if (!ctx) start()
    }

    start()
    media.addEventListener("change", onPreferenceChange)

    return () => {
      cancelled = true
      media.removeEventListener("change", onPreferenceChange)
      teardown()
    }
  }, [])
}

export { prefersReducedMotion }
