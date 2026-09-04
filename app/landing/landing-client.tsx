"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { HeroSection } from "@/components/landing/hero-section"
import { StrengthPoints } from "@/components/landing/strength-points"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { MastersComparison } from "@/components/landing/masters-comparison"
import { ReinforcementSection } from "@/components/landing/reinforcement-section"
import { MastersCtaStrip } from "@/components/landing/masters-cta-strip"
import { StickyCtaBar } from "@/components/landing/sticky-cta-bar"
import { InfoRequestModal } from "@/components/landing/info-request-modal"

import { hero, strengths, testimonials, masters, faqs, closing } from "./landing-content"

/**
 * /landing — página de venta de los 4 másteres (MBIM, MBBE, EMBIM, Online).
 *
 * A diferencia de cualquier otra página del sitio, **no lleva el `Header`
 * compartido**: sin menú, sin enlaces de navegación, solo la marca. Es una
 * landing de una sola dirección — todo empuja hacia `InfoRequestModal`, que
 * se abre desde cualquier CTA de la página (el hero, cada máster, los
 * testimonios, el cierre, y la barra flotante). El `context` que recibe
 * cada llamada a `openRequest` identifica qué botón lo abrió, para saber el
 * origen del lead — no cambia el formulario en sí, que es genérico.
 *
 * También es la única página del sitio con permiso explícito para animar
 * más fuerte que las páginas de programa (ver comentarios de cada
 * componente de `components/landing/`).
 *
 * 🎨 2026-09-05 — rediseño completo, encargo explícito del cliente ("se ve
 * pobre, genérica y poco enfocada a conversión"). Cambios estructurales:
 * - **Paleta predominantemente clara** en toda la página (antes el hero era
 *   `bg-gray-950`) — el azul de marca queda como acento, no como base.
 * - **Testimonios reales promovidos a 2ª sección**, justo después del hero
 *   y en formato grande (antes vivían dentro del contenido bloqueado, en
 *   una rejilla de tarjetas pequeñas) — la prueba social se mueve arriba
 *   del embudo a propósito.
 * - 🔓 **El bloqueo de la página hasta ver 60s reales del vídeo del hero se
 *   retira por completo** (decisión explícita del cliente, confirmada tras
 *   mi recomendación): esta es una landing de tráfico de pago, cada segundo
 *   de fricción antes del CTA cuesta conversión. El vídeo (`VIDLAN1.mp4`)
 *   sigue siendo protagonista del hero — autoplay, botón de sonido — pero
 *   ya no condiciona el acceso a nada. `GatedContent`, `VideoGateBanner` y
 *   toda la lógica de `sessionStorage`/scroll-lock/pulso de esta misma
 *   página se eliminaron (no quedan como código muerto).
 * - Resto de secciones (Por qué IDESIE, los 4 másteres, FAQ+garantía,
 *   cierre) se mantienen con su contenido y funcionamiento actuales.
 */
export default function LandingClient() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContext, setModalContext] = useState("Hero")

  const openRequest = (context: string) => {
    setModalContext(context)
    setModalOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sin Header compartido a propósito: cero navegación, solo marca.
          El logo no lleva Link — no debe sacar al visitante de la página. */}
      <div className="flex justify-center border-b border-border/60 bg-background py-4">
        <Image src="/images/logo_idesie_azul_trim.png" alt="IDESIE" width={343} height={123} className="h-8 w-auto" priority />
      </div>

      <main className="flex-grow" role="main">
        <HeroSection
          eyebrow={hero.eyebrow}
          title={hero.title}
          ctaLabel={hero.ctaLabel}
          onOpenRequest={() => openRequest("Hero")}
        />

        <TestimonialsSection testimonials={testimonials} onOpenRequest={openRequest} />
        <StrengthPoints strengths={strengths} />
        <MastersComparison masters={masters} onOpenRequest={openRequest} />
        <ReinforcementSection faqs={faqs} />
        <MastersCtaStrip masters={masters} title={closing.title} intro={closing.intro} ctaLabel={closing.ctaLabel} onOpenRequest={openRequest} />
      </main>

      {/* Sin footer completo a propósito — /landing es huérfana (noindex,
          nofollow, sin Header) para tráfico de campañas de pago. Un solo
          enlace mínimo a Aviso Legal (que ya incluye las condiciones de
          uso, no hay una página de "Términos" separada en el sitio — ver
          CLAUDE.md) en vez de <FooterSection />, que traía logo, redes,
          copyright y enlaces a todo el sitio. Nunca un <footer>: es texto
          suelto, sin bloque ni estructura de navegación propia. */}
      <p className="py-8 text-center text-xs text-muted-foreground">
        <Link
          href="/aviso-legal-page"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground hover:underline"
        >
          Términos y aviso legal
        </Link>
      </p>

      <StickyCtaBar onOpenRequest={openRequest} />
      <InfoRequestModal open={modalOpen} onOpenChange={setModalOpen} context={modalContext} />
    </div>
  )
}
