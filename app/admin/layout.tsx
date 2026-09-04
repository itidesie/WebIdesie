import type { ReactNode } from "react"
import { AdminBfcacheGuard } from "@/components/admin-bfcache-guard"

/**
 * Layout compartido por TODO /admin/* (incluida /admin/login, donde el guard
 * es inofensivo). Mismo criterio que middleware.ts: una sola pieza que cubre
 * todas las páginas en vez de tener que acordarse de añadirla en cada una.
 * Ver components/admin-bfcache-guard.tsx.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminBfcacheGuard />
      {children}
    </>
  )
}
