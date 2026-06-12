'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SOSPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [localizacao, setLocalizacao] = useState<{lat: number; lng: number} | null>(null);
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setLocalizacao({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const enviarSOS = async () => {
    setLoading(true);
    const token = localStorage.getItem('electra_token');
    try {
      const r = await fetch('https://electra-dashboard-steel.vercel.app/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ latitude: localizacao?.lat || -30.0346, longitude: localizacao?.lng || -51.2177, description: descricao, urgencyLevel: 'high' }),
      });
      const d = await r.json();
      if (d.ok) setEnviado(true);
    } catch {}
    setLoading(false);
  };

  if (enviado) return (
    <div style={{ minHeight: '100vh', background: '#070B14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
      <h2 style={{ color: '#00FF87', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>SOS Enviado!</h2>
      <p style={{ color: 'rgba(238,242,247,0.6)', textAlign: 'center', marginBottom: 32 }}>Um resgatista está sendo despachado para sua localização.</p>
      <button onClick={() => router.push('/home')} style={{ padding: '14px 32px', background: '#00E5FF', borderRadius: 12, color: '#070B14', fontWeight: 700, fontSize: 16 }}>Voltar ao início</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', padding: 24 }}>
      <button onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '6px 14px', color: 'rgba(238,242,247,0.6)', fontSize: 13, marginBottom: 24 }}>← Voltar</button>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🆘</div>
        <h1 style={{ color: '#FF3B5C', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>SOS ELECTRA</h1>
        <p style={{ color: 'rgba(238,242,247,0.6)', fontSize: 14 }}>Solicite resgate de emergência</p>
      </div>

      <div style={{ background: '#111620', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <p style={{ color: 'rgba(238,242,247,0.4)', fontSize: 12, marginBottom: 4 }}>📍 Sua localização</p>
        <p style={{ color: '#EEF2F7', fontSize: 14 }}>{localizacao ? `${localizacao.lat.toFixed(4)}, ${localizacao.lng.toFixed(4)}` : 'Obtendo localização...'}</p>
      </div>

      <textarea
        placeholder="Descreva o problema (opcional)..."
        value={descricao}
        onChange={e => setDescricao(e.target.value)}
        style={{ width: '100%', padding: 16, background: '#111620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#EEF2F7', fontSize: 14, minHeight: 100, marginBottom: 24, resize: 'none' }}
      />

      <button onClick={enviarSOS} disabled={loading} style={{ width: '100%', padding: 20, background: '#FF3B5C', borderRadius: 16, color: '#fff', fontSize: 18, fontWeight: 800 }}>
        {loading ? 'Enviando...' : '🆘 ENVIAR SOS AGORA'}
      </button>
    </div>
  );
}
