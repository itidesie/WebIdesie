/**
 * Contenido del Máster BIM & Building Engineering (MBBE), separado del layout.
 *
 * Igual que en MBIM: todos los datos vienen del contenido que ya tenía la página
 * o de sus propias FAQ. **Ninguna cifra está copiada del MBIM** — este programa
 * tiene 5 módulos (no 9) y horquillas salariales propias, más altas.
 */

import type { Modulo } from "@/app/mbim-page/mbim-content"

export type { Modulo }

/**
 * Cinco módulos, agrupados en tres fases propias del MBBE.
 * El MBIM usa Fundamentos / Ejecución / Liderazgo; aquí el reparto natural del
 * contenido es distinto.
 */
export const modulos: Modulo[] = [
  {
    num: "01",
    title: "Building Engineering — Instalaciones MEP",
    subtitle: "Dominio completo de todas las instalaciones del edificio.",
    fase: "Técnica",
    text: "Comprensión integral de todas las instalaciones: arquitectura bioclimática, hidráulicas, eléctricas, térmicas, protección contra incendios, especiales y energías alternativas. Aprenderás desde la responsabilidad técnica y el impacto real en la vida de las personas.",
    items: [
      "Arquitectura bioclimática",
      "Instalaciones hidráulicas",
      "Instalaciones eléctricas",
      "Instalaciones térmicas",
      "Protección contra incendios",
      "Instalaciones especiales",
      "Energías alternativas",
    ],
  },
  {
    num: "02",
    title: "BIM — Metodología y herramientas",
    subtitle: "Modelado BIM avanzado con Revit MEP.",
    fase: "Técnica",
    text: "Modelado BIM avanzado con Revit MEP, trabajo colaborativo multidisciplinar basado en el respeto mutuo, organización de proyectos bajo ISO 19650, coordinación con Navisworks y clash detection. La tecnología al servicio de las personas y los proyectos.",
    items: [
      "BIM modelado MEP",
      "Trabajo colaborativo",
      "Organización de proyectos",
      "Coordinación y revisión",
      "Estándares y protocolos",
    ],
  },
  {
    num: "03",
    title: "Project Management",
    subtitle: "Gestión integral del proyecto.",
    fase: "Gestión",
    text: "Gestión integral con responsabilidad: plan de gerencia, planificación de recursos, presupuesto y costes, contratación y subcontratas, gestión de riesgos, contract management y Common Data Environment. Todo desde el respeto a los equipos y las personas involucradas.",
    items: [
      "Plan de gerencia",
      "Planificación",
      "Presupuesto y costes",
      "Contratación",
      "Gestión de riesgos",
      "Contratos",
      "Common Data Environment",
    ],
  },
  {
    num: "04",
    title: "Business Administration",
    subtitle: "Competencias empresariales y liderazgo.",
    fase: "Gestión",
    text: "Competencias empresariales desde la ética profesional: management skills, estrategia corporativa, contabilidad y finanzas de proyectos, marketing técnico, gestión de recursos humanos y liderazgo responsable que valora a cada miembro del equipo.",
    items: [
      "Management skills",
      "Estrategia",
      "Contabilidad y finanzas",
      "Marketing y ventas",
      "Recursos humanos",
    ],
  },
  {
    num: "05",
    title: "Proyecto Fin de Máster",
    subtitle: "Proyecto integral MEP en BIM.",
    fase: "Cierre",
    text: "Desarrollo de un proyecto BIM MEP completo aplicando todo lo adquirido:",
    items: [
      "Modelado integral de instalaciones MEP",
      "Coordinación multidisciplinar con arquitectura y estructura",
      "Planificación y control de costes del proyecto",
      "Presentación y defensa ante tribunal profesional",
    ],
    featured: true,
  },
]

/** Las tres fases de inserción laboral (antiguo "módulo 06" del MBBE). */
export const fasesInsercion = [
  {
    fase: "Fase 1",
    title: "Media jornada",
    text: "Desde el inicio y durante 10 meses, prácticas matutinas remuneradas para aplicar lo aprendido con responsabilidad.",
  },
  {
    fase: "Fase 2",
    title: "Prácticas a jornada completa",
    text: "Al finalizar el máster, prácticas remuneradas adicionales desde 6 meses a jornada completa.",
  },
  {
    fase: "Fase 3",
    title: "Inserción laboral",
    text: "Incorporación definitiva en empresas colaboradoras del sector AEC gracias a tu amplia experiencia práctica.",
  },
]

