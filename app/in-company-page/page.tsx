import type { Metadata } from "next"
import InCompanyClient from "./in-company-client"

export const metadata: Metadata = {
  title: "Formación BIM In Company | Empresas | Personalizada | IDESIE",
  description:
    "Formación BIM personalizada para tu empresa. Programas a medida, implementación BIM corporativa. +50 empresas confían en IDESIE. Formación in-situ, casos prácticos reales, ROI inmediato en productividad.",
  keywords:
    "formación BIM empresa, BIM in company, implementación BIM corporativa, formación personalizada BIM, programas BIM medida, consultoría BIM empresas",
  openGraph: {
    title: "Formación BIM In Company | Empresas | IDESIE",
    description: "Formación BIM personalizada para tu empresa. Programas a medida, implementación BIM corporativa.",
    type: "website",
    locale: "es_ES",
  },
}

export default function InCompanyPage() {
  return <InCompanyClient />
}
