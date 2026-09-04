import type { Metadata } from "next"
import MBIMOnlineClient from "./mbim-online-client"
import CourseSchema from "@/components/course-schema"
import FAQSchema from "@/components/faq-schema"
import { faqs } from "./mbim-online-content"

export const metadata: Metadata = {
  title: "Master BIM Online - Formacion 100% Online en Building Information Modeling | IDESIE",
  description:
    "Master BIM Online de IDESIE. 12 meses de formacion 100% online en Building Information Modeling. Flexibilidad total, certificacion ISO 19650 y acceso a bolsa de empleo con +200 empresas del sector AEC.",
  keywords: [
    "Master BIM Online",
    "Building Information Modeling online",
    "Master BIM Online IDESIE",
    "BIM Manager certification",
    "ISO 19650 training",
    "Revit Navisworks online",
    "BIM 4D 5D course online",
    "formacion BIM online",
    "bolsa de empleo BIM",
    "curso BIM flexible",
    "BIM desde casa",
    "master BIM a distancia",
  ],
  alternates: { canonical: "/mbim-online-page" },
  openGraph: {
    title: "Master BIM Online - Formacion 100% Online | IDESIE",
    description:
      "Conviertete en BIM Manager con nuestro Master BIM Online. 12 meses, estudia a tu ritmo con total flexibilidad y acceso a la bolsa de empleo de IDESIE con +200 empresas.",
    url: "/mbim-online-page",
    type: "website",
    locale: "es_ES",
    siteName: "IDESIE Business & Technology School",
    images: [
      {
        url: "/images/mbim_online_hero_image.jpg",
        width: 1200,
        height: 630,
        alt: "Master BIM Online IDESIE - Building Information Modeling",
      },
    ],
  },
}

export default function MBIMOnlinePage() {
  return (
    <>
      <CourseSchema
        name="Master BIM Online"
        description="Master BIM Online de IDESIE. 12 meses de formación 100% online en Building Information Modeling, con certificación ISO 19650 y acceso a bolsa de empleo con +200 empresas del sector AEC."
        provider="IDESIE Business & Technology School"
        duration="P12M"
        courseMode="online"
        price="3800"
        url="https://idesie.com/mbim-online-page"
      />
      <FAQSchema faqs={faqs} />
      <MBIMOnlineClient />
    </>
  )
}
