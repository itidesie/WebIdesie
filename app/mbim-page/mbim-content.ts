/**
 * Contenido del Máster BIM (MBIM), separado del layout.
 *
 * Todos los datos vienen del contenido que ya había en la página o de sus FAQ.
 * No hay ninguna cifra inventada: si un dato no estaba, no está aquí.
 */

export interface Modulo {
  num: string
  title: string
  subtitle: string
  /** Fase del recorrido a la que pertenece; agrupa el carril horizontal. */
  fase: string
  text?: string
  items?: string[]
  featured?: boolean
}

export const modulos: Modulo[] = [
  {
    num: "01",
    title: "Fundamentos BIM",
    subtitle: "Conceptos esenciales, estándares y metodología.",
    fase: "Fundamentos",
    items: [
      "Fundamentos de la Metodología BIM",
      "Trabajo colaborativo en entornos de datos comunes (CDE)",
      "Protocolos y estándares internacionales (ISO 19650)",
    ],
  },
  {
    num: "02",
    title: "BIM Design",
    subtitle: "Modelado arquitectónico, estructural y MEP.",
    fase: "Fundamentos",
    text: "Módulo intensivo para dominar el diseño digital:",
    items: [
      "Modelado de arquitectura y estructuras con REVIT",
      "Modelado de instalaciones (MEP)",
      "Coordinación de modelos multidisciplinarios con Navisworks",
      "Mediciones y presupuestos automatizados",
      "Flujos de diseño colaborativo",
    ],
  },
  {
    num: "03",
    title: "BIM Construction",
    subtitle: "Planificación y control de ejecución con modelos 4D/5D.",
    fase: "Ejecución",
    text: "Aplicación de BIM en fase de obra para gestión optimizada:",
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
    fase: "Ejecución",
    text: "Gestión de proyectos de infraestructuras con herramientas especializadas como Civil 3D e InfraWorks, abordando el diseño y modelado de carreteras, puentes y entornos urbanos complejos.",
  },
  {
    num: "05",
    title: "BIM Facility Management",
    subtitle: "Gestión de mantenimiento preventivo.",
    fase: "Ejecución",
    text: "Integración de BIM en gestión de mantenimiento preventivo y predictivo, con herramientas para explotación de modelos digitales en tiempo real durante toda la vida útil del edificio.",
  },
  {
    num: "06",
    title: "BIM Project Management",
    subtitle: "Gestión integral del proyecto.",
    fase: "Ejecución",
    text: "Gestión integral de proyectos BIM, incluyendo elaboración de planes de gerencia, planificación de recursos y cronogramas, y control de costes y contratos en proyectos digitales.",
  },
  {
    num: "07",
    title: "Talent",
    subtitle: "Habilidades directivas y tecnologías avanzadas.",
    fase: "Liderazgo",
    text: "Desarrollo de habilidades directivas esenciales para gestionar equipos en proyectos BIM:",
    items: [
      "Comunicación efectiva en entornos multidisciplinares",
      "Gestión de equipos y resolución de conflictos",
      "Estrategia y toma de decisiones",
      "Liderazgo en transformación digital",
    ],
  },
  {
    num: "08",
    title: "Innovation",
    subtitle: "Tecnologías emergentes.",
    fase: "Liderazgo",
    text: "Preparación en herramientas de vanguardia que transforman el sector AEC:",
    items: [
      "Análisis de datos: Power BI para visualización y análisis de proyecto",
      "Inteligencia artificial: IA y machine learning aplicados a procesos BIM",
      "Automatización: Dynamo y Python para crear flujos personalizados",
    ],
  },
  {
    num: "09",
    title: "Proyecto Fin de Máster",
    subtitle: "Proyecto integral en BIM.",
    fase: "Liderazgo",
    text: "Desarrollo de un proyecto BIM completo aplicando todo lo adquirido:",
    items: [
      "Modelado integral de proyecto real",
      "Coordinación multidisciplinar",
      "Planificación y control de costes",
      "Presentación y defensa ante tribunal profesional",
    ],
    featured: true,
  },
]

/** Las tres fases de inserción laboral (antiguo "módulo 10"). */
export const fasesInsercion = [
  {
    fase: "Fase 1",
    title: "Media jornada",
    text: "Desde el inicio y durante 10 meses, prácticas matutinas remuneradas para aplicar lo aprendido esa misma tarde.",
  },
  {
    fase: "Fase 2",
    title: "Prácticas a jornada completa",
    text: "Al terminar la formación, 6 meses adicionales de prácticas remuneradas a jornada completa.",
  },
  {
    fase: "Fase 3",
    title: "Inserción laboral",
    text: "Incorporación definitiva en empresas colaboradoras del sector AEC, muchas veces en la misma donde hiciste prácticas.",
  },
]

