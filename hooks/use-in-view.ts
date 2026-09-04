"use client"

import { useEffect, useRef, useState } from "react"

interface Options {
  /** Margen extra respecto al viewport; negativo dispara más tarde. */
  rootMargin?: string
  /** Proporción visible necesaria para considerar el elemento en pantalla. */
  threshold?: number
}

/**
 * Devuelve [ref, visible]. El observador se desconecta tras el primer disparo,
 * así que cada elemento provoca como mucho un re-render y nada queda escuchando
 * el scroll.
 *
 * Con prefers-reduced-motion activo devuelve `true` de entrada: el contenido se
 * muestra sin animar.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  rootMargin = "0px 0px -12% 0px",
  threshold = 0.15,
}: Options = {}) {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsInView(true)
        observer.disconnect()
      },
      { rootMargin, threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return [ref, isInView] as const
}
