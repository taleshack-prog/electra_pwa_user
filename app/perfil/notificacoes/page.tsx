'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NotificacoesPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({ recargas: true, sos: true, promo: false, news: false });
  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(238,242,247,0.6)', fontSize: 18, cursor: 'pointer' }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>🔔 Notificações</h2>
      </div>
      <div style={{ padding: '0 16px' }}>
        {[
          { key: 'recargas', label: 'Recargas', desc: 'Status e conclusão de sessões' },
          { key: 'sos', label: 'SOS e Resgate', desc: 'Alertas de emergência' },
          { key: 'promo', label: 'Promoções', desc: 'Ofertas e descontos' },
          { key: 'news', label: 'Novidades', desc: 'Atualizações da plataforma' },
        ].map(item => (
          <div key={item.key} style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 500, fontSize: 14 }}>{item.label}</p>
              <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{item.desc}</p>
            </div>
            <div onClick={() => setSettings(s => ({ ...s, [item.key]: !s[item.key as keyof typeof s] }))}
              style={{ width: 46, height: 26, borderRadius: 13, background: settings[item.key as keyof typeof settings] ? '#00E5FF' : '#21262F', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
              <div style={{ position: 'absolute', top: 3, left: settings[item.key as keyof typeof settings] ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
