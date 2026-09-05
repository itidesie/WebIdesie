"use client"

import { useState } from "react"
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Faq {
  question: string
  answer: string
}

interface ReinforcementSectionProps {
  faqs: Faq[]
  onOpenRequest: (context: string) => void
}

/**
 * Sección 5 — refuerzo adicional: una barra de garantía real (acreditación
 * oficial, no una garantía de devolución inventada — no existe esa política
 * documentada en el proyecto) y un FAQ cruzado a los 4 másteres, con
 * respuestas honestas cuando el dato varía por programa en vez de
 * uniformarlas.
 *
 * Usa `.faq-panel`, el mismo mecanismo de acordeón (grid-template-rows) que
 * ya emplea `components/programa/faq-list.tsx` — no se duplica bajo un
 * nombre propio porque esta página no tiene una identidad narrativa propia
 * que proteger, es un agregador de venta que habla el idioma común del sitio.
 *
 * 🎨 2026-09-05 — rediseño visual (solo tratamiento, cero cambios de
 * contenido): la barra de garantía pasa de una franja horizontal compacta
 * a un bloque `journey-surface` grande con el icono a gran escala en vez de
 * pequeño y en línea con el texto. Título de la sección ("Antes de
 * decidir.") mucho más grande, filas de FAQ con más padding y un hover
 * explícito (borde de marca + desplazamiento), y el giro del chevron pasa a
 * `--ease-spring` en vez de la transición lineal anterior — mismo criterio
 * de "más carácter, sin inventar mecánica nueva" que el resto del rediseño.
 *
 * 🎯 2026-09-06 — CTA propio tras el FAQ (antes esta sección tampoco tenía
 * ninguno): justo después de resolver las dudas es el momento natural para
 * ofrecer la llamada, no solo confiar en la barra flotante persistente.
 */
export function ReinforcementSection({ faqs, onOpenRequest }: ReinforcementSectionProps) {
  const [open, setOpen] = useState<number | null>(null)

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelector("[data-guarantee]"), {
      y: 50,
      opacity: 0,
      scale: 0.85,
      duration: 0.9,
      ease: "back.out(2)",
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
    })
    gsap.from(scope.querySelectorAll("[data-faq-row]"), {
      x: -40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "back.out(1.6)",
      scrollTrigger: { trigger: scope, start: "top 70%", once: true },
    })
    gsap.to(scope.querySelector("[data-guarantee-icon]"), {
      scale: 1.15,
      duration: 1,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    })

    const cta = scope.querySelector("[data-faq-cta]")
    if (cta) {
      gsap.from(cta, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.8)",
        scrollTrigger: { trigger: cta, start: "top 90%", once: true },
      })
    }
  })

  return (
    <section ref={scopeRef} className="w-full bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div
          data-guarantee
          className="journey-surface journey-surface-light mb-16 flex flex-col items-center gap-6 border border-brand/20 bg-white/80 p-8 text-center sm:flex-row sm:gap-8 sm:p-10 sm:text-left"
        >
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand/10">
            <ShieldCheck data-guarantee-icon className="h-10 w-10 text-brand" />
          </span>
          {/* 2026-09-05 — corregido: la certificación Cualificam es
              exclusiva del MBIM, no de los 4 másteres — hallazgo del
              cliente, mismo criterio que `landing-content.ts`. Este texto
              vivía hardcodeado aquí (no en `landing-content.ts`), así que
              se había quedado fuera de la primera pasada de la corrección
              hasta encontrarlo al verificar el HTML servido. Ver
              CLAUDE.md §5. */}
          <p className="text-base leading-relaxed text-gray-950/80 sm:text-lg">
            <strong className="block text-xl text-gray-950 sm:text-2xl">Título IDESIE en los 4 másteres.</strong>
            El Máster BIM Full Time (MBIM) suma además la certificación Cualificam de la Fundación para el
            Conocimiento Madri+d, alineada con el Espacio Europeo de Educación Superior.
          </p>
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-brand-strong">
            Preguntas frecuentes
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-gray-950 sm:text-5xl">
            Antes de decidir.
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={faq.question}
              data-faq-row
              data-open={open === i}
              className="faq-row group overflow-hidden rounded-xl border border-gray-950/10 bg-white transition-colors duration-300 hover:border-brand/40"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition-transform duration-300 group-hover:translate-x-1 sm:p-6"
                aria-expanded={open === i}
              >
                <span className="text-base font-semibold text-gray-950 sm:text-lg">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gray-950/40 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:text-brand ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className="faq-panel px-5 sm:px-6">
                <p className="pb-5 text-sm leading-relaxed text-gray-950/65 sm:text-base">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">¿Te queda alguna duda? Resuélvela en una llamada gratuita.</p>
          <Button
            data-faq-cta
            size="lg"
            magnetic
            onClick={() => onOpenRequest("FAQ")}
            className="bg-brand px-8 py-6 text-base text-white hover:bg-brand-strong"
          >
            Agendar mi llamada gratuita
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
