'use client';
import { useRouter } from 'next/navigation';

export default function ConfiguracoesPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(238,242,247,0.6)', fontSize: 18, cursor: 'pointer' }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>⚙️ Configurações</h2>
      </div>
      <div style={{ padding: '0 16px' }}>
        {[
          { icon: '🌍', label: 'Idioma', val: 'Português (BR)' },
          { icon: '📏', label: 'Unidades', val: 'Métrico (km, kWh)' },
          { icon: '🔒', label: 'Privacidade', val: '' },
          { icon: '📄', label: 'Termos de Uso', val: '' },
          { icon: '📋', label: 'Política de Privacidade', val: '' },
          { icon: 'ℹ️', label: 'Sobre o App', val: 'v1.0.0' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
            {item.val && <span style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)' }}>{item.val}</span>}
            <span style={{ color: 'rgba(238,242,247,0.25)', fontSize: 16 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
