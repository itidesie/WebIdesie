"use client"

import { ArrowRight } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface FinancingOption {
  title: string
  description: string
  details: string[]
}

interface BalanceFinancingCardsProps {
  eyebrow: string
  title: string
  intro: string
  options: FinancingOption[]
}

/**
 * Reutiliza el patrón "card con borde izquierdo" ya establecido en
 * `admision-section.tsx` y el FAQ de las páginas de programa — genérico, no
 * importado de ninguna identidad ajena. El único aporte propio aquí es el
 * escalonado GSAP de entrada.
 */
export function BalanceFinancingCards({ eyebrow, title, intro, options }: BalanceFinancingCardsProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-card]"), {
      y: 28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
    })
  })

  return (
    <section id="opciones" ref={scopeRef} className="scroll-mt-[var(--header-height)] w-full bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="balance-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="balance-title mt-3 text-foreground">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {options.map((option) => (
            <div
              key={option.title}
              data-card
              className="balance-card border-l-4 border-brand bg-card p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-foreground">{option.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{option.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/85">
                {option.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
