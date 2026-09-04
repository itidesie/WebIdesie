"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"
import type { Legacy } from "@/app/alumni-page/alumni-content"

interface LegadoSpotlightsProps {
  eyebrow: string
  title: string
  legacies: Legacy[]
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
}

/**
 * El único momento ★ de la página. Cada alumno es un panel a página
 * completa, no una tarjeta más de una rejilla de 3 — la narrativa
 * individual manda. El arco "Programa → Hoy" reutiliza el motivo de carril
 * de "La Trayectoria" (Sobre IDESIE) a escala de una persona en vez de la
 * institución: es la misma familia visual, aplicada un nivel más abajo.
 * Solo 2 nodos por arco a propósito — programa cursado y rol actual son los
 * únicos dos puntos que los datos reales sostienen, no se inventa nada
 * intermedio.
 */
export function LegadoSpotlights({ eyebrow, title, legacies }: LegadoSpotlightsProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    scope.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
      const rail = panel.querySelector<HTMLElement>("[data-rail]")
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: { trigger: panel, start: "top 70%", end: "top 40%", scrub: true },
          },
        )
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: panel, start: "top 75%", once: true },
      })
      tl.from(panel.querySelector("[data-monogram]"), {
        scale: 0.7,
        opacity: 0,
        rotate: -8,
        duration: 0.6,
        ease: "back.out(1.6)",
      })
        .from(
          panel.querySelector("[data-quote]"),
          { y: 24, opacity: 0, duration: 0.7, ease: "expo.out" },
          "-=0.35",
        )
        .from(
          panel.querySelectorAll("[data-node]"),
          { opacity: 0, scale: 1.3, duration: 0.4, stagger: 0.15, ease: "back.out(1.6)" },
          "-=0.3",
        )
    })
  })

  return (
    <section id="legado" ref={scopeRef} className="w-full">
      {legacies.map((legacy, i) => {
        const dark = i % 2 === 0
        return (
          <div
            key={legacy.name}
            data-panel
            className={`w-full px-6 py-20 sm:px-8 md:py-28 ${dark ? "bg-gray-950" : "bg-paper"}`}
          >
            <div className="mx-auto max-w-3xl">
              {i === 0 && (
                <div className="mb-16 text-center">
                  <p className="legado-eyebrow text-brand">{eyebrow}</p>
                  <h2 className="legado-title mt-3 text-white">{title}</h2>
                </div>
              )}

              <div
                data-monogram
                className={`legado-monogram legado-monogram-${i % 3} mx-auto flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white sm:h-20 sm:w-20 sm:text-xl`}
                aria-hidden="true"
              >
                {getInitials(legacy.name)}
              </div>

              <p
                data-quote
                className={`legado-quote mt-8 text-center text-balance ${dark ? "text-white" : "text-gray-950"}`}
              >
                &ldquo;{legacy.quote}&rdquo;
              </p>

              <div className="mx-auto mt-10 max-w-sm">
                <div className={`relative h-px w-full ${dark ? "bg-white/15" : "bg-gray-950/15"}`}>
                  <div data-rail className="absolute inset-y-0 left-0 w-full origin-left bg-brand" />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span data-node className="text-left">
                    <span className="legado-mono block text-brand">{legacy.program}</span>
                    <span className={dark ? "text-white/60" : "text-gray-950/60"}>Alumno/a</span>
                  </span>
                  <span data-node className="text-right">
                    <span className={`block font-bold ${dark ? "text-white" : "text-gray-950"}`}>
                      {legacy.role}
                    </span>
                    <span className={dark ? "text-white/60" : "text-gray-950/60"}>{legacy.company}</span>
                  </span>
                </div>
              </div>

              <p className={`mt-6 text-center text-lg font-bold ${dark ? "text-white" : "text-gray-950"}`}>
                {legacy.name}
              </p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
