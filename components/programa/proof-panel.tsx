"use client"

import Image from "next/image"
import { useGsapEffect } from "@/hooks/use-gsap-effect"

export interface CertificacionProps {
  /**
   * Logo real del certificador — hoy solo existe /images/logo_cualificam.png,
   * y esa certificación es EXCLUSIVA del MBIM (ver CLAUDE.md §5). Opcional
   * desde 2026-09-05: MBBE/EMBIM no la tienen, así que pasan `certificacion`
   * sin `logo`/`logoAlt`/`sellos` y la placa con logo no se renderiza.
   */
  logo?: string
  logoAlt?: string
  /** Organismo o título que respalda el programa. */
  entidad: string
  /** Pertenencia a redes europeas de calidad (ENQA / EQAR), o descripción del título si no aplica. */
  membresia: string
  /** Sellos cortos: EEES Compliance, ENQA Member, EQAR Registered — solo si `logo` está presente. */
  sellos?: string[]
  /** Norma técnica de referencia, en mono. */
  norma: string
  normaLabel: string
  /** Nota al pie, opcional. */
  nota?: string
}

interface ProofPanelProps {
  eyebrow: string
  title: string
  lead: string
  points: { label: string; text: string }[]
  certificacion: CertificacionProps
}

/**
 * Movimiento 5 — La prueba.
 *
 * Reconstruido tras detectar que la refactorización a los 7 movimientos había
 * **perdido contenido real**: el logo de Cualificam, el organismo certificador
 * (Fundación para el Conocimiento Madri+d), el sello de pertenencia a ENQA/EQAR
 * y los tres badges (EEES / ENQA / EQAR). Solo habían sobrevivido los tres
 * puntos de garantía. La versión íntegra seguía viva en `app/embim-page`, que
 * nunca se migró, y de ahí se recuperó.
 *
 * Tres decisiones que conviene no deshacer:
 *
 * 1. **No hay fotografía decorativa.** Antes se usaba hero-certificacion-iso.jpg
 *    a sangre con `object-cover` dentro de un panel muy alto y estrecho: se veía
 *    recortada sin remedio, y pesaba 1,77 MB para no aportar nada. En una
 *    sección sobre acreditación, **el logo del certificador ES la imagen**.
 * 2. **El logo va con `object-contain`** sobre una placa blanca: un logotipo
 *    recortado es un logotipo mal usado, y `cover` lo recortaría siempre.
 * 3. **Sección compacta**, mismo criterio que el M4: la altura la marca el
 *    contenido y la tipografía interna usa `.journey-title-sm`, no display.
 *
 * 🔴 2026-09-05 — `certificacion.logo`/`sellos` pasan a opcionales: la
 * certificación Cualificam (el logo, "Miembro de ENQA/EQAR", los 3 sellos)
 * es EXCLUSIVA del MBIM entre MBIM/MBBE/EMBIM, hallazgo del cliente — ver
 * CLAUDE.md §5. MBBE y EMBIM siguen usando este mismo componente (misma
 * norma ISO 19650, mismo título propio IDESIE) pero sin la placa de logo ni
 * los 3 sellos, que solo el MBIM tiene derecho a mostrar.
 */
export function ProofPanel({ eyebrow, title, lead, points, certificacion }: ProofPanelProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const heading = scope.querySelector("[data-heading]")
    const rows = gsap.utils.toArray<HTMLElement>("[data-proof-row]", scope)
    const card = scope.querySelector("[data-cert-card]")
    const sellos = gsap.utils.toArray<HTMLElement>("[data-sello]", scope)

    if (heading) {
      gsap.from(heading, {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: heading, start: "top 88%", once: true },
      })
    }

    if (rows.length) {
      gsap.from(rows, {
        x: -20,
        opacity: 0,
        duration: 0.85,
        ease: "expo.out",
        stagger: 0.11,
        scrollTrigger: { trigger: rows[0], start: "top 90%", once: true },
      })
    }

    if (card) {
      gsap.from(card, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: card, start: "top 90%", once: true },
      })
    }

    // Los sellos entran con un rebote leve: son el remate del movimiento.
    if (sellos.length) {
      gsap.from(sellos, {
        scale: 0.85,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
        stagger: 0.08,
        scrollTrigger: { trigger: sellos[0], start: "top 94%", once: true },
      })
    }
  })

  return (
    <section ref={scopeRef} className="w-full bg-muted/40 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div data-heading className="max-w-2xl">
          <p className="journey-eyebrow text-brand">{eyebrow}</p>
          <h2 className="journey-title-sm mt-4 text-balance text-foreground">{title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{lead}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:mt-10 lg:grid-cols-[52fr_48fr] lg:gap-12">
          {/* ── Los tres puntos de garantía ──────────────────────────────── */}
          <dl className="space-y-5">
            {points.map((point, i) => (
              <div key={point.label} data-proof-row className="border-t border-border pt-4">
                <span className="journey-eyebrow text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <dt className="mt-2 text-[0.95rem] font-bold tracking-tight text-foreground">{point.label}</dt>
                <dd className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">{point.text}</dd>
              </div>
            ))}
          </dl>

          {/* ── La acreditación: el logo real es la imagen (solo si existe) ── */}
          <div
            data-cert-card
            className="journey-surface journey-surface-light h-fit bg-paper p-5 md:p-7"
          >
            {/* Placa blanca: el logo necesita fondo neutro y object-contain
                para no recortarse ni teñirse con el papel. Solo se muestra si
                el programa tiene un logo real que enseñar (hoy, solo MBIM). */}
            {certificacion.logo && (
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="relative mx-auto h-11 w-full max-w-[11rem] md:h-13">
                  <Image
                    src={certificacion.logo}
                    alt={certificacion.logoAlt ?? certificacion.entidad}
                    fill
                    sizes="176px"
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            <h3
              className={`text-balance text-base font-bold leading-snug tracking-tight text-gray-950 md:text-lg ${certificacion.logo ? "mt-5" : ""}`}
            >
              {certificacion.entidad}
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-gray-950/65">
              {certificacion.membresia}
            </p>

            {certificacion.sellos && certificacion.sellos.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {certificacion.sellos.map((sello) => (
                  <li
                    key={sello}
                    data-sello
                    className="journey-eyebrow rounded-full border border-gray-950/12 bg-white px-2.5 py-1 text-gray-950/70"
                  >
                    {sello}
                  </li>
                ))}
              </ul>
            )}

            {/* La norma técnica cierra la tarjeta, separada por una regla. */}
            <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-gray-950/10 pt-4">
              <span className="journey-mono text-base font-bold text-brand md:text-lg">
                {certificacion.norma}
              </span>
              <span className="journey-eyebrow text-right text-gray-950/45">
                {certificacion.normaLabel}
              </span>
            </div>

            {certificacion.nota && (
              <p className="mt-4 text-[0.6875rem] leading-relaxed text-gray-950/50">{certificacion.nota}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
