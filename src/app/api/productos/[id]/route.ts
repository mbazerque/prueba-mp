import { prisma } from "@/app/lib/prisma"
import { NextResponse } from 'next/server'

interface Params {
  params: { id: string }
}

export async function GET(req: Request, { params }: Params) {
  const producto = await prisma.producto.findUnique({
    where: { id: Number(params.id) },
  })
  return NextResponse.json(producto)
}

export async function PUT(req: Request, { params }: Params) {
  const body = await req.json()

  const actualizado = await prisma.producto.update({
    where: { id: Number(params.id) },
    data: {
      nombre: body.nombre,
      precio: body.precio,
      stock: body.stock,
      imagenUrl: body.imagenUrl ?? null,
    },
  })

  return NextResponse.json(actualizado)
}

export async function DELETE(req: Request, { params }: Params) {
  await prisma.producto.delete({
    where: { id: Number(params.id) },
  })

  return NextResponse.json({ message: 'Producto eliminado' })
}
