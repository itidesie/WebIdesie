// Este archivo simula una base de datos de artículos de blog.
// En una aplicación real, usarías una base de datos (Supabase, en este
// proyecto) para almacenar y persistir los datos.
//
// ⚠️ Sin consumidores: nada del proyecto importa este archivo (el blog real
// vive en app/blog/actions.ts, sobre Supabase). Candidato a borrar.

export interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
  date: string
  author: string
  image?: string
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "introduccion-bim-y-su-impacto",
    title: "Introducción a la Metodología BIM: Qué es y Por Qué es Crucial",
    content: `
La Metodología BIM (Building Information Modeling) ha revolucionado el sector de la Arquitectura, Ingeniería y Construcción (AEC). No es solo un software, sino un proceso colaborativo que permite crear y gestionar información de un proyecto de construcción a lo largo de todo su ciclo de vida.

### ¿Qué es BIM?
BIM es una metodología de trabajo que centraliza la información de un proyecto en un modelo 3D inteligente. Este modelo contiene datos geométricos, pero también información no gráfica como propiedades de materiales, costes, y especificaciones técnicas. Esto permite a todos los stakeholders trabajar con datos coherentes y actualizados en tiempo real.

### Beneficios Clave
1.  **Mejora la Colaboración:** Facilita la comunicación entre arquitectos, ingenieros, constructores y propietarios.
2.  **Reduce Errores y Retrabajos:** La detección temprana de interferencias y la visualización 3D minimizan problemas en obra.
3.  **Optimiza la Planificación y Gestión:** Permite simular el ciclo de vida del edificio, optimizar recursos y predecir costes.
4.  **Incrementa la Eficiencia:** Reduce los tiempos de diseño y construcción, y mejora la toma de decisiones.

### BIM en IDESIE
En IDESIE Business & Tech School, integramos BIM en todos nuestros programas, desde el Máster BIM hasta cursos especializados, preparando a nuestros alumnos para liderar esta transformación digital.
`,
    date: "10 de Agosto, 2025",
    author: "IDESIE Team",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "2",
    slug: "innovacion-construccion-40",
    title: "La Construcción 4.0: Hacia un Futuro Inteligente y Conectado",
    content: `
La Construcción 4.0 es la evolución de la industria AEC hacia la digitalización y la automatización, impulsada por tecnologías emergentes como la Inteligencia Artificial (IA), el Internet de las Cosas (IoT), los Gemelos Digitales y la Realidad Extendida.

### Pilares de la Construcción 4.0
*   **Inteligencia Artificial:** Para optimizar el diseño, la planificación, la gestión de riesgos y el control de calidad.
*   **Internet de las Cosas (IoT):** Sensores en obra para monitorizar el progreso, la seguridad y el rendimiento de los equipos.
*   **Gemelos Digitales (Digital Twins):** Réplicas virtuales de activos físicos que permiten simular escenarios, predecir fallos y optimizar operaciones.
*   **Realidad Extendida (AR/VR/MR):** Herramientas inmersivas para visualización de proyectos, formación y colaboración remota.
*   **Blockchain:** Para una gestión transparente y segura de la cadena de suministro y contratos.

### El Rol de IDESIE
En IDESIE, formamos a los profesionales que liderarán esta era. Nuestro Master Digital & Engineering (MDEE) es un programa pionero que integra todas estas tecnologías para que nuestros alumnos estén a la vanguardia de la industria.
`,
    date: "25 de Julio, 2025",
    author: "IDESIE Innovation Lab",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "3",
    slug: "impacto-ia-en-construccion",
    title: "El Impacto de la Inteligencia Artificial en el Sector de la Construcción",
    content: `
La Inteligencia Artificial (IA) está transformando radicalmente la industria de la construcción, desde la fase de diseño hasta la gestión de proyectos y el mantenimiento de infraestructuras. Su capacidad para procesar grandes volúmenes de datos y aprender de ellos está abriendo nuevas vías para la eficiencia, la seguridad y la sostenibilidad.

### Aplicaciones Clave de la IA en Construcción
1.  **Optimización del Diseño:** Algoritmos de IA pueden generar múltiples opciones de diseño, optimizando aspectos como la eficiencia energética, la distribución del espacio y la resistencia estructural.
2.  **Planificación y Gestión de Proyectos:** La IA mejora la programación de tareas, la asignación de recursos y la predicción de riesgos, lo que conduce a una ejecución de proyectos más fluida y a tiempo.
3.  **Control de Calidad y Seguridad:** Mediante el uso de visión por computadora y drones, la IA puede monitorear el progreso en el sitio, identificar defectos de construcción y detectar posibles riesgos de seguridad para los trabajadores.
4.  **Mantenimiento Predictivo:** Los sistemas de IA analizan datos de sensores en edificios e infraestructuras para predecir cuándo es probable que fallen los componentes, permitiendo un mantenimiento proactivo y reduciendo costes a largo plazo.

### El Futuro de la Construcción con IA
La adopción de la IA en la construcción no solo aumentará la productividad, sino que también permitirá la creación de edificios más inteligentes, eficientes y sostenibles. Aquellos profesionales que dominen estas herramientas estarán a la vanguardia de la innovación en el sector.
`,
    date: "01 de Julio, 2025",
    author: "Dr. Ana Soto",
    image: "/placeholder.svg?height=400&width=600",
  },
]
