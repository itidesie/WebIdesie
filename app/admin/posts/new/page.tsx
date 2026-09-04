import { checkAdminAuth } from "@/lib/admin-auth"
import { BlogPostForm } from "@/components/blog-post-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewBlogPost() {
  await checkAdminAuth()

  return (
    <div className="admin-layout admin-dark min-h-screen">
      <header className="border-b border-[#262626] bg-[#0a0a0a] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-[#a1a1a1] hover:text-[#ededed] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Volver al Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#22c55e]" />
            <span className="text-sm text-[#a1a1a1]">Panel de Administración</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#ededed] mb-2">Crear Nuevo Post</h1>
          <p className="text-[#a1a1a1]">Completa la información para publicar un nuevo artículo en el blog</p>
        </div>

        <BlogPostForm mode="create" />
      </main>
    </div>
  )
}
