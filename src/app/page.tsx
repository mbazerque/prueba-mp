'use client'

import { useState, useEffect } from 'react'
import ProductCard from './components/ProductCard'

interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number
  imagenUrl?: string
}

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/productos')
      if (!response.ok) {
        throw new Error('Error al cargar productos')
      }
      const data = await response.json()
      setProductos(data)
    } catch (err) {
      setError('Error al cargar los productos')
      console.error('Error fetching productos:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProductos}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            🧉 Dame un mate
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Los momentos mas lindos, empiezan con un mate!
          </p>
          <div className="flex items-center justify-center space-x-4">
          </div>
        </div>
      </div>

      {/* Barra busqueda */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="relative max-w-md mx-auto">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      🔍
    </span>
    <input
      type="text"
      placeholder="Buscar productos..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400"
    />
  </div>
</div>

      {/* Zona grid*/}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredProductos.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4">🛍️</span>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Buscá bien...' : 'Dale che...'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Nuestros Productos
              </h2>
              <span className="text-gray-600">
                {filteredProductos.length} {filteredProductos.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>
            {/* Grilla de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProductos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
