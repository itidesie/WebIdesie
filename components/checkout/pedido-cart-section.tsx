"use client"

import type { CartItem } from "@/contexts/cart-context"
import { PedidoItemRow } from "./pedido-item-row"

interface PedidoCartSectionProps {
  items: CartItem[]
  onQuantityChange: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

/** Paso 1: revisar y editar lo que hay en el carrito, antes de nada más. */
export function PedidoCartSection({ items, onQuantityChange, onRemove }: PedidoCartSectionProps) {
  return (
    <div className="pedido-card p-6">
      <p className="pedido-eyebrow text-brand-strong">Paso 1</p>
      <h2 className="mt-1 text-lg font-bold text-foreground">Tu pedido</h2>
      <p className="mt-1 text-sm text-muted-foreground">Revisa lo que vas a comprar. Puedes editarlo aquí mismo.</p>

      <div className="mt-4 divide-y divide-border">
        {items.map((item) => (
          <PedidoItemRow key={item.id} item={item} onQuantityChange={onQuantityChange} onRemove={onRemove} />
        ))}
      </div>
    </div>
  )
}
