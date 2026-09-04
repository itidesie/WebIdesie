import type { LucideIcon } from "lucide-react"
import Link from "next/link"

export interface MiniProgram {
  href: string
  icon: LucideIcon
  tag: string
  tone: "success" | "neutral" | "brand" | "warning"
  title: string
  description: string
  meta: string
}

const TONE = {
  success: { icon: "bg-green-100", iconColor: "text-green-600", tag: "bg-green-100 text-green-700" },
  neutral: { icon: "bg-gray-200", iconColor: "text-gray-700", tag: "bg-gray-200 text-gray-700" },
  brand: { icon: "bg-brand/10", iconColor: "text-brand", tag: "bg-brand/10 text-brand" },
  warning: { icon: "bg-amber-100", iconColor: "text-amber-600", tag: "bg-amber-100 text-amber-700" },
} as const

/** Tarjeta compacta para los programas secundarios. */
export function ProgramMiniCard({ href, icon: Icon, tag, tone, title, description, meta }: MiniProgram) {
  const colors = TONE[tone]

  return (
    <Link href={href} className="block group h-full">
      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-200 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className={`rounded-lg p-2 ${colors.icon}`}>
            <Icon className={`w-5 h-5 ${colors.iconColor}`} />
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded ${colors.tag}`}>{tag}</span>
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>

        <div className="text-sm text-gray-500">{meta}</div>
      </div>
    </Link>
  )
}
