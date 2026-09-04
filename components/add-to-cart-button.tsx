"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Product {
  id: number
  name: string
  price: number
  image?: string
  category?: string
}

interface AddToCartButtonProps {
  product: Product
  className?: string
  label?: string
}

export function AddToCartButton({ product, className = "", label }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    addItem(product)

    // Brief animation feedback
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  const defaultLabel = label || "Añadir al carrito"

  return (
    <Button onClick={handleAddToCart} disabled={isAdding} className={className}>
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isAdding ? "Añadiendo..." : defaultLabel}
    </Button>
  )
}
