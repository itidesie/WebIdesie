"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Modulo } from "@/app/mbim-page/mbim-content"

interface ModuleJourneyProps {
  eyebrow: string
  title: string
  intro: string
  modulos: Modulo[]
}

/**
 * Movimiento 3 — El recorrido.  ★ momento clave
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ POR QUÉ ESTA SECCIÓN **NO** USA EL PIN DE GSAP
 *
 * Hubo tres intentos con `ScrollTrigger` + `pin` + desplazamiento horizontal.
 * Los tres fallaron en producción por el mismo motivo de fondo: el pin obliga a
 * calcular a mano coordenadas (alto del header fijo, recorrido horizontal,
 * puntos de anclaje, atenuación por distancia al centro) y **cualquier desajuste
 * recorta el contenido sin dejar forma de alcanzarlo**, porque la sección está
 * anclada. En una sección que explica los módulos del máster —la información
 * más importante de la página— ese riesgo no compensa.
 *
 * Ahora el desplazamiento es **scroll horizontal nativo con scroll-snap de CSS**:
 *  · El navegador se encarga de la geometría, no nosotros.
 *  · `scroll-snap-align: center` + ancho de tarjeta acotado (`min(86vw, 30rem)`)
 *    garantizan **por construcción** que la tarjeta enfocada cabe entera: 30rem
 *    son 480px, y 86vw nunca desborda. No hay resolución en la que se recorte.
 *  · Sin pin, la sección fluye con normalidad, así que **es imposible que el
 *    header fijo la tape**. `scroll-mt` cubre además el salto por anclas.
 *  · Funciona sin JavaScript, con teclado, con trackpad y con swipe.
 *
 * El JS de este componente **no mueve nada por su cuenta**: solo observa qué
 * tarjeta está centrada para pintar el contador y el realce. Si no hidrata, el
 * carril sigue siendo plenamente utilizable.
 *
 * NO lo reconviertas a pin sin poder verificarlo midiendo en un navegador real.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function ModuleJourney({ eyebrow, title, intro, modulos }: ModuleJourneyProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [activo, setActivo] = useState(0)
  const [enInicio, setEnInicio] = useState(true)
  const [enFinal, setEnFinal] = useState(false)

  const fases = Array.from(new Set(modulos.map((m) => m.fase)))
  const faseActiva = modulos[activo]?.fase ?? fases[0]
  const progreso = modulos.length > 1 ? activo / (modulos.length - 1) : 1

  /** Lee la posición del carril para saber qué tarjeta manda y si hay tope. */
  const leerPosicion = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const max = track.scrollWidth - track.clientWidth
    setEnInicio(track.scrollLeft <= 4)
    setEnFinal(track.scrollLeft >= max - 4)

    // La tarjeta activa es aquella cuyo centro está más cerca del centro del
    // carril. Es la misma definición que usa scroll-snap-align: center.
    const centroCarril = track.scrollLeft + track.clientWidth / 2
    let mejor = 0
    let menorDistancia = Number.POSITIVE_INFINITY

    Array.from(track.children).forEach((hijo, i) => {
      const el = hijo as HTMLElement
      const distancia = Math.abs(el.offsetLeft + el.offsetWidth / 2 - centroCarril)
      if (distancia < menorDistancia) {
        menorDistancia = distancia
        mejor = i
      }
    })

    setActivo(mejor)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    leerPosicion()
    track.addEventListener("scroll", leerPosicion, { passive: true })
    window.addEventListener("resize", leerPosicion)

    /**
     * Rueda vertical → avance horizontal.
     *
     * Con una rueda de ratón corriente, el gesto natural sobre el carril es
     * girar hacia abajo; sin este mapeo el carril no se mueve y hay que usar
     * shift+rueda. De ahí la sensación de "scrolleo mucho y avanzo poco".
     *
     * `MULTIPLICADOR` acelera el avance respecto al desplazamiento del dedo.
     *
     * Dos cautelas:
     *  · En los extremos NO se intercepta el evento, así que la página sigue
     *    scrolleando con normalidad y el usuario nunca queda atrapado.
     *  · Se desactiva el snap mientras dura el gesto y se restaura al parar.
     *    Con `mandatory` activo, escribir scrollLeft a mano hace que el
     *    navegador reencaje en cada fotograma y el movimiento sale a tirones.
     */
    /**
     * El multiplicador NO es un ajuste de gusto: tiene un mínimo funcional.
     *
     * Una muesca de rueda son ~100px de deltaY y el paso entre tarjetas es de
     * ~436px (26rem + gap). Si una muesca no cruza la MITAD del paso (218px),
     * al reengancharse el snap el navegador considera "más cercana" la tarjeta
     * de origen y **te devuelve atrás**: scrolleas y no avanzas, que era justo
     * la sensación de lentitud reportada.
     *
     * 2.6 × 100 = 260px > 218px, así que una sola muesca siempre asienta en la
     * tarjeta siguiente. Si cambias el ancho de tarjeta, recalcula este mínimo.
     */
    const MULTIPLICADOR = 2.6
    /** Espera antes de reenganchar el snap. Por debajo de ~150ms, un scroll
     *  pausado reengancha a mitad de gesto y se percibe como tirón. */
    const REPOSO = 180
    let inactividad: ReturnType<typeof setTimeout> | undefined

    const onWheel = (evento: WheelEvent) => {
      // Gesto horizontal (trackpad): lo gestiona el navegador, mejor no tocar.
      if (Math.abs(evento.deltaY) <= Math.abs(evento.deltaX)) return

      const max = track.scrollWidth - track.clientWidth
      if (max <= 0) return

      const haciaElFinal = evento.deltaY > 0
      const enTope = haciaElFinal ? track.scrollLeft >= max - 1 : track.scrollLeft <= 1
      if (enTope) return // dejamos pasar el scroll a la página

      evento.preventDefault()
      /* `stopPropagation` es imprescindible, no defensivo: Lenis escucha la
         rueda a nivel de ventana para su scroll suave. Sin cortar la
         propagación, el mismo gesto desplazaba el carril EN HORIZONTAL y la
         página EN VERTICAL a la vez, que era la mezcla de movimientos que el
         cliente pedía eliminar. Cortándola, sobre el carril el movimiento es
         puramente lateral. */
      evento.stopPropagation()
      track.style.scrollSnapType = "none"
      track.scrollLeft = Math.max(
        0,
        Math.min(max, track.scrollLeft + evento.deltaY * MULTIPLICADOR),
      )

      clearTimeout(inactividad)
      inactividad = setTimeout(() => {
        // Al restaurar el snap, el navegador asienta en la tarjeta más cercana.
        track.style.scrollSnapType = ""
      }, REPOSO)
    }

    track.addEventListener("wheel", onWheel, { passive: false })

    return () => {
      track.removeEventListener("scroll", leerPosicion)
      track.removeEventListener("wheel", onWheel)
      window.removeEventListener("resize", leerPosicion)
      clearTimeout(inactividad)
    }
  }, [leerPosicion])

  /**
   * Centra una tarjeta moviendo ÚNICAMENTE el carril.
   *
   * No se usa `scrollIntoView`: con `block: "nearest"` el navegador desplaza
   * también la página en vertical cuando la tarjeta es más alta que el hueco
   * visible, y entonces la cabecera de la sección se mete bajo el header fijo.
   * `scrollTo` sobre el contenedor no puede provocar ese efecto.
   */
  const irA = (indice: number) => {
    const track = trackRef.current
    const destino = track?.children[indice] as HTMLElement | undefined
    if (!track || !destino) return

    track.scrollTo({
      left: destino.offsetLeft + destino.offsetWidth / 2 - track.clientWidth / 2,
      behavior: "smooth",
    })
  }

  return (
    <section
      id="programa"
      /* Sin pin: la sección fluye. `scroll-mt` evita que el header fijo tape el
         titular cuando se llega por el ancla #programa. */
      className="w-full scroll-mt-[var(--header-height)] bg-muted/30 py-20 md:py-28"
    >
      {/* ── Cabecera ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p className="journey-eyebrow text-brand">{eyebrow}</p>
            <h2 className="journey-title-sm mt-4 max-w-2xl text-balance text-foreground">
              {title}
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
              {intro}
            </p>
          </div>

          {/* Contador de posición */}
          <div className="flex shrink-0 items-baseline gap-1.5">
            <span className="journey-mono text-5xl font-bold leading-none text-foreground">
              {String(activo + 1).padStart(2, "0")}
            </span>
            <span className="journey-mono text-xl font-bold leading-none text-muted-foreground/50">
              / {String(modulos.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Fases */}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2">
          {fases.map((fase) => (
            <span
              key={fase}
              className={`journey-eyebrow transition-colors duration-500 ${
                fase === faseActiva ? "text-brand" : "text-muted-foreground/40"
              }`}
            >
              {fase}
            </span>
          ))}
        </div>
      </div>

      {/* ── Carril: scroll horizontal nativo con snap ──────────────────── */}
      <ul
        ref={trackRef}
        className="module-rail mt-10 md:mt-12"
        tabIndex={0}
        aria-label={`Módulos del programa. ${modulos.length} en total. Desplaza horizontalmente para recorrerlos.`}
      >
        {modulos.map((modulo) => {
          return (
            <li
              key={modulo.num}
              /* TODAS las tarjetas reciben exactamente el mismo tratamiento.
                 Hubo una versión que destacaba la centrada (borde azul, halo,
                 y las demás al 40 % de opacidad); el cliente pidió retirarlo:
                 los 10 módulos tienen el mismo peso informativo y ninguno debe
                 parecer más importante. No reintroduzcas realce por tarjeta. */
              className="module-card journey-surface flex flex-col border border-border bg-background p-7 md:p-8"
            >
              {/* Número y fase */}
              <div className="flex shrink-0 items-baseline justify-between gap-4">
                <span className="journey-mono text-[3.25rem] font-bold leading-none text-brand md:text-[4rem]">
                  {modulo.num}
                </span>
                <span className="journey-eyebrow rounded-full bg-brand/8 px-2.5 py-1 text-brand">
                  {modulo.fase}
                </span>
              </div>

              {/* Título y subtítulo */}
              <div className="mt-6 shrink-0">
                <h3 className="text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl">
                  {modulo.title}
                </h3>
                <p className="mt-2 text-sm leading-snug text-muted-foreground">{modulo.subtitle}</p>
              </div>

              <span className="mt-5 h-px w-full shrink-0 bg-border" aria-hidden="true" />

              {/* Cuerpo */}
              <div className="module-card-body mt-5 min-h-0 flex-1">
                {modulo.text && (
                  <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {modulo.text}
                  </p>
                )}

                {modulo.items && modulo.items.length > 0 && (
                  <ul className={`space-y-2.5 ${modulo.text ? "mt-5" : ""}`}>
                    {modulo.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-[0.8125rem] leading-snug text-foreground/75"
                      >
                        <span
                          className="mt-2 h-px w-3 flex-shrink-0 bg-brand"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {/* ── Progreso y controles ───────────────────────────────────────── */}
      <div className="mx-auto mt-10 flex max-w-6xl items-center gap-6 px-6 sm:px-8">
        <div className="h-px flex-1 bg-border" aria-hidden="true">
          <div
            className="h-px origin-left bg-brand transition-transform duration-500 ease-out"
            style={{ transform: `scaleX(${Math.max(progreso, 0.02)})` }}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => irA(Math.max(activo - 1, 0))}
            disabled={enInicio}
            aria-label="Módulo anterior"
            className="rounded-full border border-border p-3 text-foreground transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => irA(Math.min(activo + 1, modulos.length - 1))}
            disabled={enFinal}
            aria-label="Módulo siguiente"
            className="rounded-full border border-border p-3 text-foreground transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
