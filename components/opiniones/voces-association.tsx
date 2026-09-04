"use client"

import { useGsapEffect } from "@/hooks/use-gsap-effect"

interface Stat {
  value: number
  suffix: string
  label: string
}

interface VocesAssociationProps {
  title: string
  text: string
  stats: Stat[]
}

export function VocesAssociation({ title, text, stats }: VocesAssociationProps) {
  const scopeRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    scope.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count)
      const counter = { n: 0 }
      gsap.to(counter, {
        n: target,
        duration: 1.4,
        ease: "expo.out",
        snap: { n: 1 },
        onUpdate: () => {
          el.textContent = String(Math.round(counter.n))
        },
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      })
    })

    gsap.from(scope.querySelectorAll("[data-stat]"), {
      y: 24,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "expo.out",
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
    })
  })

  return (
    <section ref={scopeRef} className="w-full bg-gray-950 py-20 text-center md:py-28">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <h2 className="voces-title text-white">{title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{text}</p>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} data-stat>
              <div className="voces-mono text-5xl font-black text-white">
                <span data-count={stat.value}>0</span>
                <span className="text-brand">{stat.suffix}</span>
              </div>
              <p className="mt-2 text-base text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
