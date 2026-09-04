"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Outcome {
  rol: string
  salario: string
  nota: string
}

interface OutcomesListProps {
  eyebrow: string
  title: string
  intro: string
  outcomes: Outcome[]
}

/**
 * Mismos roles y rangos salariales que `mbim-content.ts` (el mercado de salida
 * es el mismo programa, solo cambia la modalidad). Sin cifra de empleabilidad
 * inventada: la página nunca tuvo un "95 %" o "100 %" — mantenemos ese mismo
 * criterio en vez de añadir uno nuevo sin fuente.
 */
export function OutcomesList({ eyebrow, title, intro, outcomes }: OutcomesListProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-outcome]"), {
      y: 24,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-background py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="online-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="online-title mt-3 text-foreground">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>
        </div>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {outcomes.map((o) => (
            <div key={o.rol} data-outcome className="flex items-center gap-4 py-5">
              <span className="online-node inline-block h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{o.rol}</p>
                <p className="text-sm text-muted-foreground">{o.nota}</p>
              </div>
              <p className="online-mono shrink-0 text-right text-sm font-bold text-brand-strong sm:text-base">
                {o.salario}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
