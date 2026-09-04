"use client"

import { useRef } from "react"
import { RotateCcw } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import type { CyclePhase } from "@/app/nuestra-metodologia-page/metodologia-content"

interface CicloDiagramProps {
  eyebrow: string
  title: string
  intro: string
  phases: CyclePhase[]
  loopLabel: string
}

/**
 * El único momento con dinamismo fuerte de la página — equivalente al carril
 * de "La Trayectoria" o al carril de becas de "El Balance", pero con un
 * motivo propio: en vez de una línea de tiempo que termina, un CICLO que se
 * cierra. Diferencia deliberada frente al "día partido" que ya usan las
 * páginas de máster para Learning by Working a nivel de programa — aquí no
 * hay dos mitades (mañana/tarde), hay un proceso continuo que se repite con
 * cada proyecto real.
 *
 * Las 3 fases se conectan con líneas rectas escaladas (mismo mecanismo de
 * `scaleX`/`scaleY` scrubbed que el resto del sitio) y el cierre del ciclo
 * (fase 3 → fase 1) se dibuja como un arco con el mismo mecanismo de
 * `stroke-dashoffset` que el carril de "La Trayectoria" — aplicado a una
 * curva en vez de a una recta.
 */
export function CicloDiagram({ eyebrow, title, intro, phases, loopLabel }: CicloDiagramProps) {
  const pathRef = useRef<SVGPathElement>(null)

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const path = pathRef.current
    if (path) {
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: scope, start: "top 60%", end: "bottom 85%", scrub: true },
      })
    }

    gsap.from(scope.querySelectorAll("[data-connector]"), {
      scaleX: 0,
      duration: 0.7,
      ease: "none",
      transformOrigin: "left center",
      scrollTrigger: { trigger: scope, start: "top 65%", end: "top 30%", scrub: true },
    })

    gsap.from(scope.querySelectorAll("[data-phase]"), {
      y: 32,
      opacity: 0,
      scale: 0.94,
      duration: 0.7,
      stagger: 0.16,
      ease: "back.out(1.5)",
      scrollTrigger: { trigger: scope, start: "top 70%", once: true },
    })

    gsap.from(scope.querySelector("[data-loop-label]"), {
      opacity: 0,
      y: 12,
      duration: 0.6,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "bottom 80%", once: true },
    })
  })

  return (
    <section id="ciclo" ref={scopeRef} className="w-full bg-gray-950 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="ciclo-eyebrow text-brand">{eyebrow}</p>
          <h2 className="ciclo-title mt-3 text-white">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">{intro}</p>
        </div>

        <div className="relative mt-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
            {phases.map((phase, i) => (
              <div key={phase.key} className="relative">
                <div
                  data-phase
                  className="ciclo-phase-card h-full rounded-xl border border-white/10 bg-white/[0.04] p-7"
                >
                  <span className="ciclo-mono text-3xl font-black text-brand">{phase.step}</span>
                  <h3 className="mt-4 text-lg font-bold text-white sm:text-xl">{phase.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{phase.description}</p>
                </div>

                {i < phases.length - 1 && (
                  <span
                    data-connector
                    aria-hidden="true"
                    className="absolute left-1/2 top-full hidden h-6 w-px -translate-x-1/2 bg-brand/50 md:left-full md:top-1/2 md:h-px md:w-6 md:-translate-y-1/2 md:translate-x-0"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Cierre del ciclo: fase 3 vuelve a fase 1 */}
          <div className="relative mx-auto mt-4 hidden max-w-4xl md:block" aria-hidden="true">
            <svg viewBox="0 0 100 22" preserveAspectRatio="none" className="h-16 w-full overflow-visible">
              <path
                ref={pathRef}
                d="M 92 0 C 92 20, 8 20, 8 0"
                fill="none"
                stroke="var(--color-brand)"
                strokeWidth="0.6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div data-loop-label className="ciclo-mono mt-6 flex items-center justify-center gap-2 text-center text-sm text-white/55 md:mt-2">
            <RotateCcw className="h-4 w-4 text-brand" aria-hidden="true" />
            {loopLabel}
          </div>
        </div>
      </div>
    </section>
  )
}
