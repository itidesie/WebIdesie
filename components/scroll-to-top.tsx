"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useLenis } from "lenis/react"

export function ScrollToTop() {
  const pathname = usePathname()
  // Con la Lenis global montada (`SiteMotionProvider`), un `window.scrollTo`
  // a pelo no le avisa: Lenis seguiría animando hacia su último objetivo
  // "recordado" y el salto a 0 se vería revertido en el siguiente tick. Si
  // hay una instancia activa, hay que pedírselo a ella; si no la hay (touch,
  // reduced-motion), cae al `scrollTo` nativo de siempre.
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, lenis])

  return null
}
