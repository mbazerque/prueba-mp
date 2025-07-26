'use client'

import { useState } from 'react'
import { useCart } from '../context/CartContext'
import Cart from './Cart'

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { state } = useCart()

  const totalItems = state.items.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <>
      <nav className="bg-blue-600 text-white px-4 md:px-8 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-lg md:text-xl font-semibold tracking-wide">
            Dame un mate
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
} 
