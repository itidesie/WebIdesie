"use client"

import { Loader2, ShieldCheck } from "lucide-react"
import type { VerificationStatus } from "./pedido-summary"

interface PedidoMobileBarProps {
  total: number
  status: VerificationStatus
}

/**
 * Franja fija en móvil con el total siempre visible mientras se recorren
 * las secciones — no repite el botón de pago (vive en `PedidoSummary`, al
 * final del contenido) para no tener dos botones de pagar en pantalla.
 */
export function PedidoMobileBar({ total, status }: PedidoMobileBarProps) {
  return (
    <div className="pedido-mobile-bar glass-panel fixed inset-x-0 bottom-0 z-30 flex items-center justify-between px-5 py-3 lg:hidden">
      <div>
        <p className="text-[11px] text-muted-foreground">Total</p>
        <p className="pedido-mono text-xl font-black text-brand">{total.toFixed(2)}€</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        {status === "verifying" && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" aria-hidden="true" />}
        {status === "verified" && <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden="true" />}
        <span className="text-muted-foreground">
          {status === "verified" ? "Verificado" : status === "verifying" ? "Verificando…" : "Revisa el pedido"}
        </span>
      </div>
    </div>
  )
}
