import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BlueprintGlyph } from "./blueprint-glyph"

interface BlueprintHeroProps {
  eyebrow: string
  titleTop: string
  titleBottom: string
  intro: string
  image: string
  imageAlt: string
  ctaHref: string
  ctaLabel: string
}

/**
 * Apertura de "El Plano". Arregla el hallazgo 1 de la auditoría: el CTA
 * apuntaba a `/contact` (404), ahora usa `ctaHref` (`/contact-page`).
 *
 * Fondo `gray-950` con retícula de puntos sutil (`.blueprint-grid`) y el
 * motivo de cotas — no una foto a sangre como en las páginas de máster: el
 * público de esta página (responsables de formación corporativa) responde
 * mejor a precisión que a fotografía aspiracional.
 */
export function BlueprintHero({
  eyebrow,
  titleTop,
  titleBottom,
  intro,
  image,
  imageAlt,
  ctaHref,
  ctaLabel,
}: BlueprintHeroProps) {
  return (
    <section className="relative flex min-h-[32rem] w-full items-center overflow-hidden bg-gray-950 py-24 text-white md:min-h-[38rem]">
      <div className="blueprint-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <BlueprintGlyph className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="blueprint-eyebrow hero-fade mb-5 text-brand">{eyebrow}</p>
          <h1 className="blueprint-hero-title text-balance">
            <span className="hero-line block">{titleTop}</span>
            <span className="hero-line hero-line-2 block text-white/60">{titleBottom}</span>
          </h1>
          <p className="hero-fade hero-fade-late mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
            {intro}
          </p>
          <div className="hero-fade hero-fade-late mt-8">
            <Button asChild size="lg" className="btn-blueprint bg-brand text-white hover:bg-brand-strong">
              <Link href={ctaHref} style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}>
                {ctaLabel}
                <ArrowRight className="btn-arrow ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="blueprint-frame hero-fade hero-fade-late relative hidden aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 lg:block">
          <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 32rem, 0px" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-950/10 to-transparent" />
          {/* Marcas de registro en dos esquinas, como en un plano impreso —
              no las cuatro, que sería demasiado ruido sobre una fotografía. */}
          <span data-corner className="left-3 top-3" aria-hidden="true" />
          <span data-corner className="bottom-3 right-3" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
