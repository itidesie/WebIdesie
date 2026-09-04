/**
 * Contenido del Máster BIM Online.
 *
 * Forma propia, NO la de `mbim-content.ts` / `mbbe-content.ts` / `embim-content.ts`
 * (esas alimentan los "7 movimientos" compartidos en `components/programa/`).
 * Esta página tiene su propia narrativa ("La Red") y sus propios componentes en
 * `components/mbim-online/`, así que su contenido vive en una forma que encaja
 * con esos componentes, no con los ajenos.
 *
 * Ninguna cifra de este archivo está inventada. Todas vienen de:
 *   - el contenido previo de esta misma página (antes de este rediseño), o
 *   - `app/mbim-page/mbim-content.ts` cuando el dato es objetivamente compartido
 *     (el temario base y las salidas profesionales son el mismo programa, solo
 *     cambia la modalidad de impartición), o
 *   - `components/programa/proof-panel.tsx`, que documenta la acreditación real
 *     (Cualificam / Madri+d / ENQA / EQAR) ya verificada para MBIM/MBBE/EMBIM.
 *
 * Precio y estado de Cualificam: la página original tenía tres cifras de precio
 * contradictorias (8.500 € en la FAQ; 4.500→3.800 € en la sección de compra) y
 * daba la certificación Cualificam por "opcional" en una cifra y por incluida
 * en la FAQ. Se resolvió con el par 4.500→3.800 € y Cualificam incluida — ver
 * el plan de rediseño para el razonamiento. Pendiente de confirmación del
 * cliente si alguna vez se cambia.
 */

export const hero = {
  eyebrow: "Máster BIM Online · 100 % remoto · 12 meses",
  titleTop: "El modelo no tiene sede.",
  titleBottom: "Tú tampoco deberías.",
  intro:
    "Fórmate como BIM Manager desde donde estés, conectado al mismo modelo, a los mismos mentores y a la misma bolsa de +200 empresas que el máster presencial.",
  image: "/images/mbim_online_hero_image.jpg",
  imageAlt: "Profesional conectado en remoto trabajando sobre un modelo BIM compartido",
  ctaHref: "#acceso",
  ctaLabel: "Solicitar información",
}

/** Movimiento único de la banda de cifra: la red es el argumento, no la duración. */
export const stat = {
  value: 200,
  suffix: "+",
  label: "empresas en la bolsa de empleo de IDESIE",
  claim:
    "La misma red de contactos del máster presencial, disponible estés donde estés cuando termines.",
  facts: [
    { value: "12 meses", label: "de programa" },
    { value: "15–20h", label: "de dedicación semanal, a tu ritmo" },
    { value: "18 meses", label: "de acceso a los materiales" },
  ],
}

/**
 * Sustituye a "el día partido" del presencial (mañana obra / tarde aula), que
 * no tiene sentido aquí: el online no tiene un día fijo, esa es la venta.
 * Tres patrones reales conviviendo a la vez, no un díptico de dos mitades.
 */
