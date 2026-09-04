interface DeliveryMode {
  title: string
  note: string
}

interface DeliveryModesProps {
  eyebrow: string
  title: string
  modes: DeliveryMode[]
}

/**
 * Mismo dato que el bloque "Máxima Flexibilidad" de la versión anterior
 * (in-situ / aulas IDESIE / online), presentado de forma más compacta — tres
 * columnas acotadas por una línea de cota superior, no una tarjeta grande con
 * degradado.
 */
export function DeliveryModes({ eyebrow, title, modes }: DeliveryModesProps) {
  return (
    <section className="w-full bg-background py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="blueprint-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="blueprint-title mt-3 text-2xl text-foreground md:text-3xl">{title}</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {modes.map((mode) => (
            <div key={mode.title} className="blueprint-dimline px-2 pt-4 text-center">
              <h3 className="font-bold text-foreground">{mode.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{mode.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
