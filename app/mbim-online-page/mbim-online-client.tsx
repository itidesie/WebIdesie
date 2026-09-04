"use client"

import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import { MotionRoot } from "@/components/programa/motion-root"

import { NetworkHero } from "@/components/mbim-online/network-hero"
import { NetworkStat } from "@/components/mbim-online/network-stat"
import { WeeklyPatterns } from "@/components/mbim-online/weekly-patterns"
import { ModuleGraph } from "@/components/mbim-online/module-graph"
import { TrustBar } from "@/components/mbim-online/trust-bar"
import { OutcomesList } from "@/components/mbim-online/outcomes-list"
import { ClosingSection } from "@/components/mbim-online/closing-section"

import { hero, stat, weeklyPatterns, modules, trust, outcomes, pricing, faqs } from "./mbim-online-content"

/**
 * Máster BIM Online — "La Red".
 *
 * Rediseño propio, no una cuarta consumidora de `components/programa/*`. Esa
 * carpeta la comparten a propósito MBIM/MBBE/EMBIM para leerse como una misma
 * familia; esta página tiene su propia narrativa (nodos que convergen en un
 * mismo modelo, en vez de un espacio físico) y sus propios componentes en
 * `components/mbim-online/`. Comparte solo infraestructura de verdad genérica:
 * `Header`, `FooterSection`, `MotionRoot` (Lenis↔ScrollTrigger, barra de
 * progreso, cursor — no está atado a la narrativa de movimientos) y los
 * tokens de marca. El razonamiento completo, la auditoría de contenido y el
 * porqué de cada sustitución (especialmente por qué no hay "día partido"
 * aquí) están en el plan de rediseño de esta página.
 */
export default function MBIMOnlineClient() {
  return (
    <div className="flex min-h-screen flex-col">
      <MotionRoot />
      <Header />

      <main className="flex-grow" role="main">
        <NetworkHero {...hero} />
        <NetworkStat {...stat} />
        <WeeklyPatterns
          eyebrow="Tu semana, no la nuestra"
          title="Aquí no hay un día correcto."
          intro="El presencial tiene un horario fijo. El online no — esa es la ventaja. Tres alumnos reales, tres semanas completamente distintas."
          patterns={weeklyPatterns}
        />
        <ModuleGraph
          eyebrow="El programa"
          title="9 módulos, un mismo modelo."
          intro="El mismo temario que el Máster BIM presencial, pensado para avanzar de forma remota y colaborativa hasta el Proyecto Fin de Máster."
          modules={modules}
        />
        <TrustBar eyebrow="La prueba" title="El mismo título, la misma garantía." partners={trust.partners} />
        <OutcomesList
          eyebrow="Las salidas"
          title="A dónde te lleva."
          intro="Los mismos roles y rangos salariales del sector AEC que el Máster BIM presencial — el mercado de salida es el mismo programa."
          outcomes={outcomes}
        />
        <ClosingSection pricing={pricing} faqs={faqs} />
      </main>

      <FooterSection />
    </div>
  )
}
