"use client"

import type React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import { useMagnetic } from "@/hooks/use-magnetic"

interface ExperienceBandProps {
  /** Se pasa como ?programa= para que contacto sepa de qué máster viene. */
  programa: "MBIM" | "MBBE" | "EMBIM"
  /** Nombre del programa en el titular. Por defecto, las siglas. */
  nombre?: string
}

/**
 * 7a — Vivirlo antes de decidir.
 *
 * Conserva los dos CTA que antes apuntaban a /asesoria-online y
 * /solicitar-clase-online (rutas que nunca existieron y devolvían 404) y que
 * ahora van a la página de contacto con motivo. Ver CLAUDE.md.
 */
export function ExperienceBand({ programa, nombre }: ExperienceBandProps) {
  const claseRef = useMagnetic<HTMLAnchorElement>(0.35)
  const label = nombre ?? programa

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const items = gsap.utils.toArray<HTMLElement>("[data-band-item]", scope)
    if (!items.length) return

    gsap.from(items, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "expo.out",
      stagger: 0.11,
      scrollTrigger: { trigger: scope, start: "top 85%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-background py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <p data-band-item className="journey-eyebrow text-brand">
          Antes de decidir
        </p>
        <h2
          data-band-item
          className="journey-title mt-6 max-w-2xl text-balance text-foreground"
        >
          Vive el {label} por un día.
        </h2>
        <p data-band-item className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Puedes asistir a una clase en vivo con uno de los profesores y ver cómo se trabaja de
          verdad, o hablar con nuestro equipo de orientación académica sobre tus próximos pasos.
        </p>

        <div data-band-item className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Link
            ref={claseRef}
            href={`/contact-page?motivo=clase&programa=${programa}`}
            style={{ "--btn-fill": "var(--color-brand-strong)" } as React.CSSProperties}
            className="btn-journey inline-flex items-center justify-center gap-3 rounded-full bg-brand px-9 py-4 text-sm font-semibold text-white"
          >
            Solicitar clase online
            <ArrowRight className="btn-arrow h-4 w-4" />
          </Link>

          <Link
            href={`/contact-page?motivo=asesoria&programa=${programa}`}
            className="link-draw text-sm font-semibold text-foreground transition-colors duration-300 hover:text-brand"
          >
            Solicitar asesoría online
          </Link>
        </div>
      </div>
    </section>
  )
}
