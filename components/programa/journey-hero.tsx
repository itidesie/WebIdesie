"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import { useMagnetic } from "@/hooks/use-magnetic"

interface JourneyHeroProps {
  eyebrow: string
  titleTop: string
  titleBottom: string
  intro: string
  image: string
  imageAlt: string
  ctaHref: string
  ctaLabel: string
}

/**
 * Movimiento 1 — Apertura.
 *
 * Regla que gobierna este componente: **el hero nunca espera a JavaScript**.
 *  · La imagen conserva `priority`, o sea su <link rel="preload">.
 *  · El titular se revela con animación CSS pura (.hero-line), que arranca en el
 *    primer pintado. Nada queda oculto a la espera de hidratar, así que el LCP
 *    es el mismo que el de una página estática.
 *  · GSAP solo entra después, y solo para el parallax al hacer scroll, que por
 *    definición ocurre más tarde.
 */
export function JourneyHero({
  eyebrow,
  titleTop,
  titleBottom,
  intro,
  image,
  imageAlt,
  ctaHref,
  ctaLabel,
}: JourneyHeroProps) {
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.4)

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const heroImage = scope.querySelector("[data-hero-image]")
    const scrim = scope.querySelector("[data-hero-scrim]")
    const content = scope.querySelector("[data-hero-content]")

    // Un solo ScrollTrigger para las tres capas: menos trabajo por fotograma y
    // sincronía garantizada entre ellas.
    const scrollTrigger = {
      trigger: scope,
      start: "top top",
      end: "bottom top",
      // scrub sin número = pegado al scroll. En una imagen a pantalla completa,
      // cualquier retardo se lee como lag y no como elegancia.
      scrub: true,
    } as const

    // Easing lineal a propósito: el reloj de una animación scrubbed es el dedo
    // del usuario. Curvarla haría que la imagen pareciese ir con retraso.
    if (heroImage) {
      gsap.fromTo(
        heroImage,
        { yPercent: 0, scale: 1.15 },
        { yPercent: 12, scale: 1.22, ease: "none", scrollTrigger },
      )
    }

    if (scrim) {
      gsap.to(scrim, { opacity: 1, ease: "none", scrollTrigger })
    }

    // El texto sube más rápido que la imagen: eso es lo que crea la sensación
    // de profundidad entre capas.
    if (content) {
      gsap.to(content, { yPercent: -16, opacity: 0.2, ease: "none", scrollTrigger })
    }
  })

  return (
    <section
      ref={scopeRef}
      /* Compacto a petición del cliente: antes ocupaba pantalla completa y
         obligaba a un scroll entero solo para pasar la portada. El tope en rem
         evita además que en monitores altos crezca sin control. */
      className="relative flex min-h-[30rem] w-full items-end overflow-hidden md:min-h-[34rem] lg:min-h-[38rem]"
      aria-labelledby="hero-heading"
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        data-hero-image
        className="scale-[1.15] object-cover object-center will-change-transform"
      />

      {/* Velo en tres paradas: un degradado de dos se ve sucio en la banda media
          sobre fotografía. */}
      <div
        data-hero-scrim
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgb(3_7_18/0.92)_0%,rgb(3_7_18/0.62)_38%,rgb(3_7_18/0.28)_70%,rgb(3_7_18/0.35)_100%)] opacity-[0.88]"
      />

      <div
        data-hero-content
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-14 pt-28 sm:px-8 md:pb-16"
      >
        <p className="journey-eyebrow hero-fade mb-5 text-white/60">{eyebrow}</p>

        <h1 id="hero-heading" className="journey-hero-title max-w-3xl text-balance text-white">
          <span className="hero-line">{titleTop}</span>
          <span className="hero-line hero-line-2 text-brand">{titleBottom}</span>
        </h1>

        <p className="hero-fade hero-fade-late mt-6 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
          {intro}
        </p>

        <div className="hero-fade hero-fade-late mt-8 flex items-center gap-7">
          <Link
            ref={ctaRef}
            href={ctaHref}
            style={{ "--btn-fill": "var(--color-brand)" } as React.CSSProperties}
            className="btn-journey inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-gray-950 hover:text-white"
          >
            {ctaLabel}
            <ArrowRight className="btn-arrow h-4 w-4" />
          </Link>

          {/* Indicador de scroll: una línea que se llena y se vacía. */}
          <span className="hidden items-center gap-3.5 sm:flex">
            <span className="scroll-cue block h-8 w-px bg-white/15 text-white/70" aria-hidden="true" />
            <span className="journey-eyebrow text-white/40">Desliza</span>
          </span>
        </div>
      </div>
    </section>
  )
}
