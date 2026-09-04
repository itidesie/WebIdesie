"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Fact {
  value: string
  label: string
}

interface StatMonolithProps {
  value: string
  unit: string
  claim: string
  facts: Fact[]
}

/**
 * Movimiento 2 — La cifra.
 *
 * Sustituye a la antigua banda de cuatro números con el mismo peso: si todo se
 * grita, no se oye nada. Aquí manda un dato y el resto es su pie de página.
 *
 * El número se renderiza ya en su valor final desde el servidor; GSAP solo lo
 * pone a cero y lo hace contar cuando entra en pantalla. Sin JS, el dato es
 * correcto igualmente.
 */
export function StatMonolith({ value, unit, claim, facts }: StatMonolithProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const numberEl = scope.querySelector<HTMLElement>("[data-count]")
    const claimEl = scope.querySelector("[data-claim]")
    const rows = scope.querySelectorAll("[data-fact]")
    const rules = scope.querySelectorAll("[data-rule]")

    if (numberEl) {
      const target = Number(numberEl.dataset.count)
      const counter = { n: 0 }

      gsap.fromTo(
        numberEl,
        { scale: 1.18, opacity: 0.15 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: numberEl, start: "top 85%", once: true },
        },
      )

      gsap.to(counter, {
        n: target,
        duration: 1.6,
        ease: "expo.out",
        snap: { n: 1 },
        onUpdate: () => {
          numberEl.textContent = String(Math.round(counter.n))
        },
        scrollTrigger: { trigger: numberEl, start: "top 85%", once: true },
      })
    }

    if (claimEl) {
      gsap.from(claimEl, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: claimEl, start: "top 88%", once: true },
      })
    }

    // Las reglas se dibujan de izquierda a derecha, escalonadas. Un detalle
    // barato que transforma una fila de datos en un gesto.
    if (rules.length) {
      gsap.from(rules, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: rules[0], start: "top 90%", once: true },
      })
    }

    if (rows.length) {
      gsap.from(rows, {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: rows[0], start: "top 90%", once: true },
      })
    }
  })

  return (
    <section ref={scopeRef} className="w-full bg-background py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:gap-12">
          {/* Degradado sobre el texto: el azul plano a este tamaño se ve pesado. */}
          <span
            data-count={value}
            aria-hidden="true"
            className="journey-display journey-mono block bg-[linear-gradient(160deg,var(--color-brand)_0%,var(--color-brand-strong)_55%,rgb(0_38_90)_100%)] bg-clip-text text-transparent will-change-transform"
          >
            {value}
          </span>
          <span className="pb-3 text-xl font-medium text-muted-foreground md:pb-8 md:text-2xl">
            {unit}
          </span>
          <span className="sr-only">
            {value} {unit}
          </span>
        </div>

        <p data-claim className="journey-title mt-12 max-w-3xl text-balance text-foreground">
          {claim}
        </p>

        <dl className="mt-20 grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label}>
              <span data-rule className="mb-6 block h-px w-full bg-brand" aria-hidden="true" />
              <div data-fact>
                <dt className="journey-mono text-3xl font-bold text-foreground md:text-4xl">
                  {fact.value}
                </dt>
                <dd className="mt-4 text-sm leading-relaxed text-muted-foreground">{fact.label}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
