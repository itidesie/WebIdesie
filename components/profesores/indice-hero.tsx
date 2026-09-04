import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IndiceHeroProps {
  eyebrow: string
  title: string
  intro: string
  ctaLabel: string
  ctaHref: string
}

/** Apertura de "El Índice de Expertos". CSS puro (.hero-line/.hero-fade), LCP. */
export function IndiceHero({ eyebrow, title, intro, ctaLabel, ctaHref }: IndiceHeroProps) {
  return (
    <section className="relative flex min-h-[75vh] w-full items-center overflow-hidden pt-28 pb-16 text-center md:min-h-[85vh] md:pt-32">
      <Image
        src="/images/claustro-hero.jpg"
        alt="Estudiantes y profesionales BIM trabajando en aula moderna"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/55 to-gray-950/35" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-white sm:px-8">
        <p className="indice-eyebrow hero-fade mb-5 text-white/70">{eyebrow}</p>
        <h1 className="indice-hero-title text-balance">
          <span className="hero-line block">{title}</span>
        </h1>
        <p className="hero-fade hero-fade-late mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
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
