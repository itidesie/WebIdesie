"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Target, MapPin, Briefcase } from "lucide-react"

/**
 * Extraído de app/bim-consulting-page/page.tsx (antes vivía inline en un
 * archivo entero marcado "use client" solo por este carrusel). Aislarlo aquí
 * permite que la página vuelva a ser Server Component con su propia
 * `metadata` — ver CLAUDE.md, diagnóstico del rediseño de Consultoría BIM.
 *
 * Contenido y estructura sin cambios (los 4 casos reales, sus datos, sus
 * fotos) — solo el aspecto visual, alineado con la dirección "El Expediente"
 * del resto de la página: bordes en vez de sombras pesadas, esquinas menos
 * redondeadas, azul de marca vía token en vez de hex suelto.
 */

interface ProjectImage {
  url: string
  title: string
}

interface Project {
  title: string
  objective: string
  location: string
  category: string
  images: ProjectImage[]
  description: string
}

const projects: Project[] = [
  {
    title: "Subtramo Línea Metro",
    objective: "Adjudicación de obra",
    location: "Sevilla",
    category: "Infraestructura, Transporte Público",
    images: [
      { url: "/images/projects/metro-sevilla-1.jpg", title: "Vista general del trazado" },
      { url: "/images/projects/metro-sevilla-2.jpg", title: "Estación subterránea" },
      { url: "/images/projects/metro-sevilla-3.jpg", title: "Sistemas de ventilación" },
      { url: "/images/projects/metro-sevilla-4.jpg", title: "Conexiones y accesos" },
    ],
    description:
      "Modelado BIM integral para proyecto de infraestructura de un tramo de transporte público, incluyendo coordinación multidisciplinar y detección de interferencias para optimizar el proceso constructivo.",
  },
  {
    title: "Senado",
    objective: "Estudio y reforma",
    location: "Madrid",
    category: "Oficinas Gubernamentales",
    images: [
      { url: "/images/projects/senado-1.jpg", title: "Fachada principal" },
      { url: "/images/projects/senado-2.jpg", title: "Planta distribución general" },
      { url: "/images/projects/senado-3.jpg", title: "Salón de plenos" },
      { url: "/images/projects/senado-4.jpg", title: "Sistemas estructurales" },
      { url: "/images/projects/senado-5.jpg", title: "Instalaciones eléctricas" },
      { url: "/images/projects/senado-6.jpg", title: "HVAC y climatización" },
      { url: "/images/projects/senado-7.jpg", title: "Detalles arquitectónicos" },
    ],
    description:
      "Análisis exhaustivo y planificación de reforma para un sector de edificio histórico gubernamental, respetando patrimonio arquitectónico, aplicando escaneo láser y modelado as-built para máxima precisión.",
  },
  {
    title: "Paso Superior A67",
    objective: "Licitación",
    location: "Polanco, Cantabria",
    category: "Infraestructura, Puentes",
    images: [
      { url: "/images/projects/puente-a67-1.jpg", title: "Vista lateral del puente" },
      { url: "/images/projects/puente-a67-2.jpg", title: "Estructura principal" },
      { url: "/images/projects/puente-a67-3.jpg", title: "Detalles de cimentación" },
      { url: "/images/projects/puente-a67-4.jpg", title: "Sistema de vigas" },
      { url: "/images/projects/puente-a67-5.jpg", title: "Barandillas y seguridad" },
      { url: "/images/projects/puente-a67-6.jpg", title: "Vista en contexto" },
    ],
    description:
      "Desarrollo de documentación BIM completa para licitación de paso superior, incluyendo análisis estructural detallado, optimización de costes y planificación de fases constructivas.",
  },
  {
    title: "Edificio Treviso",
    objective: "Gestión y mantenimiento",
    location: "Madrid",
    category: "Oficinas Corporativas",
    images: [
      { url: "/images/projects/treviso-1.jpg", title: "Vista exterior del edificio" },
      { url: "/images/projects/treviso-2.jpg", title: "Estructura y arquitectura" },
      { url: "/images/projects/treviso-3.jpg", title: "Sistema de fontanería" },
      { url: "/images/projects/treviso-4.jpg", title: "Instalaciones eléctricas" },
      { url: "/images/projects/treviso-5.jpg", title: "Sistema HVAC" },
      { url: "/images/projects/treviso-6.jpg", title: "Red contra incendios" },
      { url: "/images/projects/treviso-7.jpg", title: "Climatización por planta" },
      { url: "/images/projects/treviso-8.jpg", title: "Saneamiento y desagües" },
      { url: "/images/projects/treviso-9.jpg", title: "Sistemas de seguridad" },
      { url: "/images/projects/treviso-10.jpg", title: "Coordinación MEP" },
      { url: "/images/projects/treviso-11.jpg", title: "Modelo completo integrado" },
    ],
    description:
      "Implementación de sistema BIM para facility management integral, optimizando operaciones de mantenimiento preventivo y gestión eficiente del ciclo de vida del edificio corporativo.",
  },
]