/**
 * Salidas profesionales del MBBE. **Tres roles, no cuatro**, y con horquillas
 * más altas que las del MBIM: la especialización MEP es de las mejor pagadas
 * del sector.
 *
 * Fuente: la FAQ "¿Cuánto cobra un profesional especializado en MEP con BIM?"
 * de la propia página. No modificar sin confirmar con el cliente.
 */
export const salidas = [
  { rol: "BIM MEP Modeler", salario: "30.000 – 38.000 €", nota: "Modelado de instalaciones" },
  { rol: "MEP Coordinator", salario: "38.000 – 50.000 €", nota: "Coordinación multidisciplinar" },
  { rol: "MEP Manager", salario: "50.000 – 70.000 €", nota: "Dirección técnica" },
]

export const requisitos = [
  "Título universitario oficial de Ingeniero, Arquitecto o equivalente",
  "Pasión por la especialización en instalaciones MEP y su impacto en las personas",
  "Compromiso con la metodología Learning by Working (mañanas trabajando, tardes estudiando)",
  "Nivel de inglés técnico suficiente para documentación MEP internacional",
  "Disponibilidad para asistir presencialmente en Madrid durante 16 meses",
  "Responsabilidad y actitud ética hacia el trabajo técnico de calidad",
]

export const faqs = [
  {
    question: "¿Es necesario saber Revit para acceder al máster?",
    answer:
      "No, el programa empieza desde cero en Revit MEP. Sí es muy recomendable tener conocimientos de ingeniería de instalaciones o haber cursado asignaturas de instalaciones en la carrera, ya que el máster profundiza en cálculo y diseño técnico avanzado, no solo en el manejo del software.",
  },
  {
    question: "¿Qué diferencia hay con el Máster BIM Full Time normal?",
    answer:
      "Este máster tiene un enfoque técnico especializado en instalaciones MEP completas, con módulos específicos de arquitectura bioclimática, hidráulicas, eléctricas, térmicas, PCI, especiales y renovables. Es mucho más profundo técnicamente en instalaciones que el BIM generalista, e incluye project management y business administration.",
  },
  {
    question: "¿Las prácticas son en empresas de instalaciones?",
    answer:
      "Sí, las prácticas se realizan principalmente en ingenierías especializadas en MEP, consultoras de instalaciones, departamentos técnicos de constructoras, empresas de facility management, o estudios de arquitectura con fuerte componente de coordinación de instalaciones. Elegimos según tu perfil e intereses.",
  },
  {
    question: "¿Cuánto cobra un profesional especializado en MEP con BIM?",
    answer:
      "Los especialistas MEP con capacidades BIM tienen salarios muy competitivos: BIM MEP Modeler (30.000-38.000 €), MEP Coordinator (38.000-50.000 €), MEP Manager (50.000-70.000 €). Es una de las especializaciones mejor pagadas del sector porque combina conocimiento técnico profundo con competencias digitales escasas.",
  },
  {
    question: "¿El máster cubre cálculo real de instalaciones o solo modelado BIM?",
    answer:
      "Cubre ambos en profundidad. Aprenderás cálculo real de instalaciones (secciones eléctricas, caudales hidráulicos, cargas térmicas, sistemas de PCI, dimensionamiento renovables) aplicando normativa vigente, Y además cómo modelar todo eso en Revit MEP, coordinar con otras disciplinas y detectar interferencias.",
  },
  {
    question: "¿Puedo especializarme en una sola disciplina MEP o tengo que ver todas?",
    answer:
      "El máster cubre todas las disciplinas MEP porque la coordinación efectiva requiere entender cómo interactúan todas las instalaciones. Sin embargo, en el Proyecto Fin de Máster y en las prácticas sí puedes enfocarte en tu disciplina de interés (eléctrica, climatización, renovables, etc.) para profundizar donde más te apasione.",
  },
  {
    question: "¿Cuánto cuesta el Máster BIM & Building Engineering?",
    answer:
      "El coste del programa es de 15.000 €, si bien ofrecemos diversas opciones de financiación. Contáctanos para recibir información personalizada sobre inversión y becas disponibles. Ten en cuenta que recibes aproximadamente 11.000 € durante el programa (500 € mensuales durante 10 meses de formación + 1.200 € mensuales durante 6 meses de prácticas profesionales).",
  },
  {
    question: "¿Necesito visado para estudiar en IDESIE?",
    answer:
      "Si eres ciudadano no europeo, necesitarás visado de estudiante. Nuestro equipo de admisiones te ayudará con todo el proceso de documentación necesaria para obtener el visado de estudiante con habilitación a empleo.",
  },
  {
    question: "¿Dónde está IDESIE?",
    answer:
      "Nuestro campus está ubicado en Madrid, España, en una zona bien comunicada con transporte público.",
  },
]
