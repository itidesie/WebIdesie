import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TablonHeroProps {
  eyebrow: string
  title: string
  intro: string
}

/**
 * Apertura de "El Tablón". `gray-950` sólido, mismo negro que ya usan los
 * M3/M6 de las páginas de programa — no un segundo negro nuevo. Titular en
 * CSS puro (`.hero-line`/`.hero-fade`, mecanismo genérico), nunca GSAP, por
 * la regla de LCP del hero.
 */
export function TablonHero({ eyebrow, title, intro }: TablonHeroProps) {
  return (
    <section className="flex min-h-[60vh] w-full items-center bg-gray-950 py-24 text-center text-white md:min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <p className="tablon-eyebrow hero-fade mb-5 text-brand">{eyebrow}</p>
        <h1 className="tablon-hero-title text-balance">
          <span className="hero-line block">{title}</span>
        </h1>
        <p className="hero-fade hero-fade-late mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          {intro}
        </p>
        <div className="hero-fade hero-fade-late mt-9">
          <Button asChild size="lg" className="btn-tablon bg-brand text-white hover:bg-brand-strong">
            <Link href="#ofertas" style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}>
              Ver ofertas
              <ArrowRight className="btn-arrow ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
