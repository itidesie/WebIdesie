import Image from "next/image"

interface Logo {
  src: string
  alt: string
}

interface CicloEmpresasProps {
  eyebrow: string
  title: string
  intro: string
  logos: Logo[]
}

/**
 * Los 35 logos reales dejan de ser un grid estático (sin vida, y `LogoCarousel`
 * era un carrusel de clic manual anticuado que nadie usaba) y pasan a un
 * marquee infinito en CSS puro — actúan como los "nodos" que alimentan el
 * ciclo con proyectos reales. Se duplica el array una vez para el loop sin
 * costura; pausa al hover/foco. Server Component: sin JS, sin GSAP — es
 * infraestructura CSS `animation`, no scroll-driven.
 */
export function CicloEmpresas({ eyebrow, title, intro, logos }: CicloEmpresasProps) {
  const track = [...logos, ...logos]

  return (
    <section className="w-full overflow-hidden bg-background py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
        <p className="ciclo-eyebrow text-brand-strong">{eyebrow}</p>
        <h2 className="ciclo-title mt-3 text-foreground">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p>
      </div>

      <div className="ciclo-marquee-mask relative mt-14">
        <div className="ciclo-marquee flex w-max items-center gap-10">
          {track.map((logo, i) => (
            <div
              key={`${logo.alt}-${i}`}
              className="flex h-20 w-36 shrink-0 items-center justify-center rounded-lg border border-border bg-card p-4"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={60}
                className="max-h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
