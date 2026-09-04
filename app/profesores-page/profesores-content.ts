/**
 * Contenido real de "Profesores" — nombres, cargos, especialización y bios
 * son los mismos 17 de la versión anterior, sin cambios de texto.
 *
 * Deliberadamente NO se incluyen `image` ni `linkedin`: las 17 fotos
 * referenciadas por la versión anterior no existen en `public/images/` (404
 * confirmado, uno por uno) y los 17 enlaces de LinkedIn eran slugs
 * generados del nombre, nunca verificados contra un perfil real — publicar
 * cualquiera de los dos habría sido servir datos rotos o potencialmente
 * erróneos. Cuando el cliente entregue fotos y LinkedIn reales, se añaden
 * aquí como campos opcionales y `IndiceMonogram`/el enlace de LinkedIn
 * pasan a mostrarse condicionalmente — el diseño ya está preparado para esa
 * mejora sin cambios estructurales.
 *
 * `group` separa Dirección de Claustro por un hecho real y verificable en
 * los propios datos (los dos únicos con IDESIE como organización, no una
 * empresa colaboradora externa) — no es una taxonomía inventada.
 */

export interface Professor {
  name: string
  title: string
  specialization: string
  bio: string
  group: "direccion" | "claustro"
}

export const professors: Professor[] = [
  {
    name: "Fernando Igual",
    title: "Director General",
    specialization: "IDESIE",
    bio: "Director General de IDESIE Business & Tech School. Visionario en educación tecnológica y líder en la transformación digital del sector AEC. Impulsor de metodologías innovadoras de aprendizaje.",
    group: "direccion",
  },
  {
    name: "Marcos Luengo Sanchez",
    title: "Docente BIM Design MEP",
    specialization: "Presidente de IDESIE Business School",
    bio: "Presidente de IDESIE Business School y docente especializado en BIM Design MEP. Líder visionario en educación tecnológica con amplia experiencia en sistemas MEP y metodologías BIM aplicadas a instalaciones.",
    group: "direccion",
  },
  {
    name: "Martin Murphy",
    title: "Director División Calidad y Sistemas",
    specialization: "Hill International",
    bio: "Experto en gestión de calidad y sistemas en proyectos de construcción internacional. Lidera la división de calidad en Hill International con más de 20 años de experiencia en el sector AEC.",
    group: "claustro",
  },
  {
    name: "Concepción Jeréz",
    title: "Responsable de Control de Costes y Contratación",
    specialization: "Hill International",
    bio: "Especialista en control de costes y gestión de contratos en proyectos de gran envergadura. Experta en metodologías BIM 5D y optimización de presupuestos en construcción.",
    group: "claustro",
  },
  {
    name: "Iván Calviño",
    title: "Socio Fundador",
    specialization: "Ionetree",
    bio: "Emprendedor y experto en tecnologías digitales para el sector AEC. Fundador de Ionetree, empresa especializada en soluciones innovadoras para la digitalización de la construcción.",
    group: "claustro",
  },
  {
    name: "Laura González Arribas",
    title: "BIM & Design System Coordinator",
    specialization: "Diseño Generativo",
    bio: "Especialista en coordinación BIM y sistemas de diseño generativo. Experta en la implementación de flujos de trabajo digitales y metodologías avanzadas de diseño paramétrico en proyectos arquitectónicos.",
    group: "claustro",
  },
  {
    name: "Miguel Villamor",
    title: "Director General",
    specialization: "AECon & BIM Construction",
    bio: "Director General de AECon con amplia experiencia en BIM Construction. Líder en la implementación de metodologías BIM en proyectos de construcción y gestión de equipos multidisciplinares.",
    group: "claustro",
  },
  {
    name: "Federico Tabasco",
    title: "BIM Manager",
    specialization: "ISG",
    bio: "BIM Manager en ISG con experiencia en la gestión y coordinación de proyectos BIM complejos. Especialista en estándares internacionales y optimización de procesos constructivos digitales.",
    group: "claustro",
  },
  {
    name: "Araceli Herranz Tejedor",
    title: "Especialista BIM Construction",
    specialization: "Presupuestos y Control de Costes",
    bio: "Experta en BIM Construction y gestión de presupuestos. Especialista en metodologías 5D BIM y control de costes en proyectos de construcción, con enfoque en optimización económica.",
    group: "claustro",
  },
  {
    name: "Fernando Valladares",
    title: "Subdirector General",
    specialization: "Valladares Ingeniería",
    bio: "Subdirector General en Valladares Ingeniería con amplia trayectoria en proyectos de ingeniería civil e infraestructuras. Experto en gestión de proyectos complejos y metodologías BIM aplicadas a ingeniería.",
    group: "claustro",
  },
  {
    name: "Carlos Martín",
    title: "Socio Director",
    specialization: "L35 Arquitectura BIM Design",
    bio: "Socio Director en L35 Arquitectura especializado en BIM Design. Experto en arquitectura digital y metodologías BIM avanzadas, con amplia experiencia en proyectos arquitectónicos complejos y gestión de equipos multidisciplinares.",
    group: "claustro",
  },
  {
    name: "Francisco Javier López",
    title: "BIM Manager",
    specialization: "Sir Robert McAlpine",
    bio: "BIM Manager en Sir Robert McAlpine y docente especializado en protocolos BIM. Experto en la implementación de estándares internacionales y metodologías de trabajo colaborativo en proyectos de construcción de gran escala.",
    group: "claustro",
  },
  {
    name: "Rubén San León",
    title: "Technical Architect",
    specialization: "Revisión de Modelos de Gestión",
    bio: "Arquitecto Técnico especializado en revisión y optimización de modelos de gestión BIM. Experto en control de calidad de modelos digitales y coordinación técnica en proyectos de construcción sostenible.",
    group: "claustro",
  },
  {
    name: "Roberto San Miguel",
    title: "Docente en Innovación",
    specialization: "Expert in BIMO",
    bio: "Docente especializado en innovación y experto en BIMO (Building Information Modeling Operations). Pionero en la aplicación de tecnologías emergentes y metodologías disruptivas en el sector AEC.",
    group: "claustro",
  },
  {
    name: "Marta Gutiérrez Arribas",
    title: "Docente en BIM Design",
    specialization: "BIM Consultant",
    bio: "Docente especializada en BIM Design y consultora BIM independiente. Experta en diseño paramétrico y modelado avanzado, con enfoque en la optimización de procesos de diseño y construcción digital.",
    group: "claustro",
  },
  {
    name: "Francisco Pastor Gil",
    title: "Docente en Facility Management",
    specialization: "Gerente de Proyectos",
    bio: "Docente especializado en Facility Management y gerente de proyectos con amplia experiencia en gestión de instalaciones. Experto en BIM 6D y metodologías de mantenimiento predictivo en edificaciones.",
    group: "claustro",
  },
  {
    name: "Victor Aparici Godoy",
    title: "Docente en Infrastructure BIM Management",
    specialization: "Consulting, Engineering, Architecture",
    bio: "Docente especializado en Infrastructure BIM Management con experiencia en consulting, ingeniería y arquitectura. Experto en gestión BIM de infraestructuras y proyectos de gran escala con enfoque multidisciplinar.",
    group: "claustro",
  },
]

export const hero = {
  eyebrow: "Claustro de profesores",
  title: "Aprende de quien lo hace todos los días",
  intro:
    "Nuestro claustro combina la dirección de IDESIE con profesionales en activo de empresas de referencia en el sector AEC — Hill International, ISG, L35, Sir Robert McAlpine y más. No enseñan lo que leyeron: enseñan lo que hacen.",
  ctaLabel: "Ver el claustro",
  ctaHref: "#claustro",
}

export const closing = {
  title: "¿Listo para aprender de los mejores?",
  text: "Contacta con nuestro equipo de admisiones para más información sobre nuestros programas y claustro.",
  ctaLabel: "Contacta con nosotros",
  ctaHref: "/contact-page",
}
