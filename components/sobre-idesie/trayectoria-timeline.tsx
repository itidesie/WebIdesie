"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"
import type { Milestone } from "@/app/sobre-idesie-page/sobre-idesie-content"

interface TrayectoriaTimelineProps {
  eyebrow: string
  title: string
  milestones: Milestone[]
}

/**
 * El único momento con dinamismo fuerte de la página — equivalente al carril
 * de becas de "El Balance" o al M3 de programa, pero con un motivo propio:
 * tres hitos reales (2012, acreditación, hoy) sobre un carril que se dibuja
 * al hacer scroll. Solo 3 nodos a propósito — no hay más hitos con fecha
 * real que documentar en ningún sitio del proyecto, y forzar más habría
 * significado inventar años que no existen (ver auditoría en CLAUDE.md).
 */
export function TrayectoriaTimeline({ eyebrow, title, milestones }: TrayectoriaTimelineProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const rail = scope.querySelector<HTMLElement>("[data-rail]")
    const nodes = scope.querySelectorAll<HTMLElement>("[data-node]")
    const rows = scope.querySelectorAll<HTMLElement>("[data-row]")

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

    gsap.from(nodes, {
      opacity: 0,
      scale: 1.4,
      rotate: -8,
      duration: 0.6,
      stagger: 0.18,
      ease: "back.out(1.6)",
      scrollTrigger: { trigger: scope, start: "top 70%", once: true },
    })

    gsap.from(rows, {
      x: -28,
      opacity: 0,
      duration: 0.8,
      stagger: 0.18,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 70%", once: true },
    })
  })

  return (
    <section id="trayectoria" ref={scopeRef} className="w-full bg-gray-950 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="trayectoria-eyebrow text-brand">{eyebrow}</p>
          <h2 className="trayectoria-title mt-3 text-white">{title}</h2>
        </div>

        <div className="relative mt-16 pl-10 sm:pl-14">
          <div
            data-rail
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-brand sm:left-[11px]"
          />

          <ol className="space-y-14">
            {milestones.map((milestone) => (
              <li key={milestone.marker} data-row className="relative">
                <span
                  data-node
                  className="trayectoria-node absolute -left-10 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand bg-gray-950 sm:-left-14"
                  aria-hidden="true"
                >
                  <span className="h-2 w-2 rounded-full bg-brand" />
                </span>

                <p className="trayectoria-mono text-sm font-semibold text-brand">{milestone.marker}</p>
                <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">{milestone.title}</h3>
                <p className="mt-2 max-w-xl text-base leading-relaxed text-white/70">{milestone.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
