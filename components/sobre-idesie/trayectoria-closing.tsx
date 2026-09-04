import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TrayectoriaClosingProps {
  title: string
  text: string
  ctaLabel: string
  ctaHref: string
}

/**
 * Cierre estático, sin GSAP — mismo criterio que el resto de páginas
 * rediseñadas: después de la trayectoria y los principios, una salida en
 * calma se lee mejor que un último efecto compitiendo por atención.
 */
export function TrayectoriaClosing({ title, text, ctaLabel, ctaHref }: TrayectoriaClosingProps) {
  return (
    <section className="w-full bg-gray-950 py-20 text-center md:py-28">
      <div className="mx-auto max-w-2xl px-6 sm:px-8">
        <h2 className="trayectoria-title text-white">{title}</h2>
        <p className="mt-5 text-base leading-relaxed text-white/75 sm:text-lg">{text}</p>
        <div className="mt-9">
          <Button asChild size="lg" magnetic className="btn-sweep bg-brand text-white hover:bg-brand-strong">
            <Link href={ctaHref} style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}>
              {ctaLabel} <ArrowRight className="btn-arrow ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
