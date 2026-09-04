import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NetworkGlyph } from "./network-glyph"

interface NetworkHeroProps {
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
 * Apertura de "La Red". Equivalente al M1 de las páginas presenciales, pero
 * sin foto de aula ni de obra: el fondo es gray-950 (el mismo negro que ya usan
 * M3/M6 en las otras páginas, no un segundo negro) con la foto tratada como un
 * elemento secundario en vez de dominar el encuadre — el motivo de red es la
 * imagen principal, la foto es el apoyo.
 *
 * El titular se anima en CSS puro (.hero-line/.hero-fade, definidos en el
 * bloque "RECORRIDO DE PROGRAMA"): son mecanismo genérico, no atado a esa
 * narrativa, así que se reutilizan tal cual en vez de duplicarlos.
 */
export function NetworkHero({
  eyebrow,
  titleTop,
  titleBottom,
  intro,
  image,
  imageAlt,
  ctaHref,
  ctaLabel,
}: NetworkHeroProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[34rem] w-full items-center overflow-hidden bg-gray-950 py-24 text-white md:min-h-[40rem]"
    >
      <NetworkGlyph
        className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
        variant="hero"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="online-eyebrow hero-fade mb-5 text-brand">{eyebrow}</p>
          <h1 className="online-hero-title text-balance">
            <span className="hero-line block">{titleTop}</span>
            <span className="hero-line hero-line-2 block text-white/60">{titleBottom}</span>
          </h1>
          <p className="hero-fade hero-fade-late mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
            {intro}
          </p>
          <div className="hero-fade hero-fade-late mt-8">
            <Button asChild size="lg" className="btn-online bg-brand text-white hover:bg-brand-strong">
              <Link href={ctaHref} style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}>
                {ctaLabel}
                <ArrowRight className="btn-arrow ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="hero-fade hero-fade-late relative hidden aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 lg:block">
          <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 32rem, 0px" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-950/10 to-transparent" />
        </div>
      </div>
    </section>
  )
}
