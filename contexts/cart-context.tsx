"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
  category?: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const sanitizedPayload = { ...action.payload, price: Number(action.payload.price) || 0 }
      const existingItem = state.items.find((item) => item.id === sanitizedPayload.id)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === sanitizedPayload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
        return calculateTotals({ ...state, items: updatedItems })
      } else {
        const newItem = { ...sanitizedPayload, quantity: 1 }
        return calculateTotals({ ...state, items: [...state.items, newItem] })
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      return calculateTotals({ ...state, items: updatedItems })
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        const updatedItems = state.items.filter((item) => item.id !== action.payload.id)
        return calculateTotals({ ...state, items: updatedItems })
      }

      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      return calculateTotals({ ...state, items: updatedItems })
    }

    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 }

    case "LOAD_CART": {
      const sanitizedItems = action.payload.map((item) => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      }))
      return calculateTotals({ ...state, items: sanitizedItems })
    }

    default:
      return state
  }
}

const calculateTotals = (state: CartState): CartState => {
  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  return { ...state, total, itemCount }
}

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartItems })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
