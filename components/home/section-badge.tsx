import type { LucideIcon } from "lucide-react"
import type React from "react"

interface SectionBadgeProps {
  icon: LucideIcon
  children: React.ReactNode
  /** Sobre fondo oscuro usa la variante translúcida. */
  variant?: "light" | "dark"
}

/** Píldora "icono + rótulo" que encabeza cada sección de la home. */
export function SectionBadge({ icon: Icon, children, variant = "light" }: SectionBadgeProps) {
  const surface = variant === "dark" ? "bg-white/10 backdrop-blur-sm" : "bg-brand/10"
  const label = variant === "dark" ? "text-white" : "text-brand"

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 ${surface}`}>
      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-brand" />
      <span className={`text-xs sm:text-sm font-bold uppercase tracking-wide ${label}`}>{children}</span>
    </div>
  )
}
