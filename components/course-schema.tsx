"use client"

import { useEffect, useMemo } from "react"

interface CourseSchemaProps {
  name: string
  description: string
  provider: string
  duration: string
  courseMode: "online" | "onsite" | "blended"
  startDate?: string
  price?: string
  currency?: string
  location?: string
  url: string
}

export default function CourseSchema({
  name,
  description,
  provider,
  duration,
  courseMode,
  startDate,
  price,
  currency = "EUR",
  location = "Madrid, España",
  url,
}: CourseSchemaProps) {
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "EducationalOrganization",
      name: provider,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Madrid",
        addressCountry: "ES",
      },
    },
    courseMode,
    timeRequired: duration,
    inLanguage: "es",
    url,
    ...(location && {
      location: {
        "@type": "Place",
        name: location,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Madrid",
          addressCountry: "ES",
        },
      },
    }),
    ...(startDate && {
      hasCourseInstance: {
        "@type": "CourseInstance",
        startDate,
        courseMode,
        location: { "@type": "Place", name: location },
      },
    }),
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: currency,
        category: "Educational",
      },
    }),
  }), [name, description, provider, duration, courseMode, startDate, price, currency, location, url])

  useEffect(() => {
    const existing = document.getElementById("course-schema")
    if (existing) existing.remove()
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.id = "course-schema"
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)
    return () => { script.remove() }
  }, [structuredData])

  return null
}
