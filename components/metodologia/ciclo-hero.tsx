import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CicloHeroProps {
  eyebrow: string
  title: string
  subtitle: string
  intro: string
  ctaLabel: string
  ctaHref: string
}

/** Apertura de "El Ciclo Práctico". CSS puro (.hero-line/.hero-fade), LCP. */
export function CicloHero({ eyebrow, title, subtitle, intro, ctaLabel, ctaHref }: CicloHeroProps) {
  return (
    <section className="relative flex min-h-[80vh] w-full items-center overflow-hidden pt-28 pb-16 text-center md:min-h-[88vh] md:pt-32">
      <Image
        src="/images/alumnos_clase_2.jpg"
        alt="Alumnos de IDESIE trabajando en proyectos reales durante su formación BIM"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/55 to-gray-950/35" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-white sm:px-8">
        <p className="ciclo-eyebrow hero-fade mb-5 text-white/70">{eyebrow}</p>
        <h1 className="ciclo-hero-title text-balance">
          <span className="hero-line block">{title}</span>
        </h1>
        <p className="hero-fade mx-auto mt-4 max-w-xl text-lg font-semibold text-white/90 sm:text-xl">{subtitle}</p>
        <p className="hero-fade hero-fade-late mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          {intro}
        </p>
        <div className="hero-fade hero-fade-late mt-9">
          <Button asChild size="lg" magnetic className="btn-sweep bg-brand text-white hover:bg-brand-strong">
            <Link href={ctaHref} style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}>
              {ctaLabel} <ArrowRight className="btn-arrow ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
