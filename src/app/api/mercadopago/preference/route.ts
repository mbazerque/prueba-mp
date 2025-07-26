// app/api/mercadopago/preference/route.ts
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

interface PreferenceItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  currency_id: string
}

interface PreferenceRequest {
  items: PreferenceItem[]
  back_urls: {
    success: string
    failure: string
    pending: string
  }
}

export async function POST(request: Request) {
  try {
    const { items, back_urls } = await request.json()

    // Validar que hay items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No hay items para procesar' },
        { status: 400 }
      )
    }

    const preference = new Preference(mp);

    const result = await preference.create({
      body: {
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: item.currency_id || 'ARS',
        })),
        back_urls: back_urls || {
          success: 'http://localhost:3000/success',
          failure: 'http://localhost:3000/failure',
          pending: 'http://localhost:3000/pending',
        },
        
      },
    });

    return NextResponse.json({ 
      preferenceId: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    });

  } catch (error) {
    console.error('Error al crear preferencia de MercadoPago:', error)
    return NextResponse.json(
      { error: 'Error al procesar el pago' },
      { status: 500 }
    )
  }
}
