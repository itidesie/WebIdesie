/**
 * Carga diferida de GSAP.
 *
 * Nada de esto entra en el paquete inicial: el import() solo se ejecuta tras la
 * hidratación y únicamente si el usuario no ha pedido reducir movimiento. El
 * hero, por tanto, jamás espera a GSAP para ser visible.
 *
 * La promesa se memoiza para que las ocho secciones de la página compartan una
 * sola descarga y un solo registro de plugins.
 */

import type { gsap as GsapType } from "gsap"

export interface GsapBundle {
  gsap: typeof GsapType
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger
  SplitText: typeof import("gsap/SplitText").SplitText
}

let bundlePromise: Promise<GsapBundle> | null = null

/** true si el sistema pide menos movimiento. En servidor devuelve true (no animar). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Descarga GSAP y sus dos plugins en paralelo y los registra una única vez.
 *
 * Desde 2025 GSAP es gratuito por completo, plugins incluidos, así que SplitText
 * puede usarse en producción sin licencia.
 */
export function loadGsap(): Promise<GsapBundle> {
  if (!bundlePromise) {
    bundlePromise = Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
    ]).then(([core, scrollTrigger, splitText]) => {
      const { gsap } = core
      const { ScrollTrigger } = scrollTrigger
      const { SplitText } = splitText

      gsap.registerPlugin(ScrollTrigger, SplitText)

      // Curvas propias, para no repetir el cubic-bezier por todo el proyecto.
      // Entradas con expo: arrancan disparadas y frenan largo.
      gsap.registerEase("journeyOut", (p) => 1 - Math.pow(2, -10 * p))

      // Por defecto: entrada lenta, salida rápida. Media sensación de "premium"
      // está en esa asimetría.
      gsap.defaults({ ease: "expo.out", duration: 0.9 })

      return { gsap, ScrollTrigger, SplitText }
    })
  }

  return bundlePromise
}
