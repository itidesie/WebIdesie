import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-[#006cff] text-white shadow-lg hover:bg-[#005bbd] hover:shadow-lg hover:scale-105",
        destructive:
          "bg-destructive text-white shadow-lg hover:bg-destructive/90 hover:shadow-lg hover:scale-105 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-2 border-[#006cff] bg-transparent text-[#006cff] shadow-sm hover:bg-[#006cff] hover:text-white hover:shadow-lg hover:scale-105",
        secondary: "bg-[#ffba08] text-gray-900 shadow-lg hover:bg-[#e6a607] hover:shadow-lg hover:scale-105",
        ghost: "hover:bg-[#006cff]/10 hover:text-[#006cff] text-gray-700 hover:scale-105",
        link: "text-[#006cff] underline-offset-4 hover:underline transition-colors duration-300",
        white: "bg-white text-[#006cff] shadow-lg hover:bg-gray-50 hover:shadow-lg hover:scale-105",
      },
      size: {
        default: "h-11 px-6 py-3 text-sm",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  magnetic = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Tirón hacia el cursor (ver `components/site-motion/global-magnetic.tsx`).
     *  Opt-in explícito, no el valor por defecto: así el rollout se hace
     *  página por página / botón por botón en vez de cambiar de golpe el
     *  aspecto de todos los botones del sitio sin revisión. Funciona igual
     *  con `asChild` (el atributo llega al elemento real, sea `<button>` o
     *  el `<Link>` que envuelve). */
    magnetic?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-magnetic={magnetic ? "on" : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
