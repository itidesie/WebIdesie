import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface BalanceClosingProps {
  title: string
  text: string
  ctaLabel: string
  ctaHref: string
}

/**
 * Cierre estático, sin GSAP — mismo criterio que `closing-section.tsx` de
 * "La Red": el final de la página no necesita otro momento de movimiento,
 * ya tuvo el suyo en la sección de becas. Un cierre en calma después del
 * clímax se lee mejor que otro efecto compitiendo por atención.
 */
export function BalanceClosing({ title, text, ctaLabel, ctaHref }: BalanceClosingProps) {
  return (
    <section className="w-full bg-gray-950 py-20 text-center text-white md:py-28">
      <div className="mx-auto max-w-2xl px-6 sm:px-8">
        <h2 className="balance-title">{title}</h2>
        <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">{text}</p>
        <div className="mt-8">
          <Link
            href={ctaHref}
            data-magnetic
            style={{ ["--btn-fill" as string]: "rgb(255 255 255 / 0.85)" }}
            className="btn-balance inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-950"
          >
            {ctaLabel}
            <ArrowRight className="btn-arrow ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
