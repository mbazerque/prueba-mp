'use client'

import { useState } from 'react'
import { useCart } from '../context/CartContext'

interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number
  imagenUrl?: string
}

interface ProductCardProps {
  producto: Producto
}

export default function ProductCard({ producto }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCart()
  const [quantity, setQuantity] = useState(1)
  const cartQuantity = getItemQuantity(producto.id)

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= producto.stock) {
      addItem(producto, quantity)
      setQuantity(1)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= producto.stock) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Imagen del producto */}
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        {producto.imagenUrl ? (
          <img 
            src={producto.imagenUrl} 
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-4xl text-gray-400">🛍️</div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {producto.nombre}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ${producto.precio.toFixed(2)}
          </span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            producto.stock > 10 
              ? 'bg-green-100 text-green-800' 
              : producto.stock > 0 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
          }`}>
            {producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
          </span>
        </div>

        {/* Cantidad */}
        <div className="flex items-center justify-between mb-3">
  <span className="text-sm text-gray-600">Cantidad:</span>
  <div className="flex items-center space-x-2">
    <button
      onClick={() => handleQuantityChange(quantity - 1)}
      disabled={quantity <= 1}
      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-bold w-6 h-6 flex items-center justify-center"
    >
      -
    </button>
    <span className="w-8 text-center font-medium text-gray-900">
      {quantity}
    </span>
    <button
      onClick={() => handleQuantityChange(quantity + 1)}
      disabled={quantity >= producto.stock}
      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-bold w-6 h-6 flex items-center justify-center"
    >
      +
    </button>
  </div>
</div>

        {/* Botón agregar al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={producto.stock === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>
            {producto.stock === 0 
              ? 'Sin stock' 
              : cartQuantity > 0 
                ? `Agregar (${cartQuantity} en carrito)` 
                : 'Agregar al Carrito'
            }
          </span>
        </button>

        
        {cartQuantity > 0 && (
          <div className="mt-2 text-sm text-blue-600 text-center">
            {cartQuantity} {cartQuantity === 1 ? 'unidad' : 'unidades'} en el carrito
          </div>
        )}
      </div>
    </div>
  )
} 