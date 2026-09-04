import { CheckCircle2, User } from "lucide-react"
import { sanitizeHtml } from "@/lib/sanitize-html"

interface Modulo {
  id: number
  titulo: string
  descripcion: string | null
  temas: string[]
}

interface Faq {
  id: number
  pregunta: string
  respuesta: string
}

interface Testimonio {
  id: number
  nombre: string
  cargo: string | null
  testimonio: string
}

interface FichaContentProps {
  tipo: string
  descripcionLarga: string | null
  modulos: Modulo[]
  dirigidoA: string[]
  objetivos: string[]
  requisitos: string[]
  testimonios: Testimonio[]
  faqs: Faq[]
}

/**
 * Todas las secciones se montan siempre — antes vivían detrás de pestañas
 * que solo pintaban la activa en el DOM (`{activeTab === 'x' && (...)}`),
 * dejando 6 de cada 7 invisibles para quien no hacía clic y para cualquier
 * rastreador. La navegación lateral (AnchorNav) solo hace scroll a estas
 * secciones, no decide qué existe.
 *
 * 🔒 2026-09-04 (43) — hallazgo colateral de la auditoría de seguridad,
 * cerrado explícitamente a petición del cliente: `descripcionLarga` se
 * renderizaba con `dangerouslySetInnerHTML` sin sanitizar — mismo perfil
 * de riesgo que tenía el blog antes de (42) (mismo editor,
 * `RichTextEditor`, en `/admin/tienda`). Se reutiliza `sanitizeHtml()` tal
 * cual, sin allowlist nueva — es el mismo editor que ya la tenía calibrada.
 */
export function FichaContent({
  tipo,
  descripcionLarga,
  modulos,
  dirigidoA,
  objetivos,
  requisitos,
  testimonios,
  faqs,
}: FichaContentProps) {
  return (
    <div className="space-y-16">
      <section id="descripcion" className="catalogo-ficha-section">
        <h2 className="catalogo-eyebrow mb-3">Descripción</h2>
        <h3 className="text-2xl font-bold text-gray-950 mb-6">Sobre este {tipo}</h3>
        {descripcionLarga ? (
          <div
            className="prose prose-gray max-w-none
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-3
              [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-5 [&_h3]:mb-2
              [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
              [&_li]:text-gray-700 [&_li]:mb-1.5"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(descripcionLarga) }}
          />
        ) : (
          <p className="text-gray-600">
            Descubre todo lo que incluye este {tipo} y cómo puede ayudarte a alcanzar tus objetivos profesionales.
          </p>
        )}
      </section>

      {modulos.length > 0 && (
        <section id="programa" className="catalogo-ficha-section">
          <h2 className="catalogo-eyebrow mb-3">Programa</h2>
          <h3 className="text-2xl font-bold text-gray-950 mb-6">Módulos del programa</h3>
          <div className="space-y-3">
            {modulos.map((modulo, index) => (
              <div key={modulo.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-start gap-4 p-5 bg-gray-50">
                  <span className="catalogo-mono text-sm font-bold text-[#006cff] flex-shrink-0 pt-0.5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-900">{modulo.titulo}</h4>
                    {modulo.descripcion && <p className="text-sm text-gray-600 mt-1">{modulo.descripcion}</p>}
                  </div>
                </div>
                {modulo.temas.length > 0 && (
                  <ul className="p-5 space-y-2">
                    {modulo.temas.map((tema, tIndex) => (
                      <li key={tIndex} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <span className="w-1 h-1 rounded-full bg-[#006cff] mt-2 flex-shrink-0" />
                        {tema}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {dirigidoA.length > 0 && (
        <section id="dirigido" className="catalogo-ficha-section">
          <h2 className="catalogo-eyebrow mb-3">Perfil</h2>
          <h3 className="text-2xl font-bold text-gray-950 mb-6">¿A quién va dirigido?</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {dirigidoA.map((perfil, index) => (
              <div key={index} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <User className="w-4 h-4 text-[#006cff] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-800">{perfil}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {objetivos.length > 0 && (
        <section id="objetivos" className="catalogo-ficha-section">
          <h2 className="catalogo-eyebrow mb-3">Objetivos</h2>
          <h3 className="text-2xl font-bold text-gray-950 mb-6">Qué vas a conseguir</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {objetivos.map((objetivo, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border-l-2 border-[#006cff] bg-gray-50">
                <span className="catalogo-mono text-xs font-bold text-[#006cff] flex-shrink-0 pt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-gray-800">{objetivo}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {requisitos.length > 0 && (
        <section id="requisitos" className="catalogo-ficha-section">
          <h2 className="catalogo-eyebrow mb-3">Requisitos</h2>
          <h3 className="text-2xl font-bold text-gray-950 mb-6">Qué necesitas para empezar</h3>
          <ul className="space-y-2.5">
            {requisitos.map((requisito, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-[#006cff] flex-shrink-0 mt-0.5" />
                {requisito}
              </li>
            ))}
          </ul>
        </section>
      )}

      {testimonios.length > 0 && (
        <section id="testimonios" className="catalogo-ficha-section">
          <h2 className="catalogo-eyebrow mb-3">Testimonios</h2>
          <h3 className="text-2xl font-bold text-gray-950 mb-6">Lo que dicen nuestros alumnos</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {testimonios.map((testimonio) => (
              <div key={testimonio.id} className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <p className="text-gray-700 mb-4 leading-relaxed">&ldquo;{testimonio.testimonio}&rdquo;</p>
                <p className="font-bold text-sm text-gray-900">{testimonio.nombre}</p>
                {testimonio.cargo && <p className="text-xs text-gray-500">{testimonio.cargo}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section id="faqs" className="catalogo-ficha-section">
          <h2 className="catalogo-eyebrow mb-3">FAQ</h2>
          <h3 className="text-2xl font-bold text-gray-950 mb-6">Preguntas frecuentes</h3>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <details key={faq.id} className="group bg-gray-50 rounded-lg border border-gray-200">
                <summary className="p-5 cursor-pointer font-semibold text-gray-900 list-none flex items-center justify-between">
                  {faq.pregunta}
                  <span className="text-[#006cff] group-open:rotate-45 transition-transform text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm text-gray-700 leading-relaxed">{faq.respuesta}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
