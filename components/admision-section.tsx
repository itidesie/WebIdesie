"use client"

import { useState } from "react"
import { Check, FileText, ArrowRight, Mail, ChevronDown, ClipboardCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdmisionModal } from "@/components/admision-modal"
import type { OrigenAdmision, ProgramaAdmision } from "@/lib/admision-db"

interface AdmisionSectionProps {
  requisitos: string[]
  compraLink?: string // URL de compra específica por máster
  /** Preselecciona el programa en el nuevo formulario de solicitud de admisión (modal). */
  programa: ProgramaAdmision
}

const ORIGEN_POR_PROGRAMA: Record<ProgramaAdmision, OrigenAdmision> = {
  MBIM: "mbim",
  MBBE: "mbbe",
  EMBIM: "embim",
  Online: "online",
}

export default function AdmisionSection({ requisitos, compraLink, programa }: AdmisionSectionProps) {
  const [openSections, setOpenSections] = useState<string[]>(["requisitos"])

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  // Defensive check for requisitos
  if (!requisitos || !Array.isArray(requisitos)) {
    console.error("[v0] AdmisionSection: requisitos prop is missing or not an array")
    return null
  }

  return (
    <section id="admision" className="w-full py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-20 max-w-4xl">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">
          Admisión al <span className="bg-[#006cff] text-white px-3 py-1 rounded-lg">Máster</span>
        </h2>

        {/* Botón prominente y propio del flujo de solicitud de admisión
            (modal) — antes solo existía enterrado dentro del acordeón de
            "Documentación requerida", apuntando al formulario antiguo
            (/application, retirado por completo en 2026-09-04 (44)). Ese
            segundo botón, más abajo en el acordeón, ahora abre este mismo
            modal en vez de enlazar a la página retirada. */}
        <div className="mb-8 text-center">
          <AdmisionModal programaPreseleccionado={programa} origen={ORIGEN_POR_PROGRAMA[programa]}>
            <Button
              size="lg"
              className="bg-[#006cff] px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-[#005bbd] md:text-lg"
            >
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Solicitud de admisión
            </Button>
          </AdmisionModal>
        </div>

        <div className="space-y-4">
          {/* ACORDEÓN 1: REQUISITOS */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("requisitos")}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              type="button"
            >
              <h3 className="text-xl font-bold text-gray-900 text-left">Requisitos</h3>
              <ChevronDown
                className={`w-6 h-6 text-[#006cff] transition-transform duration-300 flex-shrink-0 ${
                  openSections.includes("requisitos") ? "rotate-180" : ""
                }`}
              />
            </button>

            {openSections.includes("requisitos") && (
              <div className="px-6 pb-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Check before mapping */}
                  {requisitos.length > 0 &&
                    requisitos.map((requisito, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">{requisito}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* ACORDEÓN 2: DOCUMENTACIÓN */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("documentacion")}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              type="button"
            >
              <h3 className="text-xl font-bold text-gray-900 text-left">Documentación requerida</h3>
              <ChevronDown
                className={`w-6 h-6 text-[#006cff] transition-transform duration-300 flex-shrink-0 ${
                  openSections.includes("documentacion") ? "rotate-180" : ""
                }`}
              />
            </button>

            {openSections.includes("documentacion") && (
              <div className="px-6 pb-6 pt-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-4 bg-gray-50 p-5 rounded-lg">
                    <FileText className="w-6 h-6 text-[#006cff] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-3">Solicitud de admisión</p>
                      <AdmisionModal programaPreseleccionado={programa} origen={ORIGEN_POR_PROGRAMA[programa]}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[#006cff] border-[#006cff] hover:bg-[#006cff] hover:text-white transition-all bg-transparent"
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          formulario de admision
                        </Button>
                      </AdmisionModal>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
                    <FileText className="w-6 h-6 text-[#006cff] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      <span className="font-semibold">DNI/Pasaporte</span> (copia)
                    </p>
                  </div>

                  <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
                    <FileText className="w-6 h-6 text-[#006cff] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      <span className="font-semibold">Certificado o título universitario</span> de Ingeniero o
                      Arquitecto
                    </p>
                  </div>

                  <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
                    <FileText className="w-6 h-6 text-[#006cff] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      <span className="font-semibold">Currículum Vitae</span> detallando estudios y experiencia
                      profesional
                    </p>
                  </div>

                  <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
                    <FileText className="w-6 h-6 text-[#006cff] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      <span className="font-semibold">Carta de recomendación empresarial</span> (si dispones de ella)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACORDEÓN 3: PASOS DEL PROCESO */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("pasos")}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              type="button"
            >
              <h3 className="text-xl font-bold text-gray-900 text-left">Pasos del proceso</h3>
              <ChevronDown
                className={`w-6 h-6 text-[#006cff] transition-transform duration-300 flex-shrink-0 ${
                  openSections.includes("pasos") ? "rotate-180" : ""
                }`}
              />
            </button>

            {openSections.includes("pasos") && (
              <div className="px-6 pb-6 pt-2 space-y-3">
                {/* Paso 1 */}
                <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#006cff]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-white bg-[#006cff] px-3 py-1 rounded">PASO 1</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Envío de documentación</h4>
                  <p className="text-gray-700 mb-3">Remite todos los documentos requeridos a:</p>
                  <a
                    href="mailto:info@idesie.com"
                    className="inline-flex items-center gap-2 text-[#006cff] font-semibold hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    info@idesie.com
                  </a>
                </div>

                {/* Paso 2 */}
                <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#006cff]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-white bg-[#006cff] px-3 py-1 rounded">PASO 2</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Entrevista personal</h4>
                  <p className="text-gray-700">
                    Con uno de nuestros profesores del Máster BIM, profesionales de prestigio del sector AEC
                  </p>
                </div>

                {/* Paso 3 */}
                <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#006cff]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-white bg-[#006cff] px-3 py-1 rounded">PASO 3</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Evaluación del Comité de Admisiones</h4>
                  <p className="text-gray-700">
                    Revisión integral de tu perfil académico, experiencia profesional y motivación para el MBIM
                  </p>
                </div>

                {/* Paso 4 */}
                <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#006cff]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-white bg-[#006cff] px-3 py-1 rounded">PASO 4</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Resolución y acompañamiento</h4>
                  <p className="text-gray-700">
                    Comunicación de admisión por email y apoyo completo en trámites de matrícula y visa de estudios
                  </p>
                </div>

                {/* BOTÓN FINAL */}
                {compraLink && (
                  <div className="mt-6 text-center">
                    <Button
                      asChild
                      size="lg"
                      className="px-8 py-4 text-base md:text-lg font-semibold bg-[#006cff] hover:bg-[#005bbd] text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                      <Link href={compraLink}>Comprar ya el master y enviar documentacion despues</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
