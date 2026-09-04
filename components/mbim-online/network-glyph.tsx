interface NetworkGlyphProps {
  className?: string
  /** "hero" reparte nodos por todo el lienzo; "compact" los concentra en un círculo pequeño (uso en la cifra). */
  variant?: "hero" | "compact"
}

/**
 * El motivo visual de toda la página: nodos dispersos conectados a un centro.
 * SVG estático puro — sin animación aquí (los componentes que lo usan animan
 * sus propios nodos/trazos con GSAP cuando corresponde). Es decorativo y no
 * lleva texto, así que no necesita alternativas de accesibilidad además de
 * `aria-hidden`.
 */
export function NetworkGlyph({ className, variant = "hero" }: NetworkGlyphProps) {
  const nodes =
    variant === "hero"
      ? [
          { x: 8, y: 18 },
          { x: 22, y: 62 },
          { x: 14, y: 85 },
          { x: 92, y: 22 },
          { x: 88, y: 70 },
          { x: 96, y: 92 },
          { x: 55, y: 8 },
          { x: 62, y: 95 },
        ]
      : [
          { x: 12, y: 20 },
          { x: 88, y: 15 },
          { x: 18, y: 85 },
          { x: 85, y: 82 },
        ]

  const center = { x: 50, y: 50 }

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      {nodes.map((n, i) => (
        <line
          key={`l-${i}`}
          x1={n.x}
          y1={n.y}
          x2={center.x}
          y2={center.y}
          className="online-link"
        />
      ))}
      <circle cx={center.x} cy={center.y} r={variant === "hero" ? 3.2 : 2.4} className="online-node-ring" />
      <circle cx={center.x} cy={center.y} r={variant === "hero" ? 1.6 : 1.2} className="online-node online-node-pulse" />
      {nodes.map((n, i) => (
        <circle key={`n-${i}`} cx={n.x} cy={n.y} r={0.9} className="online-node" />
      ))}
    </svg>
  )
}
