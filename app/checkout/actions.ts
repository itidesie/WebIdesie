"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isMock, logMock } from "@/lib/mock-mode"
import { MOCK_PRODUCTS } from "@/lib/mock-data"

/**
 * El importe final SIEMPRE se recalcula aquí, en servidor, a partir de
 * `productos` — nunca se confía en el precio que manda el cliente
 * (`contexts/cart-context.tsx` vive en `localStorage`, editable con las
 * devtools). Hueco de seguridad real, documentado desde la auditoría de
 * checkout de 2026-09-03 (15) y nunca cerrado hasta ahora — ver CLAUDE.md.
 *
 * Mismo truco de id negativo que ya usa `ficha-sidebar.tsx` para las líneas
 * de matrícula: `category === "matricula"` → el producto real es
 * `-item.id`, verificado contra `precio_matricula` en vez de `precio_actual`.
 */

export interface CartItemInput {
  id: number
  name: string
  quantity: number
  category?: string
}

export interface VerifiedItem {
  id: number
  name: string
  quantity: number
  price: number
}

export interface VerifiedTotal {
  success: boolean
  items: VerifiedItem[]
  subtotal: number
  couponCode: string | null
  couponDescription: string | null
  discount: number
  total: number
  error?: string
}

interface CouponValidation {
  valid: boolean
  code?: string
  description?: string
  discountAmount?: number
  error?: string
}

async function fetchVerifiedProduct(
  itemId: number,
  category: string | undefined,
): Promise<{ price: number; name: string } | null> {
  const isMatricula = category === "matricula"
  const productoId = isMatricula ? -itemId : itemId

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Checkout", `verificación de producto ${productoId} simulada`)
    const mock = MOCK_PRODUCTS.find((p) => p.id === productoId)
    if (!mock || !mock.activo || mock.precio_actual == null) return null
    return { price: mock.precio_actual, name: isMatricula ? `Matrícula — ${mock.nombre}` : mock.nombre }
  }

  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("productos")
    .select("nombre, precio_actual, precio_matricula, activo")
    .eq("id", productoId)
    .single()

  if (error || !data || !data.activo) return null

  const price = isMatricula ? data.precio_matricula : data.precio_actual
  if (price == null) return null

  return { price: Number(price), name: isMatricula ? `Matrícula — ${data.nombre}` : data.nombre }
}

async function validateCouponServer(rawCode: string, subtotal: number): Promise<CouponValidation> {
  const code = rawCode.trim().toUpperCase()
  if (!code) return { valid: false, error: "Introduce un código" }

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Cupones", `validación de "${code}" simulada — sin Supabase real, siempre inválido`)
    return { valid: false, error: "No se puede validar el código en modo simulado (falta Supabase real)" }
  }

  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("coupons").select("*").eq("code", code).single()

  if (error || !data) return { valid: false, error: "Código no válido" }
  if (!data.is_active) return { valid: false, error: "Este código ya no está activo" }

  const now = new Date()
  if (data.valid_from && new Date(data.valid_from) > now) {
    return { valid: false, error: "Este código todavía no es válido" }
  }
  if (data.valid_until && new Date(data.valid_until) < now) {
    return { valid: false, error: "Este código ha caducado" }
  }
  if (data.max_uses != null && data.current_uses >= data.max_uses) {
    return { valid: false, error: "Este código ya se ha agotado" }
  }

  let discountAmount: number
  let description: string
  if (data.discount_type === "percentage") {
    discountAmount = subtotal * (Number(data.discount_value) / 100)
    description = `${data.discount_value}% de descuento`
  } else {
    discountAmount = Number(data.discount_value)
    description = `${Number(data.discount_value).toLocaleString("es-ES")}€ de descuento`
  }
  discountAmount = Math.min(Math.max(0, discountAmount), subtotal)

  return { valid: true, code, description, discountAmount }
}

const EMPTY_TOTAL: Omit<VerifiedTotal, "error"> = {
  success: false,
  items: [],
  subtotal: 0,
  couponCode: null,
  couponDescription: null,
  discount: 0,
  total: 0,
}

/**
 * Recalcula el pedido completo desde cero en servidor: precio real de cada
 * línea (o `null` si el producto ya no existe/está inactivo) + cupón real
 * si se pasa uno. Es la única fuente de verdad del importe — tanto el paso
 * de "aplicar cupón" como el de "verificar antes de pagar" llaman a esta
 * misma función, nunca confían en un total calculado antes en el cliente.
 */
