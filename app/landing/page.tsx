import type { Metadata } from "next"
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"
import { LandingClient } from "./landing-client"

/**
 * Réplica del mockup estático `mbim-landing.html` (aportado por el cliente,
 * "MBIM 2.0" — BIM + IA), fiel en estilo, contenido y textos. Es un
 * concepto propio, autocontenido: tipografía (Space Grotesk / IBM Plex
 * Sans / IBM Plex Mono) y paleta ("blueprint") propias, sin relación con el
 * sistema de diseño Tailwind/shadcn del resto del sitio — mismo criterio ya
 * aplicado a otras páginas con identidad propia (In Company, Consultoría).
 * Fuentes cargadas con next/font/google, con las mismas familias/pesos del
 * mockup, en vez del `<link>` a Google Fonts del archivo original.
 *
 * El propio mockup se marca a sí mismo como borrador ("sin optimizar"):
 * trae testimonios con nombres entre corchetes y un comentario explícito
 * pidiendo sustituirlos por citas reales antes de publicar. Por eso esta
 * página se deja en `noindex, nofollow` — mismo criterio que se aplicó al
 * /landing anterior mientras tuvo contenido de ejemplo sin confirmar.
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MBIM 2.0 — Máster en BIM e Inteligencia Artificial para el sector AEC",
  description:
    "BIM e Inteligencia Artificial de nivel profesional para arquitectos, ingenieros y técnicos AEC. Contrato laboral desde el primer día, módulo de IA aplicada al AEC y tres credenciales al terminar.",
  alternates: {
    canonical: "/landing",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function LandingPage() {
  return (
    <LandingClient
      fontVariables={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    />
  )
}
