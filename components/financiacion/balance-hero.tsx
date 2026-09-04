import Image from "next/image"
import { BalanceHeroCta } from "./balance-hero-cta"

interface BalanceHeroProps {
  eyebrow: string
  title: string
  intro: string
}

/**
 * Apertura de "El Balance". A diferencia de "La Red" (gray-950 sólido + glifo
 * SVG), esta página conserva la foto real ya existente — no hay motivo para
 * sustituirla por un motivo abstracto cuando la imagen original es correcta
 * y sirve al propósito (una persona real, no un espacio físico narrativo).
 * El titular se anima con el mismo mecanismo CSS puro que el resto del sitio
 * (.hero-line/.hero-fade, "RECORRIDO DE PROGRAMA") — nunca con GSAP, por LCP.
 */
export function BalanceHero({ eyebrow, title, intro }: BalanceHeroProps) {
  return (
    <section className="relative flex min-h-[75vh] w-full items-center overflow-hidden pt-28 pb-16 text-center md:min-h-[85vh] md:pt-32">
      <Image
        src="/images/financiacion_becas_hero_image.jpg"
        alt="Estudiante con portátil y libros, simbolizando el acceso a la educación"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/50 to-gray-950/30" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-white sm:px-8">
        <p className="balance-eyebrow hero-fade mb-5 text-white/70">{eyebrow}</p>
        <h1 className="balance-hero-title text-balance">
          <span className="hero-line block">{title}</span>
        </h1>
        <p className="hero-fade hero-fade-late mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {intro}
        </p>
        <div className="hero-fade hero-fade-late mt-9">
          <BalanceHeroCta />
        </div>
      </div>
    </section>
  )
}
