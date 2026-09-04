"use client"

import { useEffect } from "react"

interface StructuredDataProps {
  data: object
}

export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.textContent = JSON.stringify(data)
    script.id = "structured-data-" + Math.random().toString(36).slice(2)
    document.head.appendChild(script)
    return () => { script.remove() }
  }, [data])

  return null
}