export function ProjectsCarousel() {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const currentProject = projects[currentProjectIndex]

  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length)
    setCurrentImageIndex(0)
  }

  const prevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentProject.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentProject.images.length) % currentProject.images.length)
  }

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-96 md:h-[550px] bg-gray-950">
            <div className="relative w-full h-full">
              <Image
                src={currentProject.images[currentImageIndex].url || "/placeholder.svg"}
                alt={`${currentProject.title} - ${currentProject.images[currentImageIndex].title}`}
                fill
                className="object-cover"
              />

              <div className="absolute top-4 left-4 right-20 md:right-auto bg-brand text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-semibold shadow-lg truncate">
                {currentProject.category}
              </div>

              <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 md:px-3 rounded-md text-xs md:text-sm font-medium tabular-nums">
                {currentImageIndex + 1} / {currentProject.images.length}
              </div>

              {currentProject.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2.5 rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-10"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2.5 rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-10"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-8">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {currentProject.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? "border-brand scale-105 shadow-lg" : "border-white/30 hover:border-white/60"
                    }`}
                    title={img.title}
                  >
                    <Image src={img.url || "/placeholder.svg"} alt={img.title} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand mb-3">Caso real</p>
            <h3 className="text-3xl font-extrabold text-gray-950 mb-4">{currentProject.title}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{currentProject.description}</p>

            <div className="space-y-4 mb-6 border-t border-gray-100 pt-6">
              <div className="flex items-start">
                <Target className="w-5 h-5 text-brand mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Objetivo</p>
                  <p className="text-gray-600">{currentProject.objective}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-brand mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Ubicación</p>
                  <p className="text-gray-600">{currentProject.location}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Briefcase className="w-5 h-5 text-brand mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Categoría</p>
                  <p className="text-gray-600">{currentProject.category}</p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {currentProject.images.length} {currentProject.images.length === 1 ? "imagen" : "imágenes"} disponibles
            </div>
          </div>
        </div>

        <div className="absolute right-4 bottom-4 md:right-12 md:top-12 md:bottom-auto flex gap-2 z-20">
          <button
            onClick={prevProject}
            className="bg-brand hover:bg-brand-strong text-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Proyecto anterior"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextProject}
            className="bg-brand hover:bg-brand-strong text-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Siguiente proyecto"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-3">
        {projects.map((project, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentProjectIndex(index)
              setCurrentImageIndex(0)
            }}
            className={`transition-all duration-300 ${
              index === currentProjectIndex ? "w-12 h-3 bg-brand rounded-full" : "w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full"
            }`}
            aria-label={`Ir al proyecto ${project.title}`}
          />
        ))}
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-500 font-medium tabular-nums">
          {currentProjectIndex + 1} / {projects.length} — {currentProject.title}
        </p>
      </div>
    </div>
  )
}
