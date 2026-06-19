'use client';
import { useRouter } from 'next/navigation';

export default function HistoricoPage() {
  const router = useRouter();
  const items = [
    { data: '12/06/2026', local: 'Eletroposto Central', kwh: 32.4, custo: 'R$ 103,68', duracao: '1h 22min' },
    { data: '10/06/2026', local: 'BYD Charge Hub', kwh: 18.2, custo: 'R$ 58,24', duracao: '48min' },
    { data: '08/06/2026', local: 'EV Station Iguatemi', kwh: 45.0, custo: 'R$ 144,00', duracao: '1h 55min' },
  ];
  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(238,242,247,0.6)', fontSize: 18, cursor: 'pointer' }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>📋 Histórico de Recargas</h2>
      </div>
      <div style={{ padding: '0 16px', paddingBottom: 80 }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{item.local}</p>
                <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{item.data} · {item.duracao}</p>
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#00E5FF' }}>{item.custo}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ background: 'rgba(0,229,255,0.1)', color: '#00E5FF', fontSize: 11, padding: '3px 8px', borderRadius: 20 }}>⚡ {item.kwh} kWh</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
