"use client"

import { ArrowRight, CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import { useMagnetic } from "@/hooks/use-magnetic"
import { HeroVideo } from "./hero-video"

const HERO_VIDEO_SRC = "https://pub-5178d59aea414c55b9ff83a226ef28f6.r2.dev/VIDLAN1.mp4"

/** Resalta "octubre" y "pocas plazas" dentro de la frase de urgencia — el
 * texto en sí sigue viviendo íntegro en `landing-content.ts` (ni una palabra
 * cambia), esto solo envuelve las dos coincidencias en `<strong>` para
 * darles peso tipográfico. Si el texto cambiara y dejara de contener alguna
 * de las dos, simplemente no se resalta nada — no rompe nada. */
function renderUrgencyLine(line: string) {
  const parts = line.split(/(octubre|pocas plazas)/i)
  return parts.map((part, i) =>
    /^(octubre|pocas plazas)$/i.test(part) ? (
      <strong key={i} className="font-semibold text-brand-strong">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

interface HeroSectionProps {
  eyebrow: string
  title: string
  urgencyLine: string
  urgencyBadge: string
  ctaLabel: string
  onOpenRequest: () => void
}

/**
 * Hero de /landing — corto (sin párrafos), con el vídeo APILADO debajo del
 * titular, no al lado ni de fondo. El titular se revela con SplitText
 * palabra a palabra (igual mecanismo que `components/programa/closing-cta.tsx`,
 * el único sitio del resto del sitio que usa SplitText) y el vídeo entra con
 * una escala elástica justo después — esta página tiene permiso explícito
 * para animar más fuerte que las páginas de programa, así que aquí SplitText
 * no es la excepción, es la norma de la portada.
 *
 * 🎨 2026-09-05 — rediseño completo de /landing: fondo claro (antes
 * `gray-950`), a petición explícita del cliente ("paleta de colores claros,
 * el azul de marca como acento, no como base"). El resplandor de fondo pasa
 * de un halo azul sobre negro a un degradado suave sobre `bg-paper`, y el
 * vídeo ya no bloquea el resto de la página al terminar de verlo (ver
 * `hero-video.tsx` y `landing-client.tsx`) — sigue siendo protagonista
 * (autoplay, botón de sonido), pero deja de ser una barrera.
 *
 * 🎯 2026-09-06 — Opción B aprobada explícitamente por el cliente: se quita
 * el botón secundario "Solicitud de admisión" (`AdmisionModal`) del hero.
 * Antes competía en igualdad de tamaño/peso con el CTA principal pese a que
 * el propio comentario decía "secundario a propósito" — visualmente no lo
 * era. Un solo camino de entrada en la sección de mayor visibilidad: agendar
 * la llamada. `AdmisionModal` sigue existiendo y usándose en las 4 páginas
 * de máster — esto solo afecta al hero de `/landing`.
 *
 * 🕐 2026-09-06 — urgencia real, dos piezas con roles distintos (para no
 * repetir el mismo tono dos veces, tal como pidió el cliente):
 * `urgencyLine` es una frase de contexto normal justo bajo el titular (el
 * sitio típico de un subtitular) — se lee como información, no como
 * reclamo. `urgencyBadge` es la insignia corta pegada al CTA, pensada para
 * el golpe visual rápido en el momento de decidir. Ninguna de las dos lleva
 * número de plazas ni fecha límite — no están confirmados, ver
 * `landing-content.ts`.
 *
 * 🎯 2026-09-06 — segunda pasada, presencia visual de la urgencia (pedido
 * explícito: "que no se vea como texto plano perdido, pero sin que grite"):
 * - `urgencyLine`: "octubre" y "pocas plazas" resaltados en negrita/marca
 *   dentro de la misma frase (`renderUrgencyLine`), sin tocar el texto.
 * - `urgencyBadge`: entrada propia con `back.out(2)` (el equivalente en
 *   GSAP de `--ease-spring`, mismo criterio que el resto del sitio),
 *   separada del botón — antes entraba pegada a él como si fuera el mismo
 *   bloque. Pulso continuo muy sutil (`scale 1.04, sine.inOut, yoyo,
 *   repeat: -1`) — el mismo mecanismo exacto que ya usan el icono de
 *   garantía del FAQ (`data-guarantee-icon`) y el CTA final del cierre
 *   (`data-final-cta`), nunca inventado aquí. Sombra suave
 *   (`shadow-brand/10`) para que se despegue un poco del fondo `bg-paper`.
 *   Ambos (entrada + pulso) heredan la protección de `useGsapEffect`: con
 *   `prefers-reduced-motion: reduce`, GSAP ni siquiera se descarga y este
 *   `setup` no llega a ejecutarse — la insignia se queda tal cual la pintó
 *   el servidor, visible y quieta, sin ningún CSS de anulación aparte que
 *   añadir (nunca depende de JS para su estado visible inicial).
 */
export function HeroSection({ eyebrow, title, urgencyLine, urgencyBadge, ctaLabel, onOpenRequest }: HeroSectionProps) {
  const ctaRef = useMagnetic<HTMLButtonElement>(0.4)

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap, SplitText }, scope) => {
    const heading = scope.querySelector<HTMLElement>("[data-hero-title]")
    const video = scope.querySelector("[data-hero-video]")
    const eyebrowEl = scope.querySelector("[data-hero-eyebrow]")
    const urgencyEl = scope.querySelector("[data-hero-urgency]")
    const badge = scope.querySelector("[data-hero-badge]")
    const cta = scope.querySelector("[data-hero-cta]")

    const tl = gsap.timeline({ delay: 0.1 })

    if (eyebrowEl) {
      tl.from(eyebrowEl, { y: 16, opacity: 0, duration: 0.6, ease: "expo.out" }, 0)
    }

    if (heading) {
      const split = new SplitText(heading, { type: "words", linesClass: "overflow-hidden" })
      tl.from(
        split.words,
        { yPercent: 130, opacity: 0, rotate: 6, duration: 1, ease: "expo.out", stagger: 0.05 },
        0.1,
      )
    }

    if (urgencyEl) {
      tl.from(urgencyEl, { y: 14, opacity: 0, duration: 0.6, ease: "expo.out" }, 0.4)
    }

    if (badge) {
      tl.from(badge, { scale: 0.7, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 0.5)
    }

    if (cta) {
      tl.from(cta, { y: 20, opacity: 0, scale: 0.9, duration: 0.6, ease: "back.out(2)" }, 0.6)
    }

    if (video) {
      tl.from(
        video,
        { y: 60, opacity: 0, scale: 0.88, duration: 1, ease: "expo.out" },
        0.5,
      )
    }

    // Pulso continuo y muy sutil de la insignia — mismo mecanismo exacto que
    // ya usan el icono de garantía del FAQ y el CTA final del cierre, con
    // un retraso para que arranque después de que la entrada se asiente.
    if (badge) {
      gsap.to(badge, {
        scale: 1.04,
        duration: 1.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.3,
      })
    }
  })

  return (
    <section ref={scopeRef} className="relative w-full overflow-hidden bg-paper py-20 md:py-28">
      {/* Resplandor de fondo, puramente decorativo, sin coste de layout —
          mismo azul de marca que en la versión oscura, mucho más sutil
          sobre un fondo claro. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: "radial-gradient(60% 55% at 50% 0%, rgb(0 108 255 / 0.14), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8">
        <p
          data-hero-eyebrow
          className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-brand-strong"
        >
          {eyebrow}
        </p>

        <h1
          data-hero-title
          className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-950 sm:text-6xl"
        >
          {title}
        </h1>

        <p
          data-hero-urgency
          className="mx-auto mt-4 max-w-xl text-balance text-base text-gray-950/70 sm:text-lg"
        >
          {renderUrgencyLine(urgencyLine)}
        </p>

        <div className="mt-9 flex flex-col items-center gap-3">
          <span
            data-hero-badge
            className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-strong shadow-sm shadow-brand/10"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            {urgencyBadge}
          </span>
          <Button
            ref={ctaRef}
            data-hero-cta
            size="lg"
            onClick={onOpenRequest}
            className="bg-brand px-8 py-6 text-base text-white hover:bg-brand-strong"
          >
            {ctaLabel}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Fuera del contenedor de texto (max-w-4xl) a propósito: el vídeo
          debe leerse "hero-sized", más ancho que el titular que tiene
          encima. Ya no lleva lógica de progreso/bloqueo — ver HeroVideo. */}
      <div data-hero-video className="relative z-10 mx-auto mt-14 max-w-5xl px-4 sm:px-6">
        <HeroVideo src={HERO_VIDEO_SRC} />
      </div>
    </section>
  )
}
