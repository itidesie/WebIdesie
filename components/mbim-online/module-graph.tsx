"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Module {
  num: string
  title: string
  subtitle: string
  items: string[]
  featured?: boolean
}

interface ModuleGraphProps {
  eyebrow: string
  title: string
  intro: string
  modules: Module[]
}

/**
 * El único momento con dinamismo fuerte de esta página — equivalente al M3 del
 * presencial (el único ★ de esas páginas), pero con un dispositivo distinto:
 * en vez de un carril horizontal con pin de scroll, los 9 módulos son nodos
 * sobre un mismo eje (`online-rail`, mecanismo idéntico al `.timeline-rail`
 * del M4 presencial: una barra que se dibuja con `scaleY` scrubbed al scroll)
 * que convergen en el Proyecto Fin de Máster. El grafo, no el carril, es la
 * metáfora de red que sostiene toda la página.
 *
 * Contenido del temario sin cambios respecto a la versión anterior de esta
 * página — solo cambia la presentación.
 */
export function ModuleGraph({ eyebrow, title, intro, modules }: ModuleGraphProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const rail = scope.querySelector<HTMLElement>("[data-rail]")
    const nodes = scope.querySelectorAll<HTMLElement>("[data-node]")

    if (rail) {
      gsap.fromTo(
        rail,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: rail, start: "top 75%", end: "bottom 80%", scrub: true },
        },
      )
    }

    nodes.forEach((node, i) => {
      gsap.from(node, {
        x: i % 2 === 0 ? -24 : 24,
        opacity: 0,
        duration: 0.7,
        ease: "expo.out",
        scrollTrigger: { trigger: node, start: "top 88%", once: true },
      })
    })
  })

  return (
    <section id="programa" className="w-full scroll-mt-[var(--header-height)] bg-background py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="online-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="online-title mt-3 text-foreground">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>
        </div>

        <div className="relative mt-16 pl-10 sm:pl-14">
          <div
            data-rail
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-brand sm:left-[11px]"
          />

          <ol className="space-y-10">
            {modules.map((m) => (
              <li key={m.num} data-node className="relative">
                <span
                  className={`absolute -left-10 top-1 flex h-4 w-4 items-center justify-center rounded-full sm:-left-14 ${
                    m.featured ? "bg-brand online-node-pulse" : "bg-brand/40"
                  }`}
                  aria-hidden="true"
                />

                <div
                  className={`rounded-2xl border p-6 ${
                    m.featured
                      ? "border-brand/30 bg-brand text-white shadow-lg"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span
                      className={`online-mono text-sm font-bold ${
                        m.featured ? "text-white/60" : "text-brand"
                      }`}
                    >
                      {m.num}
                    </span>
                    <h3 className={`text-lg font-bold ${m.featured ? "text-white" : "text-foreground"}`}>
                      {m.title}
                    </h3>
                  </div>
                  <p className={`mt-1 text-sm font-medium ${m.featured ? "text-white/80" : "text-brand-strong"}`}>
                    {m.subtitle}
                  </p>
                  {m.items.length > 0 && (
                    <ul className={`mt-3 space-y-1.5 text-sm ${m.featured ? "text-white/85" : "text-muted-foreground"}`}>
                      {m.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className={m.featured ? "text-white/50" : "text-brand"}>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
