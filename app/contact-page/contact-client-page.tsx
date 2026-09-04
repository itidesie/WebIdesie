"use client"

import React from "react"

// Header y FooterSection se renderizan en el Server Component (page.tsx),
// por lo tanto, no deben importarse ni usarse aquí.
// import Header from "../../components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowRight, CalendarCheck, CheckCircle2, Loader2, MessageSquare } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

/**
 * Motivos de contacto que pueden llegar por querystring desde las paginas de
 * programa (?motivo=asesoria / ?motivo=clase, opcionalmente &programa=MBIM).
 *
 * Sustituyen a las antiguas rutas /asesoria-online y /solicitar-clase-online,
 * que nunca existieron y devolvian 404. Cuando llega un motivo se abre
 * directamente la pestana de Calendly, que es el unico canal que hoy funciona
 * de punta a punta (el formulario de mensaje todavia no tiene onSubmit).
 */
const MOTIVOS = {
  asesoria: {
    titulo: "Asesoria online personalizada",
    descripcion:
      "Reserva un hueco y un orientador academico repasara contigo tu perfil, tus objetivos y que programa encaja mejor.",
    asunto: "Solicitud de asesoria online",
  },
  clase: {
    titulo: "Clase online con un profesor",
    descripcion:
      "Reserva un hueco y coordinamos contigo la asistencia a una clase en vivo con un profesor en activo del sector AEC.",
    asunto: "Solicitud de clase online",
  },
} as const

type MotivoKey = keyof typeof MOTIVOS

export default function ContactClientPage() {
  const searchParams = useSearchParams()

  const motivoParam = searchParams.get("motivo")
  const motivo: MotivoKey | null =
    motivoParam === "asesoria" || motivoParam === "clase" ? motivoParam : null
  const programa = searchParams.get("programa")

  const contexto = motivo ? MOTIVOS[motivo] : null
  const asuntoPrefijado = contexto
    ? programa
      ? `${contexto.asunto} - ${programa}`
      : contexto.asunto
    : ""

  // Si venimos de un CTA de programa, arrancamos en Calendly en vez de en el
  // formulario de mensaje.
  const [activeTab, setActiveTab] = useState<"message" | "schedule">(
    motivo ? "schedule" : "message",
  )
  const [subject, setSubject] = useState(asuntoPrefijado)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; text: string } | null>(null)

  /**
   * Antes este `<form>` no tenía `onSubmit` en absoluto — el botón "Enviar
   * Mensaje" no hacía nada (ver CLAUDE.md, auditoría de formularios
   * 2026-09-04). Validación de obligatorios también en servidor
   * (`POST /api/contact`), nunca solo aquí.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.get("name"),
          email: formData.get("email"),
          asunto: subject || undefined,
          mensaje: formData.get("message"),
          motivo: motivo ?? undefined,
          programa: programa ?? undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Error al enviar el mensaje")
      }

      setSubmitStatus({ type: "success", text: "Mensaje enviado correctamente. Te responderemos pronto." })
      e.currentTarget.reset()
      setSubject(asuntoPrefijado)
    } catch (error) {
      setSubmitStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Ha ocurrido un error. Inténtalo de nuevo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Dynamic Contact Card */}
      <Card className="p-4 sm:p-6 md:p-8 rounded-xl shadow-lg bg-white border border-gray-200">
        {/* Contexto cuando el usuario llega desde un CTA de una pagina de programa */}
        {contexto && (
          <div className="mb-6 sm:mb-8 rounded-lg border-l-4 border-[#006cff] bg-[#006cff]/5 p-4">
            <p className="font-semibold text-gray-900">
              {contexto.titulo}
              {programa && <span className="text-[#006cff]"> · {programa}</span>}
            </p>
            <p className="mt-1 text-sm text-gray-700 leading-relaxed">{contexto.descripcion}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center mb-6 sm:mb-8 gap-2 sm:gap-4">
          <Button
            onClick={() => setActiveTab("message")}
            size="sm"
            variant={activeTab === "message" ? "default" : "ghost"}
            className="rounded-lg text-xs sm:text-sm w-full sm:w-auto"
          >
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Escribir Mensaje
          </Button>
          <Button
            onClick={() => setActiveTab("schedule")}
            size="sm"
            variant={activeTab === "schedule" ? "default" : "ghost"}
            className="rounded-lg text-xs sm:text-sm w-full sm:w-auto"
          >
            <CalendarCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Agendar Llamada
          </Button>
        </div>

        {activeTab === "message" ? (
          <>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 text-center">Envianos un Mensaje</CardTitle>
            <CardDescription className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-700 text-center">
              Completa el formulario y nos pondremos en contacto contigo a la brevedad.
            </CardDescription>
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitStatus && (
                <div
                  className={`flex items-start gap-3 rounded-lg p-4 ${
                    submitStatus.type === "success"
                      ? "border border-green-200 bg-green-50 text-green-800"
                      : "border border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  )}
                  <p className="text-sm leading-relaxed">{submitStatus.text}</p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Tu nombre"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="tu@ejemplo.com"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Consulta sobre programas"
                  className="w-full"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Escribe tu mensaje aquí..."
                  rows={5}
                  className="w-full"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enviando…
                  </>
                ) : (
                  <>
                    Enviar Mensaje <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </>
        ) : (
          <>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 text-center">Agenda una Llamada</CardTitle>
            <CardDescription className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-700 text-center">
              Selecciona una fecha y hora conveniente para hablar con nuestro equipo de admisiones o consultoria.
            </CardDescription>
            <div className="relative w-full h-[450px] sm:h-[500px] md:h-[600px] rounded-lg overflow-hidden border border-gray-200 shadow-inner">
              {/* Calendly Embed */}
              <iframe
                src="https://calendly.com/idesie-info/30min"
                width="100%"
                height="100%"
                frameBorder="0"
                title="Agenda una llamada con IDESIE"
                className="absolute inset-0"
              ></iframe>
            </div>
          </>
        )}
      </Card>
    </>
  )
}
