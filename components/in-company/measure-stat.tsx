"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Fact {
  value: string
  label: string
}

interface MeasureStatProps {
  value: number
  suffix: string
  label: string
  facts: Fact[]
}

/**
 * Cifra rescatada del `metadata` de la página anterior — era real ("+50
 * empresas confían en IDESIE") pero nunca se mostraba en el cuerpo (hallazgo
 * 3 de la auditoría). Mismo mecanismo de conteo que el resto del sitio
 * (`stat-monolith.tsx`, `network-stat.tsx`): número a cero, cuenta al entrar
 * en pantalla, `once: true`.
 */
export function MeasureStat({ value, suffix, label, facts }: MeasureStatProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const numberEl = scope.querySelector<HTMLElement>("[data-count]")
    if (!numberEl) return

    const target = Number(numberEl.dataset.count)
    const counter = { n: 0 }

    gsap.fromTo(
      numberEl,
      { scale: 1.15, opacity: 0.2 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: numberEl, start: "top 85%", once: true },
      },
    )

    gsap.to(counter, {
      n: target,
      duration: 1.5,
      ease: "expo.out",
      snap: { n: 1 },
      onUpdate: () => {
        numberEl.textContent = String(Math.round(counter.n))
      },
      scrollTrigger: { trigger: numberEl, start: "top 85%", once: true },
    })

    gsap.from(scope.querySelectorAll("[data-fact]"), {
      y: 24,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-background py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
        <div className="blueprint-display text-foreground">
          <span data-count={value}>0</span>
          <span className="text-brand">{suffix}</span>
        </div>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">{label}</p>

        <div className="mt-14 grid grid-cols-1 gap-6 border-t border-border pt-10 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} data-fact>
              <div className="blueprint-mono text-lg font-bold text-brand-strong">{fact.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{fact.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
