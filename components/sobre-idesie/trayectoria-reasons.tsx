"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"
import type { Reason } from "@/app/sobre-idesie-page/sobre-idesie-content"

interface TrayectoriaReasonsProps {
  eyebrow: string
  title: string
  reasons: Reason[]
}

/**
 * "Por qué elegir IDESIE" como lista con borde izquierdo — el mismo patrón
 * genérico que ya usan `admision-section.tsx`, el FAQ, Consultoría BIM y
 * Financiación en todo el sitio. No es un motivo importado de otra página,
 * es infraestructura visual compartida.
 */
export function TrayectoriaReasons({ eyebrow, title, reasons }: TrayectoriaReasonsProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-reason]"), {
      x: -24,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="trayectoria-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="trayectoria-title mt-3 text-gray-950">{title}</h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {reasons.map((reason) => (
            <div key={reason.title} data-reason className="border-l-4 border-brand bg-background p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-950">{reason.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-gray-950/70">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
