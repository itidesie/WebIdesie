"use client"

import { useEffect } from "react"
import { X, ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { PedidoItemRow } from "@/components/checkout/pedido-item-row"
import Link from "next/link"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Reconstruido por completo (2026-09-03 (26)). Tres bugs reales corregidos,
 * no solo estética:
 * 1. El overlay era literalmente transparente (`bg-[rgba(255,255,255,0)]`)
 *    — ahora un fondo real que se funde con `.glass-panel` (mismo material
 *    que los desplegables del header, consistencia de superficie con el
 *    resto del sitio aunque el ritmo/tipografía del carrito sea propio).
 * 2. Las clases de transición nunca se ejecutaban porque el componente
 *    hacía `return null` en vez de desplazarse fuera de pantalla — ahora
 *    siempre está montado y se anima con `data-state`, `inert` cuando está
 *    cerrado (inaccesible por teclado/lector de pantalla sin estar oculto
 *    del layout).
 * 3. Ningún producto llevaba imagen real (📚 fijo) — `PedidoItemRow` ya
 *    pinta la imagen real si existe (ver el hilo de `imagen` añadido en
 *    `ficha-sidebar.tsx`).
 */
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, updateQuantity, removeItem, clearCart } = useCart()

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  return (
    <>
      <div
        className="pedido-drawer-overlay fixed inset-0 z-40 bg-gray-950/40"
        data-state={isOpen ? "open" : "closed"}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="pedido-drawer glass-panel fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col"
        data-state={isOpen ? "open" : "closed"}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compra"
        inert={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="pedido-title text-foreground">
            Tu pedido {state.itemCount > 0 && <span className="pedido-mono text-muted-foreground">({state.itemCount})</span>}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-brand/10 hover:text-brand"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {state.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="mb-4 h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
              <p className="mb-5 text-sm text-muted-foreground">Tu carrito está vacío</p>
              <Button onClick={onClose} variant="outline" size="sm">
                Seguir explorando
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {state.items.map((item) => (
                <PedidoItemRow
                  key={item.id}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                  compact
                />
              ))}
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="space-y-4 border-t border-border p-5">
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-medium text-muted-foreground hover:text-destructive"
            >
              Vaciar carrito
            </button>

            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-foreground">Total</span>
              <span className="pedido-mono text-2xl font-black text-brand">{state.total.toFixed(2)}€</span>
            </div>

            <Button asChild magnetic className="btn-sweep w-full bg-brand text-white hover:bg-brand-strong">
              <Link
                href="/checkout"
                onClick={onClose}
                style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}
              >
                Proceder al pago
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