export const weeklyPatterns = [
  {
    name: "Antes del turno",
    role: "Delineante en un estudio de arquitectura",
    note: "Dos horas cada madrugada, antes de entrar a trabajar.",
    pattern: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: "Entre proyectos",
    role: "Arquitecta técnica freelance",
    note: "Sesiones largas los días sin entregas, ninguna los días con cliente.",
    pattern: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  },
  {
    name: "Otro huso horario",
    role: "Ingeniero civil en Latinoamérica",
    note: "Clases en directo por la tarde-noche de España, mañana en su país.",
    pattern: [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  },
]

/**
 * Mismo temario que ya tenía la página (curricularmente real, sin cambios de
 * contenido). Solo cambia cómo se presenta: como nodos de un grafo que
 * convergen en el Proyecto Fin de Máster, no como una cuadrícula de tarjetas.
 */
export const modules = [
  {
    num: "01",
    title: "Fundamentos BIM",
    subtitle: "Conceptos esenciales, estándares y metodología.",
    items: [
      "Fundamentos de la metodología BIM",
      "Trabajo colaborativo en entornos de datos comunes (CDE)",
      "Protocolos y estándares internacionales (ISO 19650)",
    ],
  },
  {
    num: "02",
    title: "BIM Design",
    subtitle: "Modelado arquitectónico, estructural y MEP.",
    items: [
      "Modelado de arquitectura y estructuras con Revit",
      "Modelado de instalaciones (MEP)",
      "Coordinación de modelos multidisciplinares con Navisworks",
      "Mediciones y presupuestos automatizados",
    ],
  },
  {
    num: "03",
    title: "BIM Construction",
    subtitle: "Planificación y control de ejecución con modelos 4D/5D.",
    items: [
      "Planificación y control de ejecución con modelos 4D/5D",
      "Optimización de recursos, tiempos y costes",
      "Coordinación digital en obra",
    ],
  },
  {
    num: "04",
    title: "BIM Civil",
    subtitle: "Infraestructuras y entornos urbanos.",
    items: ["Diseño y modelado de carreteras, puentes y entornos urbanos con Civil 3D e InfraWorks"],
  },
  {
    num: "05",
    title: "BIM Facility Management",
    subtitle: "Gestión de mantenimiento preventivo.",
    items: ["Explotación de modelos digitales en tiempo real durante la vida útil del edificio"],
  },
  {
    num: "06",
    title: "BIM Project Management",
    subtitle: "Gestión integral del proyecto.",
    items: ["Planes de gerencia, planificación de recursos y cronogramas, control de costes y contratos"],
  },
  {
    num: "07",
    title: "Talent",
    subtitle: "Habilidades directivas.",
    items: [
      "Comunicación efectiva en entornos multidisciplinares",
      "Gestión de equipos y resolución de conflictos",
      "Liderazgo en transformación digital",
    ],
  },
  {
    num: "08",
    title: "Innovation",
    subtitle: "Tecnologías emergentes.",
    items: [
      "Power BI para visualización y análisis de datos de proyecto",
      "IA y machine learning aplicados a procesos BIM",
      "Automatización con Dynamo y Python",
    ],
  },
  {
    num: "09",
    title: "Proyecto Fin de Máster",
    subtitle: "Proyecto integral en BIM.",
    items: [
      "Modelado integral de un proyecto real",
      "Coordinación multidisciplinar",
      "Presentación y defensa ante tribunal profesional",
    ],
    featured: true,
  },
]

/**
 * Acreditación. Añadió Cualificam/Madri+d/ENQA/EQAR (la FAQ los prometía,
 * pero la página no los mostraba — ver hallazgo 4 del plan) manteniendo AEEN
 * y EUPHE, que son reales y exclusivos de esta página y de la home.
 *
 * 🔴 2026-09-05 — retirado el bloque `cualificam`: esa certificación es
 * EXCLUSIVA del MBIM (Máster BIM Full Time), no del Online — hallazgo del
 * cliente, ver CLAUDE.md §5. La franja "La prueba" se mantiene con AEEN y
 * EUPHE (`TrustBar` ya soporta `cualificam` opcional).
 */
export const trust = {
  eyebrow: "Acreditación",
  title: "El mismo título, la misma garantía.",
  partners: [
    { logo: "/images/Logo-AEEN.png", alt: "AEEN — Asociación Española de Escuelas de Negocios", name: "AEEN" },
    { logo: "/images/euphe-logo.webp", alt: "EUPHE — European Union of Private Higher Education", name: "EUPHE" },
  ],
}

/** Mismos roles y rangos salariales que `mbim-content.ts` — el mercado de
 *  salida es el mismo programa, cambia solo la modalidad de estudio. */
export const outcomes = [
  { rol: "BIM Modeler", salario: "28.000 – 35.000 €", nota: "Modelado y producción" },
  { rol: "BIM Coordinator", salario: "35.000 – 45.000 €", nota: "Coordinación multidisciplinar" },
  { rol: "Especialista MEP", salario: "32.000 – 42.000 €", nota: "Instalaciones" },
  { rol: "Project Manager Junior", salario: "35.000 – 50.000 €", nota: "Gestión de proyecto" },
]

export const pricing = {
  priceOriginal: "4.500 €",
  price: "3.800 €",
  discountLabel: "16 % de descuento en pago único",
  note: "IVA incluido. O fracciónalo en hasta 12 cuotas sin intereses.",
  includes: [
    "12 meses de formación 100 % online",
    "Acceso a la bolsa de empleo con +200 empresas",
    // 2026-09-05 — corregido: la certificación Cualificam es exclusiva del
    // MBIM, no del Online. Antes decía "Título IDESIE + certificación
    // Cualificam". Ver CLAUDE.md §5.
    "Título IDESIE",
    "18 meses de acceso a los materiales",
    "Tutoría personalizada",
    "Proyecto Fin de Máster con defensa ante tribunal",
  ],
  purchaseHref: "/producto/master-bim-online",
  catalogId: "mbim-online",
  catalogName: "Máster BIM Online",
}

export const faqs = [
  {
    question: "¿El máster es 100 % online?",
    answer:
      "Sí, el Máster BIM Online es completamente online. Accedes a clases, materiales y sesiones en directo desde cualquier lugar, adaptando el aprendizaje a tu horario.",
  },
  {
    question: "¿Tengo acceso a la bolsa de empleo de IDESIE?",
    answer:
      "Sí, como alumno del Máster BIM Online tienes acceso completo a la bolsa de empleo de IDESIE. Colaboramos con más de 200 empresas del sector AEC.",
  },
  {
    question: "¿Cuánto cuesta el Máster BIM Online?",
    answer:
      "El programa cuesta 3.800 € en pago único (16 % de descuento sobre 4.500 €), o puedes fraccionarlo en hasta 12 cuotas sin intereses. Contáctanos para becas e información personalizada.",
  },
  {
    question: "¿Hay prácticas en el Máster BIM Online?",
    answer:
      "El Máster BIM Online no incluye prácticas remuneradas como el presencial. Sí tienes acceso a la bolsa de empleo de IDESIE para encontrar oportunidades al finalizar.",
  },
  {
    question: "¿Cuál es la duración del programa?",
    answer:
      "12 meses, con una dedicación estimada de 15–20 horas semanales. Tienes acceso a los materiales durante 18 meses para repasar contenidos a tu ritmo.",
  },
  {
    question: "¿Qué certificaciones obtendré?",
    // 2026-09-05 — corregido: la certificación Cualificam es exclusiva del
    // MBIM (Máster BIM Full Time), no del Online. Ver CLAUDE.md §5.
    answer:
      "El Título de Máster BIM de IDESIE. La certificación Cualificam de la Fundación para el Conocimiento Madri+d es exclusiva del Máster BIM Full Time (MBIM) — no está incluida en la modalidad online.",
  },
  {
    question: "¿Qué salidas profesionales tiene este máster?",
    answer:
      "BIM Modeler (28.000–35.000 €), BIM Coordinator (35.000–45.000 €), Especialista MEP (32.000–42.000 €) o Project Manager Junior (35.000–50.000 €). La bolsa de empleo te conecta con las oportunidades del sector.",
  },
  {
    question: "¿Necesito conocimientos previos?",
    answer:
      "Se recomienda titulación universitaria en Ingeniería, Arquitectura o equivalente. Conocimientos básicos de AutoCAD ayudan, pero no son obligatorios.",
  },
]
