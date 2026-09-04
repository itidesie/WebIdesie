"use client"

import { FileUp } from "lucide-react"
import JobApplicationModal from "@/components/job-application-modal"
import { Button } from "@/components/ui/button"
import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface TablonCvCtaProps {
  title: string
  text: string
  ctaLabel: string
}

/**
 * Cierre estático salvo una entrada suave — mismo criterio que el resto del
 * sitio ("el final de la página no necesita otro momento de movimiento").
 * Candidatura espontánea: `jobId` queda sin definir, `JobApplicationModal`
 * ya soporta ese caso.
 */
export function TablonCvCta({ title, text, ctaLabel }: TablonCvCtaProps) {
  const scopeRef = useGsapEffect<HTMLDivElement>(({ gsap }, scope) => {
    gsap.from(scope, {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 85%", once: true },
    })
  })

  return (
    <section className="w-full bg-gray-950 py-20 text-center text-white md:py-24">
      <div ref={scopeRef} className="mx-auto max-w-xl px-6 sm:px-8">
        <FileUp className="mx-auto h-8 w-8 text-brand" aria-hidden="true" />
        <h2 className="tablon-title mt-5">{title}</h2>
        <p className="mt-3 text-base leading-relaxed text-white/70">{text}</p>
        <div className="mt-8">
          <JobApplicationModal jobTitle="Candidatura espontánea">
            <Button
              size="lg"
              style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}
              className="btn-tablon bg-brand text-white hover:bg-brand-strong"
            >
              {ctaLabel}
            </Button>
          </JobApplicationModal>
        </div>
      </div>
    </section>
  )
}
