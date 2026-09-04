"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import { IndiceMonogram } from "./indice-monogram"
import type { Professor } from "@/app/profesores-page/profesores-content"

interface IndiceListProps {
  professors: Professor[]
}

const GROUP_LABELS: Record<Professor["group"], string> = {
  direccion: "Dirección",
  claustro: "Cuerpo docente",
}

/**
 * El directorio en sí — masthead editorial, no una galería de tarjetas.
 * Cada fila se expande al clic para revelar la bio completa (mismo
 * mecanismo `grid-template-rows` que `.faq-panel`/`.balance-ledger-panel`),
 * el momento que invita a "explorar más" en vez de mostrar todo de golpe.
 * Numeración continua 01-17 sobre los dos grupos (Dirección primero, por
 * ser un hecho real y verificable en los propios datos — ver el content).
 */
export function IndiceList({ professors }: IndiceListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-row]"), {
      y: 18,
      opacity: 0,
      duration: 0.6,
      stagger: 0.045,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
    })
  })

  const groups: Professor["group"][] = ["direccion", "claustro"]
  let runningIndex = 0

  return (
    <section id="claustro" ref={scopeRef} className="w-full bg-background py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        {groups.map((group) => {
          const rows = professors.filter((p) => p.group === group)
          if (rows.length === 0) return null

          return (
            <div key={group} className="mb-14 last:mb-0">
              <p className="indice-eyebrow mb-6 text-brand-strong">{GROUP_LABELS[group]}</p>

              <ol className="divide-y divide-border border-y border-border">
                {rows.map((professor) => {
                  const i = runningIndex++
                  const isOpen = openIndex === i
                  return (
                    <li key={professor.name} data-row>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="indice-row flex w-full items-center gap-4 py-5 text-left sm:gap-6"
                      >
                        <span className="indice-mono w-7 shrink-0 text-sm text-muted-foreground sm:w-9 sm:text-base">
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <IndiceMonogram name={professor.name} index={i} />

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-base font-bold text-foreground sm:text-lg">
                            {professor.name}
                          </span>
                          <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                            {professor.title} · {professor.specialization}
                          </span>
                        </span>

                        <Plus
                          className={`indice-plus h-5 w-5 shrink-0 text-brand ${isOpen ? "indice-plus-open" : ""}`}
                          aria-hidden="true"
                        />
                      </button>

                      <div className="indice-bio-panel" data-active={isOpen}>
                        <div className="overflow-hidden">
                          <p className="max-w-xl pb-6 pl-11 pr-8 text-sm leading-relaxed text-muted-foreground sm:pl-24">
                            {professor.bio}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          )
        })}
      </div>
    </section>
  )
}
