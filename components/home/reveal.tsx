"use client"

import { useInView } from "@/hooks/use-in-view"
import type React from "react"

interface RevealProps {
  children: React.ReactNode
  /** Retardo en ms, para escalonar listas y rejillas. */
  delay?: number
  className?: string
  /** Etiqueta a renderizar; útil para no romper la semántica de listas. */
  as?: "div" | "li"
}

/**
 * Aparición al entrar en pantalla: opacidad y desplazamiento vertical, ambas
 * propiedades de composición (no provocan reflow ni CLS).
 *
 * El estado oculto inicial vive en CSS bajo [data-reveal="on"], atributo que
 * pone un script en línea solo si hay JS y el usuario no pidió reducir
 * movimiento. Sin JS, nada se oculta y el contenido se ve tal cual.
 */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: RevealProps) {
  const [ref, isInView] = useInView<HTMLDivElement>()

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      className={`reveal ${isInView ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
