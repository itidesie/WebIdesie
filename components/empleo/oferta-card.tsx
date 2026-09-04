import { MapPin, Briefcase, Wallet, ArrowRight } from "lucide-react"
import type { Oferta } from "@/app/empleo/actions"
import JobApplicationModal from "@/components/job-application-modal"
import { Button } from "@/components/ui/button"

interface OfertaCardProps {
  oferta: Oferta
}

/**
 * Ficha de anuncio del tablón — esquina doblada + chincheta (`.tablon-card`
 * / `.tablon-pin`, `globals.css`). Cada dato objetivo (ubicación, contrato,
 * salario) solo se muestra si existe: no todas las ofertas tienen los tres.
 */
export function OfertaCard({ oferta }: OfertaCardProps) {
  return (
    <div data-card className="tablon-card relative rounded-lg bg-background p-6 pt-8 shadow-sm">
      <span className="tablon-pin" aria-hidden="true" />

      {oferta.destacada && (
        <span className="tablon-mono absolute right-4 top-4 rounded-full bg-brand px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white">
          Destacada
        </span>
      )}

      <p className="tablon-mono text-xs font-bold uppercase tracking-wide text-brand-strong">{oferta.empresa}</p>
      <h3 className="mt-1.5 text-xl font-bold leading-snug text-gray-950">{oferta.puesto}</h3>

      <dl className="mt-4 flex flex-col gap-1.5 text-sm text-gray-950/70">
        {oferta.ubicacion && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-brand-strong" aria-hidden="true" />
            <dd>{oferta.ubicacion}</dd>
          </div>
        )}
        {oferta.tipo_contrato && (
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 shrink-0 text-brand-strong" aria-hidden="true" />
            <dd>{oferta.tipo_contrato}</dd>
          </div>
        )}
        {oferta.salario && (
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 shrink-0 text-brand-strong" aria-hidden="true" />
            <dd>{oferta.salario}</dd>
          </div>
        )}
      </dl>

      {oferta.descripcion && (
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-950/60">{oferta.descripcion}</p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-dashed border-gray-950/15 pt-4">
        <JobApplicationModal jobTitle={oferta.puesto} jobId={oferta.id}>
          <Button
            size="sm"
            style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}
            className="btn-tablon bg-brand text-white hover:bg-brand-strong"
          >
            Aplicar ahora
            <ArrowRight className="btn-arrow ml-1.5 h-3.5 w-3.5" />
          </Button>
        </JobApplicationModal>
        {oferta.enlace_externo && (
          <a
            href={oferta.enlace_externo}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw text-sm font-medium text-gray-950/70"
          >
            Más información
          </a>
        )}
      </div>
    </div>
  )
}
