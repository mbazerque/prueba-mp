import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/productos/:id
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const id = Number(params.id)

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" }, 
        { status: 400 }
      )
    }

    const producto = await prisma.producto.findUnique({
      where: { id }
    })

    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado" }, 
        { status: 404 }
      )
    }

    return NextResponse.json(producto)
  } catch (error) {
    console.error('Error al obtener producto:', error)
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    )
  }
}

// PUT /api/productos/:id
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const id = Number(params.id)

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" }, 
        { status: 400 }
      )
    }

    const body = await request.json()
    const { nombre, precio, stock, imagenUrl } = body

    // Validar campos requeridos
    if (!nombre || precio === undefined || stock === undefined) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" }, 
        { status: 400 }
      )
    }

    const productoActualizado = await prisma.producto.update({
      where: { id },
      data: {
        nombre: String(nombre),
        precio: Number(precio),
        stock: Number(stock),
        imagenUrl: imagenUrl || null,
      }
    })

    return NextResponse.json(productoActualizado)
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    
    // Manejar error específico de Prisma
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: "Producto no encontrado" }, 
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    )
  }
}

// DELETE /api/productos/:id
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const id = Number(params.id)

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" }, 
        { status: 400 }
      )
    }

    await prisma.producto.delete({ 
      where: { id } 
    })

    return NextResponse.json({ 
      message: "Producto eliminado correctamente" 
    })
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    
    // Manejar error específico de Prisma
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: "Producto no encontrado" }, 
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    )
  }
}
