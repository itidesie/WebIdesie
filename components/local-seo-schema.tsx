"use client"

import { useEffect, useMemo } from "react"

interface LocalSEOSchemaProps {
  pageName?: string
  pageDescription?: string
  pageUrl?: string
}

export default function LocalSEOSchema({
  pageName = "IDESIE Business & Technology School",
  pageDescription = "Formación BIM especializada en Madrid",
  pageUrl = "/",
}: LocalSEOSchemaProps) {
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://idesie.com${pageUrl}#webpage`,
        url: `https://idesie.com${pageUrl}`,
        name: pageName,
        description: pageDescription,
        inLanguage: "es-ES",
        isPartOf: { "@id": "https://idesie.com/#website" },
        about: { "@id": "https://idesie.com/#organization" },
        breadcrumb: { "@id": `https://idesie.com${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://idesie.com${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://idesie.com/" },
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://idesie.com/#organization",
        name: "IDESIE Business & Technology School",
        alternateName: "IDESIE Madrid",
        url: "https://idesie.com/",
        logo: { "@type": "ImageObject", url: "https://idesie.com/images/logo_idesie_azul.png" },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+34-912-345-678",
          contactType: "customer service",
          areaServed: "ES",
          availableLanguage: ["es", "en"],
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Madrid",
          addressLocality: "Madrid",
          addressRegion: "Comunidad de Madrid",
          postalCode: "28001",
          addressCountry: "ES",
        },
        geo: { "@type": "GeoCoordinates", latitude: 40.4168, longitude: -3.7038 },
        areaServed: [
          { "@type": "City", name: "Madrid" },
          { "@type": "AdministrativeArea", name: "Comunidad de Madrid" },
          { "@type": "Country", name: "España" },
        ],
        knowsAbout: [
          "Building Information Modeling", "BIM", "Arquitectura Digital",
          "Ingeniería BIM", "Consultoría BIM", "Formación BIM Madrid",
        ],
      },
    ],
  }), [pageName, pageDescription, pageUrl])

  useEffect(() => {
    const existing = document.getElementById("local-seo-schema")
    if (existing) existing.remove()
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.id = "local-seo-schema"
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)
    return () => { script.remove() }
  }, [structuredData])

  return null
}
