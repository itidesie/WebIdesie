import { OfertaForm } from "@/components/empleo/oferta-form"

// Protegida por middleware.ts — ver CLAUDE.md §1 "Panel de administración".
export default function NuevaOfertaPage() {
  return <OfertaForm mode="create" />
}
