// components/masters/landing/metodologia-lbw.tsx
import { Euro, Calendar, TrendingUp, CheckCircle } from "lucide-react"

interface MetodologiaLbWProps {
  ingresosLbW: number // Total de ingresos (ej: 12200)
  costeNeto: number // Coste real (ej: 2050)
  duracionFormacion?: number // Meses de formación (ej: 10)
  duracionPracticas?: number // Meses de prácticas (ej: 6)
  ingresosFormacion?: number // Ingresos mensuales en formación (ej: 500)
  ingresosPracticas?: number // Ingresos mensuales en prácticas (ej: 1200)
}

export default function MetodologiaLbW({
  ingresosLbW,
  costeNeto,
  duracionFormacion = 10,
  duracionPracticas = 6,
  ingresosFormacion = 500,
  ingresosPracticas = 1200
}: MetodologiaLbWProps) {
  const totalFormacion = duracionFormacion * ingresosFormacion
  const totalPracticas = duracionPracticas * ingresosPracticas
  const precioTotal = ingresosLbW + costeNeto

  return (
    <section className="py-12 md:py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center bg-blue-50 px-4 py-2 rounded-full mb-4">
            <span className="text-[#006cff] font-semibold text-sm">Learning by Working</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Aprende Mientras Trabajas y Ganas
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
            Nuestro innovador modelo Learning by Working te permite recibir ingresos desde el primer mes. 
            Profesionalizarte sin renunciar a tu estabilidad económica.
          </p>
        </div>

        {/* Timeline visual */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 md:mb-12">
          {/* Fase 1: Formación */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 md:p-8 rounded-xl shadow-sm border-2 border-[#006cff]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#006cff] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Formación Técnica</h3>
                <p className="text-sm text-gray-600">{duracionFormacion} meses</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#006cff] flex-shrink-0" />
                <span className="text-gray-700">Clases intensivas presenciales</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#006cff] flex-shrink-0" />
                <span className="text-gray-700">Proyectos prácticos reales</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#006cff] flex-shrink-0" />
                <span className="text-gray-700">Contrato laboral desde día 1</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ingresos mensuales</p>
                  <p className="text-2xl font-bold text-[#006cff]">{ingresosFormacion}€/mes</p>
                </div>
                <Euro className="w-8 h-8 text-[#006cff]" />
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-600">Total fase formación</p>
                <p className="text-lg font-bold text-gray-900">{totalFormacion.toLocaleString()}€</p>
              </div>
            </div>
          </div>

          {/* Fase 2: Prácticas */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 md:p-8 rounded-xl shadow-sm border-2 border-[#006cff]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#006cff] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Prácticas Profesionales</h3>
                <p className="text-sm text-gray-600">{duracionPracticas} meses</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#006cff] flex-shrink-0" />
                <span className="text-gray-700">Empresa líder del sector AEC</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#006cff] flex-shrink-0" />
                <span className="text-gray-700">Proyecto real en producción</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#006cff] flex-shrink-0" />
                <span className="text-gray-700">Mentoría de profesionales senior</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ingresos mensuales</p>
                  <p className="text-2xl font-bold text-[#006cff]">{ingresosPracticas.toLocaleString()}€/mes</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#006cff]" />
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-600">Total fase prácticas</p>
                <p className="text-lg font-bold text-gray-900">{totalPracticas.toLocaleString()}€</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen económico */}
        <div className="bg-gradient-to-r from-[#006cff] to-[#0052cc] text-white p-6 md:p-8 rounded-xl shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">
              Inversión Real en Tu Futuro
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-2">
                  <p className="text-3xl md:text-4xl font-bold">{precioTotal.toLocaleString()}€</p>
                </div>
                <p className="text-sm text-blue-100">Precio del Máster</p>
              </div>

              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-2">
                  <p className="text-3xl md:text-4xl font-bold">-{ingresosLbW.toLocaleString()}€</p>
                </div>
                <p className="text-sm text-blue-100">Ingresos durante el programa</p>
              </div>

              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg mb-2 border-2 border-white">
                  <p className="text-3xl md:text-4xl font-bold">{costeNeto.toLocaleString()}€</p>
                </div>
                <p className="text-sm font-semibold">Coste Neto Real</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 text-center">
              <p className="text-blue-100 mb-2">
                <strong>Retorno de inversión inmediato:</strong> Los profesionales cualificados tienen salarios entre 35.000€ y 55.000€ anuales en sus primeros años de experiencia.
              </p>
            </div>
          </div>
        </div>

        {/* Beneficios adicionales */}
        <div className="mt-8 md:mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-[#006cff]" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Sin Renunciar a tu Estabilidad</h4>
            <p className="text-sm text-gray-600">Ingresos garantizados mientras te formas</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-[#006cff]" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Experiencia Real desde Día 1</h4>
            <p className="text-sm text-gray-600">Trabajarás en proyectos reales del sector</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-[#006cff]" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Red Profesional Garantizada</h4>
            <p className="text-sm text-gray-600">Conexiones directas con empresas líderes</p>
          </div>
        </div>
      </div>
    </section>
  )
}
