"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Home, FileText, ShoppingBag, Briefcase, ClipboardCheck } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", {
        method: "DELETE",
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
    // Navegación dura (no `router.push`), a propósito: el router de Next.js
    // guarda en memoria un cache de las rutas ya visitadas y, al volver con
    // el botón "atrás" del navegador, lo primero que hacía era repintar esa
    // versión en memoria de /admin/posts o /admin/dashboard tal cual estaba
    // en el momento del logout — sin pasar por el servidor ni por
    // `middleware.ts`, así que ni la cookie borrada entraba en juego. Una
    // recarga completa destruye ese estado de cliente: la única forma de
    // volver atrás después es que el navegador reponga la página anterior
    // desde su propio bfcache, y de eso ya se encarga
    // `components/admin-bfcache-guard.tsx`. Verificado con Chrome real.
    window.location.href = "/admin/login"
  }

  return (
    <header className="bg-[#111111] shadow-sm border-b border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link href="/admin/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-[#3b82f6] rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-xl font-bold text-[#ededed]">IDESIE Admin</span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link href="/admin/dashboard" className="flex items-center text-[#999999] hover:text-[#ededed]">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link href="/admin/posts" className="flex items-center text-[#999999] hover:text-[#ededed]">
                <FileText className="w-4 h-4 mr-2" />
                Blog
              </Link>
              <Link href="/admin/tienda" className="flex items-center text-[#999999] hover:text-[#ededed]">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Tienda
              </Link>
              <Link href="/admin/empleo" className="flex items-center text-[#999999] hover:text-[#ededed]">
                <Briefcase className="w-4 h-4 mr-2" />
                Empleo
              </Link>
              <Link href="/admin/admisiones" className="flex items-center text-[#999999] hover:text-[#ededed]">
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Admisiones
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="bg-[#0a0a0a] border-[#262626] text-[#ededed]">
                Ver Sitio
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-[#0a0a0a] border-[#262626] text-[#ededed]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
