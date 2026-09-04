"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, User, MessageSquare, Loader2, CheckCircle } from "lucide-react"

interface JobApplicationModalProps {
  jobTitle: string
  /** Id real de la oferta en `ofertas_empleo`, si la candidatura es sobre una oferta concreta. */
  jobId?: number
  children: React.ReactNode
}

export default function JobApplicationModal({ jobTitle, jobId, children }: JobApplicationModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/empleo/candidatura", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ofertaId: jobId ?? null,
          ofertaPuesto: jobTitle,
          nombre: formData.name,
          email: formData.email,
          telefono: formData.phone,
          mensaje: formData.message,
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setTimeout(() => {
          setFormData({ name: "", email: "", phone: "", message: "" })
          setSubmitSuccess(false)
          setOpen(false)
        }, 3000)
      } else {
        throw new Error("Error al enviar el formulario")
      }
    } catch (error) {
      console.error("Error:", error)
      setSubmitError(
        error instanceof Error ? error.message : "Ha ocurrido un error al enviar tu solicitud. Por favor, inténtalo de nuevo.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto border border-gray-300 bg-white shadow-xl backdrop-blur-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-950">Solicitar Información</DialogTitle>
          <DialogDescription className="text-gray-700 pt-2">
            Completa el formulario y nos pondremos en contacto contigo para proporcionarte más detalles sobre esta
            oportunidad.
          </DialogDescription>
        </DialogHeader>

        {submitSuccess ? (
          <div className="py-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-950 mb-2">¡Solicitud enviada con éxito!</h3>
            <p className="text-gray-700">Nos pondremos en contacto contigo pronto.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 py-4">
            {/* Job Title Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Oferta de interés:</p>
              <p className="text-lg font-semibold text-[#006cff]">{jobTitle}</p>
            </div>

            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{submitError}</div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-950 font-semibold text-[15px]">
                Nombre completo <span className="text-red-600">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 border-gray-400 bg-white text-gray-950 placeholder:text-gray-500 focus:border-[#006cff] focus:ring-1 focus:ring-[#006cff]"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-950 font-semibold text-[15px]">
                Email <span className="text-red-600">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 border-gray-400 bg-white text-gray-950 placeholder:text-gray-500 focus:border-[#006cff] focus:ring-1 focus:ring-[#006cff]"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-950 font-semibold text-[15px]">
                Teléfono <span className="text-red-600">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+34 600 000 000"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 border-gray-400 bg-white text-gray-950 placeholder:text-gray-500 focus:border-[#006cff] focus:ring-1 focus:ring-[#006cff]"
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-950 font-semibold text-[15px]">
                Mensaje
              </Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Cuéntanos brevemente sobre tu experiencia o por qué te interesa esta posición..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="pl-10 border-gray-400 bg-white text-gray-950 placeholder:text-gray-500 focus:border-[#006cff] focus:ring-1 focus:ring-[#006cff] resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 border-gray-400 text-gray-950"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-[#006cff] hover:bg-[#005bbd]" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Solicitud"
                )}
              </Button>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-gray-600 text-center pt-2">
              Al enviar este formulario, aceptas que tus datos sean utilizados para contactarte sobre esta oferta de
              empleo.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
