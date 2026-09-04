import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface TrayectoriaHeroProps {
  eyebrow: string
  question: string
  intro: string
}

/**
 * Apertura de "La Trayectoria". El titular no vende un programa, plantea la
 * pregunta que el resto de la página responde — por eso es una pregunta
 * ("¿Quiénes somos?"), no una declaración. CSS puro (.hero-line/.hero-fade),
 * nunca GSAP: es el elemento del LCP.
 */
export function TrayectoriaHero({ eyebrow, question, intro }: TrayectoriaHeroProps) {
  return (
    <section className="relative flex min-h-[80vh] w-full items-center overflow-hidden pt-28 pb-16 text-center md:min-h-[88vh] md:pt-32">
      <Image
        src="/images/hero_image_sobre_idesie_colaboracion_proyecto_bim.jpg"
        alt="Campus de IDESIE con profesionales colaborando en un proyecto BIM"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/55 to-gray-950/35" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-white sm:px-8">
        <p className="trayectoria-eyebrow hero-fade mb-5 text-white/70">{eyebrow}</p>
        <h1 className="trayectoria-hero-title text-balance">
          <span className="hero-line block">{question}</span>
        </h1>
        <p className="hero-fade hero-fade-late mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {intro}
        </p>
        <div className="hero-fade hero-fade-late mt-9">
          <Button asChild size="lg" magnetic className="btn-sweep bg-brand text-white hover:bg-brand-strong">
            <Link href="#trayectoria" style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}>
              Conoce nuestra historia <ArrowRight className="btn-arrow ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
