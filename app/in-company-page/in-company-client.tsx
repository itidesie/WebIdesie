"use client"

import Header from "@/components/header"
import FooterSection from "@/components/footer-section"

import { BlueprintHero } from "@/components/in-company/blueprint-hero"
import { MeasureStat } from "@/components/in-company/measure-stat"
import { ProcessSteps } from "@/components/in-company/process-steps"
import { DeliveryModes } from "@/components/in-company/delivery-modes"
import { ReasonsList } from "@/components/in-company/reasons-list"
import { ClosingCta } from "@/components/in-company/closing-cta"

import { hero, stat, process, deliveryModes, reasons, closing } from "./in-company-content"

/**
 * In Company — "El Plano".
 *
 * Rediseño propio, no una plantilla de máster ni una copia del Máster
 * Online: esta página es un servicio B2B con su propio concepto (la
 * formación se mide como un plano técnico, con líneas de cota y crucetas de
 * registro). Componentes propios en `components/in-company/`, contenido
 * propio en `in-company-content.ts`. El razonamiento completo, la auditoría
 * de contenido (enlace roto, secciones duplicadas, cifra enterrada en el
 * metadata) y el porqué del concepto están en el plan de rediseño de esta
 * página.
 *
 * 🔴 2026-09-05 — la franja "Respaldo institucional" (`TrustBar`) se retiró
 * por completo: solo mostraba la certificación Cualificam, que es EXCLUSIVA
 * del MBIM entre los 4 másteres — In Company ni siquiera es uno de los 4,
 * es formación a medida para empresas, así que nunca debió tener esa
 * afirmación ("La misma acreditación de todos nuestros programas."). No hay
 * ningún otro sello real documentado para In Company que sostenga la
 * sección, así que se elimina en vez de dejarla con contenido inventado o
 * vacía — decisión explícita del cliente. `components/in-company/trust-bar.tsx`
 * y el export `trust` de `in-company-content.ts` se borraron con ella, ver
 * CLAUDE.md §5.
 */
export default function InCompanyClient() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-grow" role="main">
        <BlueprintHero {...hero} />
        <MeasureStat {...stat} />
        <ProcessSteps
          eyebrow="Cómo trabajamos"
          title="El programa se acota, no se improvisa."
          intro="Cuatro pasos entre el primer contacto y el primer módulo impartido."
          steps={process}
        />
        <DeliveryModes eyebrow="Modalidades" title="El formato lo decide vuestra operación." modes={deliveryModes} />
        <ReasonsList eyebrow="Por qué IDESIE" title="Cuatro razones, sin relleno." reasons={reasons} />
        <ClosingCta {...closing} />
      </main>

      <FooterSection />
    </div>
  )
}
