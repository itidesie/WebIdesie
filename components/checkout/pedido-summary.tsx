"use client"

import { CreditCard, Loader2, Lock, ShieldCheck } from "lucide-react"
import type { CartItem } from "@/contexts/cart-context"
import type { VerifiedTotal } from "@/app/checkout/actions"

export type VerificationStatus = "verifying" | "verified" | "error"

interface PedidoSummaryProps {
  items: CartItem[]
  status: VerificationStatus
  verified: VerifiedTotal | null
  verificationError: string | null
  canPay: boolean
  isPaying: boolean
  payError: string | null
  onPay: () => void
}

/**
 * El resumen es la única fuente de verdad visible del importe — y el
 * "Paso 4" real de la página: mientras `status === "verifying"` el total
 * pulsa (no se inventa un número mientras tanto), y solo pasa a mostrar el
 * check "Importe verificado" cuando la respuesta viene de
 * `calculateVerifiedTotal()` en servidor. El botón de pago permanece
 * deshabilitado hasta ese momento — no es un adorno, es la única puerta
 * real hacia Flywire.
 */
export function PedidoSummary({ items, status, verified, verificationError, canPay, isPaying, payError, onPay }: PedidoSummaryProps) {
  const clientSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const showTotal = status === "verified" && verified ? verified.total : clientSubtotal

  return (
    <div className="pedido-card pedido-summary-card p-6">
      <p className="pedido-eyebrow text-brand-strong">Paso 4</p>
      <h2 className="mt-1 text-lg font-bold text-foreground">Resumen y pago</h2>

      <div className="mt-4 space-y-3 border-t border-border pt-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-muted-foreground">
              {item.quantity > 1 ? `${item.quantity}× ` : ""}
              {item.name}
            </span>
            <span className="pedido-mono shrink-0 text-foreground">{(item.price * item.quantity).toFixed(2)}€</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-border pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className={`pedido-mono ${verified?.discount ? "text-muted-foreground line-through" : "text-foreground"}`}>
            {(verified?.subtotal ?? clientSubtotal).toFixed(2)}€
          </span>
        </div>

        {verified?.discount ? (
          <div className="flex justify-between text-sm">
            <span className="font-medium text-brand-strong">{verified.couponDescription}</span>
            <span className="pedido-mono font-medium text-brand-strong">-{verified.discount.toFixed(2)}€</span>
          </div>
        ) : null}

        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-base font-bold text-foreground">Total</span>
          <span
            data-status={status}
            className="pedido-total pedido-mono text-3xl font-black text-brand"
          >
            {showTotal.toFixed(2)}€
          </span>
        </div>

        <div className="pedido-verify-line flex items-center gap-1.5 text-xs">
          {status === "verifying" && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">Verificando importe con el servidor…</span>
            </>
          )}
          {status === "verified" && (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              <span className="font-medium text-brand-strong">Importe verificado por el servidor</span>
            </>
          )}
          {status === "error" && (
            <span className="font-medium text-destructive">{verificationError || "No se pudo verificar el pedido"}</span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onPay}
        disabled={!canPay || isPaying}
        className="btn-sweep mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}
      >
        {isPaying ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Preparando el pago…
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            {canPay ? `Pagar ${showTotal.toFixed(2)}€` : "Completa los pasos anteriores"}
          </>
        )}
      </button>

      {payError && <p className="mt-2 text-center text-xs font-medium text-destructive">{payError}</p>}

      <div className="mt-5 flex items-center justify-center gap-4 border-t border-border pt-4">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          <span className="text-xs">Pasarela segura Flywire</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="text-xs">Importe verificado</span>
        </div>
      </div>
    </div>
  )
}
