import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface CicloClosingProps {
  title: string
  text: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
}

/** Cierre estático, sin GSAP — mismo criterio que el resto de páginas rediseñadas. */
export function CicloClosing({ title, text, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: CicloClosingProps) {
  return (
    <section className="w-full bg-brand py-20 text-center md:py-28">
      <div className="mx-auto max-w-2xl px-6 sm:px-8">
        <h2 className="ciclo-title text-white">{title}</h2>
        <p className="mt-5 text-base leading-relaxed text-white/90 sm:text-lg">{text}</p>
        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href={primaryHref}
            data-magnetic
            style={{ ["--btn-fill" as string]: "#f3f4f6" }}
            className="btn-sweep inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand"
          >
            {primaryLabel}
            <ArrowRight className="btn-arrow ml-2 h-4 w-4" />
          </Link>
          <Link
            href={secondaryHref}
            data-magnetic
            style={{ ["--btn-fill" as string]: "#ffffff" }}
            className="btn-sweep inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:text-brand"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
