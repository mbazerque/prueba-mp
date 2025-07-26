'use client'

import Link from 'next/link'

export default function FailurePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Pago Fallido
        </h1>
        <p className="text-gray-600 mb-6">
          Hubo un problema al procesar tu pago. Por favor, intenta nuevamente o contacta con soporte si el problema persiste.
        </p>
        <div className="space-y-3">
          <Link 
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Volver al Inicio
          </Link>
          <br />
          <Link 
            href="/"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Intentar Nuevamente
          </Link>
        </div>
      </div>
    </div>
  )
} 