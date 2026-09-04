/**
 * Contenido real de "Alianzas Académicas" — confirmado explícitamente por
 * el cliente (2026-09-03 (25)): las 3 alianzas son reales. Las fotos de
 * campus de Universidad Panamericana y Universidad Francisco de Vitoria no
 * existen en `public/images/` (404 confirmado) — en vez de esperar a una
 * foto real, cada una usa un motivo propio en CSS (mismo criterio ya
 * aplicado en Financiación cuando faltó una imagen real). Blackwell Global
 * University sí tiene foto real y la conserva.
 */

export const hero = {
  eyebrow: "Alianzas Académicas",
  title: "Colaboración Universitaria Internacional",
  intro:
    "Colaboramos con universidades de prestigio internacional para ofrecer programas de intercambio, estancias formativas y formación especializada en metodología BIM.",
}

export interface Benefit {
  number: string
  title: string
  description: string
}

export const benefits: Benefit[] = [
  {
    number: "01",
    title: "Experiencia Internacional",
    description: "Programas de intercambio y estancias que enriquecen la formación con perspectivas globales del sector AEC.",
  },
  {
    number: "02",
    title: "Red de Contactos Global",
    description: "Conexión con estudiantes y profesionales de diferentes países, ampliando tu red profesional internacional.",
  },
  {
    number: "03",
    title: "Formación Complementaria",
    description: "Acceso a programas especializados que complementan la formación universitaria con enfoque BIM aplicado.",
  },
]

export interface Alliance {
  name: string
  location: string
  countryLabel: string
  collaborationType: string
  description: string
  points: string[]
  photo: string | null
}

export const alliances: Alliance[] = [
  {
    name: "Universidad Panamericana",
    location: "Aguascalientes, México",
    countryLabel: "México",
    collaborationType: "Programa de intercambio",
    description:
      "Colaboramos con la Universidad Panamericana para facilitar estancias internacionales de sus estudiantes en IDESIE, ofreciendo formación especializada en metodología BIM y experiencia en el mercado europeo del sector AEC.",
    points: [
      "Estancias internacionales para estudiantes de arquitectura e ingeniería",
      "Formación intensiva en metodología BIM aplicada",
      "Intercambio de conocimientos entre México y España",
      "Experiencia multicultural y networking internacional",
    ],
    photo: null,
  },
  {
    name: "Universidad Francisco de Vitoria",
    location: "Madrid, España",
    countryLabel: "España",
    collaborationType: "Orientación profesional",
    description:
      "Alianza estratégica con la UFV para promover la formación especializada en arquitectura e ingeniería con enfoque BIM, orientando a estudiantes hacia las demandas del sector profesional AEC.",
    points: [
      "Orientación profesional para estudiantes de arquitectura e ingeniería",
      "Programas de formación especializada en metodología BIM",
      "Conexión con el sector profesional AEC",
      "Desarrollo de carrera en empresas líderes del sector",
    ],
    photo: null,
  },
  {
    name: "Blackwell Global University",
    location: "Formación Online Global",
    countryLabel: "Internacional",
    collaborationType: "Licencia de contenido",
    description:
      "Colaboramos con Blackwell Global University como partners de impartición académica. La universidad comercializa cursos cortos online especializados e IDESIE se encarga de impartirlos, aportando su experiencia y know-how en el sector AEC y metodología BIM.",
    points: [
      "Cursos cortos online especializados en el sector AEC",
      "Contenido desarrollado e impartido por expertos de IDESIE",
      "Acceso a formación de calidad con alcance internacional",
      "Certificación conjunta universidad-escuela de negocios",
    ],
    photo: "/images/blackwell-global-university.jpg",
  },
]

export const closing = {
  title: "¿Tu universidad quiere colaborar con IDESIE?",
  text: "Contacta con nosotros para explorar oportunidades de colaboración académica y programas de intercambio.",
  ctaLabel: "Contacta con nosotros",
  ctaHref: "/contact-page",
}
