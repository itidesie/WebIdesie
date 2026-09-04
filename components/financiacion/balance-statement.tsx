"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface SummaryRow {
  modality: string
  financing: string
  scholarships: string
}

interface BalanceStatementProps {
  eyebrow: string
  title: string
  rows: SummaryRow[]
}

/**
 * La tabla HTML genérica original se reescribe como un "estado de cuenta":
 * cada modalidad es una línea con su propio encabezado tipográfico en mono
 * (la misma voz técnica que ya usan las páginas de programa y la tienda para
 * datos objetivos, no una identidad prestada — es infraestructura de marca
 * compartida). El escalonado de filas usa el mismo patrón que
 * `outcomes-list.tsx` de "La Red": fade+slide en bloque, sin exagerar.
 */
export function BalanceStatement({ eyebrow, title, rows }: BalanceStatementProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-row]"), {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-background py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="balance-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="balance-title mt-3 text-foreground">{title}</h2>
        </div>

        <div className="balance-statement-sheet mt-12">
          {rows.map((row) => (
            <div key={row.modality} data-row className="balance-statement-row">
              <div className="flex items-baseline justify-between gap-4 border-b border-foreground/10 pb-2">
                <h3 className="balance-mono text-lg font-bold text-foreground">{row.modality}</h3>
              </div>
              <dl className="mt-3 space-y-3">
                <div>
                  <dt className="balance-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Financiamiento
                  </dt>
                  <dd className="mt-1 text-sm text-foreground/85">{row.financing}</dd>
                </div>
                <div>
                  <dt className="balance-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Becas principales disponibles
                  </dt>
                  <dd className="mt-1 text-sm text-foreground/85">{row.scholarships}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
