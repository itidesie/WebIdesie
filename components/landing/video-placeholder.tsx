import { Film, Play } from "lucide-react"

interface VideoPlaceholderProps {
  /** Texto corto que identifica qué vídeo va aquí, p.ej. "Vídeo del hero" o "Testimonio 1". */
  label: string
  aspect?: "video" | "portrait"
  className?: string
}

/**
 * 🔲 PLACEHOLDER DE VÍDEO — pendiente de contenido real.
 *
 * No hay ningún vídeo real todavía (a propósito: el encargo pidió dejar el
 * hueco preparado, no inventar ni buscar contenido). Único uso actual:
 * `testimonials-section.tsx` (el vídeo del hero ya es real desde
 * 2026-09-04, ver `hero-video.tsx`).
 *
 * Rediseño 2026-09-04 (30): el barrido de brillo (`.video-placeholder-shimmer`)
 * sustituye el recuadro punteado estático — comunica "esto se está
 * preparando de verdad" en vez de leerse como un hueco vacío. El aviso
 * "Vídeo pendiente" se mantiene exactamente igual — la disciplina de no
 * disimular contenido pendiente no cambia, solo la ejecución visual del
 * hueco.
 *
 * 2026-09-04 (31): auditoría contra las Web Interface Guidelines de Vercel
 * (skill `web-design-guidelines`) — el shimmer pasó de animar
 * `background-position` a `transform: translateX()` (compositor-friendly,
 * ver `globals.css`) y se ralentizó para no leerse como un skeleton-loader
 * real (que promete contenido cargando ya mismo, cosa que esto no hace).
 * `Film`/`Play` ganan `aria-hidden="true"` — son decorativos junto a texto
 * visible, no aportan información propia a un lector de pantalla.
 */
export function VideoPlaceholder({ label, aspect = "video", className = "" }: VideoPlaceholderProps) {
  return (
    <div
      className={`video-placeholder-shimmer relative flex items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-brand/30 bg-[repeating-linear-gradient(135deg,rgb(0_108_255/0.05)_0px,rgb(0_108_255/0.05)_10px,transparent_10px,transparent_20px)] ${
        aspect === "video" ? "aspect-video" : "aspect-[3/4]"
      } ${className}`}
    >
      <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-gray-950/85 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white">
        <Film className="h-3 w-3" aria-hidden="true" />
        Vídeo pendiente
      </span>

      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
          <Play className="ml-1 h-5 w-5 text-brand/50 fill-brand/50" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
