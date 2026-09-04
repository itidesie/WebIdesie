interface VocesIntroProps {
  title: string
  text: string
}

/**
 * El texto real de "#TalentoIDESIE" se conserva, pero sin el recuadro azul
 * grande de la versión anterior — un bloque de color llamativo se lee como
 * autopromoción, justo lo contrario de la autenticidad que pide esta
 * dirección. Tipografía sola, con la etiqueta como eyebrow discreto.
 */
export function VocesIntro({ title, text }: VocesIntroProps) {
  return (
    <section className="w-full bg-background py-16 md:py-20">
      <div className="mx-auto max-w-2xl px-6 text-center sm:px-8">
        <p className="voces-eyebrow text-brand-strong">{title}</p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{text}</p>
      </div>
    </section>
  )
}
