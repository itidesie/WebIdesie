/**
 * Contenido real de "Alumnos" — confirmado explícitamente por el cliente
 * (2026-09-03 (25)): los 3 testimonios y las cifras de la banda son datos
 * reales verificados, no inventados. La sección de "Proyectos Destacados"
 * (StudentProjectsCarousel) se eliminó por completo — sus 3 proyectos eran
 * ficticios y sus imágenes nunca existieron en disco; el propio código ya
 * la tenía desactivada con un TODO reconociéndolo.
 */

export const hero = {
  eyebrow: "Nuestros Alumnos",
  title: "Talento que transforma la industria AEC",
  intro:
    "Descubre las trayectorias de nuestros alumnos tras el máster. Cada legado refleja la excelencia y el rigor metodológico que caracteriza nuestra enseñanza.",
  ctaLabel: "Ver legados",
  ctaHref: "#legado",
}

export const stats = [
  { value: "2.500+", label: "Alumnos Graduados", note: "Desde 2012" },
  { value: "45+", label: "Países", note: "Presencia internacional" },
  { value: "95%", label: "Empleabilidad", note: "En 6 meses post-máster" },
  { value: "200+", label: "Empresas Colaboradoras", note: "Red profesional activa" },
]

export interface Legacy {
  name: string
  role: string
  company: string
  program: string
  quote: string
}

/**
 * Cada alumno se presenta con su propio arco real: el programa que cursó
 * (dato ya existente) → el rol que ocupa hoy (dato ya existente). No se
 * inventa ninguna biografía intermedia — el arco es literalmente
 * "Programa → Hoy", los dos únicos puntos que los datos reales sostienen.
 */
export const legacies: Legacy[] = [
  {
    name: "Laura Pérez",
    role: "BIM Manager",
    company: "Ferrovial",
    program: "MBIM 2022",
    quote:
      "El máster en IDESIE me abrió las puertas a un mundo de oportunidades. Hoy trabajo como BIM Manager en una de las constructoras más importantes de España.",
  },
  {
    name: "David Moreno",
    role: "Coordinador BIM",
    company: "ACCIONA",
    program: "MBIM 2023",
    quote:
      "La metodología práctica y el profesorado experto fueron clave para mi desarrollo profesional. Recomiendo IDESIE a cualquiera que quiera especializarse en BIM.",
  },
  {
    name: "Elena García",
    role: "Modelador BIM Senior",
    company: "TYPSA",
    program: "MBIM 2023",
    quote:
      "Gracias a la bolsa de empleo de IDESIE conseguí mis primeras prácticas, que se convirtieron en mi trabajo actual. Una inversión que ha valido cada euro.",
  },
]

export const closing = {
  title: "¿Quieres formar parte de nuestra comunidad?",
  text: "Únete a los más de 2.500 profesionales que han transformado su carrera con IDESIE. Descubre nuestros programas de máster y comienza tu camino hacia la excelencia en BIM.",
  primaryLabel: "Ver programas de máster",
  primaryHref: "/comparativa-masters-page",
  secondaryLabel: "Solicitar información",
  secondaryHref: "/contact-page",
}
