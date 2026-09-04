"use client"

import Image from "next/image"
import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Half {
  time: string
  title: string
  text: string
  image: string
  imageAlt: string
}

interface SplitDayProps {
  eyebrow: string
  title: string
  morning: Half
  afternoon: Half
  fases: { fase: string; title: string; text: string }[]
}

/**
 * Movimiento 4 — El día partido.  ★ momento clave
 *
 * Dirección «El reloj partido». El contraste es **tonal**, no de tamaño:
 *  · Mañana → papel cálido, foto CONTENIDA con aire alrededor, tipografía negra.
 *  · Tarde  → gris 950, foto A SANGRE, tipografía blanca.
 *  · Reparto asimétrico 58/42: no son equivalentes, y la composición lo dice.
 *
 * Dos decisiones que vienen de iteraciones con el cliente y conviene no deshacer:
 *
 * 1. **Sección compacta.** Nada de paneles a 88vh: la altura la marca el
 *    contenido, con un mínimo modesto. Este movimiento va entre dos secciones
 *    largas (M3 y M5) y alargarlo obligaba a un scroll desproporcionado para lo
 *    que cuenta.
 * 2. **Sin cifras de hora.** Hubo una versión con 08:00 / 15:00 a tamaño display
 *    como ancla; se descartó por decorativa. El ancla de cada mitad es su propio
 *    rótulo ("Por la mañana" / "Por la tarde") en mono, y el titular baja a
 *    .journey-title-sm para no competir con el titular de la sección.
 *
 * La sorpresa de este movimiento es **cromática, no cinética**: la página se
 * abre en luz después del bloque oscuro del M3. Deliberadamente NO lleva un
 * segundo efecto scrubbed espectacular — dos seguidos se anulan entre sí.
 */
export function SplitDay({ eyebrow, title, morning, afternoon, fases }: SplitDayProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const heading = scope.querySelector("[data-heading]")
    const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", scope)
    const rail = scope.querySelector("[data-rail]")
    const stops = gsap.utils.toArray<HTMLElement>("[data-stop]", scope)

    if (heading) {
      gsap.from(heading, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: heading, start: "top 85%", once: true },
      })
    }

    // Parallax contenido a ±4 %. Con el velo casi eliminado, un recorrido
    // mayor delataría el recorte de la foto. Lineal porque va scrubbed.
    panels.forEach((panel) => {
      const img = panel.querySelector("[data-panel-image]")
      const direction = Number(panel.dataset.direction ?? 1)
      if (!img) return

      gsap.fromTo(
        img,
        { yPercent: -4 * direction },
        {
          yPercent: 4 * direction,
          ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
        },
      )
    })

    // La línea de tiempo se dibuja de arriba abajo conforme la recorres.
    if (rail) {
      gsap.fromTo(
        rail,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: rail, start: "top 80%", end: "bottom 75%", scrub: true },
        },
      )
    }

    if (stops.length) {
      gsap.from(stops, {
        x: -20,
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.13,
        scrollTrigger: { trigger: stops[0], start: "top 88%", once: true },
      })
    }
  })

  return (
    <section ref={scopeRef} className="w-full bg-background pt-20 md:pt-24">
      <div data-heading className="mx-auto mb-10 max-w-6xl px-6 sm:px-8 md:mb-14">
        <p className="journey-eyebrow text-brand">{eyebrow}</p>
        <h2 className="journey-title mt-5 max-w-3xl text-balance text-foreground">{title}</h2>
      </div>

      {/* Díptico asimétrico 58/42. Las dos mitades no comparten ni fondo, ni
          tratamiento de imagen, ni color de texto: esa es toda la idea.
          La altura la marca el contenido; el min-h solo evita que la mitad
          oscura quede raquítica si su texto es corto. */}
      <div className="grid grid-cols-1 lg:grid-cols-[58fr_42fr]">
        {/* ── Mañana · papel, foto contenida ─────────────────────────────── */}
        <div
          data-panel
          data-direction="-1"
          className="relative flex flex-col justify-between bg-paper px-7 py-10 md:px-12 md:py-14"
        >
          <div>
            {/* El rótulo es el ancla de la mitad: regla + mono espaciado. */}
            <div className="flex items-center gap-4">
              <span className="h-px w-8 flex-shrink-0 bg-brand" aria-hidden="true" />
              <p className="journey-label text-brand">{morning.time}</p>
            </div>
            <h3 className="journey-title-sm mt-5 text-gray-950">{morning.title}</h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-950/70 md:text-base">
              {morning.text}
            </p>
          </div>

          {/* La foto respira: contenida, con aire alrededor y sin velo. */}
          <figure className="mt-9 overflow-hidden rounded-sm">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={morning.image}
                alt={morning.imageAlt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                data-panel-image
                className="duotone-warm scale-[1.14] object-cover will-change-transform"
              />
            </div>
          </figure>
        </div>

        {/* ── Tarde · gris 950, foto a sangre ────────────────────────────── */}
        <div
          data-panel
          data-direction="1"
          className="relative isolate flex min-h-[19rem] flex-col justify-end overflow-hidden bg-gray-950 px-7 py-10 md:min-h-[22rem] md:px-11 md:py-14"
        >
          <Image
            src={afternoon.image}
            alt={afternoon.imageAlt}
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            data-panel-image
            className="duotone-cool scale-[1.14] object-cover will-change-transform"
          />
          {/* Tinte azul de marca sobre las sombras. */}
          <div className="duotone-cool-tint absolute inset-0" aria-hidden="true" />
          {/* Velo mínimo, solo el necesario para leer. */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_top,rgb(3_7_18/0.85)_0%,rgb(3_7_18/0.45)_55%,rgb(3_7_18/0.2)_100%)]"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 flex-shrink-0 bg-brand" aria-hidden="true" />
              <p className="journey-label text-white">{afternoon.time}</p>
            </div>
            <h3 className="journey-title-sm mt-5 text-white">{afternoon.title}</h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75 md:text-base">
              {afternoon.text}
            </p>
          </div>
        </div>
      </div>

      {/* ── Las 3 fases como paradas de la línea de tiempo ────────────────── */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 md:py-20">
        <ol className="relative pl-9 md:pl-12">
          <span
            data-rail
            aria-hidden="true"
            className="timeline-rail absolute bottom-2 left-[3px] top-2 w-px bg-brand md:left-[4px]"
          />

          {fases.map((f) => (
            <li key={f.fase} data-stop className="relative pb-10 last:pb-0">
              <span
                aria-hidden="true"
                className="timeline-dot-dark absolute -left-9 top-1 h-1.5 w-1.5 rounded-full bg-brand md:-left-12 md:ml-[1px]"
              />
              <span className="journey-eyebrow text-brand">{f.fase}</span>
              <h4 className="mt-3 text-lg font-bold tracking-tight text-foreground md:text-xl">
                {f.title}
              </h4>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {f.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
