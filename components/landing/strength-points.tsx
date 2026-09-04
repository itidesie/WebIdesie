"use client"

import Link from "next/link"
import { ArrowRight, CalendarClock, GraduationCap, ShieldCheck, Users } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Strength {
  title: string
  text: string
  href?: string
  hrefLabel?: string
}

interface StrengthPointsProps {
  strengths: Strength[]
}

/**
 * Un icono decorativo por argumento, en el mismo orden que `strengths`
 * (acreditación, desde 2012, red AEC, profesorado — ver `landing-content.ts`).
 * Puramente visual, no toca ningún texto.
 */
const STRENGTH_ICONS = [ShieldCheck, CalendarClock, Users, GraduationCap]

/**
 * Argumentos de fuerza — contenido real, ver comentarios de fuente en
 * `landing-content.ts`. Ningún dato cambia en este componente.
 *
 * 🎨 2026-09-05 — rediseño visual (solo tratamiento, cero cambios de
 * contenido), tercera sección del rediseño completo de /landing:
 * `journey-surface` (mismo motivo que ya usan Los 4 másteres — esquina
 * cortada + sombra teñida de azul) en vez del `rounded-2xl border`
 * genérico anterior. Jerarquía: icono propio + número de fondo grande
 * semitransparente (mismo recurso que `MastersComparison`) + título grande
 * en negrita + cuerpo más pequeño en gris.
 *
 * 🍱 2026-09-05 (mismo día, encargo aparte) — layout bento tras retirar
 * "Financiación flexible" y añadir "Profesorado en activo del sector AEC":
 * `strengths[0]` ("Acreditación oficial") se renderiza como un banner
 * destacado a ancho completo — es el argumento con el texto más largo desde
 * la corrección de exclusividad de Cualificam, y el más "objetivo/decisivo"
 * para alguien comparando programas en serio, así que encabeza el bento en
 * vez de competir en igualdad con los otros 3 (aprobado explícitamente por
 * el cliente, ver CLAUDE.md §5). Los otros 3 (`strengths[1..3]`) van debajo
 * en 3 columnas iguales, más compactas — el orden del array en
 * `landing-content.ts` importa, no lo reordenes sin revisar este componente.
 *
 * Animación: entrada "sello" (`back.out`, escala + rotación alterna) —
 * mismo mecanismo que ya usan `balance-ledger.tsx`/`tablon-board.tsx` para
 * sus propios sellos/tarjetas, no inventado aquí. El banner entra sin
 * rotación (se vería raro en un elemento a ancho completo) mientras que las
 * 3 tarjetas de abajo sí la conservan. En hover, una barra de acento se
 * dibuja con `scaleY` (mismo recurso que `data-master-accent` de la
 * comparativa de másteres, aquí disparado por CSS al pasar el cursor en vez
 * de por scroll).
 */
export function StrengthPoints({ strengths }: StrengthPointsProps) {
  const featured = strengths[0]
  const rest = strengths.slice(1)

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelector("[data-strength-banner]"), {
      y: 50,
      opacity: 0,
      scale: 0.94,
      duration: 0.9,
      ease: "back.out(1.6)",
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
    })

    gsap.from(scope.querySelectorAll("[data-strength]"), {
      y: 60,
      opacity: 0,
      scale: 0.8,
      rotate: (i) => (i % 2 === 0 ? -4 : 4),
      duration: 1,
      stagger: 0.15,
      ease: "back.out(1.8)",
      scrollTrigger: { trigger: scope, start: "top 68%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-brand-strong">
            Por qué IDESIE
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Lo que comparten los 4 másteres.
          </h2>
        </div>

        {featured && (
          <div
            data-strength-banner
            className="journey-surface journey-surface-light group relative mt-16 overflow-hidden border border-border bg-card p-8 md:p-14"
          >
            <span
              className="pointer-events-none absolute -right-4 -top-8 select-none font-mono text-[10rem] font-black leading-none text-brand/10 md:text-[14rem]"
              aria-hidden="true"
            >
              01
            </span>

            <div
              className="absolute left-0 top-0 h-full w-1.5 bg-brand"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-8 pl-3 md:flex-row md:items-center md:gap-14">
              <div className="flex items-center gap-4 md:w-[38%] md:flex-col md:items-start md:gap-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <ShieldCheck className="h-7 w-7" />
                </span>
                <h3 className="text-2xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
                  {featured.title}
                </h3>
              </div>

              <p className="text-base leading-relaxed text-muted-foreground md:flex-1 md:text-lg">
                {featured.text}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 md:gap-10">
          {rest.map((s, i) => {
            const Icon = STRENGTH_ICONS[i + 1] ?? ShieldCheck
            return (
              <div
                key={s.title}
                data-strength
                className="journey-surface journey-surface-light group relative min-h-[260px] overflow-hidden border border-border bg-card p-8 transition-transform duration-300 hover:-translate-y-3"
              >
                <span
                  className="pointer-events-none absolute -right-2 -top-4 select-none font-mono text-8xl font-black text-brand/10"
                  aria-hidden="true"
                >
                  {String(i + 2).padStart(2, "0")}
                </span>

                <div
                  data-strength-accent
                  className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-brand transition-transform duration-500 [transition-timing-function:var(--ease-out-quart)] group-hover:scale-y-100"
                  aria-hidden="true"
                />

                <div className="relative flex h-full flex-col pl-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>

                  <h3 className="mt-5 text-xl font-bold leading-snug text-foreground">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>

                  {s.href && (
                    <Link
                      href={s.href}
                      className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-strong hover:underline"
                    >
                      {s.hrefLabel}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
