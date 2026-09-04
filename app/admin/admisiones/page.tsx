import { AdminHeader } from "@/components/admin-header"
import { SolicitudesTable } from "@/components/admision/solicitudes-table"
import { getAdminSolicitudes } from "@/app/admision/solicitudes-actions"

// Protegida por middleware.ts — ver CLAUDE.md §1 "Panel de administración".
// Sin creación/edición manual, a diferencia de tienda/empleo: las
// solicitudes solo llegan desde /landing y las 4 páginas de máster, nunca
// se crean desde el admin — solo se gestiona su estado.
export default async function AdminAdmisionesPage() {
  const solicitudes = await getAdminSolicitudes()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminHeader />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#ededed] mb-2">Solicitudes de Admisión</h1>
          <p className="text-[#999999]">
            Solicitudes recibidas desde /landing y las 4 páginas de máster (MBIM, MBBE, EMBIM, Online)
          </p>
        </div>

        <SolicitudesTable solicitudes={solicitudes} />
      </main>
    </div>
  )
}
