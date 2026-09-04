"use client"

import { useEffect, useState } from "react"
import type { TocEntry } from "@/lib/extract-toc"

interface ArticleTocProps {
  entries: TocEntry[]
}

/** Mini-índice lateral de un artículo largo — resalta la sección visible
 * con IntersectionObserver, mismo patrón que la ficha de producto. */
export function ArticleToc({ entries }: ArticleTocProps) {
  const [activeId, setActiveId] = useState(entries[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    )

    for (const item of entries) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [entries])

  if (entries.length < 2) return null

  return (
    <nav aria-label="Contenido del artículo" className="bitacora-toc border-l border-gray-200">
      <p className="bitacora-eyebrow mb-2 pl-3">En este artículo</p>
      {entries.map((entry) => (
        <a
          key={entry.id}
          href={`#${entry.id}`}
          className="bitacora-toc-link"
          data-active={activeId === entry.id}
          style={entry.level === 3 ? { paddingLeft: "1.5rem" } : undefined}
        >
          {entry.text}
        </a>
      ))}
    </nav>
  )
}
