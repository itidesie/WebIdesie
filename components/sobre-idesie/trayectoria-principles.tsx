"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"
import type { Principle } from "@/app/sobre-idesie-page/sobre-idesie-content"

interface TrayectoriaPrinciplesProps {
  eyebrow: string
  title: string
  principles: Principle[]
}

/**
 * Misión/Visión/Valores como narrativa conectada por un mismo hilo vertical
 * (reutiliza el motivo del carril, sin el scrub scrollado: aquí no hay hitos
 * cronológicos, así que el hilo es estático — solo entra con el resto del
 * bloque). Sustituye las 3 tarjetas con icono desconectadas de la versión
 * anterior.
 */
export function TrayectoriaPrinciples({ eyebrow, title, principles }: TrayectoriaPrinciplesProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-principle]"), {
      y: 32,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 78%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-background py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="trayectoria-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="trayectoria-title mt-3 text-foreground">{title}</h2>
        </div>

        <div className="relative mt-16 border-l-2 border-brand/20 pl-8 sm:pl-12">
          {principles.map((principle) => (
            <div key={principle.key} data-principle className="relative pb-14 last:pb-0">
              <span
                className="absolute -left-[calc(2rem+5px)] top-1 h-2.5 w-2.5 rounded-full bg-brand sm:-left-[calc(3rem+5px)]"
                aria-hidden="true"
              />
              <p className="trayectoria-mono text-brand-strong">{principle.title}</p>
              <p className="mt-2 max-w-2xl text-lg leading-relaxed text-foreground/85 sm:text-xl">
                {principle.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
