import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ClosingCtaProps {
  title: string
  intro: string
  ctaHref: string
  ctaLabel: string
  note: string
}

/** Cierre único, mismo criterio que el resto del sitio: un solo bloque, un
 *  solo CTA. Enlace corregido a `/contact-page` (hallazgo 1 de la auditoría). */
export function ClosingCta({ title, intro, ctaHref, ctaLabel, note }: ClosingCtaProps) {
  return (
    <section className="w-full bg-gray-950 py-20 text-center text-white md:py-28">
      <div className="mx-auto max-w-2xl px-6 sm:px-8">
        <h2 className="blueprint-title">{title}</h2>
        <p className="mt-4 text-lg text-white/70">{intro}</p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="btn-blueprint bg-white text-gray-950 hover:bg-white/90">
            <Link href={ctaHref} style={{ ["--btn-fill" as string]: "rgb(255 255 255 / 0.85)" }}>
              {ctaLabel}
              <ArrowRight className="btn-arrow ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-white/50">{note}</p>
      </div>
    </section>
  )
}
