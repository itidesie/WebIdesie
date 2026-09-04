import { checkAdminAuth } from "@/lib/admin-auth"
import { getAllBlogPosts } from "@/app/blog/actions"
import { AdminHeader } from "@/components/admin-header"
import { BlogPostsTable } from "@/components/blog-posts-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function AdminPosts() {
  await checkAdminAuth()

  const posts = await getAllBlogPosts()

  console.log("[v0] Admin posts page - Total posts:", posts.length)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminHeader />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#ededed] mb-2">Gestión de Posts</h1>
            <p className="text-[#a1a1a1]">
              Administra todos los posts del blog ({posts.length} {posts.length === 1 ? "post" : "posts"})
            </p>
          </div>
          <Link href="/admin/posts/new">
            <Button className="admin-button-primary flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Nuevo Post
            </Button>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="admin-card p-12 text-center">
            <p className="text-[#a1a1a1] mb-4">No hay posts en la base de datos</p>
            <Link href="/admin/posts/new">
              <Button className="admin-button-primary">
                <PlusCircle className="w-4 h-4 mr-2" />
                Crear tu primer post
              </Button>
            </Link>
          </div>
        ) : (
          <BlogPostsTable posts={posts} />
        )}
      </main>
    </div>
  )
}
