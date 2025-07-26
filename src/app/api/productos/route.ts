import { prisma } from "@/app/lib/prisma"
import { NextResponse } from 'next/server'

export async function GET() {
  const productos = await prisma.producto.findMany()
  return NextResponse.json(productos)
}

export async function POST(request: Request) {
  const body = await request.json()

  const nuevo = await prisma.producto.create({
    data: {
      nombre: body.nombre,
      precio: body.precio,
      stock: body.stock,
      imagenUrl: body.imagenUrl ?? null,
    },
  })

  return NextResponse.json(nuevo)
}
