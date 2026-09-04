/**
 * Contenido real de "Nuestra Metodología" — reestructurado, no reescrito.
 * Los 3 "pilares" y los 3 pasos de "implementación" de la versión anterior
 * describían exactamente lo mismo en dos formatos distintos (el porqué y el
 * cómo de cada fase); aquí se fusionan en las 3 fases del ciclo sin añadir
 * ningún hecho nuevo — aprobado explícitamente por el cliente en vez de
 * pedir contenido nuevo.
 */

export const hero = {
  eyebrow: "Learning by Working",
  title: "Aprender trabajando, no antes de trabajar",
  subtitle: "Formación con integridad y resultados",
  intro:
    "Un programa innovador que combina trabajo y estudios, enriqueciendo la formación técnica con la experiencia real de profesionales en activo y los últimos avances tecnológicos.",
  ctaLabel: "Conoce el ciclo",
  ctaHref: "#ciclo",
}

export const stats = [
  { value: "100%", label: "Empleabilidad", note: "Garantizada" },
  { value: "+200", label: "Empresas colaboradoras", note: "En el sector AEC" },
  { value: "11.000€", label: "Ingresos aproximados", note: "Mientras estudias" },
  { value: "9.2/10", label: "Satisfacción", note: "Valoración media" },
]

export interface CyclePhase {
  key: string
  step: string
  title: string
  description: string
}

/**
 * Fusión de los 3 "pilares" (el porqué) y los 3 pasos de "implementación"
 * (el cómo) de la versión anterior — mismo contenido real, reorganizado en
 * 3 fases de un ciclo que se repite con cada proyecto real, en vez de una
 * lista de razones desconectada de una lista de pasos.
 */
export const cycle: CyclePhase[] = [
  {
    key: "aplicar",
    step: "01",
    title: "Aplicar desde el primer día",
    description:
      "Los módulos teóricos se combinan con proyectos reales de empresas líderes del sector BIM. Nuestros estudiantes trabajan en esos proyectos desde el primer día, sin esperar a terminar para generar ingresos y experiencia profesional: aplican inmediatamente lo aprendido y generan entregables profesionales.",
  },
  {
    key: "tutelar",
    step: "02",
    title: "Tutelar con profesionales en activo",
    description:
      "No son ejercicios académicos: son encargos reales de empresas líderes, y cada alumno cuenta con un tutor profesional en activo que le guía durante todo el proceso, compartiendo conocimiento técnico y experiencia real del mercado laboral mientras el proyecto avanza.",
  },
  {
    key: "consolidar",
    step: "03",
    title: "Consolidar la integración profesional",
    description:
      "Las prácticas finales en empresas líderes del sector AEC consolidan las competencias técnicas en un entorno real. Más del 80% de nuestros alumnos continúa en la empresa donde realiza sus prácticas finales, y el 100% sigue trabajando en el sector AEC al terminar el programa — de ahí que el ciclo vuelva a empezar con el siguiente proyecto real.",
  },
]

export const beneficios: string[] = [
  "Experiencia laboral desde el primer día",
  "Ingresos económicos durante la formación",
  "Portfolio profesional al terminar",
  "Red de contactos en el sector",
  "100% de empleabilidad",
  "Proyectos en empresas líderes",
]

export const resultadosEmpleo = [
  { porcentaje: 40, descripcion: "Empresas en ingeniería" },
  { porcentaje: 30, descripcion: "Consultoras" },
  { porcentaje: 20, descripcion: "Consultoras BIM" },
  { porcentaje: 10, descripcion: "Otros sectores" },
]

export const partnerLogos = [
  { src: "/images/descarga-20-281-29.png", alt: "C95 Creative" },
  { src: "/images/captura-20de-20pantalla-202025-08-11-20191856.png", alt: "EOS" },
  { src: "/images/1631368132530.jpeg", alt: "CONURMA Ingenieros Consultores" },
  { src: "/images/daikinlogo-converted.png", alt: "Daikin Air Conditioners" },
  { src: "/images/1590573051uponor-01.png", alt: "Uponor" },
  { src: "/images/descarga-20-282-29.png", alt: "Bexel Manager" },
  { src: "/images/descarga-20-284-29.png", alt: "northBIM" },
  { src: "/images/captura-20de-20pantalla-202025-08-11-20193546.png", alt: "QUARK" },
  { src: "/images/descarga-20-283-29.png", alt: "Optimia Compliance Services" },
  { src: "/images/1631364293763.jpeg", alt: "Proingest" },
  { src: "/images/descarga-20-2810-29.png", alt: "ISOVER SAINT-GOBAIN" },
  { src: "/images/descarga-20-288-29.png", alt: "LKS Next" },
  { src: "/images/descarga.png", alt: "ferrovial" },
  { src: "/images/descarga-20-289-29.png", alt: "L35" },
  { src: "/images/descarga-20-286-29.png", alt: "INGENIERIA VALLADARES" },
  { src: "/images/descarga-20-285-29.png", alt: "LYNIKA" },
  { src: "/images/descarga-20-2811-29.png", alt: "RIB Spain" },
  { src: "/images/descarga-20-2812-29.png", alt: "3g office" },
  { src: "/images/grundfos-logo-png-seeklogo-377956.png", alt: "GRUNDFOS" },
  { src: "/images/descarga-20-287-29.png", alt: "TROX" },
  { src: "/images/logo-efebe.png", alt: "EFEBÉ" },
  { src: "/images/logo-philips.webp", alt: "PHILIPS" },
  { src: "/images/inespro-logo-cabecera.png", alt: "INESPRO" },
  { src: "/images/images.png", alt: "CiTD" },
  { src: "/images/jglogodark-final-402x.png", alt: "ingenieros JG" },
  { src: "/images/logo-prysmian-group.jpeg", alt: "PRYSMIAN" },
  { src: "/images/images.jpeg", alt: "Grupo Lobe Passivhaus" },
  { src: "/images/logo-homu-project.png", alt: "HOMU PROJECT" },
  { src: "/images/lamela1.png", alt: "ESTUDIO LAMELA ARQUITECTOS" },
  { src: "/images/wolf-logo-baja-resoluci-c3-b3n.jpeg", alt: "WOLF" },
  { src: "/images/taxonomies-14-1-m.png", alt: "ACV" },
  { src: "/images/presto.png", alt: "Presto iTWO" },
  { src: "/images/thumb-26922-agency-logo-desktop-standart.jpeg", alt: "aestudio" },
  { src: "/images/viking.gif", alt: "VIKING" },
  { src: "/images/ta.jpeg", alt: "TA HYDRONICS" },
  { src: "/images/r-urculo-ingenieros-consultores-s-a-logo.jpeg", alt: "Úrculo Ingenieros" },
]

export const closing = {
  title: "¿Listo para transformar tu carrera profesional?",
  text: "Empieza a construir tu futuro desde el primer día. Trabaja en proyectos reales, genera ingresos y desarrolla las competencias que el sector demanda.",
  primaryLabel: "Descubre el MBIM",
  primaryHref: "/mbim-page",
  secondaryLabel: "Solicita información",
  secondaryHref: "/contact-page",
}
