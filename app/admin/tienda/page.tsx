import { getAdminProductos } from "@/app/tienda/actions"
import { AdminHeader } from "@/components/admin-header"
import { ProductosTable } from "@/components/productos-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

// Protegida por middleware.ts (matcher /admin/:path*) — no necesita
// checkAdminAuth() propio, ver CLAUDE.md §1 "Panel de administración".
export default async function AdminTienda() {
  const productos = await getAdminProductos()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminHeader />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#ededed] mb-2">Gestión de Tienda</h1>
            <p className="text-[#a1a1a1]">
              Administra los productos de la tienda ({productos.length}{" "}
              {productos.length === 1 ? "producto" : "productos"})
            </p>
          </div>
          <Link href="/admin/tienda/nuevo">
            <Button className="admin-button-primary flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Nuevo Producto
            </Button>
          </Link>
        </div>

        {productos.length === 0 ? (
          <div className="admin-card p-12 text-center">
            <p className="text-[#a1a1a1] mb-4">No hay productos en la base de datos</p>
            <Link href="/admin/tienda/nuevo">
              <Button className="admin-button-primary">
                <PlusCircle className="w-4 h-4 mr-2" />
                Crear tu primer producto
              </Button>
            </Link>
          </div>
        ) : (
          <ProductosTable productos={productos} />
        )}
      </main>
    </div>
  )
}
