'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  status: string;
  pricePerKwh: number;
  powerKw: number;
  latitude: number;
  longitude: number;
}

export default function RecargaPage() {
  const router = useRouter();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('electra_token');
    if (!token) { router.replace('/login'); return; }
    fetch('https://electra-dashboard-steel.vercel.app/api/estacoes')
      .then(r => r.json())
      .then(d => { if (d.stations) setStations(d.stations); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', paddingBottom: 80 }}>
      <div style={{ padding: '20px 20px 12px' }}>
        <h2 style={{ color: '#EEF2F7', fontSize: 22, fontWeight: 700 }}>⚡ Estações de Recarga</h2>
        <p style={{ color: 'rgba(238,242,247,0.4)', fontSize: 13, marginTop: 4 }}>Encontre um ponto de carregamento</p>
      </div>

      <div style={{ padding: '0 20px' }}>
        {loading && <div style={{ textAlign: 'center', color: 'rgba(238,242,247,0.4)', padding: 40 }}>Carregando estações...</div>}
        {!loading && stations.length === 0 && <div style={{ textAlign: 'center', color: 'rgba(238,242,247,0.4)', padding: 40 }}>Nenhuma estação disponível</div>}
        {stations.map((s, i) => (
          <div key={i} style={{ background: '#111620', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#EEF2F7', fontWeight: 600, fontSize: 16 }}>{s.name}</p>
                <p style={{ color: 'rgba(238,242,247,0.4)', fontSize: 12, marginTop: 2 }}>{s.address}, {s.city}</p>
              </div>
              <span style={{ background: s.status === 'available' ? 'rgba(0,255,135,0.15)' : 'rgba(255,59,92,0.15)', color: s.status === 'available' ? '#00FF87' : '#FF3B5C', fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 600, flexShrink: 0 }}>
                {s.status === 'available' ? '● Livre' : '● Ocupado'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <span style={{ background: 'rgba(0,229,255,0.1)', color: '#00E5FF', fontSize: 12, padding: '4px 10px', borderRadius: 20 }}>⚡ {s.powerKw} kW</span>
              <span style={{ background: 'rgba(0,255,135,0.1)', color: '#00FF87', fontSize: 12, padding: '4px 10px', borderRadius: 20 }}>R$ {s.pricePerKwh}/kWh</span>
            </div>
            <button
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`, '_blank')}
              style={{ width: '100%', padding: '10px', background: '#00E5FF', borderRadius: 10, color: '#070B14', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              🗺️ Navegar até aqui
            </button>
          </div>
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', padding: '10px 0' }}>
        {[['🏠','Home','/home'],['⚡','Recargar','/recarga'],['🆘','SOS','/sos'],['👤','Perfil','/perfil']].map(([icon,label,href]) => (
          <button key={href} onClick={() => router.push(href as string)} style={{ flex: 1, background: 'transparent', color: href === '/recarga' ? '#00E5FF' : 'rgba(238,242,247,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, padding: '4px 0', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
