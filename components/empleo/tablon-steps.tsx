"use client"

import { Search, Send, Mail } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Step {
  title: string
  text: string
}

interface TablonStepsProps {
  steps: Step[]
}

const ICONS = [Search, Send, Mail]

/**
 * "Cómo funciona" — sección nueva, la versión anterior no explicaba el
 * proceso en ningún sitio. Fondo `bg-paper`, mismo alivio tonal que ya usa el
 * resto del sitio entre dos bloques de color intensos.
 */
export function TablonSteps({ steps }: TablonStepsProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-step]"), {
      y: 28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-paper py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="tablon-eyebrow text-brand-strong">Cómo funciona</p>
          <h2 className="tablon-title mt-3 text-gray-950">Tres pasos, sin vueltas</h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <div key={step.title} data-step className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand bg-background">
                  <Icon className="h-6 w-6 text-brand-strong" aria-hidden="true" />
                </div>
                <p className="tablon-mono mt-4 text-xs font-bold uppercase tracking-wide text-brand-strong">
                  Paso {i + 1}
                </p>
                <h3 className="mt-1 text-lg font-bold text-gray-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-950/65">{step.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
