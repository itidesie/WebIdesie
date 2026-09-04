"use client"

import Image from "next/image"
import { Globe, CheckCircle2 } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import type { Alliance } from "@/app/alianzas-page/alianzas-content"

interface ConvenioCardProps {
  alliance: Alliance
  index: number
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => w[0] === w[0]?.toUpperCase())
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

/**
 * El único momento ★ de la página: los puntos reales del acuerdo se
 * "sellan" al entrar en pantalla — mismo mecanismo de `back.out` + stagger
 * que ya usa el sitio para hitos/becas, aplicado aquí a una lista de
 * acuerdo, no a hitos cronológicos ni a un libro de becas.
 *
 * Sin foto real (Panamericana, UFV), el motivo es un emblema circular con
 * las iniciales de la institución y un anillo punteado en rotación lenta —
 * mismo mecanismo genérico que `balance-motif` (girar el anillo, mantener
 * el contenido central legible contrarrotándolo), nunca una foto de stock.
 */
export function ConvenioCard({ alliance, index }: ConvenioCardProps) {
  const imageFirst = index % 2 === 0

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelector("[data-visual]"), {
      opacity: 0,
      scale: 0.94,
      duration: 0.8,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 75%", once: true },
    })

    gsap.from(scope.querySelectorAll("[data-point]"), {
      opacity: 0,
      scale: 1.3,
      rotate: -6,
      duration: 0.5,
      stagger: 0.12,
      ease: "back.out(1.6)",
      scrollTrigger: { trigger: scope, start: "top 70%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full border-t border-border py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 sm:px-8 md:grid-cols-2 md:gap-14">
        <div data-visual className={`relative min-h-[280px] ${imageFirst ? "md:order-1" : "md:order-2"}`}>
          {alliance.photo ? (
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-xl">
              <Image src={alliance.photo} alt={`Campus / sede de ${alliance.name}`} fill className="object-cover" />
              <span className="absolute left-4 top-4 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
                {alliance.countryLabel}
              </span>
            </div>
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl bg-paper">
              <div className="convenio-motif relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-dashed border-brand/30 sm:h-56 sm:w-56">
                <div className="flex h-4/5 w-4/5 flex-col items-center justify-center rounded-full border-2 border-brand bg-background text-center shadow-sm">
                  <span className="convenio-mono text-3xl font-black text-brand sm:text-4xl">
                    {getInitials(alliance.name)}
                  </span>
                  <span className="convenio-mono mt-1 px-4 text-xs text-gray-950/60">{alliance.countryLabel}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={imageFirst ? "md:order-2" : "md:order-1"}>
          <p className="convenio-eyebrow text-brand-strong">{alliance.collaborationType}</p>
          <h3 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">{alliance.name}</h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" aria-hidden="true" />
            {alliance.location}
          </p>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{alliance.description}</p>

          <ul className="mt-6 space-y-2.5">
            {alliance.points.map((point) => (
              <li key={point} data-point className="flex items-start gap-2.5 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
