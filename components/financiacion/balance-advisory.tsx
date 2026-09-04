"use client"

import { CalendarCheck, FileText, ArrowRight } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Step {
  title: string
  text: string
}

interface BalanceAdvisoryProps {
  eyebrow: string
  title: string
  intro: string
  steps: Step[]
}

const ICONS = [CalendarCheck, FileText, ArrowRight]

/**
 * Sustituye la imagen decorativa rota (`asesoramiento-personalizado.png`,
 * 404 confirmado — nunca existió en disco) por un motivo propio en CSS/SVG:
 * un "sello" de aprobación girado, coherente con el resto de la identidad de
 * la página (sellos/carril de la sección de becas) en vez de salir a buscar
 * o generar una foto nueva de stock.
 */
export function BalanceAdvisory({ eyebrow, title, intro, steps }: BalanceAdvisoryProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-step]"), {
      x: -24,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
    })

    gsap.from(scope.querySelector("[data-motif]"), {
      scale: 0.85,
      opacity: 0,
      rotate: -8,
      duration: 0.9,
      ease: "back.out(1.4)",
      scrollTrigger: { trigger: scope, start: "top 75%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-paper py-20 md:py-28">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 px-6 sm:px-8 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="balance-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="balance-title mt-3 text-gray-950">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-gray-950/75">{intro}</p>

          <ol className="mt-8 space-y-5">
            {steps.map((step, i) => {
              const Icon = ICONS[i % ICONS.length]
              return (
                <li key={step.title} data-step className="flex items-start gap-4">
                  <span className="balance-mono flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-brand text-sm font-bold text-brand-strong">
                    {i + 1}
                  </span>
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-gray-950">
                      <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-950/65">{step.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <div data-motif className="mx-auto flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72">
          <div className="balance-motif relative flex h-full w-full items-center justify-center rounded-full border-4 border-dashed border-brand/30">
            <div className="flex h-4/5 w-4/5 flex-col items-center justify-center rounded-full border-2 border-brand bg-background text-center shadow-sm">
              <span className="balance-display text-4xl text-brand sm:text-5xl">1:1</span>
              <span className="balance-mono mt-1 px-4 text-xs text-gray-950/60">asesoría personalizada</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
