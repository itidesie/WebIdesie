interface BlueprintGlyphProps {
  className?: string
}

/**
 * El motivo visual de "El Plano": líneas de cota con ticks en los extremos y
 * crucetas de registro, como las marcas de un plano técnico impreso. SVG
 * estático puro, decorativo — `aria-hidden`, sin alternativa textual.
 *
 * Vocabulario propio (`.blueprint-line`/`.blueprint-node`), no el de
 * `.online-*`: aunque el mecanismo (línea + nodo) se parezca, esta página no
 * comparte vocabulario con el Máster Online, solo infraestructura de verdad
 * genérica (curvas de easing, revelado del hero).
 */
export function BlueprintGlyph({ className }: BlueprintGlyphProps) {
  const tick = (x: number, y: number, vertical: boolean) => (
    <line
      x1={vertical ? x - 1.2 : x}
      y1={vertical ? y : y - 1.2}
      x2={vertical ? x + 1.2 : x}
      y2={vertical ? y : y + 1.2}
      className="blueprint-line"
      style={{ opacity: 0.55 }}
    />
  )

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      {/* Cota horizontal superior */}
      <line x1="8" y1="14" x2="92" y2="14" className="blueprint-line" strokeDasharray="1.5 2.5" style={{ opacity: 0.4 }} />
      {tick(8, 14, true)}
      {tick(92, 14, true)}

      {/* Cota vertical izquierda */}
      <line x1="10" y1="20" x2="10" y2="88" className="blueprint-line" strokeDasharray="1.5 2.5" style={{ opacity: 0.4 }} />
      {tick(10, 20, false)}
      {tick(10, 88, false)}

      {/* Cota corta, esquina inferior derecha */}
      <line x1="70" y1="92" x2="94" y2="92" className="blueprint-line" strokeDasharray="1.5 2.5" style={{ opacity: 0.4 }} />
      {tick(70, 92, true)}
      {tick(94, 92, true)}

      {/* Crucetas de registro */}
      <g transform="translate(76, 34)">
        <line x1="-4" y1="0" x2="4" y2="0" className="blueprint-line" style={{ opacity: 0.7 }} />
        <line x1="0" y1="-4" x2="0" y2="4" className="blueprint-line" style={{ opacity: 0.7 }} />
        <circle r="1" className="blueprint-node" />
      </g>

      <g transform="translate(22, 60)">
        <line x1="-3" y1="0" x2="3" y2="0" className="blueprint-line" style={{ opacity: 0.5 }} />
        <line x1="0" y1="-3" x2="0" y2="3" className="blueprint-line" style={{ opacity: 0.5 }} />
        <circle r="0.8" className="blueprint-node" style={{ opacity: 0.7 }} />
      </g>
    </svg>
  )
}
