// app/api/mercadopago/preference/route.ts
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST() {
  const preference = new Preference(mp);

  const result = await preference.create({
    body: {
      items: [
        { 
          id:"1",
          title: 'Producto de prueba',
          quantity: 1,
          unit_price: 1000,
          currency_id: 'ARS',
        },
      ],
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/failure',
        pending: 'http://localhost:3000/pending',
      },
      //auto_return: 'approved',
    },
  });

  return NextResponse.json({ preferenceId: result.id });
}
