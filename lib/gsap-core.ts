/**
 * Carga diferida de GSAP **sin plugins** — solo el núcleo (`gsap.quickTo`,
 * tweens básicos). Pensado para el cursor y el magnetismo de botones, que se
 * montan en TODO el sitio y no necesitan ScrollTrigger ni SplitText.
 *
 * Deliberadamente independiente de `lib/gsap.ts` (`loadGsap()`), que sí carga
 * esos dos plugins (~18 KB gz extra) para las páginas de programa. Si una
 * página usa ambos loaders (p. ej. `/mbim-page`), el navegador comparte el
 * mismo chunk de `gsap` core entre los dos — no se descarga dos veces — pero
 * una página que solo necesita el cursor (home, blog, tienda) nunca paga el
 * peso de ScrollTrigger/SplitText.
 */

import type { gsap as GsapType } from "gsap"

let corePromise: Promise<typeof GsapType> | null = null

export function loadGsapCore(): Promise<typeof GsapType> {
  if (!corePromise) {
    corePromise = import("gsap").then((mod) => mod.gsap)
  }
  return corePromise
}
