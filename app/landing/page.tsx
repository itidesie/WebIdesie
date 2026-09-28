import type { Metadata } from "next"
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono, Bricolage_Grotesque, DM_Sans, Instrument_Serif } from "next/font/google"
import { LandingClient } from "./landing-client"

/**
 * "MBIM 2.0" — landing de venta del máster, concepto visual propio,
 * autocontenido (sin relación con el sistema Tailwind/shadcn del resto del
 * sitio — mismo criterio que otras páginas con identidad propia: In
 * Company, Consultoría). Ver el comentario de cabecera de
 * `landing-client.tsx` para el historial completo de rediseños visuales.
 *
 * Se mantiene en `noindex, nofollow`: sigue siendo tráfico exclusivo de
 * campañas de pago, nunca indexada para búsqueda orgánica.
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

/**
 * Solo para el <h1> del hero (2026-09-08, rediseño de hero "MBIM 2.0" a dos
 * columnas) — pedido explícito del cliente de migrar el titular a Bricolage
 * Grotesque tras confirmárselo. El resto de la página se queda en Space
 * Grotesk, a propósito: no se sustituye la identidad tipográfica ya
 * aprobada, solo el titular gana más carácter.
 */
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
})

/**
 * 2026-09-28 — Segundo rediseño visual, esta vez tomando como referencia
 * explícita el landing y el formulario de otro proyecto propio del cliente
 * (`marketing/flowengine`): tipografía de acento en itálica serif dentro de
 * los titulares, y cuerpo de texto en una sans más neutra. Ver el comentario
 * de cabecera de `landing-client.tsx` para el detalle completo de qué se
 * tomó como referencia y qué se dejó igual (todo el contenido real).
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dmsans",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
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
      fontVariables={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} ${bricolageGrotesque.variable} ${dmSans.variable} ${instrumentSerif.variable}`}
    />
  )
}
