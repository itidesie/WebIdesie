"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { usePathname } from "next/navigation"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[]
  className?: string
  variant?: "visible" | "hidden" | "subtle" | "small"
}

export default function BreadcrumbNavigation({ items, className = "", variant = "small" }: BreadcrumbNavigationProps) {
  const pathname = usePathname()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split("/").filter((segment) => segment !== "")
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Inicio", href: "/" }]

    // Define page mappings for better labels
    const pageLabels: Record<string, string> = {
      "mbim-page": "Máster BIM (MBIM)",
      "mbim-online-page": "Máster BIM Online",
      "embim-page": "Executive Máster BIM",
      "mbbe-page": "Máster Business Building Engineering",
      "short-courses-page": "Cursos Cortos",
      "in-company-page": "Formación In-Company",
      "empresas-page": "Empresas",
      "bim-consulting-page": "Consultoría BIM",
      "bolsa-de-empleo-page": "Bolsa de Empleo",
      "financiacion-y-becas-page": "Financiación y Becas",
      "sobre-idesie-page": "Sobre IDESIE",
      "profesores-page": "Profesores",
      "alumni-page": "Alumnos",
      "alianzas-page": "Alianzas Académicas",
      "contact-page": "Contacto",
      blog: "Blog",
    }

    let currentPath = ""
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const label = pageLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")

      // Don't add the current page as a link in breadcrumbs
      if (index === pathSegments.length - 1) {
        breadcrumbs.push({ label, href: currentPath })
      } else {
        breadcrumbs.push({ label, href: currentPath })
      }
    })

    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  // Don't show breadcrumbs on homepage
  if (pathname === "/") {
    return null
  }

  const getVariantClasses = () => {
    switch (variant) {
      case "hidden":
        return "sr-only" // Screen reader only - invisible but accessible
      case "subtle":
        return "bg-transparent border-none py-2 text-xs opacity-70 hover:opacity-100 transition-opacity"
      case "small":
        return "bg-transparent py-1 text-xs"
      case "visible":
      default:
        return "bg-gray-50 border-b border-gray-200 py-3"
    }
  }

  const getTextClasses = () => {
    switch (variant) {
      case "small":
        return "text-xs"
      case "subtle":
        return "text-xs"
      default:
        return "text-sm"
    }
  }

  const getIconSize = () => {
    switch (variant) {
      case "small":
        return "w-3 h-3"
      case "subtle":
        return "w-4 h-4"
      default:
        return "w-4 h-4"
    }
  }

  return (
    <nav id="breadcrumb-navigation" className={`${getVariantClasses()} ${className}`} aria-label="Navegación de ruta">
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-20 max-w-6xl">
        <ol className={`flex items-center space-x-1 ${getTextClasses()}`}>
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <ChevronRight className={`${getIconSize()} text-gray-400 mx-1`} aria-hidden="true" />}
              {index === 0 && <Home className={`${getIconSize()} text-gray-500 mr-1`} aria-hidden="true" />}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-gray-600 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-[#006cff] hover:underline transition-colors"
                  aria-label={`Ir a ${item.label}`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
