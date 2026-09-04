import { notFound } from "next/navigation"
import { getAdminProductoBySlug } from "@/app/tienda/actions"
import { getModulosConTemas } from "@/app/tienda/modulos-actions"
import { getListaItems } from "@/app/tienda/detalle-actions"
import { LISTAS_DETALLE, type ListaKey } from "@/lib/producto-detalle-config"
import { ProductoForm } from "@/components/producto-form"
import { DetalleTabs } from "@/components/tienda/detalle-tabs"

interface EditarProductoProps {
  params: Promise<{ slug: string }>
}

// Protegida por middleware.ts — ver CLAUDE.md §1 "Panel de administración".
export default async function EditarProductoPage({ params }: EditarProductoProps) {
  const { slug } = await params
  const producto = await getAdminProductoBySlug(slug)

  if (!producto) {
    notFound()
  }

  const listaKeys = Object.keys(LISTAS_DETALLE) as ListaKey[]
  const [modulos, ...listasArrays] = await Promise.all([
    getModulosConTemas(producto.id),
    ...listaKeys.map((key) => getListaItems(LISTAS_DETALLE[key].tabla, producto.id)),
  ])
  const initialListas = Object.fromEntries(listaKeys.map((key, i) => [key, listasArrays[i]])) as Record<
    ListaKey,
    Awaited<ReturnType<typeof getListaItems>>
  >

  return (
    <>
      <ProductoForm mode="edit" initialData={producto} />
      <DetalleTabs
        productoId={producto.id}
        slug={producto.slug}
        initialModulos={modulos}
        initialListas={initialListas}
      />
    </>
  )
}
