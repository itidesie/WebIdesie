"use client"

import { useEffect, useState, type ComponentType } from "react"
import type { LenisProps } from "lenis/react"
import { GlobalCursor } from "./global-cursor"
import { GlobalMagnetic } from "./global-magnetic"

/**
 * Capa de movimiento global del sitio — se monta UNA vez en `app/layout.tsx`
 * y aplica a las 47+ páginas públicas sin que ninguna tenga que importar
 * nada. Reemplaza la Lenis que `components/programa/motion-root.tsx` creaba
 * por su cuenta en cada página de programa (ver ese archivo: ahora reutiliza
 * esta misma instancia en vez de crear una segunda).
 *
 * Qué NO hace, a propósito:
 * - No usa `lib/gsap.ts` (`loadGsap()`), que carga también ScrollTrigger y
 *   SplitText (~18 KB gz de más) — el cursor solo necesita `gsap.quickTo`,
 *   así que usa `lib/gsap-core.ts`, un loader aparte con solo el núcleo.
 * - No toca `animation-timeline` (home) ni el ScrollTrigger de programa: es
 *   una capa nueva e independiente, con sus propios elementos (el punto del
 *   cursor) y su propio scroll suave, que ninguna otra animación anima.
 * - No fuerza el desplazamiento a "virtual": Lenis, sin `wrapper`/`content`
 *   personalizados, sigue actualizando el `scrollTop` real del documento —
 *   por eso `animation-timeline: view()` (que lee la posición de scroll
 *   nativa) sigue funcionando exactamente igual con Lenis montado.
 *
 * Los tres (Lenis, el cursor y el magnetismo de botones) se autogestionan
 * frente a `prefers-reduced-motion` y a puntero táctil — ver `GlobalCursor`,
 * `GlobalMagnetic` y el `import()` de más abajo.
 */
export function SiteMotionProvider() {
  const [ReactLenisRoot, setReactLenisRoot] = useState<ComponentType<LenisProps> | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const fine = window.matchMedia("(pointer: fine)")
    let cancelled = false

    const start = () => {
      // En puntero táctil, el scroll nativo ya es lo mejor que hay — Lenis
      // no aporta nada y solo consumiría batería de más.
      if (cancelled || reduced.matches || !fine.matches) return
      import("lenis/react").then(({ ReactLenis }) => {
        if (!cancelled) setReactLenisRoot(() => ReactLenis)
      })
    }

    const stop = () => setReactLenisRoot(null)

    const onPreferenceChange = () => (reduced.matches ? stop() : start())

    start()
    reduced.addEventListener("change", onPreferenceChange)

    return () => {
      cancelled = true
      reduced.removeEventListener("change", onPreferenceChange)
    }
  }, [])

  return (
    <>
      {/* `root`: instancia global sin wrapper propio, headless (no pinta
          nada). Cualquier componente del árbol puede engancharse a ella con
          `useLenis()` de `lenis/react` — es justo lo que hace ahora
          `MotionRoot` en vez de crear su propia Lenis. Misma duración y
          multiplicador de rueda que ya se afinaron para el MBIM. */}
      {ReactLenisRoot && <ReactLenisRoot root options={{ duration: 1.05, wheelMultiplier: 0.9 }} />}
      <GlobalCursor />
      <GlobalMagnetic />
    </>
  )
}
