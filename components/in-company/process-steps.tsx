"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Step {
  num: string
  title: string
  text: string
}

interface ProcessStepsProps {
  eyebrow: string
  title: string
  intro: string
  steps: Step[]
}

/**
 * El único momento con dinamismo fuerte de la página — responde a la
 * pregunta que la versión anterior nunca contestaba: "¿cómo se llega al
 * programa a medida?" (hallazgo 4 de la auditoría). Sustituye a las tres
 * tarjetas de icono genérico (Proyectos Reales / 100% Personalizado / Plan
 * Estratégico), que describían el resultado sin explicar el proceso.
 *
 * `data-rail` es la misma técnica que `.timeline-rail` del M4 presencial y
 * `data-rail` del grafo del Máster Online: una barra que se dibuja con
 * `scaleY` scrubbed al scroll. Aquí representa la línea de cota que acota
 * los cuatro pasos, no un carril de módulos ni un eje de red.
 */
export function ProcessSteps({ eyebrow, title, intro, steps }: ProcessStepsProps) {
  const scopeRef = useGsapEffect<HTMLDivElement>(({ gsap }, scope) => {
    const rail = scope.querySelector<HTMLElement>("[data-rail]")
    const items = scope.querySelectorAll<HTMLElement>("[data-step]")

    if (rail) {
      gsap.fromTo(
        rail,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: rail, start: "top 75%", end: "bottom 80%", scrub: true },
        },
      )
    }

    items.forEach((item, i) => {
      gsap.from(item, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "expo.out",
        delay: i * 0.05,
        scrollTrigger: { trigger: item, start: "top 88%", once: true },
      })
    })
  })

  return (
    <section className="w-full bg-paper py-20 md:py-28">
      <div ref={scopeRef} className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="blueprint-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="blueprint-title mt-3 text-gray-950">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-gray-950/70">{intro}</p>
        </div>

        <div className="relative mt-16 pl-12 sm:pl-16">
          <div data-rail className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-brand sm:left-[11px]" />

          <ol className="space-y-10">
            {steps.map((step) => (
              <li key={step.num} data-step className="relative">
                <span
                  className="blueprint-mono absolute -left-12 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-brand/40 bg-white text-[0.65rem] font-bold text-brand-strong sm:-left-16"
                  aria-hidden="true"
                >
                  {step.num}
                </span>
                <div className="blueprint-dimline pt-4">
                  <h3 className="text-lg font-bold text-gray-950">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-950/70">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
