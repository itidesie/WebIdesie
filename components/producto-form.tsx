"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { RichTextEditor } from "@/components/rich-text-editor"
import { createProducto, updateProducto, type Producto } from "@/app/tienda/actions"

/**
 * "tipo" está limitado a "master"/"curso" porque el storefront
 * (components/tienda/catalogo-grid.tsx) filtra comparando ese string
 * literal — un valor distinto rompería el filtro de /tienda en silencio.
 */
/**
 * El orden importa: `z.union([z.coerce.number().min(0), z.literal("")])`
 * NO sirve para un campo numérico opcional. Zod prueba las ramas en orden y
 * usa la primera que no falle — `Number("")` es `0`, que pasa `.min(0)`, así
 * que la unión se resuelve ahí mismo y "" se convierte en 0 en vez de
 * llegar nunca a `z.literal("")`. Comprobando `z.literal("")` PRIMERO se
 * evita el problema: solo si el valor no es exactamente "" se intenta la
 * coerción numérica.
 */
const optionalNumber = (schema: z.ZodNumber) => z.union([z.literal(""), schema])

/**
 * Categorías reales para el filtro de /tienda. Antes se inferían buscando
 * substrings en el nombre del producto ("bim", "sql", "energía"...),
 * duplicado en dos archivos y roto para cualquier producto cuyo nombre no
 * contuviera esas palabras exactas. "Sin categoría" (valor `""`) dejaba el
 * producto fuera de todos los filtros salvo "Todos".
 */
export const CATEGORIAS = ["BIM", "Programación", "Energía"] as const

const productoSchema = z.object({
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones (sin espacios)"),
  tipo: z.enum(["master", "curso"], { required_error: "Elige un tipo" }),
  categoria: z.string().optional(),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcionCorta: z.string().optional(),
  descripcionLarga: z.string().optional(),
  // Opcional desde scripts/026_precio_actual_nullable.sql: un producto sin
  // precio publicado (p. ej. Executive Master BIM) se deja vacío en vez de
  // forzar un 0€ — la interfaz pública lo distingue de "gratuito".
  precioActual: optionalNumber(z.coerce.number().min(0, "El precio no puede ser negativo")).optional(),
  precioOriginal: optionalNumber(z.coerce.number().min(0)).optional(),
  precioMatricula: optionalNumber(z.coerce.number().min(0)).optional(),
  duracionMeses: optionalNumber(z.coerce.number().int().min(0)).optional(),
  duracionHoras: optionalNumber(z.coerce.number().int().min(0)).optional(),
  modalidad: z.string().optional(),
  certificacion: z.string().optional(),
  imagen: z.string().optional(),
  imagenAlt: z.string().optional(),
  destacado: z.boolean(),
  activo: z.boolean(),
})

type ProductoFormValues = z.infer<typeof productoSchema>

interface ProductoFormProps {
  mode: "create" | "edit"
  initialData?: Producto
}

