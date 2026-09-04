"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import { VideoPlaceholder } from "./video-placeholder"
import { TestimonialVideo } from "./testimonial-video"
import type { Testimonial } from "@/app/landing/landing-content"

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
  onOpenRequest: (context: string) => void
}

/**
 * 🎬 2026-09-05 — rediseño completo de /landing: los testimonios pasan de
 * ser la 2ª sección DENTRO del contenido bloqueado (3 tarjetas pequeñas en
 * formato retrato, dentro de un grid de 3 columnas) a ser la 2ª sección de
 * la página entera, justo después del hero — antes incluso de "Por qué
 * IDESIE" — y en formato grande: un panel por alumno, vídeo protagonista a
 * un lado y cita a el otro, alternando de lado en cada uno para dar ritmo.
 * Pedido explícito del cliente: "dales protagonismo real, no los trates
 * como sección secundaria" — con Carolina, Omar y Agustina ya siendo
 * contenido real y verificado, la prueba social se mueve arriba del embudo
 * a propósito (generar confianza antes de argumentar, no después).
 *
 * Sigue en fondo claro (`bg-background`/`bg-paper` alternos para dar
 * respiro tonal entre paneles, nunca `gray-950`) — la dirección aprobada
 * pide una paleta predominantemente clara en toda la página.
 *
 * El mecanismo de "N de 3 son de ejemplo" se conserva (por si se añade un
 * cuarto testimonio sin vídeo confirmado en el futuro) pero ya no es un
 * texto de cabecera: con las 3 tarjetas reales no había nada que avisar, así
 * que el aviso ahora vive como un renglón discreto bajo el título, solo si
 * `pendingCount > 0`.
 *
 * Cierra con un CTA propio ("Quiero mi propia historia") — cada sección de
 * la página empuja a la conversión, la prueba social no es una excepción.
 */
export function TestimonialsSection({ testimonials, onOpenRequest }: TestimonialsSectionProps) {
  const pendingCount = testimonials.filter((t) => !t.video).length

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelector("[data-testimonials-heading]"), {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
    })

    scope.querySelectorAll<HTMLElement>("[data-testimonial-panel]").forEach((panel) => {
      const media = panel.querySelector("[data-testimonial-media]")
      const copy = panel.querySelector("[data-testimonial-copy]")
      const fromRight = panel.dataset.side === "right"

      const tl = gsap.timeline({
        scrollTrigger: { trigger: panel, start: "top 75%", once: true },
      })
      if (media) {
        tl.from(media, { scale: 0.9, opacity: 0, duration: 0.8, ease: "expo.out" }, 0)
      }
      if (copy) {
        tl.from(copy, { x: fromRight ? 40 : -40, opacity: 0, duration: 0.7, ease: "expo.out" }, 0.15)
      }
    })

    const cta = scope.querySelector("[data-testimonials-cta]")
    if (cta) {
      gsap.from(cta, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.8)",
        scrollTrigger: { trigger: cta, start: "top 90%", once: true },
      })
    }
  })

  return (
    <section ref={scopeRef} className="w-full bg-background">
      <div data-testimonials-heading className="mx-auto max-w-2xl px-6 pt-20 text-center sm:px-8 md:pt-28">
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-brand-strong">
          Testimonios reales
        </p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          Lo que dicen nuestros alumnos.
        </h2>
        {pendingCount > 0 && (
          <p className="mt-3 text-sm font-medium text-brand-strong">
            ⚠ {pendingCount} de {testimonials.length} testimonios {pendingCount === 1 ? "es" : "son"} de ejemplo —
            vídeo{pendingCount === 1 ? "" : "s"}, cita{pendingCount === 1 ? "" : "s"} y nombre
            {pendingCount === 1 ? "" : "s"} pendientes de sustituir por testimonios reales.
          </p>
        )}
      </div>

      <div className="mt-16 md:mt-20">
        {testimonials.map((t, i) => {
          const side = i % 2 === 0 ? "left" : "right"
          const panelBg = i % 2 === 0 ? "bg-background" : "bg-paper"

          return (
            <div key={t.name} data-testimonial-panel data-side={side} className={`w-full ${panelBg} py-14 md:py-20`}>
              <div
                className={`mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 sm:px-8 md:gap-16 ${
                  side === "right" ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <div data-testimonial-media className="w-full max-w-xs shrink-0 sm:max-w-sm">
                  <div className="journey-surface journey-surface-light overflow-hidden rounded-2xl">
                    {t.video ? (
                      <TestimonialVideo src={t.video} name={t.name} quote={t.quote} />
                    ) : (
                      // TODO: sustituir por el vídeo real de este testimonio
                      <VideoPlaceholder label={`Testimonio ${i + 1}`} aspect="portrait" />
                    )}
                  </div>
                </div>

                <div data-testimonial-copy className="flex-1 text-center md:text-left">
                  <span className="font-mono text-xs font-bold uppercase tracking-wide text-brand/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <blockquote className="mt-3 text-2xl font-bold leading-snug tracking-tight text-gray-950 sm:text-3xl">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <p className="mt-5 text-base font-semibold text-gray-950">{t.name}</p>
                  {t.role && <p className="text-sm text-gray-950/55">{t.role}</p>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center bg-background pb-20 pt-4 md:pb-28">
        <Button
          data-testimonials-cta
          size="lg"
          magnetic
          onClick={() => onOpenRequest("Testimonios")}
          className="bg-brand px-8 py-6 text-base text-white hover:bg-brand-strong"
        >
          Quiero mi propia historia
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}
