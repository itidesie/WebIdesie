"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Resultado {
  porcentaje: number
  descripcion: string
}

interface CicloResultadosProps {
  eyebrow: string
  title: string
  resultados: Resultado[]
}

/**
 * Estadísticas de empleo por sector — sustituye los anillos SVG genéricos de
 * la versión anterior por barras horizontales que se dibujan al scroll
 * (mismo mecanismo `scaleX` scrubbed que los conectores del ciclo).
 */
export function CicloResultados({ eyebrow, title, resultados }: CicloResultadosProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-bar]"), {
      scaleX: 0,
      duration: 1,
      stagger: 0.12,
      ease: "expo.out",
      transformOrigin: "left center",
      scrollTrigger: { trigger: scope, start: "top 78%", once: true },
    })

    gsap.from(scope.querySelectorAll("[data-row]"), {
      x: -20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 78%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="ciclo-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="ciclo-title mt-3 text-gray-950">{title}</h2>
        </div>

        <div className="mt-12 space-y-6">
          {resultados.map((resultado) => (
            <div key={resultado.descripcion} data-row>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-sm font-semibold text-gray-950">{resultado.descripcion}</span>
                <span className="ciclo-mono text-sm font-bold text-brand-strong">{resultado.porcentaje}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-950/10">
                <div
                  data-bar
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${resultado.porcentaje}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
