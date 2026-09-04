"use client"

import { useEffect } from "react"

/**
 * Sin esto, salir de /admin y pulsar "atrás" en el navegador muestra la
 * página protegida tal cual estaba justo antes de cerrar sesión — el
 * bfcache (back/forward cache) del navegador restaura ese DOM desde
 * memoria sin volver a pasar por el servidor, así que ni `middleware.ts`
 * ni el borrado de la cookie `admin-auth` entran en juego. La sesión SÍ
 * está cerrada de verdad (cualquier navegación real tras el "atrás"
 * redirige a /admin/login), pero visualmente parece que se sigue dentro
 * — confirmado con Chrome real, ver CLAUDE.md.
 *
 * `pageshow` con `event.persisted === true` es la señal estándar de "esta
 * página viene del bfcache, no de una carga nueva". Forzar una recarga real
 * hace que pase por el middleware, que expulsa si la cookie ya no es válida.
 */
export function AdminBfcacheGuard() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload()
      }
    }

    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [])

  return null
}
