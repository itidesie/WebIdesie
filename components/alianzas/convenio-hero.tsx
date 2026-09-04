import Image from "next/image"

interface ConvenioHeroProps {
  eyebrow: string
  title: string
  intro: string
}

/** Apertura de "El Convenio". CSS puro (.hero-line/.hero-fade), LCP. */
export function ConvenioHero({ eyebrow, title, intro }: ConvenioHeroProps) {
  return (
    <section className="relative flex min-h-[75vh] w-full items-center overflow-hidden pt-28 pb-16 text-center md:min-h-[85vh] md:pt-32">
      <Image
        src="/images/clase_bim_2.jpg"
        alt="Estudiantes internacionales colaborando en proyecto académico"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/55 to-gray-950/35" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-white sm:px-8">
        <p className="convenio-eyebrow hero-fade mb-5 text-white/70">{eyebrow}</p>
        <h1 className="convenio-hero-title text-balance">
          <span className="hero-line block">{title}</span>
        </h1>
        <p className="hero-fade hero-fade-late mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {intro}
        </p>
      </div>
    </section>
  )
}
