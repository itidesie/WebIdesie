import Image from "next/image"
import type { CompanyLogo } from "@/app/opiniones-page/opiniones-content"

interface VocesTrustProps {
  title: string
  logos: CompanyLogo[]
}

/**
 * Tira de confianza discreta, no una sección grande — solo 4 logos reales
 * (Siemens se retiró, sin logo verificable en el proyecto). Estática, sin
 * marquee: con solo 4 elementos un bucle infinito se sentiría apresurado y
 * poco sobrio, lo contrario del criterio de esta página.
 */
export function VocesTrust({ title, logos }: VocesTrustProps) {
  return (
    <section className="w-full bg-background py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
        <p className="voces-eyebrow text-brand-strong">{title}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {logos.map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={60}
              className="max-h-10 w-auto object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
