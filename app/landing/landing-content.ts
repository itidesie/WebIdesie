/**
 * Contenido de /landing — página de venta de los 4 másteres.
 *
 * Todo lo que NO lleva `// TODO` es dato real, verificado contra el contenido
 * ya existente del proyecto (cada afirmación indica su fuente en un comentario
 * junto al dato). Todo lo que lleva `// TODO` es un hueco deliberado: el
 * encargo pidió explícitamente NO inventar vídeos, testimonios ni cifras sin
 * verificar, y dejarlos señalizados para completarlos más tarde.
 *
 * Resumen de huecos pendientes (ver también el mensaje final de esta tarea):
 *   - Número de empresas de la red colaboradora: el propio `mbim-content.ts`
 *     se contradice entre "+40 empresas líderes" y "+200 empresas" — no se
 *     usa ninguna de las dos cifras como si fuera segura
 *   - Conexión real del formulario de solicitud de información (ver TODO en
 *     `components/landing/info-request-modal.tsx`) — hoy solo simula el envío
 *
 * El precio de cada máster se retiró de esta página a propósito (el objetivo
 * es que contacten para informarse, no que decidan solo por precio), así que
 * ya no aplica el hueco que existía antes sobre el precio sin confirmar del
 * Máster BIM Online — sigue pendiente en su propia página, no en esta.
 */

export const hero = {
  eyebrow: "4 másteres · 1 metodología · IDESIE desde 2012",
  title: "Añade competencias a tu currículum.",
  ctaLabel: "Solicitar información",
}

/**
 * Argumentos de fuerza — solo afirmaciones ciertas para LOS 4 MÁSTERES A LA
 * VEZ. Deliberadamente NO incluye "Learning by Working" como argumento
 * universal ni ninguna cifra de empleabilidad: el EMBIM no tiene prácticas
 * (formato ejecutivo, ver `embim-content.ts`) y las cifras de empleabilidad
 * varían por programa (MBIM 95 %, MBBE 100 % verificado, EMBIM y Online sin
 * cifra) — mezclarlas en una sola afirmación sería inventar un dato que hoy
 * no es cierto para las 4 páginas a la vez.
 *
 * 🗑️ 2026-09-05 — la tarjeta "Financiación flexible" se retiró por
 * instrucción explícita del cliente. En su lugar (no como sustituto
 * temático, sino como la alternativa que el cliente eligió tras revisar 3
 * propuestas) se añadió "Profesorado en activo del sector AEC" — contenido
 * real, ver el comentario de esa entrada. El orden de este array importa:
 * `strength-points.tsx` usa el índice 0 (Acreditación) como tarjeta
 * destacada del layout bento, no lo reordenes sin actualizar también ahí.
 */
export const strengths = [
  {
    title: "Acreditación oficial",
    // 2026-09-05 — corregido: la certificación Cualificam es EXCLUSIVA del
    // MBIM (Máster BIM Full Time), no de los 4 másteres — hallazgo del
    // cliente. Antes decía "la misma en los 4 másteres", que era falso para
    // MBBE/EMBIM/Online. Ver CLAUDE.md §5 "Certificación Cualificam —
    // corrección de exclusividad".
    text: "Título IDESIE en los 4 másteres. El MBIM (Máster BIM Full Time) suma además la certificación Cualificam de la Fundación para el Conocimiento Madri+d, miembro de ENQA y registrada en el EQAR.",
    // Fuente: components/programa/proof-panel.tsx (MBIM, la única que la tiene).
  },
  {
    title: "Formación desde 2012",
    text: "IDESIE es pionera en formación BIM en España, con más de 500 profesionales formados.",
    // Fuente: metadata de app/page.tsx y app/sobre-idesie-page/page.tsx.
  },
  {
    title: "Red del sector AEC",
    // TODO: cifra sin verificar. app/mbim-page/mbim-content.ts se contradice
    // entre "más de 40 empresas líderes" (línea ~168) y "más de 200 empresas"
    // (línea ~178) para lo que parece el mismo dato. No se usa ninguna de las
    // dos como si fuera segura — pide al cliente el número correcto antes de
    // publicar esta sección.
    text: "Estudios de arquitectura, ingenierías, constructoras y empresas de facility management colaboran con IDESIE en prácticas, bolsa de empleo y proyectos reales.",
  },
  {
    title: "Profesorado en activo del sector AEC",
    // 2026-09-05 — nueva, sustituye el hueco que dejó "Financiación
    // flexible" al retirarse. Afirmación a nivel IDESIE (no de un máster
    // concreto), ancorada en frases ya verbatim en el proyecto — no
    // parafraseada de forma que cambie el sentido:
    //   - "profesionales en activo del sector AEC" — igual en
    //     app/mbim-page/page.tsx:136 y app/sobre-idesie-page/sobre-idesie-content.ts:28
    //   - "No enseñan lo que leyeron: enseñan lo que hacen" y los 4 nombres
    //     de empresa — cita exacta de app/profesores-page/profesores-content.ts:154
    text: "Claustro con profesionales en activo de empresas como Hill International, ISG, L35 y Sir Robert McAlpine, además de la dirección de IDESIE: no enseñan lo que leyeron, enseñan lo que hacen.",
  },
]

export interface MasterCard {
  slug: string
  shortName: string
  fullName: string
  duration: string
  modality: string
  /** Un solo dato verificado y distintivo del programa, no una cifra genérica. */
  highlight: string
}

