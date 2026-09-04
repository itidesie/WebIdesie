'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateVerifiedTotal, createOrderAndGetPaymentUrl, type VerifiedTotal } from '@/app/checkout/actions';

/**
 * 🔒 2026-09-04 (41) — reescrito para cerrar el hallazgo CRÍTICO de la
 * auditoría de seguridad: el importe que llegaba a Flywire no lo verificaba
 * el servidor en ningún punto (`BASE_PRICE` fijo en el cliente, cupón
 * "validado" contra un `basePrice` que mandaba el propio navegador). Ver
 * CLAUDE.md §4/§5.
 *
 * Nunca se reimplementa la verificación aquí: se reutilizan literalmente
 * `calculateVerifiedTotal()`/`createOrderAndGetPaymentUrl()` de
 * `app/checkout/actions.ts`, pasándoles un "carrito" de un solo artículo —
 * el producto real que `/pago-directo` siempre representó
 * (`master-bim-full-time`, 15.000€, mismo importe que tenía `BASE_PRICE`).
 * Esto además, de regalo, conecta esta página a la tabla real `coupons`
 * (antes usaba `COUPONS_FALLBACK` hardcodeado) y registra el intento de
 * pago en `orders`/`order_items`, igual que ya hace checkout.
 *
 * Deliberadamente NO se ha tocado la estética/UX de esta página en esta
 * pieza (pendiente de una decisión aparte, ver CLAUDE.md) — solo la fuente
 * de verdad del importe.
 */
const PRODUCTO_ID = 8; // master-bim-full-time — ver CLAUDE.md para cómo se confirmó
const PRODUCTO_NOMBRE = 'Master BIM Full Time';

interface PaymentFormState {
  firstName: string;
  lastName: string;
  email: string;
  promoCode: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export function DirectPaymentForm() {
  const [formData, setFormData] = useState<PaymentFormState>({
    firstName: '',
    lastName: '',
    email: '',
    promoCode: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [verified, setVerified] = useState<VerifiedTotal | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Recalcula el precio real (con o sin cupón) en servidor — nunca se
  // muestra ni se usa ningún importe calculado en cliente.
  const verifyPrice = useCallback(async (promoCode: string) => {
    setIsVerifying(true);
    try {
      const result = await calculateVerifiedTotal(
        [{ id: PRODUCTO_ID, name: PRODUCTO_NOMBRE, quantity: 1 }],
        promoCode.trim() || undefined,
      );
      setVerified(result);
    } catch {
      setVerified({
        success: false,
        items: [],
        subtotal: 0,
        couponCode: null,
        couponDescription: null,
        discount: 0,
        total: 0,
        error: 'No se pudo verificar el precio. Inténtalo de nuevo.',
      });
    } finally {
      setIsVerifying(false);
    }
  }, []);

  // Debounce, mismo comportamiento que antes tenía la validación de cupón.
  useEffect(() => {
    const timer = setTimeout(() => {
      verifyPrice(formData.promoCode);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.promoCode, verifyPrice]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Los apellidos son requeridos';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Por favor, introduce un email válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasDiscount = !!verified?.couponCode;
  const finalPrice = verified?.total ?? 0;
  const discountAmount = verified?.discount ?? 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handlePaymentClick = async () => {
    if (!validateForm() || isVerifying || isPaying) {
      return;
    }

    setPayError(null);
    setIsPaying(true);
    try {
      const result = await createOrderAndGetPaymentUrl({
        cartItems: [{ id: PRODUCTO_ID, name: PRODUCTO_NOMBRE, quantity: 1 }],
        couponCode: formData.promoCode.trim() || undefined,
        buyer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
        },
      });

      if (!result.success || !result.paymentUrl) {
        setPayError(result.error || 'No se pudo iniciar el pago. Inténtalo de nuevo.');
        return;
      }

      window.open(result.paymentUrl, '_blank');
    } catch {
      setPayError('No se pudo iniciar el pago. Inténtalo de nuevo.');
    } finally {
      setIsPaying(false);
    }
  };

  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    validateEmail(formData.email) &&
    verified?.success;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Formulario de Pago
        </h2>
        <p className="text-gray-600 text-sm">
          Completa todos los campos para continuar
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Nombre */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre
          </label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Tu nombre"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition ${
              errors.firstName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-[#006cff]'
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Apellidos */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Apellidos
          </label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Tus apellidos"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition ${
              errors.lastName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-[#006cff]'
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition ${
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-[#006cff]'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Código Promocional */}
        <div>
          <label
            htmlFor="promoCode"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Código Promocional <span className="text-gray-500">(Opcional)</span>
          </label>
          <Input
            id="promoCode"
            name="promoCode"
            type="text"
            placeholder="Ej: IDESTIE10"
            value={formData.promoCode}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006cff] focus:ring-offset-0 transition"
          />
          {isVerifying && (
            <p className="text-gray-500 text-xs mt-1">Verificando con el servidor...</p>
          )}
          {!isVerifying && hasDiscount && verified?.couponDescription && (
            <p className="text-green-600 text-xs mt-1 font-medium">
              Código válido: {verified.couponDescription}
            </p>
          )}
          {!isVerifying && formData.promoCode && !hasDiscount && verified?.error && (
            <p className="text-red-500 text-xs mt-1">{verified.error}</p>
          )}
        </div>

        {/* Resumen de Precio */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Precio base:</span>
            <span
              className={`font-semibold ${
                hasDiscount
                  ? 'line-through text-gray-500'
                  : 'text-gray-900'
              }`}
            >
              {isVerifying ? '…' : `€${(verified?.subtotal ?? 0).toLocaleString('es-ES')}`}
            </span>
          </div>

          {hasDiscount && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-green-600 text-sm font-medium">
                  {verified?.couponDescription}:
                </span>
                <span className="text-green-600 font-semibold">
                  -{'€'}{discountAmount.toLocaleString('es-ES')}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
                <span className="text-gray-900 font-bold">Total a pagar:</span>
                <span className="text-2xl font-bold text-[#006cff]">
                  {'€'}{finalPrice.toLocaleString('es-ES')}
                </span>
              </div>
            </>
          )}

          {!hasDiscount && (
            <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
              <span className="text-gray-900 font-bold">Total a pagar:</span>
              <span className="text-2xl font-bold text-[#006cff]">
                {isVerifying ? '…' : `€${finalPrice.toLocaleString('es-ES')}`}
              </span>
            </div>
          )}

          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            Importe verificado por el servidor antes de cada pago.
          </p>
        </div>

        {payError && (
          <p className="text-red-500 text-sm text-center">{payError}</p>
        )}

        {/* Botón de Pago */}
        <Button
          onClick={handlePaymentClick}
          disabled={!isFormValid || isPaying}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
            isFormValid && !isPaying
              ? 'bg-[#006cff] hover:bg-[#005bbd] cursor-pointer shadow-md hover:shadow-lg'
              : 'bg-gray-400 cursor-not-allowed opacity-60'
          }`}
        >
          {isPaying ? 'Preparando el pago…' : isFormValid ? 'Pagar Ahora' : 'Completa el formulario'}
        </Button>

        {/* Nota de seguridad */}
        <p className="text-gray-500 text-xs text-center mt-4">
          Serás redirigido a la pasarela segura de Flywire para completar tu pago.
        </p>
      </form>
    </div>
  );
}
