"use client"

import { useState } from "react"
import Link from "next/link"
import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Scholarship {
  title: string
  description: string
}

interface LedgerGroup {
  key: string
  label: string
  intro: string
  items: Scholarship[]
}

interface BalanceLedgerProps {
  eyebrow: string
  title: string
  groups: LedgerGroup[]
  note: string
  ctaLabel: string
  ctaHref: string
}

/**
 * El único momento con dinamismo fuerte de esta página — equivalente al M3 de
 * las páginas de programa y al grafo de "La Red", pero con un motivo propio:
 * cada beca es un "sello aprobado" que se estampa sobre un carril que se
 * dibuja al hacer scroll (mismo mecanismo `scaleY` scrubbed que `.online-rail`
 * / `.timeline-rail`, aplicado a un concepto distinto — un libro de becas, no
 * una red ni una línea de tiempo).
 *
 * El cambio de pestaña Full Time / Executive es una transición CSS instantánea
 * (mismo mecanismo que el acordeón de FAQ, `grid-template-rows`), no otro
 * disparo de GSAP: el "wow" ya ocurrió al entrar en la sección por scroll: no
 * tiene sentido repetirlo cada vez que alguien cambia de pestaña.
 */
export function BalanceLedger({ eyebrow, title, groups, note, ctaLabel, ctaHref }: BalanceLedgerProps) {
  const [active, setActive] = useState(groups[0]?.key)

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const rail = scope.querySelector<HTMLElement>("[data-rail]")
    const stamps = scope.querySelectorAll<HTMLElement>("[data-stamp]")

    if (rail) {
      gsap.fromTo(
        rail,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: rail, start: "top 75%", end: "bottom 85%", scrub: true },
        },
      )
    }

    gsap.from(stamps, {
      opacity: 0,
      scale: 1.35,
      rotate: -6,
      duration: 0.6,
      stagger: 0.12,
      ease: "back.out(1.6)",
      scrollTrigger: { trigger: scope, start: "top 78%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-background py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="balance-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="balance-title mt-3 text-foreground">{title}</h2>
        </div>

        <div className="mt-10 flex justify-center gap-2" role="tablist" aria-label="Modalidad">
          {groups.map((group) => (
            <button
              key={group.key}
              type="button"
              role="tab"
              data-magnetic
              data-magnetic-strength="0.18"
              aria-selected={active === group.key}
              onClick={() => setActive(group.key)}
              className={`balance-tab ${active === group.key ? "balance-tab-active" : ""}`}
            >
              {group.label}
            </button>
          ))}
        </div>

        {groups.map((group) => (
          <div key={group.key} data-active={active === group.key} className="balance-ledger-panel mt-4">
            <div className="overflow-hidden">
              <p className="pb-6 text-center text-sm text-muted-foreground">{group.intro}</p>

              <div className="relative pl-10 sm:pl-14">
                <div
                  data-rail
                  className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-brand sm:left-[11px]"
                />

                <ol className="space-y-8">
                  {group.items.map((item) => (
                    <li key={item.title} className="relative">
                      <span
                        data-stamp
                        className="balance-seal absolute -left-10 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand bg-background sm:-left-14"
                        aria-hidden="true"
                      >
                        <span className="h-2 w-2 rounded-full bg-brand" />
                      </span>

                      <div className="balance-card border-l-4 border-brand bg-card p-5">
                        <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}

        <p className="balance-mono mt-10 text-center text-sm font-semibold text-destructive">{note}</p>

        <div className="mt-10 text-center">
          <Link
            href={ctaHref}
            data-magnetic
            style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}
            className="btn-balance inline-flex items-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