function generateSlug(nombre: string) {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function ProductoForm({ mode, initialData }: ProductoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [secretKey, setSecretKey] = useState("")

  const form = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      slug: initialData?.slug ?? "",
      tipo: (initialData?.tipo as "master" | "curso") ?? "master",
      categoria: initialData?.categoria ?? "",
      nombre: initialData?.nombre ?? "",
      descripcionCorta: initialData?.descripcion_corta ?? "",
      descripcionLarga: initialData?.descripcion_larga ?? "",
      precioActual: initialData?.precio_actual ?? "",
      precioOriginal: initialData?.precio_original ?? "",
      precioMatricula: initialData?.precio_matricula ?? "",
      duracionMeses: initialData?.duracion_meses ?? "",
      duracionHoras: initialData?.duracion_horas ?? "",
      modalidad: initialData?.modalidad ?? "",
      certificacion: initialData?.certificacion ?? "",
      imagen: initialData?.imagen ?? "",
      imagenAlt: initialData?.imagen_alt ?? "",
      destacado: initialData?.destacado ?? false,
      activo: initialData?.activo ?? true,
    },
  })

  const onSubmit = async (values: ProductoFormValues) => {
    if (!secretKey.trim()) {
      setError("Debes ingresar la clave secreta")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const formData = new FormData()
      formData.set("slug", values.slug)
      formData.set("tipo", values.tipo)
      formData.set("categoria", values.categoria ?? "")
      formData.set("nombre", values.nombre)
      formData.set("descripcionCorta", values.descripcionCorta ?? "")
      formData.set("descripcionLarga", values.descripcionLarga ?? "")
      formData.set("precioActual", !values.precioActual && values.precioActual !== 0 ? "" : String(values.precioActual))
      formData.set("precioOriginal", !values.precioOriginal && values.precioOriginal !== 0 ? "" : String(values.precioOriginal))
      formData.set("precioMatricula", !values.precioMatricula && values.precioMatricula !== 0 ? "" : String(values.precioMatricula))
      formData.set("duracionMeses", !values.duracionMeses && values.duracionMeses !== 0 ? "" : String(values.duracionMeses))
      formData.set("duracionHoras", !values.duracionHoras && values.duracionHoras !== 0 ? "" : String(values.duracionHoras))
      formData.set("modalidad", values.modalidad ?? "")
      formData.set("certificacion", values.certificacion ?? "")
      formData.set("imagen", values.imagen ?? "")
      formData.set("imagenAlt", values.imagenAlt ?? "")
      formData.set("destacado", String(values.destacado))
      formData.set("activo", String(values.activo))
      formData.set("secretKey", secretKey)

      const result =
        mode === "create"
          ? await createProducto(formData)
          : await (async () => {
              formData.set("originalSlug", initialData!.slug)
              return updateProducto(formData)
            })()

      if (result.success) {
        setSuccess(result.message)
        setTimeout(() => {
          router.push("/admin/tienda")
          router.refresh()
        }, 1200)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el producto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-layout admin-dark min-h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
            <div className="flex items-center gap-4">
              <Link href="/admin/tienda">
                <button type="button" className="admin-button-secondary flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Tienda
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[#ededed]">
                  {mode === "create" ? "Crear Producto" : "Editar Producto"}
                </h1>
                <p className="text-sm text-[#a1a1a1] mt-1">
                  {mode === "create" ? "Datos básicos del producto" : `Editando: ${initialData?.nombre}`}
                </p>
              </div>
            </div>
            <button type="submit" disabled={loading} className="admin-button-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              {loading ? "Guardando..." : mode === "create" ? "Crear Producto" : "Actualizar"}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-6">
              <div className="admin-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-[#ededed]">Datos básicos</h2>

                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#ededed]">Nombre *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="admin-input"
                          placeholder="Máster BIM (MBIM)"
                          onChange={(e) => {
                            field.onChange(e)
                            if (mode === "create") form.setValue("slug", generateSlug(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#ededed]">Slug (URL) *</FormLabel>
                      <FormControl>
                        <Input {...field} className="admin-input" placeholder="master-bim" />
                      </FormControl>
                      <FormDescription className="text-[#666666]">/producto/{field.value || "..."}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#ededed]">Tipo *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="admin-input w-full">
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="master">Máster</SelectItem>
                          <SelectItem value="curso">Curso corto</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#ededed]">Categoría</FormLabel>
                      <FormDescription className="text-[#666666]">
                        Controla el filtro de categoría en /tienda
                      </FormDescription>
                      <Select
                        onValueChange={(value) => field.onChange(value === "ninguna" ? "" : value)}
                        value={field.value || "ninguna"}
                      >
                        <FormControl>
                          <SelectTrigger className="admin-input w-full">
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ninguna">Sin categoría</SelectItem>
                          {CATEGORIAS.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descripcionCorta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#ededed]">Descripción corta</FormLabel>
                      <FormDescription className="text-[#666666]">
                        Aparece en la tienda y en el resumen de la ficha
                      </FormDescription>
                      <FormControl>
                        <Textarea {...field} className="admin-input" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descripcionLarga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#ededed]">Descripción larga</FormLabel>
                      <FormControl>
                        <RichTextEditor content={field.value ?? ""} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="admin-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-[#ededed]">Precio y duración</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="precioActual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#ededed]">Precio actual (€)</FormLabel>
                        <FormDescription className="text-[#666666]">
                          Vacío = sin precio público ("Precio no disponible, contactar")
                        </FormDescription>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" className="admin-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="precioOriginal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#ededed]">Precio original (€)</FormLabel>
                        <FormDescription className="text-[#666666]">Solo si hay descuento</FormDescription>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" className="admin-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="precioMatricula"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#ededed]">Precio de matrícula (€)</FormLabel>
                        <FormDescription className="text-[#666666]">
                          Reserva de plaza con pago fraccionado. Déjalo vacío si este producto no ofrece esa opción
                        </FormDescription>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" className="admin-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duracionMeses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#ededed]">Duración (meses)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" className="admin-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duracionHoras"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#ededed]">Duración (horas)</FormLabel>
                        <FormDescription className="text-[#666666]">Para cursos cortos</FormDescription>
                        <FormControl>
                          <Input {...field} type="number" className="admin-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="admin-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-[#ededed]">Configuración</h2>

                <FormField
                  control={form.control}
                  name="modalidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#ededed]">Modalidad</FormLabel>
                      <FormControl>
                        <Input {...field} className="admin-input" placeholder="Presencial / Online" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certificacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#ededed]">Certificación</FormLabel>
                      <FormControl>
                        <Input {...field} className="admin-input" placeholder="Cualificam" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imagenAlt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#ededed]">Texto alternativo de la imagen</FormLabel>
                      <FormControl>
                        <Input {...field} className="admin-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imagen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#ededed]">Imagen</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://ejemplo.com/imagen.jpg" className="admin-input" />
                      </FormControl>
                      <p className="text-xs text-[#525252] mt-1">Pega la URL de una imagen ya alojada en algún sitio</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("imagen") && (
                  <img
                    src={form.watch("imagen")}
                    alt="Vista previa"
                    className="mt-2 rounded-lg border border-[#262626] max-h-32 object-cover"
                  />
                )}
              </div>

              <div className="admin-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-[#ededed]">Estado</h2>

                <FormField
                  control={form.control}
                  name="destacado"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="text-[#ededed]">Destacado</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="activo"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel className="text-[#ededed]">Publicado</FormLabel>
                        <FormDescription className="text-[#666666]">Visible en /tienda</FormDescription>
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
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
