import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface IndiceClosingProps {
  title: string
  text: string
  ctaLabel: string
  ctaHref: string
}

/** Cierre estático, sin GSAP — mismo criterio que el resto de páginas rediseñadas. */
export function IndiceClosing({ title, text, ctaLabel, ctaHref }: IndiceClosingProps) {
  return (
    <section className="w-full bg-gray-950 py-20 text-center md:py-28">
      <div className="mx-auto max-w-2xl px-6 sm:px-8">
        <h2 className="indice-title text-white">{title}</h2>
        <p className="mt-5 text-base leading-relaxed text-white/75 sm:text-lg">{text}</p>
        <div className="mt-9">
          <Link
            href={ctaHref}
            data-magnetic
            style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}
            className="btn-sweep inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white"
          >
            {ctaLabel} <ArrowRight className="btn-arrow ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
