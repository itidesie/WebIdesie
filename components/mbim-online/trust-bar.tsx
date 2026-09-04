import Image from "next/image"

interface CualificamData {
  logo: string
  logoAlt: string
  entidad: string
  membresia: string
  sellos: string[]
}

interface Partner {
  logo: string
  alt: string
  name: string
}

interface TrustBarProps {
  eyebrow: string
  title: string
  /**
   * 🔴 2026-09-05 — opcional: la certificación Cualificam es EXCLUSIVA del
   * MBIM (Máster BIM Full Time), no del Máster BIM Online — hallazgo del
   * cliente, ver CLAUDE.md §5. Antes era obligatoria y siempre se mostraba
   * aquí, lo que afirmaba implícitamente que el Online también la tenía.
   * Sin `cualificam`, la franja muestra solo AEEN/EUPHE (`partners`), que sí
   * son reales y exclusivos de esta página.
   */
  cualificam?: CualificamData
  partners: Partner[]
}

/**
 * Añade la acreditación Cualificam/Madri+d/ENQA/EQAR que la FAQ de esta
 * página ya prometía pero que la sección "Reconocimientos" original no
 * mostraba (ver hallazgo 4 de la auditoría) — misma fuente real que usa
 * `components/programa/proof-panel.tsx` en MBIM/MBBE/EMBIM. Mantiene AEEN y
 * EUPHE, que son reales y exclusivos de esta página y de la home.
 *
 * No es el clímax de la página (ese es el grafo de módulos): por eso es una
 * barra horizontal compacta, no un panel grande como el M5 presencial — aquí
 * la acreditación respalda, no protagoniza.
 */
export function TrustBar({ eyebrow, title, cualificam, partners }: TrustBarProps) {
  return (
    <section className="w-full bg-paper py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="online-eyebrow text-brand-strong">{eyebrow}</p>
          <h2 className="online-title mt-3 text-2xl text-gray-950 md:text-3xl">{title}</h2>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-8">
          {cualificam && (
            <>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-24 items-center justify-center rounded-lg bg-white p-2 shadow-sm">
                  <Image
                    src={cualificam.logo}
                    alt={cualificam.logoAlt}
                    width={90}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-950">{cualificam.entidad}</p>
                  <p className="text-xs text-gray-950/60">{cualificam.membresia}</p>
                </div>
              </div>

              <div className="hidden h-10 w-px bg-gray-950/10 sm:block" aria-hidden="true" />

              <div className="flex flex-wrap items-center justify-center gap-2">
                {cualificam.sellos.map((sello) => (
                  <span
                    key={sello}
                    className="online-mono rounded-full border border-brand/25 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-brand-strong"
                  >
                    {sello}
                  </span>
                ))}
              </div>

              <div className="hidden h-10 w-px bg-gray-950/10 sm:block" aria-hidden="true" />
            </>
          )}

          {partners.map((p) => (
            <div key={p.name} className="flex h-14 w-24 items-center justify-center rounded-lg bg-white p-2 shadow-sm">
              <Image src={p.logo} alt={p.alt} width={90} height={40} className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
