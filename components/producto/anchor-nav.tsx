"use client"

import { useEffect, useState } from "react"

interface AnchorNavProps {
  sections: { id: string; label: string }[]
}

/**
 * Navegación por anclas de la ficha de producto — sustituye a las pestañas
 * de ProductoTabs, que ocultaban 6 de cada 7 secciones del DOM. Aquí todas
 * las secciones están siempre montadas; esto solo resalta en qué sección
 * está el scroll, con IntersectionObserver.
 */
export function AnchorNav({ sections }: AnchorNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    )

    for (const section of sections) {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [sections])

  if (sections.length === 0) return null

  return (
    <nav aria-label="Contenido de la ficha" className="border-l border-gray-200">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="catalogo-anchor-link"
          data-active={activeId === section.id}
        >
          {section.label}
        </a>
      ))}
    </nav>
  )
}
