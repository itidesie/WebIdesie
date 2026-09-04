/**
 * Contenido real de "Sobre IDESIE" — extraído tal cual de la versión anterior
 * de la página, sin inventar ninguna cifra ni hito nuevo. La trayectoria solo
 * usa los dos anclas con fecha real que existen en el resto del sitio (2012 =
 * fundación, hoy = estado actual) más un hito intermedio sin año concreto
 * (acreditación) — no se inventan años intermedios que no existen en ningún
 * sitio del proyecto.
 */

export const hero = {
  eyebrow: "Sobre IDESIE",
  question: "¿Quiénes somos?",
  intro:
    "El entorno actual es incierto y difícil. Las empresas necesitan profesionales capaces de inspirar confianza y contagiar entusiasmo. En IDESIE formamos a esas personas.",
}

export interface Milestone {
  marker: string
  title: string
  description: string
}

export const trayectoria: Milestone[] = [
  {
    marker: "2012",
    title: "El comienzo",
    description:
      "IDESIE nace como pionera en formación BIM, cuando Building Information Modeling era todavía una disciplina emergente en España. Empezamos a reunir a profesionales en activo del sector AEC para formar desde la práctica, no desde la teoría aislada.",
  },
  {
    marker: "Acreditación",
    title: "Reconocimiento oficial",
    // 2026-09-05 — corregido: la acreditación Cualificam/Madri+d/ENQA/EQAR
    // es exclusiva del MBIM, no de MBBE ni EMBIM (hallazgo del cliente). El
    // cierre anterior ("el mismo estándar de calidad que avala hoy a MBIM,
    // MBBE y EMBIM") sonaba a que los 3 la comparten — sustituido por una
    // frase explícita sobre la exclusividad, redacción pedida por el
    // cliente.
    description:
      "El Máster BIM Full Time (MBIM) obtiene la acreditación de Cualificam y la Fundación para el Conocimiento Madri+d, con reconocimiento internacional ENQA/EQAR. Los 4 másteres comparten el mismo rigor académico, aunque la certificación Cualificam es exclusiva del MBIM.",
  },
  {
    marker: "Hoy",
    title: "12+ años después",
    description:
      "Más de 500 profesionales formados, una red de más de 200 empresas colaboradoras y el 100% de nuestros alumnos encontrando empleo antes de terminar o al finalizar el programa. Seguimos formando a las personas que el sector necesita.",
  },
]

export interface Principle {
  key: string
  title: string
  text: string
}

export const principles: Principle[] = [
  {
    key: "mision",
    title: "Misión",
    text: "Impulsar el conocimiento y la educación sobre la ingeniería, la tecnología y aquellas áreas del saber cuya aplicación práctica ayuda a mejorar la calidad de vida de nuestra sociedad. Formamos profesionales que sean valorados por su eficacia, su capacidad para trabajar en equipo y por el respeto a los valores éticos.",
  },
  {
    key: "vision",
    title: "Visión",
    text: "Ser la escuela de referencia en la formación de profesionales capaces de asumir nuevos desafíos, de inspirar confianza y contagiar entusiasmo. Queremos formar a las personas que las empresas necesitan hoy y que la sociedad precisa para construir un futuro sostenible asentado sobre sólidos fundamentos.",
  },
  {
    key: "valores",
    title: "Valores",
    text: "Integridad y ética profesional, rigor académico con enfoque práctico, respeto hacia cada alumno como individuo único, compromiso con la excelencia y la honestidad, empatía hacia cada persona que confía en nosotros.",
  },
]

export interface Reason {
  title: string
  description: string
}

export const reasons: Reason[] = [
  {
    title: "Ética e integridad",
    description: "Formamos profesionales que sean valorados por su eficacia y por el respeto a los valores éticos.",
  },
  {
    title: "Rigor académico",
    description: "Perspectiva global y enfoque eminentemente práctico, con la mirada puesta en el mundo real.",
  },
  {
    title: "Trabajo en equipo",
    description: "Capacidad para colaborar, inspirar confianza y contagiar entusiasmo en cada proyecto.",
  },
  {
    title: "Respeto individual",
    description: "Cada alumno es único. Empatía hacia cada persona que confía en nosotros.",
  },
]

export const closing = {
  title: "¿Listo para dar el siguiente paso?",
  text: "Hoy, más que nunca, las empresas necesitan profesionales íntegros y preparados. Contacta con nosotros y descubre cómo podemos ayudarte a convertirte en uno de ellos.",
  ctaLabel: "Contacta con nosotros",
  ctaHref: "/contact-page",
}
