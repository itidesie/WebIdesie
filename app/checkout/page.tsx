"use client"

import { useEffect, useMemo, useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PedidoCartSection } from "@/components/checkout/pedido-cart-section"
import { PedidoBuyerForm, type BuyerFormData, type BuyerFormErrors } from "@/components/checkout/pedido-buyer-form"
import { PedidoCoupon } from "@/components/checkout/pedido-coupon"
import { PedidoSummary, type VerificationStatus } from "@/components/checkout/pedido-summary"
import { PedidoMobileBar } from "@/components/checkout/pedido-mobile-bar"
import { calculateVerifiedTotal, createOrderAndGetPaymentUrl, type VerifiedTotal } from "./actions"

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function CheckoutPage() {
  const { state, updateQuantity, removeItem } = useCart()

  const [buyer, setBuyer] = useState<BuyerFormData>({ firstName: "", lastName: "", email: "" })
  const [errors, setErrors] = useState<BuyerFormErrors>({})

  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [couponDescription, setCouponDescription] = useState<string | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const [verification, setVerification] = useState<{ status: VerificationStatus; result: VerifiedTotal | null }>({
    status: "verifying",
    result: null,
  })

  const [isPaying, setIsPaying] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)

  const itemsPayload = useMemo(
    () => state.items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, category: i.category })),
    [state.items],
  )
  const cartSignature = useMemo(() => JSON.stringify(itemsPayload), [itemsPayload])

  // El importe se reverifica en servidor cada vez que cambia el carrito o
  // el cupón aplicado — nunca se reutiliza un total calculado antes si algo
  // pudo haber cambiado. Pequeño debounce (400ms) para no disparar una
  // llamada por cada clic de +/- en la cantidad.
  useEffect(() => {
    if (state.items.length === 0) return
    let cancelled = false
    setVerification((v) => ({ status: "verifying", result: v.result }))

    const timer = setTimeout(async () => {
      const result = await calculateVerifiedTotal(itemsPayload, couponCode ?? undefined)
      if (cancelled) return
      setVerification({ status: result.success ? "verified" : "error", result })
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartSignature, couponCode])

  const handleApplyCoupon = async (code: string) => {
    setIsApplyingCoupon(true)
    setCouponError(null)
    const result = await calculateVerifiedTotal(itemsPayload, code)
    setIsApplyingCoupon(false)

    if (result.success && result.couponCode) {
      setCouponCode(result.couponCode)
      setCouponDescription(result.couponDescription)
      setVerification({ status: "verified", result })
    } else {
      setCouponError(result.error || "Código no válido")
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode(null)
    setCouponDescription(null)
    setCouponError(null)
  }

  const handleBuyerChange = (field: keyof BuyerFormData, value: string) => {
    setBuyer((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const isBuyerValid =
    buyer.firstName.trim() !== "" &&
    buyer.lastName.trim() !== "" &&
    buyer.email.trim() !== "" &&
    validateEmail(buyer.email)

  const canPay = isBuyerValid && verification.status === "verified" && state.items.length > 0

  const handlePay = async () => {
    const newErrors: BuyerFormErrors = {}
    if (!buyer.firstName.trim()) newErrors.firstName = "El nombre es obligatorio"
    if (!buyer.lastName.trim()) newErrors.lastName = "Los apellidos son obligatorios"
    if (!buyer.email.trim()) newErrors.email = "El email es obligatorio"
    else if (!validateEmail(buyer.email)) newErrors.email = "Introduce un email válido"
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0 || verification.status !== "verified") return

    setIsPaying(true)
    setPayError(null)
    const result = await createOrderAndGetPaymentUrl({
      cartItems: itemsPayload,
      couponCode: couponCode ?? undefined,
      buyer,
    })
    setIsPaying(false)

    if (result.success && result.paymentUrl) {
      window.open(result.paymentUrl, "_blank")
    } else {
      setPayError(result.error || "No se pudo procesar el pago. Inténtalo de nuevo.")
    }
  }

  if (state.items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 pt-28">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-foreground">Tu carrito está vacío</h1>
          <p className="mb-6 text-muted-foreground">Añade un programa a tu carrito para continuar con el pago.</p>
          <Button asChild className="btn-sweep bg-brand text-white hover:bg-brand-strong">
            <Link href="/tienda" style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}>
              Ir a la tienda
            </Link>
          </Button>
        </div>
      </main>
    )
  }

  const clientSubtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const mobileBarTotal = verification.status === "verified" && verification.result ? verification.result.total : clientSubtotal

  return (
    <main className="min-h-screen bg-paper pb-24 pt-28 lg:pb-16">
      <div className="container mx-auto max-w-5xl px-4">
        <Link
          href="/tienda"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a la tienda
        </Link>

        <h1 className="pedido-title mb-8 text-foreground">Finalizar compra</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-start lg:gap-8">
          <div className="space-y-6 lg:col-span-3">
            <PedidoCartSection items={state.items} onQuantityChange={updateQuantity} onRemove={removeItem} />
            <PedidoBuyerForm data={buyer} errors={errors} onChange={handleBuyerChange} />
            <PedidoCoupon
              appliedCode={couponCode}
              appliedDescription={couponDescription}
              onApply={handleApplyCoupon}
              onRemove={handleRemoveCoupon}
              isApplying={isApplyingCoupon}
              error={couponError}
            />
          </div>

          <div className="lg:sticky lg:top-28 lg:col-span-2">
            <PedidoSummary
              items={state.items}
              status={verification.status}
              verified={verification.result}
              verificationError={verification.result?.error ?? null}
              canPay={canPay}
              isPaying={isPaying}
              payError={payError}
              onPay={handlePay}
            />
          </div>
        </div>
      </div>

      <PedidoMobileBar total={mobileBarTotal} status={verification.status} />
    </main>
  )
}
