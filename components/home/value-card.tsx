import type { LucideIcon } from "lucide-react"

export interface Value {
  icon: LucideIcon
  title: string
  description: string
}

/** Una de las cinco señas de identidad de IDESIE. */
export function ValueCard({ icon: Icon, title, description }: Value) {
  return (
    <div className="text-center">
      <div className="bg-brand rounded-xl w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-2 sm:mb-3">
        <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
      </div>
      <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  )
}
