import type { Metadata } from "next"
import TiendaClient from "./tienda-client"
import { getPublicProductos } from "./actions"

export const metadata: Metadata = {
  title: "Tienda | Másteres, Cursos y Certificaciones BIM",
  description:
    "Compra másteres, cursos cortos y certificaciones BIM de IDESIE. Formación en Building Information Modeling con el respaldo académico de IDESIE.",
  alternates: { canonical: "/tienda" },
  openGraph: {
    title: "Tienda IDESIE | Másteres, Cursos y Certificaciones BIM",
    description:
      "Compra másteres, cursos cortos y certificaciones BIM de IDESIE. Formación en Building Information Modeling con el respaldo académico de IDESIE.",
    url: "/tienda",
    type: "website",
    locale: "es_ES",
    siteName: "IDESIE Business & Technology School",
    images: [
      {
        url: "/images/hero-background.jpg",
        width: 1200,
        height: 630,
        alt: "Tienda IDESIE - Másteres y cursos BIM",
      },
    ],
  },
}

// Server Component: los productos se obtienen aquí (en el servidor) y se
// pasan como prop. Antes `tienda-client.tsx` los pedía con `useEffect` +
// `fetch("/api/productos")`, así que el HTML inicial era solo un spinner —
// sin contenido real, sin <h1>, invisible para cualquier rastreador que no
// ejecute JS. Ver CLAUDE.md "SEO técnico" / diagnóstico del rediseño.
export default async function TiendaPage() {
  const productos = await getPublicProductos()
  return <TiendaClient productos={productos} />
}
