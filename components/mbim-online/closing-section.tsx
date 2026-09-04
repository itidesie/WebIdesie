"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, ClipboardCheck, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CatalogDownloadButton } from "@/components/catalog-download-button"
import { AdmisionModal } from "@/components/admision-modal"

interface PricingData {
  priceOriginal: string
  price: string
  discountLabel: string
  note: string
  includes: string[]
  purchaseHref: string
  catalogId: string
  catalogName: string
}

interface Faq {
  question: string
  answer: string
}

interface ClosingSectionProps {
  pricing: PricingData
  faqs: Faq[]
}

/**
 * Cierre único, igual que en MBIM/MBBE/EMBIM: precio + FAQ + CTA final en un
 * solo bloque en vez de tres secciones separadas.
 *
 * Cierra el hallazgo 5 de la auditoría: la página nunca había recibido el
 * enrutado `?motivo=asesoria&programa=X` que ya usan sus tres hermanas (vía
 * `ExperienceBand` en cada una) para llevar a `/contact-page` con contexto.
 * Mismo mecanismo, sin inventar uno nuevo.
 */
export function ClosingSection({ pricing, faqs }: ClosingSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section id="acceso" className="scroll-mt-[var(--header-height)] w-full bg-gray-950 py-20 text-white md:py-28">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Precio */}
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-16 md:grid-cols-2 md:gap-16">
          <div>
            <p className="online-eyebrow text-brand">Precio y acceso</p>
            <h2 className="online-title mt-3">Empieza cuando quieras.</h2>

            <div className="mt-6">
              <span className="online-mono text-lg text-white/40 line-through">{pricing.priceOriginal}</span>
              <div className="mt-1 flex items-baseline gap-2">
                {/* Tamaño propio, no `.online-display`: esa clase está calibrada
                    para un contador de 3 dígitos (la cifra de la sección 2) y
                    un texto más largo como "3.800 €" se desbordaba y saltaba
                    de línea al heredar su clamp(). */}
                <span className="online-mono text-5xl font-black text-white sm:text-6xl">{pricing.price}</span>
              </div>
              {/* bg-brand/20 + text-brand daba 3.70:1 sobre gray-950 — por debajo
                  de AA. Azul sólido + texto blanco da 4.58:1. */}
              <span className="mt-2 inline-block rounded-full bg-brand px-3 py-1 text-sm font-semibold text-white">
                {pricing.discountLabel}
              </span>
              <p className="mt-4 text-sm text-white/60">{pricing.note}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="btn-online bg-brand text-white hover:bg-brand-strong">
                <Link href={pricing.purchaseHref} style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Comprar el máster
                </Link>
              </Button>
              <CatalogDownloadButton
                catalogId={pricing.catalogId}
                catalogName={pricing.catalogName}
                variant="outline"
                size="lg"
                className="border-white/25 bg-transparent text-white hover:bg-white/10"
              />
              <AdmisionModal programaPreseleccionado="Online" origen="online">
                <Button size="lg" variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10">
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Solicitud de admisión
                </Button>
              </AdmisionModal>
            </div>
          </div>

          <div className="online-surface-dark p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/70">Incluido en el programa</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              {pricing.includes.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="online-node mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="py-16">
          <p className="online-eyebrow text-brand">Preguntas frecuentes</p>
          <div className="mt-6 space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={faq.question}
                data-open={openFaq === i}
                className="online-faq-row overflow-hidden rounded-xl border border-white/10"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-white/50 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div className="online-faq-panel px-4">
                  <p className="pb-4 text-sm leading-relaxed text-white/70">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="flex flex-col items-center gap-6 border-t border-white/10 pt-14 text-center">
          <h2 className="online-title max-w-xl">¿Listo para conectarte al mismo modelo?</h2>
          <p className="max-w-lg text-white/70">
            Habla con un orientador académico sobre el Máster BIM Online y resuelve tus dudas antes de matricularte.
          </p>
          <Button asChild size="lg" className="btn-online bg-white text-gray-950 hover:bg-white/90">
            <Link
              href="/contact-page?motivo=asesoria&programa=MBIM%20Online"
              style={{ ["--btn-fill" as string]: "rgb(255 255 255 / 0.85)" }}
            >
              Solicitar asesoría
              <ArrowRight className="btn-arrow ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
