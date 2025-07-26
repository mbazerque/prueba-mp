import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/productos/:id
export async function GET(_request: Request, { params }: any) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  const producto = await prisma.producto.findUnique({
    where: { id },
  })

  if (!producto) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
  }

  return NextResponse.json(producto)
}

// PUT /api/productos/:id
export async function PUT(request: Request, { params }: any) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  const body = await request.json()

  try {
    const productoActualizado = await prisma.producto.update({
      where: { id },
      data: {
        nombre: body.nombre,
        precio: body.precio,
        stock: body.stock,
        imagenUrl: body.imagenUrl ?? null,
      },
    })

    return NextResponse.json(productoActualizado)
  } catch (error) {
    return NextResponse.json({ error: "No se pudo actualizar el producto" }, { status: 500 })
  }
}

// DELETE /api/productos/:id
export async function DELETE(_request: Request, { params }: any) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  try {
    await prisma.producto.delete({ where: { id } })
    return NextResponse.json({ message: "Producto eliminado correctamente" })
  } catch (error) {
    return NextResponse.json({ error: "No se pudo eliminar el producto" }, { status: 500 })
  }
}
