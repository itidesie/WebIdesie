"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import { useMagnetic } from "@/hooks/use-magnetic"
import { getModalityCategory, MODALITY_STYLES } from "@/lib/landing-modality"
import type { MasterCard } from "@/app/landing/landing-content"

interface MastersCtaStripProps {
  masters: MasterCard[]
  title: string
  intro: string
  ctaLabel: string
  onOpenRequest: (context: string) => void
}

/**
 * Sección 6 — los 4 másteres otra vez, en formato de cierre/conversión.
 * Mismos datos que `masters-comparison.tsx` (sección 4), sin precio, y cada
 * tarjeta y el CTA final abren `InfoRequestModal` en vez de enlazar a nada —
 * es el final del embudo, no hay más sitio al que ir que el formulario.
 *
 * 🎨 2026-09-05 — rediseño visual (solo tratamiento, cero cambios de dato):
 * único bloque que se mantiene oscuro a propósito (mismo criterio que otros
 * cierres "de impacto" del sitio, p. ej. Financiación o el checkout, incluso
 * en páginas predominantemente claras). Las píldoras ganan más padding,
 * título/intro con más contraste entre sí (título grande, intro pequeña y
 * apagada), y la misma barra de acento por modalidad que ya usa
 * `MastersComparison` (`lib/landing-modality.ts`, extraído para no duplicar
 * la paleta). Entrada de las píldoras con `back.out` en vez del `expo.out`
 * anterior, y el CTA final con un rebote todavía mayor — es el clímax de la
 * página.
 */
export function MastersCtaStrip({ masters, title, intro, ctaLabel, onOpenRequest }: MastersCtaStripProps) {
  const ctaRef = useMagnetic<HTMLButtonElement>(0.4)

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-master-pill]"), {
      y: 40,
      opacity: 0,
      scale: 0.88,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.9)",
      scrollTrigger: { trigger: scope, start: "top 78%", once: true },
    })

    gsap.fromTo(
      scope.querySelectorAll("[data-pill-accent]"),
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "expo.out",
        transformOrigin: "left center",
        scrollTrigger: { trigger: scope, start: "top 72%", once: true },
      },
    )

    const cta = scope.querySelector("[data-final-cta]")
    if (cta) {
      gsap.from(cta, {
        scale: 0.7,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(3)",
        scrollTrigger: { trigger: cta, start: "top 90%", once: true },
      })
      // Pulso continuo y sutil — el último empujón antes de cerrar el formulario.
      gsap.to(cta, {
        scale: 1.035,
        duration: 1.1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.4,
      })
    }
  })

  return (
    <section ref={scopeRef} className="w-full bg-gray-950 py-24 text-white md:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">{title}</h2>
          <p className="mt-5 text-sm text-white/50 sm:text-base">{intro}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {masters.map((m) => {
            const category = getModalityCategory(m.modality)
            const style = MODALITY_STYLES[category]

            return (
              <button
                key={m.slug}
                data-master-pill
                onClick={() => onOpenRequest(m.shortName)}
                className="journey-surface journey-surface-dark group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-white/5 p-6 text-left transition-colors hover:border-brand/50 hover:bg-white/10"
              >
                <div
                  data-pill-accent
                  className={`absolute left-0 top-0 h-1 w-full origin-left ${style.accent}`}
                  aria-hidden="true"
                />
                <div className="pt-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wide text-brand">
                    {m.shortName}
                  </span>
                  <p className="mt-2 text-sm text-white/60">
                    {m.duration} · {m.modality}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-base font-semibold text-white">Solicitar información</span>
                  <ArrowRight className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            ref={ctaRef}
            data-final-cta
            size="lg"
            onClick={() => onOpenRequest("Cierre")}
            className="bg-brand px-10 py-7 text-lg text-white hover:bg-brand-strong"
          >
            {ctaLabel}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
