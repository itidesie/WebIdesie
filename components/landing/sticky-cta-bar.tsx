"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface StickyCtaBarProps {
  onOpenRequest: (context: string) => void
}

/**
 * Añadido más allá del encargo original, no algo pedido explícitamente: una
 * barra de conversión fija que aparece al superar el hero y se mantiene
 * visible el resto del scroll. Encaja con dos peticiones que sí son
 * explícitas — "una sola dirección: hacia la conversión" y "mucho más
 * dinamismo en toda la página" — pero es una decisión de diseño mía, no una
 * instrucción literal. Fácil de quitar: basta con no montar este componente
 * en `landing-client.tsx`.
 */
export function StickyCtaBar({ onOpenRequest }: StickyCtaBarProps) {
  const scopeRef = useGsapEffect<HTMLDivElement>(({ gsap, ScrollTrigger }, scope) => {
    gsap.set(scope, { yPercent: 100 })
    ScrollTrigger.create({
      trigger: document.body,
      start: "top -700",
      onEnter: () => gsap.to(scope, { yPercent: 0, duration: 0.5, ease: "expo.out" }),
      onLeaveBack: () => gsap.to(scope, { yPercent: 100, duration: 0.4, ease: "expo.in" }),
    })
  })

  return (
    <div
      ref={scopeRef}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-gray-950/95 px-6 py-3 backdrop-blur-sm sm:px-8"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <p className="hidden text-sm font-medium text-white sm:block">
          Agenda una sesión informativa de 30 minutos, sin compromiso.
        </p>
        <Button
          size="sm"
          onClick={() => onOpenRequest("Barra flotante")}
          className="w-full bg-brand text-white hover:bg-brand-strong sm:w-auto"
        >
          Agendar mi llamada gratuita
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
