"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import { useState } from "react"

interface VideoFacadeProps {
  /** ID numérico del vídeo en Vimeo. */
  videoId: string
  /** Hash de privacidad (parámetro ?h= de la URL). */
  hash: string
  title: string
  /** Imagen local que se muestra antes de cargar el reproductor. */
  poster: string
}

/**
 * Muestra una miniatura hasta que el usuario pulsa play; solo entonces monta el
 * iframe de Vimeo. Evita cargar ~318 KB de JS de terceros en el arranque de la
 * home, donde la mayoría de visitantes nunca reproduce el vídeo.
 */
export function VideoFacade({ videoId, hash, title, poster }: VideoFacadeProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (isPlaying) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?h=${hash}&autoplay=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setIsPlaying(true)}
      aria-label={`Reproducir vídeo: ${title}`}
      className="group relative w-full h-full cursor-pointer overflow-hidden"
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gray-900/40 transition-colors group-hover:bg-gray-900/25" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/95 shadow-xl transition-transform duration-300 group-hover:scale-110">
          <Play className="w-6 h-6 text-brand fill-brand ml-1" />
        </span>
      </span>
    </button>
  )
}
