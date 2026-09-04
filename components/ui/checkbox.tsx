'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer border-input dark:bg-input/30 data-[state=checked]:bg-brand data-[state=checked]:text-white data-[state=checked]:border-brand aria-invalid:border-destructive aria-invalid:ring-destructive/15 dark:aria-invalid:ring-destructive/30 size-5 shrink-0 rounded-md border shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'transition-[color,box-shadow,border-color,background-color] duration-200 [transition-timing-function:var(--ease-out-quart)]',
        'hover:border-brand/50',
        'focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/20',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
