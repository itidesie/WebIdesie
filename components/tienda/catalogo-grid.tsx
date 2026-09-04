"use client"

import { useState } from "react"
import type { Producto } from "@/app/tienda/actions"
import { ProductoCard } from "./producto-card"
import { FiltroPanel } from "./filtro-panel"

interface CatalogoGridProps {
  productos: Producto[]
}

export function CatalogoGrid({ productos }: CatalogoGridProps) {
  const [tipo, setTipo] = useState("todos")
  const [categoria, setCategoria] = useState("todas")

  const categoriasDisponibles = Array.from(
    new Set(productos.map((p) => p.categoria).filter((c): c is string => Boolean(c))),
  ).sort()

  const tipoOptions = [
    { label: "Todos", value: "todos", count: productos.length },
    { label: "Másteres", value: "master", count: productos.filter((p) => p.tipo === "master").length },
    { label: "Cursos", value: "curso", count: productos.filter((p) => p.tipo === "curso").length },
  ]

  const categoriaOptions = [
    { label: "Todas", value: "todas", count: productos.length },
    ...categoriasDisponibles.map((c) => ({
      label: c,
      value: c,
      count: productos.filter((p) => p.categoria === c).length,
    })),
  ]

  const filtrados = productos.filter((p) => {
    const matchesTipo = tipo === "todos" || p.tipo === tipo
    const matchesCategoria = categoria === "todas" || p.categoria === categoria
    return matchesTipo && matchesCategoria
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-8">
      <aside className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
        <FiltroPanel title="Tipo de programa" options={tipoOptions} active={tipo} onChange={setTipo} />
        {categoriasDisponibles.length > 0 && (
          <FiltroPanel title="Categoría" options={categoriaOptions} active={categoria} onChange={setCategoria} />
        )}
      </aside>

      <div>
        <p className="catalogo-mono text-sm text-gray-500 mb-6">
          {filtrados.length} de {productos.length} programas
        </p>

        {filtrados.length === 0 ? (
          <div className="catalogo-filter-panel p-12 text-center text-gray-500">
            No hay programas que coincidan con este filtro.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtrados.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
