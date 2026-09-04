import type React from "react"

/** Palabra resaltada sobre el azul de marca dentro de un titular. */
export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-brand text-white px-2 sm:px-3 py-1 rounded-lg inline-block whitespace-nowrap">{children}</span>
  )
}
