/**
 * Contenido del Executive Master BIM (EMBIM), separado del layout.
 *
 * **Este programa es el más distinto de los tres.** No copies nada del MBIM ni
 * del MBBE:
 *  · 12 meses, no 16.  · 18.000 €, no 15.000 €.  · 10 módulos, no 9 ni 5.
 *  · Exige 5+ años de experiencia previa.
 *  · **NO tiene Learning by Working ni prácticas remuneradas.** El alumno
 *    conserva su empleo sénior; las clases son viernes tarde y sábado mañana.
 *  · **No hay cifra de empleabilidad** en ninguna parte del contenido original.
 *
 * Todos los datos salen del contenido previo de la página o de sus FAQ.
 */

import type { Modulo } from "@/app/mbim-page/mbim-content"

export type { Modulo }

/**
 * Diez módulos agrupados en tres fases propias del formato ejecutivo.
 * MBIM usa Fundamentos/Ejecución/Liderazgo y MBBE Técnica/Gestión/Cierre.
 */
export const modulos: Modulo[] = [
  {
    num: "01",
    title: "Fundamentos y Metodología BIM",
    subtitle: "Bases estratégicas y estándares ISO 19650.",
    fase: "Fundamentos",
    text: "Bases BIM, modelo de datos, interoperabilidad, organización de modelos, trabajo colaborativo, Common Data Environment, estándares y protocolos ISO 19650.",
    items: [
      "BIM en contexto empresarial",
      "Estándares ISO 19650 — aplicación empresarial",
      "BEP a nivel estratégico",
      "Modelo de datos y estructuración",
      "Trabajo colaborativo en CDE",
      "Roles organizacionales",
    ],
  },
  {
    num: "02",
    title: "BIM Design",
    subtitle: "Gestión avanzada de proyectos BIM.",
    fase: "Fundamentos",
    text: "BIM Execution Plan, organización de proyectos y trabajo colaborativo, modelado para mediciones 5D y planificación 4D, automatización con Dynamo, coordinación y revisión de modelos.",
    items: [
      "Organización de proyectos complejos",
      "BIM Execution Plan detallado",
      "Modelado para mediciones 5D",
      "Modelado para planificación 4D",
      "Automatización con Dynamo avanzado",
      "Coordinación multiempresa",
    ],
  },
  {
    num: "03",
    title: "BIM Construction",
    subtitle: "VDC y gestión de construcción digital.",
    fase: "Ejecución",
    text: "Modelos BIM/VDC para construcción, BIM Execution Plan específico, procesos de licitación y pre-construcción, mediciones, planificación y certificación digital.",
    items: [
      "Modelos BIM/VDC para construcción",
      "Procesos de licitación BIM",
      "Pre-construcción virtual",
      "Mediciones y certificaciones digitales",
      "Control de costes 5D en tiempo real",
      "Gestión de campo con tecnología",
    ],
  },
  {
    num: "04",
    title: "BIM Civil",
    subtitle: "Infraestructuras y obra civil compleja.",
    fase: "Ejecución",
    text: "BIM en proyectos de ingeniería civil, licitaciones, diseño conceptual, modelado de infraestructuras (puertos, carreteras, ferrocarriles, obras hidráulicas), FIELD BIM.",
    items: [
      "BIM en licitaciones de infraestructuras",
      "Modelado de infraestructuras complejas",
      "Carreteras y viales urbanos",
      "Ferrocarriles y sistemas de transporte",
      "Obras hidráulicas complejas",
      "FIELD BIM — replanteo y control",
    ],
  },
  {
    num: "05",
    title: "BIM Facility Management",
    subtitle: "Gestión de activos y mantenimiento.",
    fase: "Ejecución",
    text: "Conceptos de Facility Management, dimensión 7D del BIM, aplicaciones especializadas para gestión de activos construidos y mantenimiento predictivo.",
    items: [
      "Estrategia de FM corporativa",
      "Dimensión 7D — gestión de activos",
      "Plataformas CAFM/IWMS empresariales",
      "Mantenimiento basado en condición",
      "Sostenibilidad y eficiencia energética",
    ],
  },
  {
    num: "06",
    title: "BIM Project Management",
    subtitle: "Dirección integrada y contratos.",
    fase: "Ejecución",
    text: "Plan de gerencia, planificación avanzada, presupuestos y contratación, gestión de riesgos, contratos internacionales FIDIC y CIOB.",
    items: [
      "Dirección integrada de proyectos",
      "Planificación avanzada",
      "Presupuestos y control financiero",
      "Gestión de riesgos empresarial",
      "Contratos internacionales FIDIC",
      "Contratos CIOB y otros estándares",
    ],
  },
  {
    num: "07",
    title: "Talent",
    subtitle: "Liderazgo estratégico y transformación.",
    fase: "Liderazgo",
    text: "Management skills avanzadas, estrategia empresarial, liderazgo de equipos multidisciplinares, gestión del cambio organizacional y transformación digital.",
    items: [
      "Liderazgo estratégico",
      "Estrategia empresarial",
      "Gestión del cambio organizacional",
      "Gestión de equipos multidisciplinares",
      "Influencia y negociación ejecutiva",
    ],
  },
  {
    num: "08",
    title: "Innovation",
    subtitle: "Tecnologías emergentes y datos.",
    fase: "Liderazgo",
    text: "Bases de datos relacionales, programación orientada a Revit con C#, realidad virtual y aumentada, business intelligence y big data aplicado a construcción.",
    items: [
      "Programación orientada a Revit con C#",
      "Realidad virtual y aumentada empresarial",
      "Business intelligence y big data",
      "IA y machine learning en AEC",
      "Digital twins empresariales",
    ],
  },
  {
    num: "09",
    title: "Soluciones BIM",
    subtitle: "Dominio avanzado de herramientas.",
    fase: "Liderazgo",
    text: "Dominio avanzado de herramientas especializadas: Revit, Navisworks, BIMcollab, BIM360, Presto, Synchro, Civil 3D, Lumion, Power BI, InfraWorks, Enscape y Tekla.",
    items: [
      "Revit y Navisworks — dominio avanzado",
      "BIMcollab y BIM360 / Construction Cloud",
      "Presto — gestión de costes",
      "Synchro — planificación 4D avanzada",
      "Civil 3D e InfraWorks",
      "Power BI — business intelligence",
    ],
  },
  {
    num: "10",
    title: "Proyecto Fin de Máster",
    subtitle: "Proyecto ejecutivo de alta complejidad.",
    fase: "Liderazgo",
    text: "Desarrollo de un proyecto BIM integral de alta complejidad, con defensa ante tribunal de expertos del sector.",
    items: [
      "Proyecto de alto nivel",
      "BEP corporativo",
      "Análisis de viabilidad",
      "Estrategia de implementación",
      "Defensa ejecutiva",
    ],
    featured: true,
  },
]

