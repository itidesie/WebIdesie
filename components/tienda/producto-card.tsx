import Image from "next/image"
import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"
import type { Producto } from "@/app/tienda/actions"

interface ProductoCardProps {
  producto: Producto
}

/**
 * Ficha comparable: cada dato (duración, modalidad, certificación, precio)
 * vive siempre en la misma fila, con o sin valor real — si falta, se pinta
 * un guion en vez de que la tarjeta cambie de alto. Es lo que permite
 * comparar dos tarjetas a simple vista sin releer cada una entera.
 */
export function ProductoCard({ producto }: ProductoCardProps) {
  const duracion = producto.duracion_meses
    ? `${producto.duracion_meses} meses`
    : producto.duracion_horas
      ? `${producto.duracion_horas} h`
      : "—"

  const precioActual = producto.precio_actual
  const precioOriginal = producto.precio_original
  // `precioActual` es `null` para un producto sin precio publicado (p. ej.
  // Executive Master BIM) — distinto de 0, que es gratuito (Curso de Revit).
  const hasDiscount = precioActual != null && precioOriginal != null && precioOriginal > precioActual
  const discountPercent = hasDiscount
    ? Math.round(((precioOriginal! - precioActual!) / precioOriginal!) * 100)
    : 0

  return (
    <Link href={`/producto/${producto.slug}`} className="group block h-full">
      <article className="catalogo-card">
        <div className="relative h-40 bg-gray-100 overflow-hidden">
          {producto.imagen ? (
            <Image
              src={producto.imagen}
              alt={producto.imagen_alt || producto.nombre}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              <BookOpen className="w-10 h-10 text-[#006cff] opacity-30" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="catalogo-mono inline-block bg-gray-950 text-white text-[0.6875rem] font-semibold uppercase tracking-wide px-2 py-1 rounded">
              {producto.tipo}
            </span>
            {producto.destacado && (
              <span className="catalogo-mono inline-block bg-amber-500 text-white text-[0.6875rem] font-semibold uppercase tracking-wide px-2 py-1 rounded">
                Destacado
              </span>
            )}
            {hasDiscount && (
              <span className="catalogo-mono inline-block bg-red-600 text-white text-[0.6875rem] font-semibold px-2 py-1 rounded">
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 p-5">
          <h3 className="font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2 min-h-[2.75rem] group-hover:text-[#006cff] transition-colors">
            {producto.nombre}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
            {producto.descripcion_corta || "—"}
          </p>

          <div className="mb-4">
            <div className="catalogo-spec-row">
              <span className="catalogo-spec-label">Duración</span>
              <span className="catalogo-spec-value catalogo-mono">{duracion}</span>
            </div>
            <div className="catalogo-spec-row">
              <span className="catalogo-spec-label">Modalidad</span>
              <span className="catalogo-spec-value catalogo-mono">{producto.modalidad || "—"}</span>
            </div>
            <div className="catalogo-spec-row">
              <span className="catalogo-spec-label">Certificación</span>
              <span className="catalogo-spec-value">{producto.certificacion || "—"}</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
            <div>
              {hasDiscount && (
                <p className="catalogo-mono text-xs text-gray-400 line-through">{precioOriginal}€</p>
              )}
              {precioActual == null ? (
                <p className="catalogo-mono text-sm font-bold text-gray-950 max-w-[9rem]">
                  Precio no disponible, contactar
                </p>
              ) : (
                <p className="catalogo-mono text-2xl font-bold text-gray-950">
                  {precioActual === 0 ? "Gratis" : `${precioActual}€`}
                </p>
              )}
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-[#006cff] group-hover:gap-2 transition-all">
              Ver ficha
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
