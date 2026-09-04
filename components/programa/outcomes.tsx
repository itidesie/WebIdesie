"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Salida {
  rol: string
  salario: string
  nota: string
  /**
   * Unidad de la retribución. Por defecto "Bruto anual".
   *
   * Si se define, la fila queda **fuera de la escala comparativa**: existe
   * porque el EMBIM incluye un perfil freelance cuya cifra es tarifa por día.
   * Ponerlo en la misma barra que los salarios anuales sería engañoso.
   */
  unidad?: string
}

interface OutcomesProps {
  eyebrow: string
  title: string
  stats: { value: string; label: string }[]
  salidas: Salida[]
  footnote: string
}

/**
 * Extrae el techo de la horquilla: "50.000 – 70.000 €" → 70000.
 * El punto es separador de millares en español, así que se elimina.
 */
function techoSalarial(salario: string): number {
  const numeros = salario.match(/\d[\d.]*/g) ?? []
  if (!numeros.length) return 0
  return Math.max(...numeros.map((n) => Number(n.replace(/\./g, ""))))
}

/**
 * Movimiento 6 — La salida.  ★ momento clave
 *
 * Rediseñado como **escalera salarial**. Antes era un carrusel horizontal de
 * tarjetas iguales, con dos problemas: repetía el gesto del M3 (la página tenía
 * dos carriles horizontales en vez de uno) y presentaba los cuatro roles con el
 * mismo peso visual, cuando lo interesante es precisamente que **no** valen lo
 * mismo.
 *
 * Ahora cada rol es una fila con una **barra proporcional al techo de su
 * horquilla**. Se ve cuál paga más antes de leer una sola palabra, y la sección
 * ocupa la mitad de alto.
 *
 * **Los perfiles fuera de escala** (`unidad` definida, como la tarifa diaria del
 * consultor freelance del EMBIM) se separan con un borde discontinuo y **no
 * llevan barra**: la distinción se lee por la forma, no solo por la etiqueta.
 */
export function Outcomes({ eyebrow, title, stats, salidas, footnote }: OutcomesProps) {
  // La escala solo la fijan los perfiles comparables entre sí.
  const comparables = salidas.filter((s) => !s.unidad)
  const techoMaximo = Math.max(...comparables.map((s) => techoSalarial(s.salario)), 1)

  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const heading = scope.querySelector("[data-heading]")
    const counters = gsap.utils.toArray<HTMLElement>("[data-count]", scope)
    const rows = gsap.utils.toArray<HTMLElement>("[data-row]", scope)
    const bars = gsap.utils.toArray<HTMLElement>("[data-bar]", scope)

    if (heading) {
      gsap.from(heading, {
        y: 32,
        opacity: 0,
        duration: 0.95,
        ease: "expo.out",
        scrollTrigger: { trigger: heading, start: "top 88%", once: true },
      })
    }

    counters.forEach((el) => {
      const raw = el.dataset.count ?? ""
      // Separa "110.000 €" en prefijo, número y sufijo. El punto es separador
      // de millares en español, así que se quita para obtener el valor.
      const partes = raw.match(/^(\D*)([\d.]+)(.*)$/)
      if (!partes) return

      const objetivo = Number(partes[2].replace(/\./g, ""))
      if (!Number.isFinite(objetivo) || objetivo === 0) return

      const contador = { n: 0 }
      gsap.to(contador, {
        n: objetivo,
        duration: 1.5,
        ease: "expo.out",
        onUpdate: () => {
          // toLocaleString devuelve los millares con punto, igual que el original.
          el.textContent = `${partes[1]}${Math.round(contador.n).toLocaleString("es-ES")}${partes[3]}`
        },
        // Al terminar se restaura el texto literal, para que nunca difiera del
        // que sirvió el servidor.
        onComplete: () => {
          el.textContent = raw
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      })
    })

    if (rows.length) {
      gsap.from(rows, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.09,
        scrollTrigger: { trigger: rows[0], start: "top 90%", once: true },
      })
    }

    // Las barras se despliegan escalonadas: es el momento de personalidad de
    // la sección y sustituye a toda la animación de tarjetas anterior.
    if (bars.length) {
      gsap.from(bars, {
        scaleX: 0,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: rows[0] ?? bars[0], start: "top 88%", once: true },
      })
    }
  })

  return (
    <section ref={scopeRef} className="w-full bg-gray-950 py-16 text-white md:py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Cabecera y cifras en la misma banda: antes ocupaban dos bloques
            apilados de pantalla casi completa. */}
        <div
          data-heading
          className="flex flex-col gap-10 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
        >
          <div>
            <p className="journey-eyebrow text-brand">{eyebrow}</p>
            <h2 className="journey-title-sm mt-4 max-w-xl text-balance">{title}</h2>
          </div>

          <dl className="flex gap-10 sm:gap-14">
            {stats.map((stat) => (
              <div key={stat.label} className="max-w-[11rem]">
                <dt
                  data-count={stat.value}
                  className="journey-mono text-[2.5rem] font-bold leading-none text-brand md:text-5xl"
                >
                  {stat.value}
                </dt>
                <dd className="mt-3 text-xs leading-relaxed text-white/45">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Escalera salarial ─────────────────────────────────────────── */}
        <ol className="mt-4">
          {salidas.map((salida, i) => {
            const fueraDeEscala = Boolean(salida.unidad)
            const proporcion = fueraDeEscala
              ? 0
              : Math.max(techoSalarial(salida.salario) / techoMaximo, 0.12)

            return (
              <li
                key={salida.rol}
                data-row
                className={`salary-row group relative border-t border-white/10 px-3 py-6 md:px-4 md:py-7 ${
                  fueraDeEscala ? "salary-row-aside mt-6 border-white/25" : ""
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span
                      className={`journey-eyebrow flex-shrink-0 transition-colors duration-300 ${
                        fueraDeEscala ? "text-brand" : "text-white/25 group-hover:text-brand"
                      }`}
                    >
                      {fueraDeEscala ? "◆" : String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight md:text-xl">{salida.rol}</h3>
                      <p className="mt-1 text-xs text-white/40">{salida.nota}</p>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-baseline gap-3 sm:flex-col sm:items-end sm:gap-1">
                    <span className="journey-mono text-2xl font-bold text-white md:text-[1.75rem]">
                      {salida.salario}
                    </span>
                    <span
                      className={`journey-eyebrow ${
                        fueraDeEscala ? "text-brand" : "text-white/30"
                      }`}
                    >
                      {salida.unidad ?? "Bruto anual"}
                    </span>
                  </div>
                </div>

                {/* La barra solo existe para los perfiles comparables. */}
                {!fueraDeEscala && (
                  <div className="mt-5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      data-bar
                      className="salary-bar h-full rounded-full bg-gradient-to-r from-brand to-brand-strong"
                      style={{ width: `${proporcion * 100}%` }}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </li>
            )
          })}
        </ol>

        <p className="mt-10 max-w-2xl text-xs leading-relaxed text-white/40">{footnote}</p>
      </div>
    </section>
  )
}
