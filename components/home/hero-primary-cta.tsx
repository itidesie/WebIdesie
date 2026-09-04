import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * CTA principal del hero de la home. Sigue siendo Server Component: el
 * magnetismo ya no depende de `useMagnetic` por instancia (que exigía un
 * ref + `"use client"` solo para eso) — `<Button magnetic>` se limita a
 * marcar el elemento con `data-magnetic`, y el motor centralizado
 * (`components/site-motion/global-magnetic.tsx`, montado una vez en el
 * layout) hace el resto. El LCP (imagen + título del hero, en CSS puro)
 * sigue sin depender de ningún JS de cliente.
 *
 * `.btn-sweep` (relleno por barrido) es la otra pieza ya usada en
 * `/mbim-page` — ver CLAUDE.md §5 "Sistema global de cursor + scroll suave".
 */
export function HeroPrimaryCta() {
  return (
    <Button
      asChild
      magnetic
      size="lg"
      className="btn-sweep bg-brand hover:bg-brand-strong text-white px-6 py-3 text-sm font-semibold shadow-xl transition-all w-full sm:w-auto"
    >
      <Link href="/contact-page" style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}>
        Solicitar información <ArrowRight className="btn-arrow ml-2 w-4 h-4" />
      </Link>
    </Button>
  )
}
