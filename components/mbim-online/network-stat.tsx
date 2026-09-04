"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"
import { NetworkGlyph } from "./network-glyph"

interface Fact {
  value: string
  label: string
}

interface NetworkStatProps {
  value: number
  suffix: string
  label: string
  claim: string
  facts: Fact[]
}

/**
 * La cifra de esta página no es la duración ni el salario — esos ya los usan
 * MBIM y EMBIM. Es la bolsa de empleo: es el argumento que mejor vende "estés
 * donde estés, la red es la misma". Mismo mecanismo de conteo que
 * `stat-monolith.tsx` (número a cero, cuenta al entrar en pantalla, `once:
 * true`), pero el glifo de fondo es el motivo de red, no un degradado de marca.
 */
export function NetworkStat({ value, suffix, label, claim, facts }: NetworkStatProps) {
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
    <section ref={scopeRef} className="relative w-full overflow-hidden bg-gray-950 py-20 text-white md:py-28">
      <NetworkGlyph variant="compact" className="pointer-events-none absolute inset-0 h-full w-full opacity-40" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8">
        <div className="online-display text-white">
          <span data-count={value}>0</span>
          <span className="text-brand">{suffix}</span>
        </div>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{label}</p>
        {/* white/45 daba 4.47:1 sobre gray-950 — al filo de AA. /55 lo deja en 5.3:1. */}
        <p className="online-mono mx-auto mt-2 max-w-lg text-sm text-white/55">{claim}</p>

        <div className="mt-14 grid grid-cols-1 gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} data-fact>
              <div className="online-mono text-2xl font-bold text-brand">{fact.value}</div>
              <div className="mt-1 text-sm text-white/60">{fact.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
