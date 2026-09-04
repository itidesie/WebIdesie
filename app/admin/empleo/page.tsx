import Link from "next/link"
import { PlusCircle, Users } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { OfertasTable } from "@/components/empleo/ofertas-table"
import { getAdminOfertas } from "@/app/empleo/actions"

// Protegida por middleware.ts — ver CLAUDE.md §1 "Panel de administración".
export default async function AdminEmpleoPage() {
  const ofertas = await getAdminOfertas()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminHeader />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#ededed] mb-2">Bolsa de Empleo</h1>
            <p className="text-[#999999]">Gestiona las ofertas publicadas en /bolsa-de-empleo-page</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/empleo/candidaturas">
              <button className="admin-button-secondary flex items-center gap-2">
                <Users className="w-4 h-4" />
                Candidaturas recibidas
              </button>
            </Link>
            <Link href="/admin/empleo/nueva">
              <button className="admin-button-primary flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Nueva Oferta
              </button>
            </Link>
          </div>
        </div>

        <OfertasTable ofertas={ofertas} />
      </main>
    </div>
  )
}
