"use client"

import { useEffect } from "react"

const educationalOrgSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "IDESIE Business & Technology School",
  alternateName: "IDESIE",
  url: "https://idesie.com",
  logo: "/images/logo_idesie_azul.png",
  description: "Escuela líder en formación BIM y Building Information Modeling desde 2012",
  foundingDate: "2012",
  address: {
    "@type": "PostalAddress",
    addressCountry: "ES",
    addressLocality: "Madrid",
    addressRegion: "Comunidad de Madrid",
    postalCode: "28001",
    streetAddress: "Madrid, España",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.4168,
    longitude: -3.7038,
  },
  areaServed: [
    { "@type": "City", name: "Madrid" },
    { "@type": "AdministrativeArea", name: "Comunidad de Madrid" },
    { "@type": "Country", name: "España" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+34-912-345-678",
    contactType: "customer service",
    availableLanguage: ["Spanish", "English"],
    areaServed: "ES",
  },
  sameAs: ["https://www.linkedin.com/school/idesie/", "https://twitter.com/IDESIE_BIM"],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "Máster BIM (MBIM)",
      description: "Máster en Building Information Modeling presencial en Madrid",
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Máster BIM Online",
      description: "Máster en Building Information Modeling modalidad online desde Madrid",
    },
  ],
  offers: [
    {
      "@type": "Course",
      name: "Máster BIM Madrid",
      description: "Formación presencial en Building Information Modeling en Madrid",
      provider: { "@type": "EducationalOrganization", name: "IDESIE Business & Technology School" },
    },
    {
      "@type": "Course",
      name: "Consultoría BIM Madrid",
      description: "Servicios de consultoría BIM especializada en Madrid y España",
      provider: { "@type": "EducationalOrganization", name: "IDESIE Business & Technology School" },
    },
  ],
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://idesie.com/#localbusiness",
  name: "IDESIE Business & Technology School",
  image: "/images/logo_idesie_azul.png",
  telephone: "+34-912-345-678",
  email: "info@idesie.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Madrid",
    addressLocality: "Madrid",
    addressRegion: "Comunidad de Madrid",
    postalCode: "28001",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.4168,
    longitude: -3.7038,
  },
  url: "https://idesie.com",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  priceRange: "\u20AC\u20AC\u20AC",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "150",
  },
}

export default function GlobalSchemaScripts() {
  useEffect(() => {
    const schemas = [
      { id: "educational-organization-schema", data: educationalOrgSchema },
      { id: "local-business-schema", data: localBusinessSchema },
    ]

    const elements: HTMLScriptElement[] = []

    for (const schema of schemas) {
      const existing = document.getElementById(schema.id)
      if (existing) existing.remove()

      const script = document.createElement("script")
      script.type = "application/ld+json"
      script.id = schema.id
      script.textContent = JSON.stringify(schema.data)
      document.head.appendChild(script)
      elements.push(script)
    }

    return () => {
      for (const el of elements) el.remove()
    }
  }, [])

  return null
}
