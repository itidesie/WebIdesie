"use client"

import { useRef, useState } from "react"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"

interface HeroVideoProps {
  src: string
}

/**
 * Vídeo nativo (Cloudflare R2, sin iframe ni librería) — autoplay silencioso
 * en bucle. Necesita "use client" solo por el control de pausa/reproducción
 * y silencio manuales (refs, estado, manejadores de eventos), no por el
 * `<video>` en sí.
 *
 * 🔓 2026-09-05 — el mecanismo de bloqueo del resto de la página hasta ver
 * 60s reales (`onProgressDelta`/`pulseSignal`, `GatedContent`,
 * `VideoGateBanner`, todos retirados) se eliminó por decisión explícita del
 * cliente en el rediseño completo de /landing: es tráfico de pago, cada
 * segundo de fricción antes del CTA cuesta conversión. El vídeo sigue siendo
 * el protagonista del hero (autoplay, sonido opcional), pero ya no condiciona
 * el acceso a nada.
 *
 * 🔴 2026-09-06 — `preload="metadata"` añadido tras un diagnóstico real de
 * Lighthouse móvil contra producción: sin este atributo, el navegador aplica
 * su valor por defecto (`auto`) y empieza a bufferear agresivamente un
 * archivo de 170s en bucle — confirmado por red real, ~3,7 MB descargados
 * solo para el primer render, de los 5,09 MB de peso total de la página
 * (LCP 4,1s, "malo"). `preload="metadata"` no rompe el autoplay (el
 * navegador sigue arrancando la reproducción en cuanto puede), solo deja de
 * indicarle que precargue muy por delante de lo que hace falta para
 * arrancar.
 *
 * 🎨 2026-09-06 — `journey-surface journey-surface-dark` en el marco (antes
 * `rounded-2xl` genérico) — era la única sección de las 7 sin el motivo de
 * esquina cortada que ya comparten Testimonios/Argumentos/Comparativa/FAQ/
 * Cierre. Puro CSS (`border-radius` + un `::before` de borde degradado),
 * sin JS ni recursos nuevos — no toca en absoluto el `preload="metadata"`
 * de arriba ni el LCP: el navegador sigue descargando y pintando el vídeo
 * exactamente igual, solo cambia la forma del marco que lo recorta.
 */
export function HeroVideo({ src }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play()
    else video.pause()
  }

  // Silenciar/activar sonido no toca `autoPlay` ni `loop` — solo cambia el
  // estado de React, que React vuelca sobre la propiedad `.muted` real del
  // elemento en cada commit (no es solo un atributo HTML inicial). No hay
  // remontaje del `<video>`, así que la reproducción no se reinicia.
  const toggleMute = () => {
    setIsMuted((m) => !m)
  }

  return (
    <div className="hero-video-frame journey-surface journey-surface-dark relative overflow-hidden bg-gray-950 shadow-2xl">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="block h-auto w-full"
      />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pausar vídeo" : "Reproducir vídeo"}
        className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-gray-950/70 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/90"
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
      </button>

      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "Activar sonido" : "Silenciar vídeo"}
        className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-gray-950/70 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/90"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </div>
  )
}
