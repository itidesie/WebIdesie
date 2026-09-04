/**
 * Contenido de /bolsa-de-empleo-page, separado del layout — mismo criterio
 * que financiacion-content.ts. El hero y los pasos son texto nuevo (la
 * versión anterior no tenía ninguna sección de "cómo funciona"); las 4
 * ofertas hardcodeadas de la versión anterior se retiran por completo — eran
 * ficticias (empresas inventadas, "Constructora Innova"...), nunca datos
 * reales, así que no hay nada que migrar: las ofertas ahora vienen siempre
 * de `ofertas_empleo` a través de `getPublicOfertas()`.
 */

export const hero = {
  eyebrow: "Bolsa de empleo",
  title: "Tu próximo paso profesional en AEC",
  intro:
    "Descubre las mejores oportunidades laborales en el sector de la Arquitectura, Ingeniería y Construcción. Conecta con empresas líderes y potencia tu carrera.",
}

export const steps = [
  { title: "Explora las ofertas", text: "Filtra por ubicación o tipo de contrato hasta encontrar la que encaja." },
  { title: "Aplica en un clic", text: "Manda tu candidatura y tu CV directamente desde la propia oferta." },
  { title: "Te contactamos", text: "El equipo de IDESIE revisa tu candidatura y te responde por email." },
]

export const cvCta = {
  title: "¿No encuentras tu oferta ideal?",
  text: "Envíanos tu CV y te ayudaremos a conectar con las empresas que buscan talento como el tuyo.",
  ctaLabel: "Enviar mi CV",
}
