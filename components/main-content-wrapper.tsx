import type React from "react"

interface MainContentWrapperProps {
  children: React.ReactNode
  className?: string
}

/**
 * Deja hueco bajo el header fijo.
 *
 * El espaciado sale de --header-height (definido en globals.css), no de una
 * medición en el cliente: así el render del servidor y el del navegador
 * coinciden y el contenido no salta al hidratar. Una sección a sangre puede
 * cancelar este hueco con `mt-[calc(var(--header-height)*-1)]`.
 */
export function MainContentWrapper({ children, className = "" }: MainContentWrapperProps) {
  return (
    <main className={`flex-grow pt-[var(--header-height)] ${className}`} role="main">
      {children}
    </main>
  )
}
