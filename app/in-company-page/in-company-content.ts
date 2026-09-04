/**
 * Contenido de In Company ("El Plano").
 *
 * Forma propia, no la de `mbim-content.ts` ni la de `mbim-online-content.ts`:
 * esta página nunca perteneció a la familia de másteres, es un servicio B2B
 * con su propio concepto (la formación se mide como un plano técnico).
 *
 * Ninguna cifra está inventada:
 *   - "+50 empresas" ya existía en el `metadata` de la página anterior mas
 *     nunca se mostraba en el cuerpo — se rescata aquí como cifra ancla.
 *   - Los 3 formatos de entrega y las razones de elegir IDESIE vienen del
 *     contenido real anterior (`benefits` + `keyPoints`), consolidados para
 *     no repetir el mismo mensaje dos veces.
 *   - No hay logos de empresas cliente ni casos de éxito: no existe ese
 *     listado en el proyecto y no se fabrica uno. Ver la auditoría del plan
 *     de rediseño para el razonamiento completo.
 */

export const hero = {
  eyebrow: "Formación BIM In Company",
  titleTop: "Medimos tu empresa",
  titleBottom: "antes de diseñar el programa.",
  intro:
    "Nada de temario genérico: analizamos tus proyectos, el nivel de tu equipo y tus objetivos para acotar un programa de formación BIM a tu medida exacta.",
  image: "/images/in_company_hero_image.jpg",
  imageAlt: "Equipo de profesionales colaborando en formación BIM in-company en oficina moderna",
  ctaHref: "/contact-page",
  ctaLabel: "Solicitar diagnóstico",
}

/** Cifra rescatada del metadata: era real pero nunca se mostraba en el cuerpo. */
export const stat = {
  value: 50,
  suffix: "+",
  label: "empresas ya han confiado en la formación in-company de IDESIE",
  facts: [
    { value: "In-situ", label: "en tus instalaciones" },
    { value: "En IDESIE", label: "en nuestras aulas equipadas" },
    { value: "Online", label: "vía Campus Virtual" },
  ],
}

/**
 * Responde a la pregunta que la página nunca contestaba: "¿cómo se llega a
 * ese programa a medida?". Sustituye a las 3 tarjetas de icono genérico
 * (Proyectos Reales / 100% Personalizado / Plan Estratégico), que describían
 * el resultado sin explicar el proceso.
 */
export const process = [
  {
    num: "01",
    title: "Diagnóstico",
    text: "Analizamos vuestros proyectos reales, el nivel técnico del equipo y los objetivos estratégicos de la organización.",
  },
  {
    num: "02",
    title: "Diseño a medida",
    text: "Acotamos un temario propio sobre esa base: no hay dos programas iguales porque no hay dos empresas iguales.",
  },
  {
    num: "03",
    title: "Entrega",
    text: "Formadores en vuestras instalaciones, en nuestras aulas equipadas, u online a través del Campus Virtual — lo que mejor encaje en el calendario del equipo.",
  },
  {
    num: "04",
    title: "Medición",
    text: "El programa se diseñó contra objetivos concretos, así que el resultado se puede medir contra ellos.",
  },
]

/** Mismo dato que el bloque "Máxima Flexibilidad" anterior, sin cambios. */
export const deliveryModes = [
  { title: "En tu empresa", note: "Nuestro equipo se desplaza a vuestras instalaciones." },
  { title: "En nuestras aulas", note: "Espacios equipados para formación intensiva presencial." },
  { title: "Online", note: "A través del Campus Virtual, con la misma exigencia práctica." },
]

/**
 * Fusiona `benefits` (4 tarjetas) y `keyPoints` (6 bullets) de la versión
 * anterior — decían lo mismo con palabras distintas (ver hallazgo 2 de la
 * auditoría). Una sola lista, sin repetir mensaje.
 */
export const reasons = [
  {
    title: "Proyectos reales, no casos de ejemplo",
    text: "Desde el primer día el equipo aplica las herramientas BIM sobre vuestros propios proyectos.",
  },
  {
    title: "100 % a medida",
    text: "El temario, el ritmo y el nivel se diseñan para vuestro sector y vuestra tipología de proyectos — no hay un programa estándar.",
  },
  {
    title: "Aplicación inmediata",
    text: "Herramientas y procesos operativos desde el primer día, no al final del curso.",
  },
  {
    title: "Máxima flexibilidad de formato",
    text: "In-situ, en nuestras aulas u online — el calendario lo marca vuestra operación, no al revés.",
  },
]

// 2026-09-05 — `trust` (franja "Respaldo institucional") eliminado: solo
// mostraba la certificación Cualificam, exclusiva del MBIM entre los 4
// másteres — In Company ni siquiera es uno de ellos. No hay ningún otro
// sello real documentado para In Company. Ver CLAUDE.md §5 y el comentario
// de cabecera de `in-company-client.tsx`.

export const closing = {
  title: "¿Hablamos de tu proyecto?",
  intro:
    "Cuéntanos los retos de tu empresa y diseñaremos juntos un programa de formación BIM medido a tu equipo.",
  ctaHref: "/contact-page",
  ctaLabel: "Solicitar diagnóstico",
  note: "Responderemos en menos de 24 horas.",
}
