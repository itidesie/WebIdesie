"use client"

import { useEffect, useMemo } from "react"

interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
}

export default function FAQSchema({ faqs }: FAQSchemaProps) {
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }), [faqs])

  useEffect(() => {
    const existing = document.getElementById("faq-schema")
    if (existing) existing.remove()
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.id = "faq-schema"
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)
    return () => { script.remove() }
  }, [structuredData])

  return null
}
