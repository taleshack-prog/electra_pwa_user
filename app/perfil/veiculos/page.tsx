'use client';
import { useRouter } from 'next/navigation';

export default function VeiculosPage() {
  const router = useRouter();
  const veiculos = [
    { modelo: 'BYD Seal 03', placa: 'ABC-1234', bateria: 42, cor: '#00E5FF' },
  ];
  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(238,242,247,0.6)', fontSize: 18, cursor: 'pointer' }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>🚗 Meus Veículos</h2>
      </div>
      <div style={{ flex: 1, padding: '0 16px', paddingBottom: 80 }}>
        {veiculos.map((v, i) => (
          <div key={i} style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 16 }}>{v.modelo}</p>
                <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)', marginTop: 2 }}>{v.placa}</p>
              </div>
              <span style={{ fontSize: 24 }}>🚗</span>
            </div>
            <div style={{ height: 6, background: '#111827', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ width: v.bateria + '%', height: '100%', background: v.cor, borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'rgba(238,242,247,0.35)', fontFamily: 'monospace' }}>Bateria</span>
              <span style={{ fontSize: 11, color: v.cor, fontFamily: 'monospace', fontWeight: 600 }}>{v.bateria}%</span>
            </div>
          </div>
        ))}
        <button style={{ width: '100%', padding: 14, background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 14, color: '#00E5FF', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Adicionar Veículo</button>
      </div>
    </div>
  );
}
