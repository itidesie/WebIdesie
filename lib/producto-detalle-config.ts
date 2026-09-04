/**
 * Configuración declarativa de las 5 tablas de detalle que comparten la
 * misma forma (`producto_id`, 1-3 campos de texto, `orden`) — ver
 * `scripts/023_producto_detalle_tables.sql`. Un único componente
 * (`components/tienda/lista-editor.tsx`) y un único juego de Server Actions
 * (`app/tienda/detalle-actions.ts`) sirven a las 5 leyendo esta tabla, en
 * vez de 5 editores casi idénticos. `producto_modulos`/`modulo_temas`
 * quedan fuera: son las únicas con un nivel de anidación, con su propio
 * editor en `app/tienda/modulos-actions.ts` + `modulos-editor.tsx`.
 */

export type CampoTipo = "input" | "textarea"

export interface CampoDef {
  key: string
  label: string
  tipo: CampoTipo
  requerido: boolean
}

export type TablaDetalle =
  | "producto_dirigido"
  | "producto_objetivos"
  | "producto_requisitos"
  | "producto_faqs"
  | "producto_testimonios"

export interface ListaConfig {
  tabla: TablaDetalle
  etiqueta: string
  campos: CampoDef[]
  vacio: string
}

export const LISTAS_DETALLE = {
  dirigido: {
    tabla: "producto_dirigido",
    etiqueta: "Dirigido a",
    campos: [{ key: "perfil", label: "Perfil", tipo: "textarea", requerido: true }],
    vacio: "Sin perfiles todavía.",
  },
  objetivos: {
    tabla: "producto_objetivos",
    etiqueta: "Objetivos",
    campos: [{ key: "objetivo", label: "Objetivo", tipo: "textarea", requerido: true }],
    vacio: "Sin objetivos todavía.",
  },
  requisitos: {
    tabla: "producto_requisitos",
    etiqueta: "Requisitos",
    campos: [{ key: "requisito", label: "Requisito", tipo: "textarea", requerido: true }],
    vacio: "Sin requisitos todavía.",
  },
  faqs: {
    tabla: "producto_faqs",
    etiqueta: "FAQs",
    campos: [
      { key: "pregunta", label: "Pregunta", tipo: "input", requerido: true },
      { key: "respuesta", label: "Respuesta", tipo: "textarea", requerido: true },
    ],
    vacio: "Sin preguntas frecuentes todavía.",
  },
  testimonios: {
    tabla: "producto_testimonios",
    etiqueta: "Testimonios",
    campos: [
      { key: "nombre", label: "Nombre", tipo: "input", requerido: true },
      { key: "cargo", label: "Cargo (opcional)", tipo: "input", requerido: false },
      { key: "testimonio", label: "Testimonio", tipo: "textarea", requerido: true },
    ],
    vacio: "Sin testimonios todavía.",
  },
} as const satisfies Record<string, ListaConfig>

export type ListaKey = keyof typeof LISTAS_DETALLE

export const TABLAS_DETALLE_VALIDAS: TablaDetalle[] = Object.values(LISTAS_DETALLE).map((c) => c.tabla)

export function isTablaDetalleValida(tabla: string): tabla is TablaDetalle {
  return (TABLAS_DETALLE_VALIDAS as string[]).includes(tabla)
}

export function camposDeTabla(tabla: TablaDetalle): CampoDef[] {
  const config = Object.values(LISTAS_DETALLE).find((c) => c.tabla === tabla)
  if (!config) throw new Error(`Tabla de detalle desconocida: ${tabla}`)
  return [...config.campos]
}
