"use client"

import Link from "next/link"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { AnchorNav } from "./anchor-nav"

interface FichaSidebarProps {
  producto: {
    id: number
    nombre: string
    tipo: string
    precio: number | null
    precio_original: number | null
    precio_matricula: number | null
    imagen?: string | null
  }
  sections: { id: string; label: string }[]
}

/**
 * Precio y CTA fijos durante el scroll de la ficha, con la navegación por
 * anclas justo encima. Antes el precio/CTA solo vivían en el hero — al
 * bajar a leer el programa o las FAQ, desaparecían de la vista.
 */
export function FichaSidebar({ producto, sections }: FichaSidebarProps) {
  const sinPrecio = producto.precio == null
  const hasDescuento = !sinPrecio && producto.precio_original != null && producto.precio_original > producto.precio!

  return (
    <aside className="catalogo-sticky-cta space-y-6 lg:self-start">
      <div className="catalogo-filter-panel p-5">
        {hasDescuento && (
          <p className="catalogo-mono text-sm text-gray-400 line-through mb-1">{producto.precio_original}€</p>
        )}
        <p className="catalogo-mono text-3xl font-bold text-gray-950 mb-1">
          {sinPrecio ? "Precio no disponible, contactar" : producto.precio === 0 ? "Gratis" : `${producto.precio}€`}
        </p>
        {!sinPrecio && <p className="text-xs text-gray-500 mb-4">IVA incluido</p>}

        {sinPrecio ? (
          // Sin precio publicado no tiene sentido "Añadir al carrito" — no
          // hay ningún importe que cobrar. Se sustituye por el mismo enlace
          // de contacto contextual que ya usan las páginas de programa
          // (?motivo=asesoria&programa=...), no un botón de compra inerte.
          <Link
            href={`/contact-page?motivo=asesoria&programa=${encodeURIComponent(producto.nombre)}`}
            className="block w-full text-center bg-[#006cff] hover:bg-[#0052cc] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            Contactar para más información
          </Link>
        ) : producto.precio_matricula ? (
          <div className="space-y-2">
            <AddToCartButton
              product={{
                id: producto.id,
                name: producto.nombre,
                price: producto.precio!,
                category: producto.tipo,
                image: producto.imagen ?? undefined,
              }}
              className="w-full bg-[#006cff] hover:bg-[#0052cc] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              label={`Máster completo — ${producto.precio}€`}
            />
            <AddToCartButton
              product={{
                // `-producto.id`, no `producto.id`: el carrito identifica cada
                // línea por `id` (contexts/cart-context.tsx, ADD_ITEM), así
                // que reutilizar el mismo id que "Máster completo" hacía que
                // añadir ambos al carrito no sumara una línea nueva, sino que
                // incrementase la cantidad de la primera — el total salía mal
                // (el precio de matrícula desaparecía, se cobraba 2x el
                // precio completo). Negativo porque los id reales de
                // `productos` son siempre positivos (serial de Postgres):
                // nunca puede colisionar con un producto de verdad.
                id: -producto.id,
                name: `Matrícula — ${producto.nombre}`,
                price: producto.precio_matricula,
                category: "matricula",
                image: producto.imagen ?? undefined,
              }}
              className="w-full bg-white hover:bg-gray-50 text-[#006cff] border border-[#006cff] font-semibold py-2.5 rounded-lg text-sm transition-colors"
              label={`Reserva tu plaza — ${producto.precio_matricula}€`}
            />
            <p className="text-xs text-gray-500 text-center pt-1">
              La matrícula reserva tu plaza. Contacta con la escuela para el resto.
            </p>
          </div>
        ) : (
          <AddToCartButton
            product={{
              id: producto.id,
              name: producto.nombre,
              price: producto.precio!,
              category: producto.tipo,
              image: producto.imagen ?? undefined,
            }}
            className="w-full bg-[#006cff] hover:bg-[#0052cc] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
          />
        )}
      </div>

      <AnchorNav sections={sections} />
    </aside>
  )
}
