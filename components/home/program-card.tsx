import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export interface Program {
  href: string
  image: string
  imageAlt: string
  /** Etiqueta superpuesta en la imagen, p. ej. "MÁS POPULAR". */
  tag: string
  tone: "brand" | "accent"
  title: string
  meta: string
  description: string
  features: string[]
}

const TONE = {
  brand: { tag: "bg-brand", link: "text-brand" },
  accent: { tag: "bg-orange-500", link: "text-orange-500" },
} as const

/** Tarjeta destacada de un máster, con imagen de cabecera. */
export function ProgramCard({ href, image, imageAlt, tag, tone, title, meta, description, features }: Program) {
  const colors = TONE[tone]

  return (
    <Link href={href} className="block group">
      <div className="program-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200 h-full">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="program-card-image object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <span
            className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1.5 rounded-full ${colors.tag}`}
          >
            {tag}
          </span>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-bold text-2xl text-white mb-1">{title}</h3>
            <p className="text-white/90">{meta}</p>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {features.map((feature) => (
              <span key={feature} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>

          <div className={`font-semibold flex items-center gap-2 group-hover:gap-3 transition-all ${colors.link}`}>
            Ver programa <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}