export async function calculateVerifiedTotal(
  cartItems: CartItemInput[],
  couponCode?: string,
): Promise<VerifiedTotal> {
  if (cartItems.length === 0) {
    return { ...EMPTY_TOTAL, error: "El carrito está vacío" }
  }

  const verifiedItems: VerifiedItem[] = []
  for (const item of cartItems) {
    const verified = await fetchVerifiedProduct(item.id, item.category)
    if (!verified) {
      return {
        ...EMPTY_TOTAL,
        error: `"${item.name}" ya no está disponible. Quítalo del carrito para continuar.`,
      }
    }
    verifiedItems.push({
      id: item.id,
      name: verified.name,
      quantity: Math.max(1, Math.floor(item.quantity) || 1),
      price: verified.price,
    })
  }

  const subtotal = verifiedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  let discount = 0
  let couponDescription: string | null = null
  let normalizedCode: string | null = null

  if (couponCode?.trim()) {
    const couponResult = await validateCouponServer(couponCode, subtotal)
    if (!couponResult.valid) {
      return {
        success: false,
        items: verifiedItems,
        subtotal: Math.round(subtotal * 100) / 100,
        couponCode: null,
        couponDescription: null,
        discount: 0,
        total: Math.round(subtotal * 100) / 100,
        error: couponResult.error,
      }
    }
    discount = couponResult.discountAmount ?? 0
    couponDescription = couponResult.description ?? null
    normalizedCode = couponResult.code ?? null
  }

  const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100)

  return {
    success: true,
    items: verifiedItems,
    subtotal: Math.round(subtotal * 100) / 100,
    couponCode: normalizedCode,
    couponDescription,
    discount: Math.round(discount * 100) / 100,
    total,
  }
}

export interface CreateOrderResult {
  success: boolean
  paymentUrl?: string
  error?: string
}

/**
 * Último paso antes de Flywire: recalcula el total en servidor (nunca se
 * reutiliza un total calculado antes, por si el carrito cambió entre medias),
 * registra el pedido en `orders`/`order_items` (existían en Supabase desde
 * 2026-09-01 sin ningún consumidor real — primer código del proyecto que
 * escribe en ellas) y solo entonces construye la URL de pago con el importe
 * ya verificado. El cliente nunca decide el `amount` que llega a Flywire.
 */
export async function createOrderAndGetPaymentUrl(input: {
  cartItems: CartItemInput[]
  couponCode?: string
  buyer: { firstName: string; lastName: string; email: string }
}): Promise<CreateOrderResult> {
  const firstName = input.buyer.firstName.trim()
  const lastName = input.buyer.lastName.trim()
  const email = input.buyer.email.trim()

  if (!firstName || !lastName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Revisa los datos del comprador" }
  }

  const verified = await calculateVerifiedTotal(input.cartItems, input.couponCode)
  if (!verified.success) {
    return { success: false, error: verified.error || "No se pudo verificar el pedido" }
  }
  if (verified.total <= 0) {
    return { success: false, error: "El importe del pedido no es válido" }
  }

  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    logMock("Pedidos", `pedido simulado por ${verified.total}€ — no persistido`)
  } else {
    const supabase = getSupabaseServerClient()
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_email: email,
        customer_name: `${firstName} ${lastName}`,
        status: "pending",
        total_amount: verified.total,
      })
      .select("id")
      .single()

    if (orderError || !order) {
      console.error("[checkout] Error creando pedido:", orderError)
      return { success: false, error: "No se pudo registrar el pedido. Inténtalo de nuevo." }
    }

    const orderItemsRows = verified.items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))
    const { error: itemsError } = await supabase.from("order_items").insert(orderItemsRows)
    if (itemsError) console.error("[checkout] Error guardando líneas de pedido:", itemsError)

    // Incremento simple, no atómico — volumen esperado bajo (matrículas de
    // máster, no un carrito de e-commerce de alto tráfico); una condición de
    // carrera dejaría como mucho un uso de más, no un fallo del pedido.
    if (verified.couponCode) {
      const { data: couponRow } = await supabase
        .from("coupons")
        .select("id, current_uses")
        .eq("code", verified.couponCode)
        .single()
      if (couponRow) {
        await supabase.from("coupons").update({ current_uses: couponRow.current_uses + 1 }).eq("id", couponRow.id)
      }
    }
  }

  const amountCents = Math.round(verified.total * 100)
  const paymentUrl =
    "https://payment.flywire.com/pay/payment?amount=" +
    amountCents +
    "&student_first_name=" +
    encodeURIComponent(firstName) +
    "&student_last_name=" +
    encodeURIComponent(lastName) +
    "&student_email=" +
    encodeURIComponent(email) +
    "&recipient=IBT&read_only=amount,student_first_name,student_last_name,student_email"

  return { success: true, paymentUrl }
}
