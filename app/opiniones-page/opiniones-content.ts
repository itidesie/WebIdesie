/**
 * Contenido real de "Opiniones" — confirmado explícitamente por el cliente
 * (2026-09-03 (25)): los 3 testimonios (incluido el de María González, sin
 * empresa asociada) son reales. La empresa "Siemens" se retira de
 * "Empresas que confían en nosotros" — no tiene ningún logo en el proyecto
 * y no se pudo verificar; se mantienen las otras 4, reutilizando sus logos
 * reales ya existentes en `public/images/` (los mismos que usa el marquee
 * de Nuestra Metodología, parte de las 35 empresas colaboradoras reales).
 */

export const hero = {
  eyebrow: "Opiniones",
  title: "Lo que dicen quienes ya pasaron por IDESIE",
  intro:
    "Conoce las opiniones sobre los Máster BIM para arquitectos e ingenieros de IDESIE, tanto Full-Time como Executive.",
}

export const talento = {
  title: "#TalentoIDESIE",
  text: "Arquitectos e ingenieros que han confiado en IDESIE, donde nos preocupamos por convertir a nuestros alumnos en referentes en el sector AEC. En este espacio, cada alumno analiza por qué confía en IDESIE para seguir formándose, qué ventaja obtuvo de nuestra formación dual y cómo fue su año académico.",
}

export interface Testimonial {
  quote: string
  name: string
  program: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Ser alumno significa que seguís unidos a IDESIE porque seguiréis recibiendo apoyo, formación y asesoramiento, y formaréis parte de la gran red de antiguos alumnos.",
    name: "Chengye Xu",
    program: "Alumno Máster BIM Full Time · 2021/2022",
  },
  {
    quote:
      "La diferencia de IDESIE frente a otras escuelas, para mí es sobre todo el hecho de que vayas haciendo prácticas a la vez que estás realizando la formación.",
    name: "Federico Tabasco",
    program: "eMBIM 2015 · BIM Manager en Ingeniería Valladares",
  },
  {
    quote:
      "El Máster BIM de IDESIE me ha permitido desarrollar competencias técnicas y profesionales que son fundamentales en el sector AEC actual.",
    name: "María González",
    program: "Alumna Máster BIM Full Time · 2022/2023",
  },
]

export interface CompanyLogo {
  src: string
  alt: string
}

export const companies: CompanyLogo[] = [
  { src: "/images/descarga-20-289-29.png", alt: "L35" },
  { src: "/images/descarga-20-281-29.png", alt: "C95 Creative" },
  { src: "/images/daikinlogo-converted.png", alt: "Daikin Air Conditioners" },
  { src: "/images/descarga-20-288-29.png", alt: "LKS Next" },
]

export const association = {
  title: "Asociación de Alumnos",
  text: "Al ser alumno de IDESIE podrás contar con todas las ventajas que ofrece ser miembro de la Asociación de Alumnos de IDESIE Business School. La finalidad de la Asociación es crear un fuerte lazo de colaboración entre todos aquellos que hayan formado parte de IDESIE.",
  stats: [
    { value: 100, suffix: "%", label: "Empleabilidad" },
    { value: 10, suffix: "+", label: "Años de experiencia" },
    { value: 500, suffix: "+", label: "Alumnos" },
  ],
}

export const closing = {
  title: "¿Quieres formar parte de #TalentoIDESIE?",
  text: "Descubre nuestros programas y da el siguiente paso en tu carrera profesional.",
  ctaLabel: "Solicita información",
  ctaHref: "/contact-page",
}
