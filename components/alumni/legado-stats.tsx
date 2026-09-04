"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Stat {
  value: string
  label: string
  note: string
}

interface LegadoStatsProps {
  stats: Stat[]
}

export function LegadoStats({ stats }: LegadoStatsProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll("[data-stat]"), {
      y: 28,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-brand py-14 md:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 text-center sm:px-8 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} data-stat>
            <div className="legado-mono text-4xl font-black text-white md:text-5xl">{stat.value}</div>
            <div className="mt-2 text-sm font-medium text-white/90 md:text-base">{stat.label}</div>
            <div className="legado-eyebrow mt-1 text-white/65">{stat.note}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
