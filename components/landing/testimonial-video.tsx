interface TestimonialVideoProps {
  src: string
  name: string
  quote: string
}

/**
 * Vídeo real de un testimonio — distinto de `hero-video.tsx` a propósito:
 * ese es un fondo silencioso en bucle atado al sistema de bloqueo; este
 * necesita sonido real y que sea el propio usuario quien decida
 * reproducirlo. Sin autoplay, controles nativos visibles, sin bucle.
 *
 * `preload="metadata"` en vez de `auto`: cede la carga completa del vídeo
 * a que el usuario pulse play, sin descargar nada de más solo por estar en
 * la página (mismo criterio de peso que ya se aplica al vídeo del hero).
 *
 * `prefers-reduced-motion` no necesita gestión aparte aquí: sin autoplay no
 * hay ningún movimiento hasta que el usuario pulsa play, que ya es una
 * acción explícita suya — la preferencia de movimiento reducido es sobre
 * animaciones que ocurren SIN pedirlo, no sobre reproducir un vídeo a
 * petición propia.
 *
 * 🔴 2026-09-04 (34) — bug real corregido: las esquinas redondeadas vivían
 * en un `<div>` envolvente con `overflow-hidden`, no en el propio
 * `<video>`. Es un problema conocido y documentado en varios navegadores:
 * cuando un ancestro con `overflow: hidden` recorta un vídeo con controles
 * nativos, el control de volumen/silencio puede quedar visualmente
 * presente pero sin responder a los clics (el resto de controles, como
 * play, sigue funcionando — por eso pasaba desapercibido). El redondeado
 * ahora vive en el propio `<video>` (los navegadores modernos recortan el
 * contenido de un elemento reemplazado con su propio `border-radius`, sin
 * necesitar un ancestro con `overflow: hidden`) — no hay ningún `muted` en
 * el JSX, nunca lo hubo, así que el silencio no venía de ahí.
 */
export function TestimonialVideo({ src, name, quote }: TestimonialVideoProps) {
  return (
    <div className="aspect-[3/4] w-full bg-gray-950">
      <video
        src={src}
        controls
        preload="metadata"
        playsInline
        aria-label={`Vídeo testimonio de ${name}: «${quote}»`}
        className="h-full w-full rounded-2xl object-cover"
      >
        Tu navegador no admite la reproducción de este vídeo.
      </video>
    </div>
  )
}
