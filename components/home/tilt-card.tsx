"use client"

import type React from "react"
import { useRef } from "react"

/** Inclinación máxima en grados. Deliberadamente pequeña: sugiere, no marea. */
const MAX_TILT = 5

/**
 * Inclina el contenido siguiendo el cursor.
 *
 * Sin dependencias: el manejador solo escribe dos variables CSS y el navegador
 * resuelve la transformación en el compositor. Se ignora en punteros gruesos
 * (táctil) y con prefers-reduced-motion, ambos comprobados en CSS además de
 * aquí, así que en móvil no se ejecuta nada.
 */
export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node || event.pointerType !== "mouse") return

    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    node.style.setProperty("--tilt-x", `${(-y * MAX_TILT).toFixed(2)}deg`)
    node.style.setProperty("--tilt-y", `${(x * MAX_TILT).toFixed(2)}deg`)
  }

  const handleLeave = () => {
    const node = ref.current
    if (!node) return
    node.style.setProperty("--tilt-x", "0deg")
    node.style.setProperty("--tilt-y", "0deg")
  }

  return (
    <div ref={ref} onPointerMove={handleMove} onPointerLeave={handleLeave} className={`tilt ${className}`}>
      {children}
    </div>
  )
}
