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
    <div className="hero-video-frame relative overflow-hidden rounded-2xl bg-gray-950 shadow-2xl">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted={isMuted}
        loop
        playsInline
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
