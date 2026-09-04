interface IndiceMonogramProps {
  name: string
  index: number
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ""
  const second = parts[1]?.[0] ?? ""
  return `${first}${second}`.toUpperCase()
}

/**
 * Sustituye las 17 fotos rotas (ninguna existe en `public/images/`, 404
 * confirmado) por un monograma con degradado en tonos de marca — nunca un
 * color fuera de la paleta de IDESIE, para no romper la disciplina de color
 * del sitio con 17 tonos aleatorios. La variación viene de 3 combinaciones
 * fijas de ángulo/parada cicladas por índice, no de un color por persona.
 * El día que existan fotos reales, este componente se sustituye por
 * `<Image>` sin tocar el resto de `indice-list.tsx`.
 */
export function IndiceMonogram({ name, index }: IndiceMonogramProps) {
  const variant = index % 3
  return (
    <div
      className={`indice-monogram indice-monogram-${variant} flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold text-white sm:h-16 sm:w-16 sm:text-lg`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  )
}
