import { CheckCircle } from "lucide-react"
import type React from "react"

interface FeatureChipProps {
  children: React.ReactNode
  /** Sobre fondo oscuro usa la variante translúcida. */
  variant?: "light" | "dark"
}

/** Chip "✓ característica" usado en Sobre IDESIE, Consultoría y el CTA final. */
export function FeatureChip({ children, variant = "light" }: FeatureChipProps) {
  const surface =
    variant === "dark"
      ? "bg-white/10 backdrop-blur-sm text-white"
      : "bg-white border border-gray-200 shadow-sm text-gray-800"

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 ${surface}`}>
      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand flex-shrink-0" />
      <span className="text-sm font-medium">{children}</span>
    </div>
  )
}
