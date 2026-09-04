import Image from "next/image"

interface VocesHeroProps {
  eyebrow: string
  title: string
  intro: string
}

/** Apertura de "El Archivo de Voces". CSS puro (.hero-line/.hero-fade), LCP. */
export function VocesHero({ eyebrow, title, intro }: VocesHeroProps) {
  return (
    <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden pt-28 pb-16 text-center md:min-h-[80vh] md:pt-32">
      <Image
        src="/images/alumnos_clase_2.jpg"
        alt="Estudiantes de Máster BIM en IDESIE"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/55 to-gray-950/35" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-white sm:px-8">
        <p className="voces-eyebrow hero-fade mb-5 text-white/70">{eyebrow}</p>
        <h1 className="voces-hero-title text-balance">
          <span className="hero-line block">{title}</span>
        </h1>
        <p className="hero-fade hero-fade-late mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {intro}
        </p>
      </div>
    </section>
  )
}
