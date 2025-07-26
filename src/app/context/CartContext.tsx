'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number
  imagenUrl?: string
}

interface CartItem {
  producto: Producto
  cantidad: number
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { producto: Producto; cantidad: number } }
  | { type: 'REMOVE_ITEM'; payload: { productoId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productoId: number; cantidad: number } }
  | { type: 'CLEAR_CART' }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item.producto.id === action.payload.producto.id
      )

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.producto.id === action.payload.producto.id
            ? { ...item, cantidad: item.cantidad + action.payload.cantidad }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0)
        }
      } else {
        const newItems = [...state.items, { producto: action.payload.producto, cantidad: action.payload.cantidad }]
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0)
        }
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.producto.id !== action.payload.productoId)
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0)
      }
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.producto.id === action.payload.productoId
          ? { ...item, cantidad: action.payload.cantidad }
          : item
      ).filter(item => item.cantidad > 0)

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0)
      }
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (producto: Producto, cantidad: number) => void
  removeItem: (productoId: number) => void
  updateQuantity: (productoId: number, cantidad: number) => void
  clearCart: () => void
  getItemQuantity: (productoId: number) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  })

  const addItem = (producto: Producto, cantidad: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { producto, cantidad } })
  }

  const removeItem = (productoId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productoId } })
  }

  const updateQuantity = (productoId: number, cantidad: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productoId, cantidad } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getItemQuantity = (productoId: number) => {
    const item = state.items.find(item => item.producto.id === productoId)
    return item ? item.cantidad : 0
  }

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  )
} 