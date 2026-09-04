"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { prefersReducedMotion } from "@/hooks/use-gsap-effect"
import type { CartItem } from "@/contexts/cart-context"

interface PedidoItemRowProps {
  item: CartItem
  onQuantityChange: (id: number, quantity: number) => void
  onRemove: (id: number) => void
  compact?: boolean
}

/**
 * Fila de artículo compartida entre el carrito (`CartDrawer`) y el checkout
 * — misma identidad "Pedido" en los dos sitios donde se lista lo que hay en
 * el carrito, para no mantener dos marcados distintos de lo mismo.
 *
 * La salida al quitar un artículo se anima con CSS puro antes de llamar a
 * `onRemove` (colapso de altura + fundido) — sin librería de animación de
 * salida: React desmonta de golpe, así que el propio componente retrasa la
 * llamada real el tiempo justo para que la transición se vea. Con
 * `prefers-reduced-motion`, se salta el retraso y quita al instante.
 */
export function PedidoItemRow({ item, onQuantityChange, onRemove, compact = false }: PedidoItemRowProps) {
  const [removing, setRemoving] = useState(false)
  const isMatricula = item.category === "matricula"

  const handleRemove = () => {
    if (prefersReducedMotion()) {
      onRemove(item.id)
      return
    }
    setRemoving(true)
    setTimeout(() => onRemove(item.id), 260)
  }

  return (
    <div
      data-removing={removing || undefined}
      className={`pedido-row flex items-start gap-3 ${compact ? "py-3" : "py-4"}`}
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-lg bg-muted ${compact ? "h-14 w-14" : "h-16 w-16"}`}
      >
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand/40">
            <span className="pedido-mono text-lg font-bold">IDESIE</span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-tight text-foreground">{item.name}</p>
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Quitar ${item.name} del carrito`}
            className="pedido-remove-btn shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {isMatricula && <span className="pedido-badge mt-1 inline-block">Matrícula</span>}

        <div className="mt-2 flex items-center justify-between">
          <div className="pedido-stepper flex items-center gap-1">
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              aria-label="Reducir cantidad"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-foreground hover:border-brand hover:text-brand"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="pedido-mono w-6 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              aria-label="Aumentar cantidad"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-foreground hover:border-brand hover:text-brand"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <span className="pedido-mono text-sm font-bold text-foreground">
            {(item.price * item.quantity).toFixed(2)}€
          </span>
        </div>
      </div>
    </div>
  )
}
