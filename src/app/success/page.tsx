'use client'

import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { useEffect } from 'react'

export default function SuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    // Limpiar el carrito cuando se complete el pago exitosamente
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          ¡Pago Exitoso!
        </h1>
        <p className="text-gray-600 mb-6">
          Tu compra ha sido procesada correctamente. Recibirás un email con los detalles de tu pedido.
        </p>
        <Link 
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
} 