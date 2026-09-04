/**
 * Datos ficticios que alimentan el modo mock cuando no hay base de datos.
 * Van marcados con [DEMO] a propósito: si ves ese prefijo en pantalla, estás
 * mirando contenido inventado, no la base de datos real.
 */

const DAY = 24 * 60 * 60 * 1000

/** Fechas relativas a hoy, para que las URLs /blog/AAAA/MM/DD/slug sigan siendo coherentes. */
const daysAgo = (n: number) => new Date(Date.now() - n * DAY)

export interface MockBlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  slug: string
  author: string
  featured_image_url: string | null
  tags: string[]
  created_at: Date
  updated_at: Date
}

export const MOCK_BLOG_POSTS: MockBlogPost[] = [
  {
    id: 1,
    title: "[DEMO] Qué es BIM y por qué está transformando la construcción",
    content:
      "<p>Contenido de ejemplo generado en modo mock. Building Information Modeling no es solo un software: es una metodología de trabajo colaborativa.</p><p>Este texto no procede de la base de datos.</p>",
    excerpt: "Una introducción a la metodología BIM y su impacto en el sector AEC.",
    slug: "demo-que-es-bim",
    author: "Equipo IDESIE",
    featured_image_url: "/images/clase_bim_2.jpg",
    tags: ["BIM", "Metodología"],
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
  },
  {
    id: 2,
    title: "[DEMO] ISO 19650: guía rápida para equipos que empiezan",
    content:
      "<p>Contenido de ejemplo generado en modo mock. La norma ISO 19650 estandariza la gestión de información a lo largo del ciclo de vida del activo.</p>",
    excerpt: "Los conceptos mínimos de la ISO 19650 para implantarla sin morir en el intento.",
    slug: "demo-iso-19650-guia-rapida",
    author: "Equipo IDESIE",
    featured_image_url: "/images/hero-certificacion-iso.jpg",
    tags: ["ISO 19650", "Certificación"],
    created_at: daysAgo(10),
    updated_at: daysAgo(10),
  },
  {
    id: 3,
    title: "[DEMO] Salidas profesionales de un BIM Manager en 2026",
    content:
      "<p>Contenido de ejemplo generado en modo mock. El perfil de BIM Manager combina competencias técnicas con gestión de equipos y procesos.</p>",
    excerpt: "Qué hace un BIM Manager, qué se le pide y cuánto se paga el puesto.",
    slug: "demo-salidas-bim-manager",
    author: "Equipo IDESIE",
    featured_image_url: "/images/estudiantes_proyecto_grupal.jpg",
    tags: ["Empleo", "BIM"],
    created_at: daysAgo(21),
    updated_at: daysAgo(21),
  },
  {
    id: 4,
    title: "[DEMO] Revit y Navisworks: flujo de coordinación 3D paso a paso",
    content:
      "<p>Contenido de ejemplo generado en modo mock. La detección de interferencias es uno de los retornos más inmediatos de adoptar BIM.</p>",
    excerpt: "Cómo montar un flujo de detección de interferencias que el equipo use de verdad.",
    slug: "demo-revit-navisworks-coordinacion",
    author: "Equipo IDESIE",
    featured_image_url: "/images/3d-building-monitor.jpg",
    tags: ["Revit", "Coordinación"],
    created_at: daysAgo(35),
    updated_at: daysAgo(35),
  },
]

export interface MockProduct {
  id: number
  slug: string
  tipo: string
  nombre: string
  descripcion_corta: string
  descripcion_larga: string
  precio_actual: number
  precio_original: number | null
  duracion_meses: number | null
  duracion_horas: number | null
  modalidad: string
  certificacion: string
  destacado: boolean
  imagen: string
  imagen_alt: string
  activo: boolean
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 1,
    slug: "demo-master-bim",
    tipo: "master",
    nombre: "[DEMO] Máster BIM (MBIM)",
    descripcion_corta: "Producto de ejemplo en modo mock.",
    descripcion_larga: "Registro ficticio servido porque no hay conexión a base de datos.",
    precio_actual: 9500,
    precio_original: 11000,
    duracion_meses: 16,
    duracion_horas: null,
    modalidad: "Presencial",
    certificacion: "Título propio",
    destacado: true,
    imagen: "/images/mbim_online_hero.jpg",
    imagen_alt: "Máster BIM de ejemplo",
    activo: true,
  },
  {
    id: 2,
    slug: "demo-mbbe",
    tipo: "master",
    nombre: "[DEMO] MBBE — BIM + MEP",
    descripcion_corta: "Producto de ejemplo en modo mock.",
    descripcion_larga: "Registro ficticio servido porque no hay conexión a base de datos.",
    precio_actual: 9800,
    precio_original: null,
    duracion_meses: 16,
    duracion_horas: null,
    modalidad: "Presencial",
    certificacion: "Título propio",
    destacado: true,
    imagen: "/images/mbbe_hero.jpg",
    imagen_alt: "MBBE de ejemplo",
    activo: true,
  },
  {
    id: 3,
    slug: "demo-curso-corto",
    tipo: "curso",
    nombre: "[DEMO] Curso corto de Revit",
    descripcion_corta: "Producto de ejemplo en modo mock.",
    descripcion_larga: "Registro ficticio servido porque no hay conexión a base de datos.",
    precio_actual: 750,
    precio_original: 900,
    duracion_meses: null,
    duracion_horas: 40,
    modalidad: "Online",
    certificacion: "Certificado de aprovechamiento",
    destacado: false,
    imagen: "/images/clase_bim_2.jpg",
    imagen_alt: "Curso corto de ejemplo",
    activo: true,
  },
]

export interface MockOferta {
  id: number
  puesto: string
  empresa: string
  ubicacion: string | null
  salario: string | null
  tipo_contrato: string | null
  descripcion: string | null
  enlace_externo: string | null
  destacada: boolean
  activa: boolean
}

export const MOCK_OFERTAS: MockOferta[] = [
  {
    id: 1,
    puesto: "[DEMO] BIM Manager Senior",
    empresa: "Empresa de ejemplo",
    ubicacion: "Madrid, España",
    salario: "A convenir",
    tipo_contrato: "Jornada completa",
    descripcion: "Oferta de ejemplo servida porque no hay conexión a base de datos.",
    enlace_externo: null,
    destacada: true,
    activa: true,
  },
  {
    id: 2,
    puesto: "[DEMO] Arquitecto BIM Specialist",
    empresa: "Empresa de ejemplo",
    ubicacion: "Remoto",
    salario: "A convenir",
    tipo_contrato: "Jornada completa",
    descripcion: "Oferta de ejemplo servida porque no hay conexión a base de datos.",
    enlace_externo: null,
    destacada: false,
    activa: true,
  },
]

/** Etiquetas únicas, como devolvería SELECT DISTINCT UNNEST(tags). */
export const MOCK_TAGS: string[] = [...new Set(MOCK_BLOG_POSTS.flatMap((p) => p.tags))].sort()
