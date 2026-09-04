import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { CandidaturasTable } from "@/components/empleo/candidaturas-table"
import { getAdminCandidaturas } from "@/app/empleo/actions"

// Protegida por middleware.ts — ver CLAUDE.md §1 "Panel de administración".
export default async function CandidaturasPage() {
  const candidaturas = await getAdminCandidaturas()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminHeader />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/empleo">
            <button className="admin-button-secondary flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Empleo
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-[#ededed] mb-2">Candidaturas recibidas</h1>
            <p className="text-[#999999]">Solo lectura — descarga el CV real desde Vercel Blob</p>
          </div>
        </div>

        <CandidaturasTable candidaturas={candidaturas} />
      </main>
    </div>
  )
}
