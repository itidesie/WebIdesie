"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"

interface CartIconProps {
  onClick: () => void
  className?: string
}

export function CartIcon({ onClick, className = "" }: CartIconProps) {
  const { state } = useCart()

  return (
    <Button
      variant="ghost"
      size="sm"
      magnetic
      onClick={onClick}
      className={`relative p-2 hover:bg-blue-50 ${className}`}
    >
      <ShoppingCart className="h-6 w-6" />
      {state.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#006cff] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {state.itemCount > 99 ? "99+" : state.itemCount}
        </span>
      )}
    </Button>
  )
}
