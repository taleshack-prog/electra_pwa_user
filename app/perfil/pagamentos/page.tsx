'use client';
import { useRouter } from 'next/navigation';

export default function PagamentosPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(238,242,247,0.6)', fontSize: 18, cursor: 'pointer' }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>💳 Métodos de Pagamento</h2>
      </div>
      <div style={{ padding: '0 16px', paddingBottom: 80 }}>
        {[{ tipo: 'PIX', detalhe: 'Pagamento instantâneo', icon: '⚡' }, { tipo: 'Cartão •••• 4242', detalhe: 'Visa · Expira 12/27', icon: '💳' }].map((p, i) => (
          <div key={i} style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{p.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{p.tipo}</p>
              <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{p.detalhe}</p>
            </div>
            <span style={{ color: '#00FF87', fontSize: 12 }}>✓ Ativo</span>
          </div>
        ))}
        <button style={{ width: '100%', padding: 14, background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 14, color: '#00E5FF', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>+ Adicionar método</button>
      </div>
    </div>
  );
}
