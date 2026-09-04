"use client"

import { Check } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface CicloBeneficiosProps {
  eyebrow: string
  title: string
  beneficios: string[]
}

export function CicloBeneficios({ eyebrow, title, beneficios }: CicloBeneficiosProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-beneficio]"), {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-background py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="ciclo-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="ciclo-title mt-3 text-foreground">{title}</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {beneficios.map((beneficio) => (
            <div key={beneficio} data-beneficio className="flex items-center gap-3 border-l-4 border-brand bg-card p-4">
              <Check className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
              <p className="text-sm font-medium text-foreground sm:text-base">{beneficio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
