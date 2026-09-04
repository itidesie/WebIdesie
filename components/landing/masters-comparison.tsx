"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import { getModalityCategory, MODALITY_STYLES } from "@/lib/landing-modality"
import type { MasterCard } from "@/app/landing/landing-content"

interface MastersComparisonProps {
  masters: MasterCard[]
  onOpenRequest: (context: string) => void
}

/**
 * Sección 4 — "El Mapa de Formatos". Segunda reescritura de esta sección en
 * el mismo día (2026-09-05): la primera dirección ("El Selector", pestañas
 * + un programa a la vez) se descartó por completo — el cliente reportó un
 * bug real (pestaña y contenido desincronizados, causado casi con toda
 * seguridad por el mismo servidor de desarrollo obsoleto que ya se
 * encontró y arregló esa misma sesión) y, más importante, pidió volver a
 * ver los 4 másteres a la vez, no 3 ocultos mientras se ve 1. Esta es la
 * dirección 3 de las 3 propuestas originales con la skill `awwwards`:
 * bandas editoriales apiladas, una por máster, todas visibles sin
 * interacción — cero estado de React, cero lógica de pestaña que pueda
 * volver a desincronizarse.
 *
 * 🔒 Sangrado seguro, no literal: el nombre GIGANTE de fondo usa el
 * `shortName` (MBIM/MBBE/EMBIM/Online — siempre corto), nunca el
 * `fullName` (el del MBBE tiene 34 caracteres — "Máster BIM & Building
 * Engineering" — ilegible o desbordante a escala gigante en móvil). El
 * `fullName` real se muestra aparte, en un titular de tamaño normal,
 * siempre legible. Cada banda lleva `overflow-hidden` como cinturón de
 * seguridad estructural: el nombre de fondo puede recortarse dentro de su
 * propia banda, pero no puede generar scroll horizontal de página bajo
 * ninguna circunstancia. El "full-bleed" es solo el fondo de color de cada
 * banda (a todo el ancho de la sección, que a su vez ocupa el viewport
 * completo) — el contenido en primer plano sigue alineado al mismo ancho
 * contenido que el resto de la página, nunca se deja "sangrar" el texto
 * real. Verificado con Puppeteer (Chrome headless real) en varios
 * viewports, incluido móvil — ver CLAUDE.md §5.
 *
 * Motion: cada banda revela de forma independiente al entrar en pantalla
 * (`scrollTrigger` por banda, `once: true`), y el nombre gigante de fondo
 * tiene un parallax horizontal muy sutil ligado al scroll (mismo mecanismo
 * ±4% ya usado en `split-day.tsx`/M4 de las páginas de máster — no
 * inventado aquí). Alternan izquierda/derecha en escritorio (`md:` en
 * adelante); en móvil todo se normaliza a una sola alineación, sin alternar
 * — alternar en pantallas estrechas no aporta nada y complica el diseño
 * sin necesidad.
 */
export function MastersComparison({ masters, onOpenRequest }: MastersComparisonProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    scope.querySelectorAll<HTMLElement>("[data-master-band]").forEach((band) => {
      const content = band.querySelector("[data-band-content]")
      const ghost = band.querySelector("[data-band-ghost]")
      const fromRight = band.dataset.side === "right"

      if (content) {
        gsap.from(content, {
          x: fromRight ? 40 : -40,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: band, start: "top 80%", once: true },
        })
      }
      if (ghost) {
        gsap.from(ghost, {
          opacity: 0,
          scale: 0.92,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: band, start: "top 85%", once: true },
        })
        // Parallax horizontal muy sutil, mismo criterio que el M4 de las
        // páginas de máster: con el sangrado ya contenido, un recorrido
        // mayor delataría el recorte del texto de fondo.
        gsap.to(ghost, {
          xPercent: fromRight ? -4 : 4,
          ease: "none",
          scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true },
        })
      }
    })
  })

  return (
    <section id="masteres" ref={scopeRef} className="w-full scroll-mt-4 overflow-x-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-brand-strong">
            Los 4 másteres
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            El mismo nivel, cuatro formatos.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Compara duración y modalidad.{" "}
            <Link href="/comparativa-masters-page" className="font-semibold text-brand-strong hover:underline">
              Ver la comparativa completa
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col">
        {masters.map((m, i) => {
          const category = getModalityCategory(m.modality)
          const style = MODALITY_STYLES[category]
          const side = i % 2 === 0 ? "left" : "right"
          const bandBg = i % 2 === 0 ? "bg-background" : "bg-paper"

          return (
            <div
              key={m.slug}
              data-master-band
              data-side={side}
              className={`relative w-full overflow-hidden py-14 md:py-20 ${bandBg}`}
            >
              {/* Nombre corto gigante de fondo — puramente decorativo, `overflow-hidden`
                  del padre garantiza que nunca puede desbordar ni generar scroll,
                  independientemente de lo ancho que llegue a medir el propio texto. */}
              <span
                data-band-ghost
                aria-hidden="true"
                className={`pointer-events-none absolute top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-mono text-[clamp(4rem,22vw,14rem)] font-black leading-none ${style.number} ${
                  side === "left" ? "left-0 -translate-x-[6%]" : "right-0 translate-x-[6%]"
                }`}
              >
                {m.shortName}
              </span>

              <div
                className={`relative mx-auto max-w-6xl px-6 sm:px-8 ${side === "right" ? "flex justify-end" : ""}`}
              >
                <div
                  data-band-content
                  className="journey-surface journey-surface-light relative w-full max-w-xl overflow-hidden border border-border bg-card p-7 md:p-9"
                >
                  <div
                    className={`absolute top-0 h-full w-1.5 ${style.accent} ${side === "right" ? "right-0" : "left-0"}`}
                    aria-hidden="true"
                  />

                  <span className="font-mono text-xs font-bold uppercase tracking-wide text-brand">
                    {m.shortName}
                  </span>
                  <h3 className="mt-1.5 text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl">
                    {m.fullName}
                  </h3>

                  <span
                    className={`mt-4 inline-block rounded-full px-3 py-1 font-mono text-[0.6875rem] font-semibold uppercase tracking-wide ${style.badge}`}
                  >
                    {m.modality.split("·")[0].trim()}
                  </span>

                  <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm tabular-nums">
                    <div className="flex items-baseline gap-2">
                      <dt className="text-muted-foreground">Duración</dt>
                      <dd className="font-medium text-foreground">{m.duration}</dd>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <dt className="text-muted-foreground">Modalidad</dt>
                      <dd className="font-medium text-foreground">{m.modality}</dd>
                    </div>
                  </dl>

                  <p
                    className={`mt-5 border-l-2 py-0.5 pl-3 text-sm font-semibold leading-snug text-foreground ${style.accent.replace("bg-", "border-")}`}
                  >
                    {m.highlight}
                  </p>

                  <Button
                    variant="outline"
                    magnetic
                    className="relative mt-6 w-full py-5"
                    onClick={() => onOpenRequest(m.shortName)}
                  >
                    Solicitar información
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
