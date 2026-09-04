"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { submitDeletionRequest } from "./actions"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function SolicitudBajaClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await submitDeletionRequest(formData)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        ;(e.target as HTMLFormElement).reset()
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Ha ocurrido un error al enviar la solicitud. Por favor, inténtalo de nuevo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-8 rounded-xl shadow-lg bg-white border border-gray-200">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-gray-900">Formulario de Solicitud de Baja</h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          )}
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre Completo */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre Completo <span className="text-red-500">*</span>
          </label>
          <Input id="nombre" name="nombre" type="text" placeholder="Tu nombre completo" required className="w-full" />
        </div>

        {/* Correo Electrónico */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico <span className="text-red-500">*</span>
          </label>
          <Input id="email" name="email" type="email" placeholder="tu@email.com" required className="w-full" />
          <p className="text-sm text-gray-500 mt-1">
            Indica el email con el que estás registrado en nuestra base de datos
          </p>
        </div>

        {/* Motivo de la Baja */}
        <div>
          <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
            Motivo de la Baja <span className="text-red-500">*</span>
          </label>
          <select
            id="motivo"
            name="motivo"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006cff] focus:border-transparent"
          >
            <option value="">Selecciona un motivo</option>
            <option value="no_interes">Ya no estoy interesado en los servicios</option>
            <option value="privacidad">Preocupaciones sobre privacidad</option>
            <option value="spam">Recibo demasiados correos</option>
            <option value="otro">Otro motivo</option>
          </select>
        </div>

        {/* Comentarios Adicionales */}
        <div>
          <label htmlFor="comentarios" className="block text-sm font-medium text-gray-700 mb-2">
            Comentarios Adicionales (Opcional)
          </label>
          <Textarea
            id="comentarios"
            name="comentarios"
            placeholder="Si deseas añadir algún comentario adicional..."
            rows={4}
            className="w-full"
          />
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border-l-4 border-[#006cff] p-4 rounded">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold">Importante:</span> Una vez procesada tu solicitud, eliminaremos todos tus
            datos personales de nuestros sistemas. Este proceso es irreversible y puede tardar hasta 30 días en
            completarse.
          </p>
        </div>

        {/* Legal Text */}
        <div className="text-sm text-gray-600 leading-relaxed">
          <p>
            IDESIE BUSINESS SCHOOL SL con CIF B86142510 y domicilio en Calle Montalbán 3, 1º derecha 28014 Madrid
            España, le informa que la finalidad del tratamiento de los datos recogidos es la solicitud de ejercicio del
            derecho de supresión. Sus datos se conservarán durante el tiempo necesario para atender su solicitud y,
            posteriormente, durante el plazo de prescripción de las acciones legales. Para más información sobre el
            tratamiento de sus datos, consulte nuestra Política de Privacidad.
          </p>
        </div>

        {/* Submit Button */}
        <Button type="submit" size="lg" className="w-full bg-[#006cff] hover:bg-blue-700" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Solicitud de Baja"}
        </Button>
      </form>
    </Card>
  )
}