/**
 * Salidas profesionales y sus horquillas salariales.
 * Fuente: la FAQ "¿Qué salidas profesionales tiene este máster…?" de la propia
 * página. No modificar sin confirmar con el cliente.
 */
export const salidas = [
  { rol: "BIM Modeler", salario: "28.000 – 35.000 €", nota: "Modelado y producción" },
  { rol: "BIM Coordinator", salario: "35.000 – 45.000 €", nota: "Coordinación multidisciplinar" },
  { rol: "Especialista MEP", salario: "32.000 – 42.000 €", nota: "Instalaciones" },
  { rol: "Project Manager Junior", salario: "35.000 – 50.000 €", nota: "Gestión de proyecto" },
]

export const requisitos = [
  "Título universitario oficial de Ingeniero, Arquitecto o equivalente",
  "Pasión por la transformación digital del sector AEC mediante BIM",
  "Compromiso con la metodología Learning by Working (mañanas trabajando, tardes estudiando)",
  "Nivel de inglés técnico suficiente para documentación BIM internacional",
  "Disponibilidad para asistir presencialmente en Madrid durante 16 meses",
  "Motivación para liderar equipos multidisciplinares en proyectos BIM",
]

export const faqs = [
  {
    question: "¿Puedo renunciar al trabajo que se realiza por la mañana?",
    answer:
      "¿Cómo impactan mis decisiones en el desarrollo de mi aprendizaje y en los proyectos? Cada elección dentro del programa genera efectos visibles y proporcionales: tu avance depende de tu responsabilidad, es lo que prepara no solo para tu futuro laboral, sino para tu vida entera.",
  },
  {
    question: "¿En qué empresas se realizan las prácticas?",
    answer:
      "IDESIE colabora con estudios de arquitectura, ingenierías, constructoras, empresas de Project Management, fondos y propiedades. Dentro de la red de IDESIE conviven más de 40 empresas líderes del sector AEC, tanto españolas como internacionales y de distintos tamaños.",
  },
  {
    question: "¿Cuánto cuesta el Máster?",
    answer:
      "El coste del programa es de 15.000 €, si bien ofrecemos diversas opciones de financiación. Contáctanos para recibir información personalizada sobre inversión y becas disponibles. Ten en cuenta que recibes entre 500 € y 650 € mensuales durante los 10 meses de formación teórica con prácticas a media jornada (5.000 € aproximadamente) y desde 900 € mensuales durante los 6 meses posteriores de prácticas profesionales a jornada completa (7.200 € aproximadamente). Los pagos se realizan mensualmente mediante nómina, cumpliendo con toda la normativa laboral vigente.",
  },
  {
    question: "¿Las prácticas están garantizadas o tengo que buscarlas yo?",
    answer:
      "Las prácticas están garantizadas al 100 %. IDESIE tiene acuerdos con más de 200 empresas del sector (estudios de arquitectura, ingenierías, constructoras, empresas de facility management) y asignamos la empresa según tu perfil, preferencias y rendimiento académico.",
  },
  {
    question: "¿Dónde está IDESIE?",
    answer:
      "Nuestro campus está ubicado en Madrid, España, en Plaza de Castilla, una zona bien comunicada con transporte público.",
  },
  {
    question: "¿Puedo visitar la escuela?",
    answer:
      "Sí, puedes agendar una visita a nuestras instalaciones. Contáctanos para coordinar una fecha que se ajuste a tu disponibilidad.",
  },
  {
    question: "¿Qué salidas profesionales tiene este máster y cuál es el salario medio?",
    answer:
      "Las oportunidades profesionales se alinean con la coherencia y responsabilidad demostrada durante el programa. Quien actúa íntegramente, accede a resultados completos. Podrás trabajar como BIM Modeler (28.000-35.000 €), BIM Coordinator (35.000-45.000 €), Especialista MEP (32.000-42.000 €), o Project Manager Junior (35.000-50.000 €). Más del 95 % de nuestros alumnos consiguen empleo en los 6 meses posteriores, muchos directamente en la empresa donde realizaron prácticas.",
  },
  {
    question: "¿Puedo financiar el máster y en qué condiciones?",
    answer:
      "Sí, ofrecemos facilidades de pago personalizadas. Puedes fraccionar el pago en hasta 12 cuotas sin intereses, o solicitar financiación bancaria en colaboración con entidades especializadas en formación. Además, recuerda que los ingresos del programa (alrededor de 12.200 €) cubren gran parte del coste total.",
  },
  {
    question: "¿Necesito visado para estudiar en IDESIE?",
    answer:
      "Si eres ciudadano no europeo, necesitarás visado de estudiante. Al ser un Máster certificado por CUALIFICAM, ofrecemos facilidades para obtener el visado de estudiante con habilitación a empleo. Nuestro equipo de admisiones te ayudará con todo el proceso de documentación necesaria.",
  },
]
