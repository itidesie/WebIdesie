/**
 * Contenido de /financiacion-y-becas-page, separado del layout — mismo criterio
 * que app/mbim-page/mbim-content.ts. Ningún dato es nuevo: todo viene de la
 * versión anterior de esta página. Los únicos cambios de texto son ortográficos
 * (tildes que faltaban en 5 frases del hero y del CTA de becas), confirmados
 * explícitamente con el cliente antes de tocarlos — ver CLAUDE.md.
 */

export const hero = {
  eyebrow: "Financiación y becas",
  title: "Haz realidad tu formación",
  intro:
    "En IDESIE, creemos que el talento no debe tener límites económicos. Descubre las diversas opciones de financiación y becas que te ayudarán a acceder a nuestros programas.",
}

/**
 * Cifra destacada: 50% aparece dos veces de forma independiente en el
 * contenido real (Excelentia para Full Time, Alumni para Executive) — es la
 * única cifra que se puede afirmar sin ambigüedad como "la ayuda más alta".
 * Los tres datos de apoyo salen literalmente del resto del contenido, sin
 * inventar ninguno nuevo.
 */
export const stat = {
  value: 50,
  suffix: "%",
  label: "de descuento en matrícula con la beca de mayor cobertura del programa",
  claim: "Beca IDESIE Excelentia (Full Time) y Beca Alumni (Executive) — ambas hasta el 50 %.",
  facts: [
    { value: "0 %", label: "de intereses en la financiación propia de IDESIE" },
    { value: "3", label: "vías de financiación distintas, combinables con becas" },
    { value: "100 %", label: "de exención de tasas de admisión para referidos Alumni" },
  ],
}

export const financingOptions = [
  {
    title: "Préstamos Bancarios",
    description:
      "Convenios con entidades bancarias líderes para ofrecer condiciones preferenciales a nuestros alumnos. Flexibilidad en plazos y tipos de interés.",
    details: [
      "Banco Sabadell: financiación con intereses directos al alumno (modalidad Full Time).",
      "CaixaBank - Préstamo Exprés Matrícula: sin intereses, con comisión inicial; TAE entre 6,90% y 11,93%.",
      "CaixaBank - Préstamo Estudia Grado/Máster: paga solo intereses durante estudios, devuelve capital al finalizar.",
    ],
  },
  {
    title: "Financiación Propia IDESIE",
    description:
      "Opciones de pago fraccionado directamente con IDESIE, sin intereses ni intermediarios. Facilidades para adaptar el pago a tu situación.",
    details: ["Pagos mensuales sin intereses.", "Planes personalizados.", "Sin comisiones de apertura."],
  },
  {
    title: "Convenios y Descuentos",
    description:
      "Acuerdos con empresas, asociaciones y colegios profesionales para ofrecer descuentos exclusivos a sus miembros y empleados.",
    details: [
      "Descuentos por pronto pago.",
      "Convenios con empresas colaboradoras.",
      "Ayudas para desempleados y emprendedores.",
    ],
  },
]

export interface Scholarship {
  title: string
  description: string
}

export const scholarshipLedger: { key: string; label: string; intro: string; items: Scholarship[] }[] = [
  {
    key: "fulltime",
    label: "Full Time",
    intro: "Las solicitudes se envían junto con el formulario de admisión al Departamento de Admisiones.",
    items: [
      {
        title: "Beca IDESIE Excelentia",
        description:
          "Para candidatos con méritos académicos y/o experiencia profesional relevante. Requiere superar el proceso de admisión. Ofrece un 50% de descuento en la matrícula.",
      },
      {
        title: "Becas para alumnos con hijos",
        description: "Otorgadas según la evaluación del Comité de Becas de IDESIE Business School.",
      },
      {
        title: "Becas de la Asociación de Antiguos Alumnos de IDESIE",
        description:
          "Cobertura de hasta 25% de la matrícula para programas Full Time, dirigida a quienes muestran experiencia profesional excepcional y méritos personales. Si eres referido por un Alumni, te eximen del 100% de las tasas de admisión.",
      },
    ],
  },
  {
    key: "executive",
    label: "Executive",
    intro: "Una vez superado el proceso de admisión, puedes solicitar estas ayudas.",
    items: [
      {
        title: "Beca Familia Numerosa",
        description:
          "5% de descuento en matrícula para familias numerosas generales. 10% para familias numerosas especiales.",
      },
      {
        title: "Beca por Desempleo",
        description: "5% de descuento si estás inscrito como demandante de empleo durante al menos 12 meses.",
      },
      {
        title: "Becas de la Asociación de Antiguos Alumnos de IDESIE",
        description:
          "Cobertura de hasta 50% de la matrícula para quienes demuestren experiencia profesional excepcional y méritos personales. Referencias de Alumni: descuento del 100% en las tasas de admisión.",
      },
    ],
  },
]

export const scholarshipNote = "Importante: las ayudas no son acumulables entre sí."

export const advisory = {
  intro:
    "IDESIE cuenta con una Oficina de Ayuda Financiera especializada que asesora y orienta a los alumnos para que encuentren la opción de financiación que mejor se adapte a sus situaciones particulares.",
  steps: [
    { title: "Agenda una cita", text: "Reserva una cita personalizada con un asesor financiero." },
    { title: "Prepara la documentación", text: "Reúne la documentación necesaria para tu caso." },
    { title: "Recibe tu propuesta", text: "Te llevas una propuesta adaptada a tu perfil concreto." },
  ],
}

export const summary = [
  {
    modality: "Full Time",
    financing: "Préstamos (Banco Sabadell, CaixaBank)",
    scholarships: "Excelentia (50%), hijos, Alumni (25% o 100% admisión)",
  },
  {
    modality: "Executive",
    financing: "(No se mencionan préstamos explícitos)",
    scholarships: "Familia numerosa (5–10%), desempleo (5%), Alumni (50% matrícula o 100% admisión)",
  },
]

export const closing = {
  title: "¿Listo para dar el siguiente paso?",
  text: "Contacta con nuestro equipo de admisiones para explorar todas tus opciones de financiación y becas.",
  ctaLabel: "Contacta con admisiones",
  ctaHref: "/contact-page",
}

export const scholarshipsCta = {
  label: "Solicitar información sobre becas",
  href: "/contact-page",
}
