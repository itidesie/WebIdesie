import type * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/15 dark:aria-invalid:ring-destructive/30 dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-xl border bg-transparent px-3.5 py-2.5 text-base shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "transition-[color,box-shadow,border-color] duration-200 [transition-timing-function:var(--ease-out-quart)]",
        "hover:border-brand/40",
        "focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/20",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
