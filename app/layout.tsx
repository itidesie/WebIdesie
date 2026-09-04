// Layout configuration
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Roboto_Mono } from "next/font/google"
import { Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "next-themes"
import { CartProvider } from "@/contexts/cart-context"
import { Suspense } from "react"
import { ScrollToTop } from "@/components/scroll-to-top"
import GlobalSchemaScripts from "@/components/global-schema-scripts"
import { SiteMotionProvider } from "@/components/site-motion/site-motion-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
})

/**
 * Voz editorial del blog ("Cuaderno de Bitácora Técnico") — un serif con
 * carácter para titulares de artículo, distinto del sans por defecto del
 * resto del sitio. Fraunces tiene eje óptico (se ve bien tanto grande en un
 * h1 como en itálica de cita) sin caer en lo genérico de un Georgia/Times.
 * Solo se usa en el blog, ver el bloque "BLOG — CUADERNO DE BITÁCORA
 * TÉCNICO" de globals.css.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
})

export const metadata: Metadata = {
  title: {
    default: "IDESIE - Máster BIM y Formación en Building Information Modeling",
    template: "%s | IDESIE Business & Technology School",
  },
  description:
    "Líder en formación BIM desde 2012. Máster BIM presencial y online, cursos de Building Information Modeling, consultoría BIM especializada. Certificación oficial en arquitectura y ingeniería digital.",
  keywords: [
    "BIM Master's program",
    "Building Information Modeling course",
    "BIM certification",
    "architecture and engineering digital design",
    "Máster BIM",
    "formación BIM",
    "consultoría BIM",
    "IDESIE",
    "BIM Manager",
    "Autodesk certification",
    "Revit training",
    "construction technology",
    "Máster BIM Madrid",
    "formación BIM Madrid España",
    "escuela BIM Madrid",
    "curso Building Information Modeling Madrid",
    "BIM Manager Madrid",
    "consultoría BIM Madrid",
    "certificación BIM Madrid España",
    "arquitectura digital Madrid",
    "ingeniería BIM Madrid",
    "formación construcción Madrid",
  ],
  authors: [{ name: "IDESIE Business & Technology School" }],
  creator: "IDESIE",
  publisher: "IDESIE Business & Technology School",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://idesie.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    title: "IDESIE - Máster BIM y Formación en Building Information Modeling",
    description:
      "Líder en formación BIM desde 2012. Máster BIM presencial y online, cursos especializados en Building Information Modeling y consultoría BIM.",
    siteName: "IDESIE Business & Technology School",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "IDESIE - Formación BIM y Building Information Modeling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IDESIE - Máster BIM y Formación en Building Information Modeling",
    description:
      "Líder en formación BIM desde 2012. Máster BIM presencial y online, cursos especializados en Building Information Modeling.",
    images: ["/images/twitter-image.jpg"],
    creator: "@IDESIE_BIM",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Verificación de Search Console pendiente: cuando el cliente tenga el
  // código real (Search Console → Configuración → Verificación de la
  // propiedad → método "Etiqueta HTML"), añadir aquí
  // `verification: { google: "<código>" }`. Un placeholder sin rellenar
  // no verifica nada — es mejor omitir la clave que dejar un valor falso
  // en el HTML de producción (SEO audit 2026-09-03).
  generator: "Next.js",
  other: {
    "geo.region": "ES-MD",
    "geo.placename": "Madrid",
    "geo.position": "40.4168;-3.7038",
    ICBM: "40.4168, -3.7038",
  },
}

// GlobalSchemaScripts is now imported from @/components/global-schema-scripts

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${robotoMono.variable} ${fraunces.variable} antialiased`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        {/* Activa el estado inicial oculto de las animaciones de entrada solo
            si hay JS y el usuario no pidió reducir movimiento. Sin este
            atributo el CSS no oculta nada, así que el contenido siempre se ve. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.reveal='on'}}catch(e){}",
          }}
        />
        <GlobalSchemaScripts />
        {/* Cursor + scroll suave de todo el sitio — ver
            components/site-motion/site-motion-provider.tsx. Una sola vez
            aquí, nunca por página; ver CLAUDE.md §5 "Sistema global de
            cursor + scroll suave" antes de tocar esto o de volver a montar
            Lenis en una página concreta. */}
        <SiteMotionProvider />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <ScrollToTop />
            <CartProvider>{children}</CartProvider>
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
