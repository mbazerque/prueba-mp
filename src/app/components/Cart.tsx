'use client'

import { useState } from 'react'
import { useCart } from '../context/CartContext'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    if (state.items.length === 0) return

    setIsProcessing(true)
    try {
      // Preparar los datos para MercadoPago
      const items = state.items.map(item => ({
        id: item.producto.id.toString(),
        title: item.producto.nombre,
        quantity: item.cantidad,
        unit_price: item.producto.precio,
        currency_id: 'ARS'
      }))

      const back_urls = {
        success: `${window.location.origin}/success`,
        failure: `${window.location.origin}/failure`,
        pending: `${window.location.origin}/pending`
      }

      // Crear preferencia de MercadoPago
      const response = await fetch('/api/mercadopago/preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, back_urls }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al procesar el pago')
      }

      const { preferenceId, init_point } = await response.json()

      // Redirigir a MercadoPago
      window.location.href = init_point

    } catch (error) {
      console.error('Error al procesar el pago:', error)
      alert('Error al procesar el pago: ' + (error as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <div className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out">
              <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Carrito de Compras</h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={onClose}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Cerrar panel</span>
                        <span className="text-2xl">✕</span>
                      </button>
                    </div>
                  </div>

                  {/* Contenido del carrito */}
                  <div className="mt-8">
                    <div className="flow-root">
                      {state.items.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">🛒</div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
                          <p className="text-gray-500">Gastala...</p>
                        </div>
                      ) : (
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {state.items.map((item) => (
                            <li key={item.producto.id} className="flex py-6">
                              {/* Imagen del producto */}
                              <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                {item.producto.imagenUrl ? (
                                  <img 
                                    src={item.producto.imagenUrl} 
                                    alt={item.producto.nombre}
                                    className="size-full object-cover" 
                                  />
                                ) : (
                                  <div className="size-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                    <span className="text-2xl">🛍️</span>
                                  </div>
                                )}
                              </div>

                              {/* Información del producto */}
                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                      <span>{item.producto.nombre}</span>
                                    </h3>
                                    <p className="ml-4">${(item.producto.precio * item.cantidad).toFixed(2)}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    ${item.producto.precio.toFixed(2)} c/u
                                  </p>
                                </div>
                                
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  {/* Cantidad */}
                                  <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">Cantidad:</span>
                                    <button
                                      onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
                                    >
                                      -
                                    </button>
                                    <span className="w-8 text-center font-medium text-gray-900">
                                      {item.cantidad}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                                      disabled={item.cantidad >= item.producto.stock}
                                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-600"
                                    >
                                      +
                                    </button>
                                  </div>

                                  <div className="flex">
                                    <button 
                                      type="button" 
                                      onClick={() => removeItem(item.producto.id)}
                                      className="font-medium text-red-600 hover:text-red-500"
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {state.items.length > 0 && (
                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p>${state.total.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Envío e impuestos calculados al finalizar la compra.
                    </p>
                    
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Procesando...' : 'Pagar con MercadoPago'}
                      </button>
                      
                      <button
                        onClick={clearCart}
                        className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        Vaciar Carrito
                      </button>
                    </div>
                    
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        o{' '}
                        <button
                          type="button"
                          onClick={onClose}
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          Continuar Comprando
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
