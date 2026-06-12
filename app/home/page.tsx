'use client';
import { useEffect, useState, useRef } from 'react';
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

const MAPA_HTML = (stations: Station[]) => `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #map { width: 100%; height: 100%; background: #0A1628; }
.leaflet-tile { filter: brightness(0.85) saturate(0.7) hue-rotate(180deg) invert(1) brightness(0.6); }
.leaflet-control-attribution { display: none; }
</style></head>
<body><div id="map"></div>
<script>
const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([-30.0346, -51.2177], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
const stations = ${JSON.stringify(stations)};
stations.forEach(s => {
  const cor = s.status === 'available' ? '#00FF87' : '#FFB800';
  const icon = L.divIcon({ className: '', html: '<div style="width:14px;height:14px;border-radius:50%;background:' + cor + ';border:2px solid #fff;box-shadow:0 0 8px ' + cor + '"></div>', iconSize:[14,14] });
  const marker = L.marker([s.latitude, s.longitude], { icon }).addTo(map);
  marker.on('click', () => window.parent.postMessage({ type: 'station', id: s.id, name: s.name, address: s.address, status: s.status, powerKw: s.powerKw, pricePerKwh: s.pricePerKwh }, '*'));
});
</script></body></html>`;

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{name?: string; email?: string} | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [selected, setSelected] = useState<Station | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('electra_token');
    const u = localStorage.getItem('electra_user');
    if (!token) { router.replace('/login'); return; }
    if (u) setUser(JSON.parse(u));

    fetch('https://electra-dashboard-steel.vercel.app/api/estacoes')
      .then(r => r.json())
      .then(d => { if (d.stations) setStations(d.stations); });

    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'station') setSelected(e.data);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('electra_token');
    localStorage.removeItem('electra_user');
    router.replace('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0C0E12', color: '#EEF2F7', fontFamily: 'DM Sans, sans-serif', paddingBottom: 72, maxWidth: 430, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'rgba(238,242,247,0.38)', fontSize: 12 }}>Olá,</p>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#EEF2F7' }}>{user?.name || 'Usuário'} ⚡</h2>
        </div>
        <button onClick={logout} style={{ background: '#21262F', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '6px 14px', color: 'rgba(238,242,247,0.6)', fontSize: 12, cursor: 'pointer' }}>Sair</button>
      </div>

      {/* SOS Button */}
      <div style={{ padding: '0 20px 16px' }}>
        <button onClick={() => router.push('/sos')} style={{ width: '100%', padding: '16px', background: 'rgba(255,59,48,0.14)', border: '1.5px solid rgba(255,59,48,0.4)', borderRadius: 16, color: '#FF3B30', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          🆘 RESGATE SOS EMERGENCIAL
        </button>
      </div>

      {/* Mapa */}
      <div style={{ margin: '0 20px 16px', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', height: 220, position: 'relative', background: '#0D1520' }}>
        {stations.length > 0 && (
          <iframe
            ref={iframeRef}
            srcDoc={MAPA_HTML(stations)}
            style={{ width: '100%', height: '100%', border: 'none' }}
            sandbox="allow-scripts allow-same-origin"
          />
        )}
        {stations.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(238,242,247,0.3)', fontSize: 13 }}>Carregando mapa...</div>
        )}
      </div>

      {/* Station card popup */}
      {selected && (
        <div style={{ margin: '0 20px 16px', background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15, color: '#EEF2F7' }}>{selected.name}</p>
              <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{selected.address}</p>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(238,242,247,0.38)', fontSize: 18, cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <span style={{ background: 'rgba(74,143,255,0.14)', color: '#4A8FFF', fontSize: 11, padding: '3px 8px', borderRadius: 20 }}>⚡ {selected.powerKw} kW</span>
            <span style={{ background: 'rgba(50,201,90,0.13)', color: '#32C95A', fontSize: 11, padding: '3px 8px', borderRadius: 20 }}>R$ {selected.pricePerKwh}/kWh</span>
            <span style={{ background: selected.status === 'available' ? 'rgba(50,201,90,0.13)' : 'rgba(255,184,0,0.13)', color: selected.status === 'available' ? '#32C95A' : '#FFB800', fontSize: 11, padding: '3px 8px', borderRadius: 20 }}>
              {selected.status === 'available' ? '● Livre' : '● Ocupado'}
            </span>
          </div>
          <button onClick={() => router.push('/recarga?id=' + selected.id)} style={{ width: '100%', padding: '12px', background: '#4A8FFF', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            ⚡ Iniciar Recarga
          </button>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ padding: '0 20px 16px' }}>
        <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.38)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Ações Rápidas</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { icon: '⚡', label: 'Recarregar', href: '/recarga' },
            { icon: '📷', label: 'QR Code', href: '/recarga?qr=1' },
            { icon: '🆘', label: 'SOS Resgate', href: '/sos' },
            { icon: '👤', label: 'Perfil', href: '/perfil' },
          ].map((a, i) => (
            <button key={i} onClick={() => router.push(a.href)} style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <span style={{ fontSize: 24 }}>{a.icon}</span>
              <span style={{ fontSize: 12, color: 'rgba(238,242,247,0.62)', fontWeight: 500 }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Estações próximas */}
      <div style={{ padding: '0 20px' }}>
        <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.38)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Estações Próximas</p>
        {stations.slice(0, 3).map((s, i) => (
          <div key={i} onClick={() => setSelected(s)} style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.status === 'available' ? '#32C95A' : '#FFB800', flexShrink: 0, boxShadow: s.status === 'available' ? '0 0 6px #32C95A' : '0 0 6px #FFB800' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#EEF2F7' }}>{s.name}</p>
              <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.38)', marginTop: 1 }}>{s.city} · {s.powerKw}kW · R${s.pricePerKwh}/kWh</p>
            </div>
            <span style={{ fontSize: 16, color: 'rgba(238,242,247,0.3)' }}>›</span>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#13161B', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '8px 0 10px' }}>
        {[['🏠','Home','/home'],['⚡','Recargar','/recarga'],['🆘','SOS','/sos'],['👤','Perfil','/perfil']].map(([icon,label,href]) => (
          <button key={href} onClick={() => router.push(href as string)} style={{ flex: 1, background: 'transparent', border: 'none', color: href === '/home' ? '#4A8FFF' : 'rgba(238,242,247,0.38)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
