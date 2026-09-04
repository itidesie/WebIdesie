import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * CTA del hero de "El Balance". Ya no necesita ser Client Component: el
 * magnetismo pasó del `useMagnetic` por instancia al motor centralizado
 * (`<Button magnetic>` solo marca `data-magnetic`) — `balance-hero.tsx`
 * sigue siendo Server Component (foto + titular en CSS puro, sin impacto
 * en LCP).
 */
export function BalanceHeroCta() {
  return (
    <Button asChild magnetic size="lg" className="btn-balance bg-brand text-white hover:bg-brand-strong">
      <Link href="#opciones" style={{ ["--btn-fill" as string]: "var(--color-brand-strong)" }}>
        Explorar opciones
        <ArrowRight className="btn-arrow ml-2 h-4 w-4" />
      </Link>
    </Button>
  )
}
