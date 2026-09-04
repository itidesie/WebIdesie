"use client"

import { ArrowRight, ClipboardCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import { useMagnetic } from "@/hooks/use-magnetic"
import { HeroVideo } from "./hero-video"
import { AdmisionModal } from "@/components/admision-modal"

const HERO_VIDEO_SRC = "https://pub-5178d59aea414c55b9ff83a226ef28f6.r2.dev/VIDLAN1.mp4"

interface HeroSectionProps {
  eyebrow: string
  title: string
  ctaLabel: string
  onOpenRequest: () => void
}

/**
 * Hero de /landing — corto (sin párrafos), con el vídeo APILADO debajo del
 * titular, no al lado ni de fondo. El titular se revela con SplitText
 * palabra a palabra (igual mecanismo que `components/programa/closing-cta.tsx`,
 * el único sitio del resto del sitio que usa SplitText) y el vídeo entra con
 * una escala elástica justo después — esta página tiene permiso explícito
 * para animar más fuerte que las páginas de programa, así que aquí SplitText
 * no es la excepción, es la norma de la portada.
 *
 * 🎨 2026-09-05 — rediseño completo de /landing: fondo claro (antes
 * `gray-950`), a petición explícita del cliente ("paleta de colores claros,
 * el azul de marca como acento, no como base"). El resplandor de fondo pasa
 * de un halo azul sobre negro a un degradado suave sobre `bg-paper`, y el
 * vídeo ya no bloquea el resto de la página al terminar de verlo (ver
 * `hero-video.tsx` y `landing-client.tsx`) — sigue siendo protagonista
 * (autoplay, botón de sonido), pero deja de ser una barrera.
 */
export function HeroSection({ eyebrow, title, ctaLabel, onOpenRequest }: HeroSectionProps) {
  const ctaRef = useMagnetic<HTMLButtonElement>(0.4)

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap, SplitText }, scope) => {
    const heading = scope.querySelector<HTMLElement>("[data-hero-title]")
    const video = scope.querySelector("[data-hero-video]")
    const eyebrowEl = scope.querySelector("[data-hero-eyebrow]")
    const cta = scope.querySelector("[data-hero-cta]")

    const tl = gsap.timeline({ delay: 0.1 })

    if (eyebrowEl) {
      tl.from(eyebrowEl, { y: 16, opacity: 0, duration: 0.6, ease: "expo.out" }, 0)
    }

    if (heading) {
      const split = new SplitText(heading, { type: "words", linesClass: "overflow-hidden" })
      tl.from(
        split.words,
        { yPercent: 130, opacity: 0, rotate: 6, duration: 1, ease: "expo.out", stagger: 0.05 },
        0.1,
      )
    }

    if (cta) {
      tl.from(cta, { y: 20, opacity: 0, scale: 0.9, duration: 0.6, ease: "back.out(2)" }, 0.55)
    }

    if (video) {
      tl.from(
        video,
        { y: 60, opacity: 0, scale: 0.88, duration: 1, ease: "expo.out" },
        0.5,
      )
    }
  })

  return (
    <section ref={scopeRef} className="relative w-full overflow-hidden bg-paper py-20 md:py-28">
      {/* Resplandor de fondo, puramente decorativo, sin coste de layout —
          mismo azul de marca que en la versión oscura, mucho más sutil
          sobre un fondo claro. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: "radial-gradient(60% 55% at 50% 0%, rgb(0 108 255 / 0.14), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8">
        <p
          data-hero-eyebrow
          className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-brand-strong"
        >
          {eyebrow}
        </p>

        <h1
          data-hero-title
          className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-950 sm:text-6xl"
        >
          {title}
        </h1>

        <div data-hero-cta className="mt-9 flex flex-wrap justify-center gap-4">
          <Button
            ref={ctaRef}
            size="lg"
            onClick={onOpenRequest}
            className="bg-brand px-8 py-6 text-base text-white hover:bg-brand-strong"
          >
            {ctaLabel}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          {/* Secundario a propósito: no compite con el CTA de información,
              que sigue siendo el objetivo principal de la página. */}
          <AdmisionModal origen="landing">
            <Button
              size="lg"
              variant="outline"
              className="border-gray-950/15 bg-white/70 px-8 py-6 text-base text-gray-950 hover:bg-white"
            >
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Solicitud de admisión
            </Button>
          </AdmisionModal>
        </div>
      </div>

      {/* Fuera del contenedor de texto (max-w-4xl) a propósito: el vídeo
          debe leerse "hero-sized", más ancho que el titular que tiene
          encima. Ya no lleva lógica de progreso/bloqueo — ver HeroVideo. */}
      <div data-hero-video className="relative z-10 mx-auto mt-14 max-w-5xl px-4 sm:px-6">
        <HeroVideo src={HERO_VIDEO_SRC} />
      </div>
    </section>
  )
}
