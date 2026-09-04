"use client"

import { useState } from "react"
import { Check, Loader2, Tag, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PedidoCouponProps {
  appliedCode: string | null
  appliedDescription: string | null
  onApply: (code: string) => Promise<void>
  onRemove: () => void
  isApplying: boolean
  error: string | null
}

/**
 * Código promocional con botón "Aplicar" explícito — la versión anterior lo
 * validaba al teclear, sin ninguna acción deliberada del usuario. Aplicar
 * un cupón vuelve a llamar a `calculateVerifiedTotal()` en servidor (misma
 * función que la verificación final), así que el descuento que se ve aquí
 * es el mismo que llegará a Flywire, nunca uno calculado aparte en cliente.
 */
export function PedidoCoupon({ appliedCode, appliedDescription, onApply, onRemove, isApplying, error }: PedidoCouponProps) {
  const [input, setInput] = useState("")

  const handleApply = () => {
    if (!input.trim() || isApplying) return
    onApply(input.trim())
  }

  return (
    <div className="pedido-card p-6">
      <p className="pedido-eyebrow text-brand-strong">Paso 3</p>
      <h2 className="mt-1 text-lg font-bold text-foreground">Código promocional</h2>
      <p className="mt-1 text-sm text-muted-foreground">Opcional — si tienes un código, aplícalo aquí.</p>

      {appliedCode ? (
        <div data-applied className="pedido-coupon-applied mt-4 flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
              <Check className="h-4 w-4" />
            </span>
            <div>
              <p className="pedido-mono text-sm font-bold text-foreground">{appliedCode}</p>
              <p className="text-xs text-muted-foreground">{appliedDescription}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Quitar código promocional"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApply())}
                placeholder="Ej: IDESTIE10"
                className="pl-9 uppercase"
              />
            </div>
            <button
              type="button"
              onClick={handleApply}
              disabled={!input.trim() || isApplying}
              className="btn-sweep shrink-0 rounded-lg border-2 border-brand px-5 text-sm font-semibold text-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              style={{ ["--btn-fill" as string]: "var(--color-brand)" }}
            >
              {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aplicar"}
            </button>
          </div>
          {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
        </div>
      )}
    </div>
  )
}
