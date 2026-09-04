import { notFound } from "next/navigation"
import { getAdminOfertaById } from "@/app/empleo/actions"
import { OfertaForm } from "@/components/empleo/oferta-form"

interface EditarOfertaProps {
  params: Promise<{ id: string }>
}

// Protegida por middleware.ts — ver CLAUDE.md §1 "Panel de administración".
export default async function EditarOfertaPage({ params }: EditarOfertaProps) {
  const { id } = await params
  const oferta = await getAdminOfertaById(Number(id))

  if (!oferta) {
    notFound()
  }

  return <OfertaForm mode="edit" initialData={oferta} />
}
