interface FiltroOption {
  label: string
  value: string
  count: number
}

interface FiltroPanelProps {
  title: string
  options: FiltroOption[]
  active: string
  onChange: (value: string) => void
}

/**
 * Panel de filtro persistente y explícito — antes eran badges sueltas que
 * flotaban entre secciones. Aquí vive siempre en el mismo sitio, visible
 * mientras se compara el catálogo, en vez de tener que recordar dónde
 * estaba el filtro tras hacer scroll.
 */
export function FiltroPanel({ title, options, active, onChange }: FiltroPanelProps) {
  return (
    <div className="catalogo-filter-panel p-4">
      <h3 className="catalogo-eyebrow mb-3">{title}</h3>
      <div className="flex flex-col gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            data-magnetic
            data-magnetic-strength="0.16"
            className="catalogo-filter-option"
            data-active={active === option.value}
            onClick={() => onChange(option.value)}
          >
            <span>{option.label}</span>
            <span className="catalogo-filter-count">{option.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
