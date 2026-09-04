"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CatalogDownloadButton } from "@/components/catalog-download-button"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import { useMagnetic } from "@/hooks/use-magnetic"

interface ClosingCtaProps {
  title: string
  text: string
  image: string
  imageAlt: string
  primaryHref: string
  primaryLabel: string
  catalogId: string
  catalogName: string
  /**
   * Nombre real del PDF en `public/catalogs/`, para el enlace de descarga
   * directa (sin pedir email). Opcional a propósito: 2026-09-05, encargo
   * del cliente de "conectar los catálogos" reveló que solo MBIM y MBBE
   * tienen catálogo real subido (`catalogoMBIM.pdf`, `catalogo_mbbe_2025.pdf`)
   * — EMBIM sigue con un PDF de 1 página como marcador (ver CLAUDE.md §3).
   * Sin este prop, el enlace de descarga directa NO se renderiza — nunca se
   * ofrece una descarga directa de un catálogo que en realidad es un
   * placeholder, mismo criterio que `VideoPlaceholder` en /landing.
   */
  catalogFile?: string
}

/**
 * Cierre único de la página.
 *
 * Deja de ser el bloque centrado previsible: alineado a la izquierda, con el
 * titular a tamaño display revelado **palabra a palabra con SplitText** y la
 * imagen de fondo en parallax.
 *
 * Antes había cuatro llamadas a la acción compitiendo en el tramo final. Aquí
 * quedan dos, jerarquizadas de verdad.
 */
export function ClosingCta({
  title,
  text,
  image,
  imageAlt,
  primaryHref,
  primaryLabel,
  catalogId,
  catalogName,
  catalogFile,
}: ClosingCtaProps) {
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.4)

  const scopeRef = useGsapEffect<HTMLDivElement>(({ gsap, SplitText }, scope) => {
    const bg = scope.querySelector("[data-cta-bg]")
    const heading = scope.querySelector<HTMLElement>("[data-cta-title]")

    if (bg) {
      gsap.fromTo(
        bg,
        { yPercent: -8, scale: 1.16 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: true },
        },
      )
    }

    // SplitText: revelado palabra a palabra. Es el único sitio de la página donde
    // se usa; si se aplicase a todos los titulares dejaría de significar nada.
    if (heading) {
      const split = new SplitText(heading, { type: "words,lines", linesClass: "overflow-hidden" })

      gsap.from(split.words, {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.045,
        scrollTrigger: { trigger: heading, start: "top 85%", once: true },
      })

      // Devolver el DOM a su estado original al limpiar, si no SplitText deja
      // los <div> de las líneas incrustados.
      return () => split.revert()
    }
  })

  const restRef = useGsapEffect<HTMLDivElement>(({ gsap }, scope) => {
    gsap.from(scope.children, {
      y: 32,
      opacity: 0,
      duration: 0.95,
      ease: "expo.out",
      stagger: 0.12,
      scrollTrigger: { trigger: scope, start: "top 92%", once: true },
    })
  })

  return (
    <section id="contact" className="relative w-full overflow-hidden py-32 md:py-48">
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="100vw"
        data-cta-bg
        className="scale-[1.16] object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gray-950/88" aria-hidden="true" />

      <div ref={scopeRef} className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <h2 data-cta-title className="journey-title max-w-3xl text-balance text-white">
          {title}
        </h2>

        <div ref={restRef}>
          <p data-cta-item className="mt-8 max-w-lg text-lg leading-relaxed text-white/65">
            {text}
          </p>

          <div data-cta-item className="mt-14 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Link
              ref={ctaRef}
              href={primaryHref}
              style={{ "--btn-fill": "#ffffff" } as React.CSSProperties}
              className="btn-journey inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand px-9 py-4 text-sm font-semibold text-white hover:text-gray-950 sm:w-auto"
            >
              {primaryLabel}
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>

            <CatalogDownloadButton
              catalogId={catalogId}
              catalogName={catalogName}
              variant="ghost"
              className="link-draw h-auto rounded-none px-1 py-2 text-sm font-semibold text-white/70 hover:bg-transparent hover:text-white"
            />

            {/* Descarga directa, sin pedir email — solo si hay un catálogo
                real detrás (ver comentario de `catalogFile` en las props). */}
            {catalogFile && (
              <a
                href={`/catalogs/${catalogFile}`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw h-auto rounded-none px-1 py-2 text-sm font-semibold text-white/50 hover:text-white/80"
              >
                o descárgalo directamente (PDF)
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
