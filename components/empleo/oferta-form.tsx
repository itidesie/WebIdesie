"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { createOferta, updateOferta, type Oferta } from "@/app/empleo/actions"

const ofertaSchema = z.object({
  puesto: z.string().min(1, "El puesto es obligatorio"),
  empresa: z.string().min(1, "La empresa es obligatoria"),
  ubicacion: z.string().optional(),
  salario: z.string().optional(),
  tipoContrato: z.string().optional(),
  descripcion: z.string().optional(),
  enlaceExterno: z.string().optional(),
  destacada: z.boolean(),
  activa: z.boolean(),
})

type OfertaFormValues = z.infer<typeof ofertaSchema>

interface OfertaFormProps {
  mode: "create" | "edit"
  initialData?: Oferta
}

export function OfertaForm({ mode, initialData }: OfertaFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [secretKey, setSecretKey] = useState("")

  const form = useForm<OfertaFormValues>({
    resolver: zodResolver(ofertaSchema),
    defaultValues: {
      puesto: initialData?.puesto ?? "",
      empresa: initialData?.empresa ?? "",
      ubicacion: initialData?.ubicacion ?? "",
      salario: initialData?.salario ?? "",
      tipoContrato: initialData?.tipo_contrato ?? "",
      descripcion: initialData?.descripcion ?? "",
      enlaceExterno: initialData?.enlace_externo ?? "",
      destacada: initialData?.destacada ?? false,
      activa: initialData?.activa ?? true,
    },
  })

  const onSubmit = async (values: OfertaFormValues) => {
    if (!secretKey.trim()) {
      setError("Debes ingresar la clave secreta")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const formData = new FormData()
      formData.set("puesto", values.puesto)
      formData.set("empresa", values.empresa)
      formData.set("ubicacion", values.ubicacion ?? "")
      formData.set("salario", values.salario ?? "")
      formData.set("tipoContrato", values.tipoContrato ?? "")
      formData.set("descripcion", values.descripcion ?? "")
      formData.set("enlaceExterno", values.enlaceExterno ?? "")
      formData.set("destacada", String(values.destacada))
      formData.set("activa", String(values.activa))
      formData.set("secretKey", secretKey)

      const result =
        mode === "create"
          ? await createOferta(formData)
          : await (async () => {
              formData.set("id", String(initialData!.id))
              return updateOferta(formData)
            })()

      if (result.success) {
        setSuccess(result.message)
        setTimeout(() => {
          router.push("/admin/empleo")
          router.refresh()
        }, 1200)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar la oferta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-layout admin-dark min-h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
            <div className="flex items-center gap-4">
              <Link href="/admin/empleo">
                <button type="button" className="admin-button-secondary flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Empleo
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[#ededed]">
                  {mode === "create" ? "Crear Oferta" : "Editar Oferta"}
                </h1>
                <p className="text-sm text-[#a1a1a1] mt-1">
                  {mode === "create" ? "Datos de la oferta de empleo" : `Editando: ${initialData?.puesto}`}
                </p>
              </div>
            </div>
            <button type="submit" disabled={loading} className="admin-button-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              {loading ? "Guardando..." : mode === "create" ? "Crear Oferta" : "Actualizar"}
            </button>
          </div>

          {error && (
            <div className="bg-[#1f1f1f] border border-[#ef4444] rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#ef4444]">Error</p>
                <p className="text-sm text-[#a1a1a1] mt-1">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-[#1f1f1f] border border-[#22c55e] rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#22c55e]">Éxito</p>
                <p className="text-sm text-[#a1a1a1] mt-1">{success}</p>
              </div>
            </div>
          )}

          <div className="admin-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#ededed]">Datos de la oferta</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="puesto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#ededed]">Puesto *</FormLabel>
                    <FormControl>
                      <Input {...field} className="admin-input" placeholder="BIM Manager Senior" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="empresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#ededed]">Empresa *</FormLabel>
                    <FormControl>
                      <Input {...field} className="admin-input" placeholder="Nombre de la empresa" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ubicacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#ededed]">Ubicación</FormLabel>
                    <FormControl>
                      <Input {...field} className="admin-input" placeholder="Madrid, España / Remoto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipoContrato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#ededed]">Tipo de contrato</FormLabel>
                    <FormControl>
                      <Input {...field} className="admin-input" placeholder="Jornada completa" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#ededed]">Salario</FormLabel>
                    <FormDescription className="text-[#666666]">
                      Texto libre — un rango, "A convenir", etc.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} className="admin-input" placeholder="35.000 - 45.000 €/año" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enlaceExterno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#ededed]">Enlace externo</FormLabel>
                    <FormDescription className="text-[#666666]">
                      Solo si la empresa gestiona candidaturas fuera de IDESIE, en vez del formulario interno
                    </FormDescription>
                    <FormControl>
                      <Input {...field} className="admin-input" placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#ededed]">Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="admin-input" rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="admin-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#ededed]">Estado</h2>

            <FormField
              control={form.control}
              name="destacada"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="text-[#ededed]">Destacada</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activa"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div>
                    <FormLabel className="text-[#ededed]">Publicada</FormLabel>
                    <FormDescription className="text-[#666666]">Visible en /bolsa-de-empleo-page</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="admin-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#ededed]">Autenticación</h2>
            <div>
              <label className="text-sm font-medium text-[#ededed] block mb-2">Clave Secreta *</label>
              <Input
                type="password"
                className="admin-input"
                placeholder="Ingresa tu clave secreta"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
              <p className="text-xs text-[#666666] mt-1">Requerida para guardar cambios en la base de datos</p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
