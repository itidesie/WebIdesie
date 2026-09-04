import { checkAdminAuth } from "@/lib/admin-auth"
import { getBlogPosts } from "@/app/blog/actions"
import { getAdminProductos } from "@/app/tienda/actions"
import { getAdminOfertas, getAdminCandidaturas } from "@/app/empleo/actions"
import { getAdminSolicitudes } from "@/app/admision/solicitudes-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  PlusCircle,
  FileText,
  Eye,
  Edit,
  Calendar,
  TrendingUp,
  ShoppingBag,
  Briefcase,
  Users,
  ClipboardCheck,
} from "lucide-react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin-header"

export default async function AdminDashboard() {
  await checkAdminAuth()

  const posts = await getBlogPosts()
  const productos = await getAdminProductos()
  const ofertas = await getAdminOfertas()
  const candidaturas = await getAdminCandidaturas()
  const solicitudesAdmision = await getAdminSolicitudes()

  const publishedPosts = posts.filter((post) => post.published)
  const draftPosts = posts.filter((post) => !post.published)
  const recentPosts = posts.slice(0, 5)

  const activeProductos = productos.filter((p) => p.activo)
  const inactiveProductos = productos.filter((p) => !p.activo)

  const activeOfertas = ofertas.filter((o) => o.activa)
  const pendientesAdmision = solicitudesAdmision.filter((s) => s.estado === "pendiente")

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminHeader />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold text-[#ededed] mb-2">Panel de Administración</h1>
          <p className="text-[#999999]">Gestiona el blog y la tienda de IDESIE</p>
        </div>

        {/* Blog Statistics */}
        <h2 className="text-sm font-semibold text-[#666666] uppercase tracking-wide mb-3">Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#111111] border-[#262626]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#999999]">Total de Posts</CardTitle>
              <FileText className="h-4 w-4 text-[#666666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#ededed]">{posts.length}</div>
              <p className="text-xs text-[#666666]">
                {publishedPosts.length} publicados, {draftPosts.length} borradores
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#262626]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#999999]">Posts Publicados</CardTitle>
              <Eye className="h-4 w-4 text-[#666666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#22c55e]">{publishedPosts.length}</div>
              <p className="text-xs text-[#666666]">Visibles en el sitio web</p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#262626]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#999999]">Este Mes</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#666666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3b82f6]">
                {
                  posts.filter((post) => {
                    const postDate = new Date(post.created_at)
                    const now = new Date()
                    return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear()
                  }).length
                }
              </div>
              <p className="text-xs text-[#666666]">Posts creados</p>
            </CardContent>
          </Card>
        </div>

        {/* Tienda Statistics */}
        <h2 className="text-sm font-semibold text-[#666666] uppercase tracking-wide mb-3">Tienda</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#111111] border-[#262626]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#999999]">Total de Productos</CardTitle>
              <ShoppingBag className="h-4 w-4 text-[#666666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#ededed]">{productos.length}</div>
              <p className="text-xs text-[#666666]">
                {activeProductos.length} publicados, {inactiveProductos.length} despublicados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#262626]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#999999]">Productos Publicados</CardTitle>
              <Eye className="h-4 w-4 text-[#666666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#22c55e]">{activeProductos.length}</div>
              <p className="text-xs text-[#666666]">Visibles en /tienda</p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#262626] flex flex-col justify-center">
            <CardContent className="pt-6">
              <Link href="/admin/tienda/nuevo">
                <Button className="w-full justify-start bg-[#3b82f6] hover:bg-[#2563eb] text-white" size="lg">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuevo Producto
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Empleo Statistics */}
        <h2 className="text-sm font-semibold text-[#666666] uppercase tracking-wide mb-3">Bolsa de Empleo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#111111] border-[#262626]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#999999]">Ofertas Publicadas</CardTitle>
              <Briefcase className="h-4 w-4 text-[#666666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#22c55e]">{activeOfertas.length}</div>
              <p className="text-xs text-[#666666]">de {ofertas.length} ofertas totales</p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#262626]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#999999]">Candidaturas Recibidas</CardTitle>
              <Users className="h-4 w-4 text-[#666666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3b82f6]">{candidaturas.length}</div>
              <Link href="/admin/empleo/candidaturas" className="text-xs text-[#666666] hover:text-[#999999] underline">
                Ver todas
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#262626] flex flex-col justify-center">
            <CardContent className="pt-6">
              <Link href="/admin/empleo/nueva">
                <Button className="w-full justify-start bg-[#3b82f6] hover:bg-[#2563eb] text-white" size="lg">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nueva Oferta
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Admisión Statistics */}
        <h2 className="text-sm font-semibold text-[#666666] uppercase tracking-wide mb-3">Solicitudes de Admisión</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#111111] border-[#262626]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#999999]">Solicitudes Recibidas</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-[#666666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#ededed]">{solicitudesAdmision.length}</div>
              <Link href="/admin/admisiones" className="text-xs text-[#666666] hover:text-[#999999] underline">
                Ver todas
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#262626]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#999999]">Pendientes de Revisión</CardTitle>
              <Users className="h-4 w-4 text-[#666666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{pendientesAdmision.length}</div>
              <p className="text-xs text-[#666666]">de {solicitudesAdmision.length} solicitudes totales</p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#262626] flex flex-col justify-center">
            <CardContent className="pt-6">
              <Link href="/admin/admisiones">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-[#0a0a0a] border-[#262626] text-[#ededed]"
                  size="lg"
                >
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Gestionar Admisiones
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1 bg-[#111111] border-[#262626]">
            <CardHeader>
              <CardTitle className="text-[#ededed]">Acciones Rápidas</CardTitle>
              <CardDescription className="text-[#999999]">Gestiona tu contenido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/posts/new">
                <Button className="w-full justify-start bg-[#3b82f6] hover:bg-[#2563eb] text-white" size="lg">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crear Nuevo Post
                </Button>
              </Link>
              <Link href="/admin/posts">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-[#0a0a0a] border-[#262626] text-[#ededed]"
                  size="lg"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Gestionar Posts
                </Button>
              </Link>
              <Link href="/admin/tienda">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-[#0a0a0a] border-[#262626] text-[#ededed]"
                  size="lg"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Gestionar Tienda
                </Button>
              </Link>
              <Link href="/admin/empleo">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-[#0a0a0a] border-[#262626] text-[#ededed]"
                  size="lg"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Gestionar Empleo
                </Button>
              </Link>
              <Link href="/admin/admisiones">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-[#0a0a0a] border-[#262626] text-[#ededed]"
                  size="lg"
                >
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Gestionar Admisiones
                </Button>
              </Link>
              <Link href="/blog" target="_blank">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-[#0a0a0a] border-[#262626] text-[#ededed]"
                  size="lg"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Blog Público
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card className="lg:col-span-2 bg-[#111111] border-[#262626]">
            <CardHeader>
              <CardTitle className="text-[#ededed]">Posts Recientes</CardTitle>
              <CardDescription className="text-[#999999]">Últimos posts creados</CardDescription>
            </CardHeader>
            <CardContent>
              {recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-3 border border-[#262626] rounded-lg bg-[#0a0a0a]"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-sm text-[#ededed]">{post.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={post.published ? "default" : "secondary"}
                            className={post.published ? "bg-[#22c55e]" : "bg-[#666666]"}
                          >
                            {post.published ? "Publicado" : "Borrador"}
                          </Badge>
                          <span className="text-xs text-[#999999] flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/posts/edit/${post.slug}`}>
                          <Button variant="outline" size="sm" className="bg-[#0a0a0a] border-[#262626] text-[#ededed]">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </Link>
                        {post.published && (
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-[#0a0a0a] border-[#262626] text-[#ededed]"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#999999]">
                  <FileText className="mx-auto h-12 w-12 text-[#666666] mb-4" />
                  <p>No hay posts aún</p>
                  <Link href="/admin/posts/new">
                    <Button className="mt-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white">Crear tu primer post</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
