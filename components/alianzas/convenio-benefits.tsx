"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"
import type { Benefit } from "@/app/alianzas-page/alianzas-content"

interface ConvenioBenefitsProps {
  title: string
  benefits: Benefit[]
}

/**
 * Franja delgada de 3 beneficios con numeración en mono en vez de icono en
 * círculo azul — el patrón de tarjeta+icono ya se retiró de esta página en
 * otras piezas del sitio (In Company, Consultoría) por genérico.
 */
export function ConvenioBenefits({ title, benefits }: ConvenioBenefitsProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-benefit]"), {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-paper py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <h2 className="convenio-title mb-10 text-center text-gray-950">{title}</h2>

        <div className="grid grid-cols-1 gap-8 border-t border-gray-950/10 pt-8 sm:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.number} data-benefit>
              <span className="convenio-mono text-3xl font-black text-brand">{benefit.number}</span>
              <h3 className="mt-2 text-lg font-bold text-gray-950">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-950/70">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