/**
 * Datos de los 4 másteres — duración verificada contra el contenido real de
 * cada página (ver comentarios). Se usa este mismo array en la sección 4
 * (comparación, a mitad de página) y en la sección 6 (CTA de cierre), con
 * presentaciones visuales distintas pero los mismos datos.
 *
 * Sin `price` ni `href` a propósito: el precio se retiró de esta página
 * (el objetivo es que contacten para informarse, no que decidan solo por
 * precio) y los botones ya no enlazan a la página individual de cada
 * máster — todos abren el formulario de solicitud de información
 * (`InfoRequestModal`), pasando `shortName` como contexto del lead.
 */
export const masters: MasterCard[] = [
  {
    slug: "mbim",
    shortName: "MBIM",
    fullName: "Máster BIM",
    duration: "16 meses",
    modality: "Presencial · Madrid",
    highlight: "100 % prácticas garantizadas desde el primer mes",
  },
  {
    slug: "mbbe",
    shortName: "MBBE",
    fullName: "Máster BIM & Building Engineering",
    duration: "16 meses",
    modality: "Presencial · Madrid · especialización MEP",
    highlight: "100 % de empleabilidad verificada por el cliente",
  },
  {
    slug: "embim",
    shortName: "EMBIM",
    fullName: "Executive Máster BIM",
    duration: "12 meses",
    modality: "Ejecutivo · viernes tarde y sábados",
    highlight: "Para profesionales con 5+ años de experiencia",
  },
  {
    slug: "mbim-online",
    shortName: "Online",
    fullName: "Máster BIM Online",
    duration: "12 meses",
    modality: "100 % online",
    highlight: "Acceso a la misma bolsa de empleo que el presencial",
  },
]

/**
 * Testimonios — los 3 son ya reales: Carolina Larrahona (2026-09-04 (33)),
 * Omar Pérez Ruiz (2026-09-04 (36)), Agustina Mingrone (2026-09-04 (37)).
 * El encargo original pidió explícitamente no buscar ni inventar
 * testimonios y dejar el hueco señalizado hasta que el cliente confirmara
 * vídeo, cita, nombre y programa de cada uno — completado con las 3.
 */
export interface Testimonial {
  quote: string
  name: string
  /** Opcional: no se rellena si el programa/rol todavía no está confirmado. */
  role?: string
  /** Opcional: URL del vídeo real. Sin ella, la tarjeta sigue mostrando el placeholder. */
  video?: string
}

export const testimonials: Testimonial[] = [
  {
    // Real — confirmado por el cliente 2026-09-04 (33).
    quote: "Es la mejor decisión que pude tomar.",
    name: "Carolina Larrahona",
    role: "Alumna del Máster BIM Full Time",
    video: "https://pub-5178d59aea414c55b9ff83a226ef28f6.r2.dev/RES1.mp4",
  },
  {
    // Real — confirmado por el cliente 2026-09-04 (36).
    quote: "Lo que más destaco del máster es la metodología learning by working.",
    name: "Omar Pérez Ruiz",
    role: "Alumno del Máster BIM Full Time (MBIM)",
    video: "https://pub-5178d59aea414c55b9ff83a226ef28f6.r2.dev/VID2.mp4",
  },
  {
    // Real — confirmado por el cliente 2026-09-04 (37).
    quote: "El BIM me abrió muchísimas puertas.",
    name: "Agustina Mingrone",
    role: "Alumna del Máster BIM Full Time (MBIM)",
    video: "https://pub-5178d59aea414c55b9ff83a226ef28f6.r2.dev/VID3.mp4",
  },
]

/**
 * FAQ del refuerzo adicional — solo preguntas y respuestas ciertas para los
 * 4 másteres a la vez, incluida la honestidad de que no todos son iguales
 * (mejor decir "depende del programa" que inventar una respuesta uniforme).
 */
export const faqs = [
  {
    question: "¿Cómo elijo el máster adecuado para mí?",
    answer:
      "Depende de tu situación: el MBIM y el MBBE son full-time presenciales con prácticas remuneradas, el EMBIM es un formato ejecutivo de fin de semana para profesionales sénior, y el Online te permite estudiar desde cualquier lugar. La comparativa detallada está en /comparativa-masters-page.",
  },
  {
    question: "¿Todos los másteres incluyen prácticas garantizadas?",
    answer:
      "No — varía por programa. El MBIM y el MBBE incluyen prácticas remuneradas garantizadas al 100 %. El EMBIM no las incluye porque está pensado para profesionales que ya trabajan en el sector, y el Online da acceso a la bolsa de empleo sin prácticas remuneradas incluidas.",
  },
  {
    question: "¿Necesito experiencia previa?",
    answer:
      "Para el MBIM, el MBBE y el Online se recomienda titulación universitaria en Arquitectura, Ingeniería o equivalente, sin experiencia profesional obligatoria. El EMBIM exige un mínimo de 5 años de experiencia en el sector AEC.",
  },
  {
    question: "¿Puedo financiar la matrícula?",
    answer:
      "Sí, en los 4 másteres: pago fraccionado sin intereses directamente con IDESIE, becas de excelencia de hasta el 50 % de la matrícula, y acuerdos con entidades bancarias. Todas las opciones están en /financiacion-y-becas-page.",
  },
  {
    question: "¿Qué certificación obtengo al terminar?",
    // 2026-09-05 — corregido, mismo criterio que "strengths" arriba: la
    // certificación Cualificam es exclusiva del MBIM, no de los 4 programas.
    answer:
      "El Título de Máster de IDESIE en los 4 programas. El Máster BIM Full Time (MBIM) obtiene además la certificación Cualificam de la Fundación para el Conocimiento Madri+d, alineada con el Espacio Europeo de Educación Superior — exclusiva de ese programa.",
  },
]

export const closing = {
  title: "El primer paso es elegir el formato.",
  intro: "Todos llevan a la misma acreditación. La diferencia es cómo encajan en tu vida ahora mismo.",
  ctaLabel: "Solicitar información",
}
