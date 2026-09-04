"use client"

import { Quote } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import type { Testimonial } from "@/app/opiniones-page/opiniones-content"

interface VocesTestimonialsProps {
  title: string
  testimonials: Testimonial[]
}

/**
 * El único momento ★ de la página, y deliberadamente el más contenido de
 * las 6 páginas de prueba social: nada de tarjetas con degradado azul (se
 * leen como marketing producido, lo opuesto a "auténtico"). Cada cita se
 * revela sola, grande, en tipografía — el archivo de voces, no un carrusel
 * de reseñas. Diferenciación explícita de "El Legado" (Alumnos): allí la
 * cita viene acompañada de un arco de carrera; aquí la cita es la única
 * protagonista, sin más aparato.
 */
export function VocesTestimonials({ title, testimonials }: VocesTestimonialsProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-voice]"), {
      y: 28,
      opacity: 0,
      duration: 0.8,
      stagger: 0.16,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 78%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <h2 className="voces-title mb-14 text-center text-gray-950">{title}</h2>

        <div className="divide-y divide-gray-950/10">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} data-voice className="py-10 first:pt-0 last:pb-0">
              <Quote className="h-7 w-7 text-brand/40" aria-hidden="true" />
              <p className="voces-quote mt-4 text-gray-950">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="voces-mono mt-5 text-sm text-gray-950/60">
                <span className="font-bold text-gray-950">{testimonial.name}</span> · {testimonial.program}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
