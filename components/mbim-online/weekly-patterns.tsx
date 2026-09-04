"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface WeekPattern {
  name: string
  role: string
  note: string
  /** 28 valores (4 semanas x 7 días), 1 = sesión de estudio ese día. */
  pattern: number[]
}

interface WeeklyPatternsProps {
  eyebrow: string
  title: string
  intro: string
  patterns: WeekPattern[]
}

/**
 * Sustituye a "El día partido" (M4 del presencial: mañana obra / tarde aula).
 * Ese dispositivo cuenta UN día porque el presencial TIENE un día fijo. El
 * online no lo tiene — esa es la venta. En vez de partir un día en dos mitades
 * simétricas de color, aquí conviven tres patrones semanales reales y
 * distintos: la idea visual es "no hay un día correcto", lo contrario del
 * díptico del presencial.
 *
 * El escalonado de cada mapa de calor es CSS puro (`transition-delay` vía la
 * variable `--i` en cada celda): un solo ScrollTrigger por tarjeta activa
 * `.is-visible` en el contenedor, no 28 ScrollTriggers por tarjeta.
 *
 * Fondo `bg-paper`: mismo alivio tonal que usa el M4 presencial entre dos
 * bloques oscuros (gray-950 antes y después). No se inventa un tono nuevo.
 */
export function WeeklyPatterns({ eyebrow, title, intro, patterns }: WeeklyPatternsProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap, ScrollTrigger }, scope) => {
    const cards = scope.querySelectorAll<HTMLElement>("[data-pattern-card]")
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "expo.out",
        delay: i * 0.08,
        scrollTrigger: { trigger: card, start: "top 85%", once: true },
      })

      ScrollTrigger.create({
        trigger: card,
        start: "top 85%",
        once: true,
        onEnter: () => card.querySelector(".week-grid")?.classList.add("is-visible"),
      })
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="online-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="online-title mt-3 text-gray-950">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-gray-950/70">{intro}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {patterns.map((p) => (
            <div
              key={p.name}
              data-pattern-card
              className="rounded-2xl border border-gray-950/10 bg-white/70 p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-950">{p.name}</h3>
              <p className="mt-1 text-sm font-medium text-brand-strong">{p.role}</p>

              <div className="week-grid mt-5" style={{ gridTemplateRows: "repeat(4, 1fr)" }}>
                {p.pattern.map((active, i) => (
                  <span
                    key={i}
                    className="week-cell"
                    data-active={active === 1}
                    style={{ ["--i" as string]: i }}
                  />
                ))}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-gray-950/60">{p.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
