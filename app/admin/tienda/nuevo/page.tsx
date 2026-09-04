import { ProductoForm } from "@/components/producto-form"

// Protegida por middleware.ts — ver CLAUDE.md §1 "Panel de administración".
export default function NuevoProductoPage() {
  return <ProductoForm mode="create" />
}
