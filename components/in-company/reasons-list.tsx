"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Reason {
  title: string
  text: string
}

interface ReasonsListProps {
  eyebrow: string
  title: string
  reasons: Reason[]
}

/**
 * Fusiona las dos secciones que decían lo mismo con palabras distintas en la
 * versión anterior (`benefits`, 4 tarjetas con icono genérico, y `keyPoints`,
 * 6 bullets) — hallazgo 2 de la auditoría. Una sola lista de 4 razones reales,
 * sin iconos ilustrativos (Sparkles/Atom/Lightbulb no comunican nada de BIM),
 * numeradas en mono como el resto del vocabulario "acotado" de la página.
 */
export function ReasonsList({ eyebrow, title, reasons }: ReasonsListProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-reason]"), {
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
          <p className="blueprint-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="blueprint-title mt-3 text-foreground">{title}</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
          {reasons.map((reason, i) => (
            <div key={reason.title} data-reason className="flex gap-4">
              <span className="blueprint-mono mt-0.5 text-sm font-bold text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-bold text-foreground">{reason.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{reason.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