/**
 * Sustituye a las "fases de inserción laboral" del MBIM/MBBE, que aquí no
 * existen porque no hay prácticas: el alumno ya trabaja.
 *
 * Los tres hechos salen literalmente del contenido de la página:
 *  · Aplicación inmediata → FAQ "¿Puedo seguir trabajando mientras hago el
 *    Executive Master?"
 *  · Grupo de 25 y networking → FAQ "¿El programa incluye visitas a empresas o
 *    networking con el sector?" y el motivo "Diseñado para profesionales senior"
 *  · Masterclasses y visitas técnicas → la misma FAQ de networking
 */
export const ventajasFormato = [
  {
    fase: "En tu empresa",
    title: "Aplicación inmediata",
    text: "Se espera que apliques los conocimientos en tus proyectos desde el primer módulo. Muchos alumnos lideran implementaciones BIM en sus empresas durante el propio máster.",
  },
  {
    fase: "Con tus iguales",
    title: "Networking de alto nivel",
    text: "Grupo reducido de un máximo de 25 alumnos, todos profesionales sénior de empresas líderes del sector AEC. Las conexiones son parte del programa.",
  },
  {
    fase: "Con el sector",
    title: "Masterclasses y visitas técnicas",
    text: "Masterclasses con líderes del sector AEC, visitas técnicas a proyectos BIM de referencia y eventos de networking exclusivos.",
  },
]

/**
 * Salidas profesionales del EMBIM: las más altas de los tres programas.
 *
 * ⚠️ El Consultor Senior es **tarifa diaria de freelance**, no salario anual.
 * El campo `unidad` existe para que la ficha lo etiquete distinto y no se lea
 * como un sueldo. No lo mezcles con los otros tres sin esa distinción.
 *
 * Fuente: la FAQ "¿Qué salidas profesionales tiene y cuál es la proyección
 * salarial?" de la propia página.
 */
export interface SalidaEmbim {
  rol: string
  salario: string
  nota: string
  /**
   * SOLO se define en los perfiles cuya retribución NO es salario anual.
   *
   * Declararlo saca la fila de la escala comparativa del M6 (sin barra, con
   * borde discontinuo). Si lo pones en todas, ninguna tendría barra y la
   * escalera salarial pierde todo su sentido.
   */
  unidad?: string
}

export const salidas: SalidaEmbim[] = [
  { rol: "BIM Manager", salario: "50.000 – 70.000 €", nota: "Dirección de implantación BIM" },
  { rol: "Director BIM", salario: "70.000 – 95.000 €", nota: "Dirección de departamento" },
  {
    rol: "Director de Transformación Digital",
    salario: "80.000 – 110.000 €",
    nota: "Dirección corporativa",
  },
  {
    // El único fuera de escala: cobra por día, no un sueldo anual.
    rol: "Consultor BIM Senior",
    salario: "500 – 800 €",
    nota: "Ejercicio independiente",
    unidad: "Tarifa por día · freelance",
  },
]

