"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Fact {
  value: string
  label: string
}

interface BalanceStatProps {
  value: number
  suffix: string
  label: string
  claim: string
  facts: Fact[]
}

/**
 * Cifra protagonista de la página, mismo mecanismo que `network-stat.tsx` de
 * "La Red" (escala+opacidad de entrada, contador a cero, tira de datos de
 * apoyo escalonada) — es infraestructura genérica de scroll-reveal, no un
 * motivo propio de esa página, así que se reutiliza el patrón sin copiar su
 * identidad visual (aquí es `bg-paper`, no `gray-950`: esta página respira en
 * claro, no en oscuro).
 */
export function BalanceStat({ value, suffix, label, claim, facts }: BalanceStatProps) {
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
    <section ref={scopeRef} className="relative w-full overflow-hidden bg-paper py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8">
        <div className="balance-display text-gray-950">
          <span data-count={value}>0</span>
          <span className="text-brand">{suffix}</span>
        </div>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-950/75">{label}</p>
        <p className="balance-mono mx-auto mt-2 max-w-lg text-sm text-gray-950/55">{claim}</p>

        <div className="mt-14 grid grid-cols-1 gap-6 border-t border-gray-950/10 pt-10 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} data-fact>
              <div className="balance-mono text-2xl font-bold text-brand-strong">{fact.value}</div>
              <div className="mt-1 text-sm text-gray-950/65">{fact.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
