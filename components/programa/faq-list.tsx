"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface FaqListProps {
  eyebrow: string
  title: string
  faqs: { question: string; answer: string }[]
}

/**
 * Movimiento 7 — Preguntas.
 *
 * La apertura es real, no un salto: `grid-template-rows: 0fr → 1fr` anima hasta
 * la altura automática sin medir nada con JavaScript. El icono gira con una
 * curva con rebote leve (--ease-spring), que es donde se nota el cuidado.
 *
 * Sin la caja gris con borde azul de cada fila: a esta altura de la página el
 * azul ya se ha usado en los tres momentos clave, y repetirlo aquí lo devalúa.
 */
export function FaqList({ eyebrow, title, faqs }: FaqListProps) {
  const [open, setOpen] = useState<number | null>(null)

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const heading = scope.querySelector("[data-heading]")
    const rows = gsap.utils.toArray<HTMLElement>("[data-row]", scope)

    if (heading) {
      gsap.from(heading, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: heading, start: "top 88%", once: true },
      })
    }

    if (rows.length) {
      gsap.from(rows, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: rows[0], start: "top 92%", once: true },
      })
    }
  })

  return (
    <section ref={scopeRef} className="w-full bg-background py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div data-heading>
          <p className="journey-eyebrow text-brand">{eyebrow}</p>
          <h2 className="journey-title mt-6 text-balance text-foreground">{title}</h2>
        </div>

        <div className="mt-16">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={faq.question}
                data-row
                data-open={isOpen}
                className="faq-row border-b border-border"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="group flex w-full items-start justify-between gap-8 py-7 text-left"
                  >
                    <span className="text-lg font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand md:text-xl">
                      {faq.question}
                    </span>
                    <Plus
                      className="faq-icon mt-1 h-5 w-5 flex-shrink-0 text-brand"
                      aria-hidden="true"
                    />
                  </button>
                </h3>

                <div id={`faq-panel-${i}`} className="faq-panel" role="region">
                  <div>
                    <p className="pb-8 pr-12 text-base leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