export const requisitos = [
  "Experiencia profesional demostrable de al menos 5 años en el sector AEC (Arquitectura, Ingeniería o Construcción) en posiciones técnicas o de gestión de proyectos.",
  "Titulación universitaria en Arquitectura, Ingeniería Civil, Industrial, Edificación o disciplinas afines. Se valorará especialmente formación de posgrado previa (MBA, másters técnicos).",
  "Disponibilidad para asistir a clases los viernes de 15:30 a 20:30 h y sábados de 9:00 a 14:00 h durante 12 meses en las instalaciones de IDESIE en Madrid.",
  "Conocimientos técnicos sólidos del sector: gestión de proyectos, procesos constructivos, normativa técnica y experiencia en coordinación de equipos multidisciplinares.",
  "Nivel de inglés técnico medio-alto para lectura de documentación especializada, estándares internacionales y participación en módulos con casos de estudio globales.",
  "Ordenador portátil personal de alto rendimiento: i7/Ryzen 7 o superior, 32 GB RAM, tarjeta gráfica dedicada con 8 GB VRAM, SSD 1 TB (especificaciones detalladas proporcionadas en admisión).",
]

export const faqs = [
  {
    question: "¿En qué se diferencia el Executive Master del Máster BIM Full Time?",
    answer:
      "El Executive Master está diseñado para profesionales senior con experiencia demostrable (5+ años). Tiene un formato ejecutivo de fin de semana, mayor enfoque en gestión estratégica y liderazgo, casos de estudio de mayor complejidad, networking con otros profesionales de tu nivel, y un módulo exclusivo de Soluciones BIM con herramientas avanzadas. Es más intensivo en management y menos en modelado básico.",
  },
  {
    question: "¿Puedo seguir trabajando mientras hago el Executive Master?",
    answer:
      "Sí, el programa está específicamente diseñado para ello. Las clases son viernes tarde y sábados mañana, permitiéndote mantener tu posición laboral actual. De hecho, esperamos que apliques inmediatamente los conocimientos en tus proyectos profesionales. Muchos alumnos lideran implementaciones BIM en sus empresas durante el máster.",
  },
  {
    question: "¿Qué nivel de conocimientos de BIM necesito para acceder?",
    answer:
      "No se requieren conocimientos previos de BIM, aunque tener nociones básicas de Revit o haber trabajado en proyectos BIM es valorado positivamente. El programa empieza desde fundamentos pero avanza rápidamente hacia conceptos avanzados aprovechando tu experiencia profesional previa.",
  },
  {
    question: "¿Qué tipo de proyectos desarrollaré en el Proyecto Fin de Máster?",
    answer:
      "Proyectos de alta complejidad y envergadura: hospitales, infraestructuras de transporte, edificios corporativos, proyectos de regeneración urbana o instalaciones industriales. Muchos alumnos desarrollan proyectos reales de sus empresas (con autorización), lo que aporta valor inmediato a su organización.",
  },
  {
    question: "¿Cuánto cuesta el Executive Master BIM?",
    answer:
      "El coste del programa es de 18.000 €. Ofrecemos diversas opciones de financiación adaptadas a profesionales senior. Contáctanos para recibir información personalizada sobre inversión, facilidades de pago y posibles acuerdos con empresas para formación de directivos.",
  },
  {
    question: "¿El programa está certificado oficialmente?",
    // 2026-09-05 — corregido: la certificación Cualificam es exclusiva del
    // MBIM (Máster BIM Full Time), no del EMBIM. Antes esta respuesta decía
    // "Sí, el Executive Master BIM cuenta con la certificación Cualificam...".
    // Ver CLAUDE.md §5 "Certificación Cualificam — corrección de exclusividad".
    answer:
      "No tiene la certificación Cualificam — es exclusiva del Máster BIM Full Time (MBIM) entre los 4 programas de IDESIE. El EMBIM otorga el Título de Executive Máster de IDESIE, con integración completa de la norma ISO 19650.",
  },
  {
    question: "¿Qué salidas profesionales tiene y cuál es la proyección salarial?",
    answer:
      "Los graduados acceden a posiciones de alto nivel: BIM Manager (50.000-70.000 €), Director BIM (70.000-95.000 €), Director de Transformación Digital (80.000-110.000 €), Consultor BIM Senior (freelance 500-800 €/día). Muchos lideran departamentos de transformación digital en sus organizaciones.",
  },
  {
    question: "¿Puedo aplicar a becas o financiación para el Executive Master?",
    answer:
      "Sí, disponemos de becas parciales para profesionales destacados y opciones de financiación en hasta 18 cuotas sin intereses. También trabajamos con empresas que financian la formación de sus profesionales como inversión estratégica. Consulta con nuestro equipo de admisiones.",
  },
  {
    question: "¿El programa incluye visitas a empresas o networking con el sector?",
    answer:
      "Sí, organizamos masterclasses con líderes del sector AEC, visitas técnicas a proyectos BIM de referencia, y eventos de networking exclusivos. El grupo reducido (máximo 25 alumnos) facilita conexiones profesionales de alto valor con compañeros de empresas líderes del sector.",
  },
]
