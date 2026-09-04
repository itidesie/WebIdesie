import type { Metadata } from "next"
import LandingClient from "./landing-client"

/**
 * /landing es EXCLUSIVAMENTE para tráfico de campañas de pago (Google Ads,
 * Meta Ads...) — no debe posicionar en búsqueda orgánica ni descubrirse por
 * rastreo. `robots: { index: false, follow: false }` + `Disallow: /landing`
 * en robots.txt + fuera del sitemap + sin ningún enlace interno desde el
 * resto del sitio son las 4 piezas que mantienen esto así. Ver CLAUDE.md §2
 * "SEO técnico" antes de tocar cualquiera de las cuatro.
 */
export const metadata: Metadata = {
  title: "Másteres BIM | MBIM, MBBE, EMBIM y Online | IDESIE",
  description:
    "Elige entre los 4 másteres BIM de IDESIE: presencial, especializado en instalaciones (MBBE), ejecutivo (EMBIM) u online. Misma acreditación oficial, distinto formato.",
  alternates: {
    canonical: "/landing",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Másteres BIM | MBIM, MBBE, EMBIM y Online | IDESIE",
    description:
      "Elige entre los 4 másteres BIM de IDESIE: presencial, especializado en instalaciones (MBBE), ejecutivo (EMBIM) u online. Misma acreditación oficial, distinto formato.",
    url: "/landing",
    type: "website",
    locale: "es_ES",
    siteName: "IDESIE Business & Technology School",
    images: [
      {
        url: "/images/hero-background.jpg",
        width: 1200,
        height: 630,
        alt: "Másteres BIM de IDESIE - MBIM, MBBE, EMBIM y Online",
      },
    ],
  },
}

export default function LandingPage() {
  return <LandingClient />
}
