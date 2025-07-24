// app/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  useEffect(() => {
    const createPreference = async () => {
      const res = await fetch('/api/mercadopago/preference', { method: 'POST' });
      const data = await res.json();
      setPreferenceId(data.preferenceId);
    };

    createPreference();
  }, []);

  useEffect(() => {
    if (!preferenceId) return;

    const script = document.createElement('script');
    script.src = 'https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js';
    script.type = 'text/javascript';
    script.setAttribute('data-preference-id', preferenceId);
    script.setAttribute('data-button-label', 'Pagar con Mercado Pago');
    document.getElementById('wallet_container')?.appendChild(script);
  }, [preferenceId]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Producto de prueba</h1>
      <div id="wallet_container" />
    </main>
  );
}
