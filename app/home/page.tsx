'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';
import ElectraVoice from '../components/ElectraVoice';

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

export default function HomePage() {
  const router = useRouter();
  const mapDivRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<{map: any; L: any} | null>(null);
  const [user, setUser] = useState<{name?: string; email?: string} | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('electra_token');
    const u = localStorage.getItem('electra_user');
    if (!token) { router.replace('/login'); return; }
    if (u) setUser(JSON.parse(u));
    fetch('https://electra-dashboard-steel.vercel.app/api/estacoes')
      .then(r => r.json())
      .then(d => { if (d.stations) setStations(d.stations); });
  }, [router]);

  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;
    import('leaflet').then(L => {
      const map = L.map(mapDivRef.current!, { zoomControl: false, attributionControl: false })
        .setView([-30.0346, -51.2177], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      const style = document.createElement('style');
      style.textContent = '.leaflet-tile{filter:brightness(0.85) saturate(0.7) hue-rotate(180deg) invert(1) brightness(0.55)!important;} .leaflet-popup-content-wrapper{background:transparent;border:none;box-shadow:none;padding:0;} .leaflet-popup-content{margin:0;} .leaflet-popup-tip-container{display:none;}';
      document.head.appendChild(style);
      mapRef.current = { map, L };
      setMapReady(true);
    });
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || stations.length === 0) return;
    const { map, L } = mapRef.current;

    stations.forEach((s: Station) => {
      const cor = s.status === 'available' ? '#32C95A' : '#FFB800';
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;border-radius:50%;background:${cor};border:2.5px solid #070B14;box-shadow:0 0 12px ${cor}99;"></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8], popupAnchor: [0, -10],
      });
      const popup = `<div style="background:rgba(13,19,32,0.97);border:1px solid rgba(0,229,255,0.25);border-radius:14px;padding:12px;min-width:200px;font-family:sans-serif;">
        <div style="font-size:14px;font-weight:700;color:#EEF2F7;margin-bottom:2px;">${s.name}</div>
        <div style="font-size:11px;color:rgba(238,242,247,0.45);margin-bottom:8px;">${s.address}</div>
        <div style="display:flex;gap:6px;margin-bottom:8px;">
          <span style="font-size:11px;padding:2px 8px;border-radius:20px;background:rgba(74,143,255,0.18);color:#4A8FFF;">⚡ ${s.powerKw}kW</span>
          <span style="font-size:11px;padding:2px 8px;border-radius:20px;background:${s.status==='available'?'rgba(50,201,90,0.15)':'rgba(255,184,0,0.15)'};color:${s.status==='available'?'#32C95A':'#FFB800'};">${s.status==='available'?'● Livre':'● Ocupado'}</span>
        </div>
        <div style="display:flex;gap:6px;">
          <button onclick="location.href='/recarga?id=${s.id}'" style="flex:1;padding:8px;background:#4A8FFF;border:none;border-radius:8px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">⚡ Recargar</button>
          <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}','_blank')" style="flex:1;padding:8px;background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.25);border-radius:8px;color:#00E5FF;font-size:12px;cursor:pointer;">🗺 Ir</button>
        </div>
      </div>`;
      L.marker([s.latitude, s.longitude], { icon }).addTo(map).bindPopup(popup, { maxWidth: 240 });
    });

    const ui = L.divIcon({
      className: '',
      html: '<div style="width:14px;height:14px;border-radius:50%;background:#00E5FF;border:3px solid #070B14;box-shadow:0 0 12px #00E5FF99;"></div>',
      iconSize: [14, 14], iconAnchor: [7, 7],
    });
    L.marker([-30.0346, -51.2177], { icon: ui }).addTo(map);
  }, [mapReady, stations]);

  return (
    <div style={{ height: '100vh', background: '#0C0E12', color: '#EEF2F7', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>

      {/* MAPA TELA INTEIRA */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '52vh' }}>
        <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, #0C0E12)', pointerEvents: 'none', zIndex: 1000 }} />
        {/* Legenda */}
        <div style={{ position: 'absolute', bottom: 88, right: 14, display: 'flex', flexDirection: 'column', gap: 5, zIndex: 1000 }}>
          {[['#32C95A','Livre'],['#FFB800','Ocupado']].map(([c,l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(13,19,32,0.9)', borderRadius: 8, padding: '3px 8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
              <span style={{ fontSize: 10, color: 'rgba(238,242,247,0.6)', fontFamily: 'monospace' }}>{l}</span>
            </div>
          ))}
        </div>
        {/* Header flutuante */}
        <div style={{ position: 'absolute', top: 48, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'rgba(13,19,32,0.92)', borderRadius: 14, padding: '8px 14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 11, color: 'rgba(238,242,247,0.4)' }}>Olá,</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#EEF2F7' }}>{user?.name?.split(' ')[0] || 'Usuário'} 👋</div>
          </div>
          <button onClick={() => router.push('/perfil')} style={{ width: 42, height: 42, borderRadius: 21, background: 'rgba(13,19,32,0.92)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</button>
        </div>
      </div>

      {/* CARDS */}
      <div style={{ position: 'absolute', top: 'calc(52vh - 20px)', left: 0, right: 0, bottom: 72, overflowY: 'auto', padding: '0 16px 16px' }}>
        {/* Card Bateria */}
        <div style={{ background: 'rgba(13,19,32,0.97)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, padding: 18, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(238,242,247,0.35)', letterSpacing: 1, marginBottom: 4 }}>BYD SEAL 03</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ fontSize: 52, fontWeight: 800, color: '#00E5FF', lineHeight: 1 }}>42</span>
                <span style={{ fontSize: 18, color: 'rgba(238,242,247,0.4)' }}>%</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(238,242,247,0.4)', marginTop: 4 }}>Autonomia · <span style={{ color: '#00E5FF' }}>168 km</span></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 54, height: 26, border: '1.5px solid #00E5FF', borderRadius: 5, padding: 2, overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', background: '#00E5FF', borderRadius: 2 }} />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#00E5FF' }}>✓ OK</span>
            </div>
          </div>
          <div style={{ height: 5, background: '#1A2236', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ width: '42%', height: '100%', background: '#00E5FF', borderRadius: 3 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {['0%','42%','100%'].map(l => <span key={l} style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(238,242,247,0.2)' }}>{l}</span>)}
          </div>
        </div>

        {/* Card IA */}
        <div style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.18)', borderRadius: 20, padding: 16, marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🤖</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#00E5FF', letterSpacing: 1 }}>IA RESCUE</span>
                <span style={{ background: 'rgba(0,229,255,0.15)', borderRadius: 20, padding: '1px 6px', fontSize: 9, color: '#00E5FF', fontFamily: 'monospace' }}>ATIVO</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.7)', lineHeight: 1.5 }}>Com 42% de bateria, você tem ~168km. Posto a <span style={{ color: '#00E5FF', fontWeight: 600 }}>2,3km</span></p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => router.push('/estacoes')} style={{ flex: 1, height: 34, background: '#00E5FF', borderRadius: 10, border: 'none', color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Ver posto</button>
            <button style={{ flex: 1, height: 34, background: 'transparent', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(238,242,247,0.5)', fontSize: 13, cursor: 'pointer' }}>Ignorar</button>
          </div>
        </div>

        {/* Card SOS */}
        <button onClick={() => router.push('/sos')} style={{ width: '100%', background: 'rgba(255,59,92,0.08)', border: '1px solid rgba(255,59,92,0.25)', borderRadius: 20, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(255,59,92,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🆘</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#EEF2F7', marginBottom: 2 }}>Precisa de socorro?</div>
              <div style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)' }}>Resgatista em ~8 min</div>
            </div>
          </div>
          <div style={{ width: 64, height: 44, background: '#FF3B5C', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(255,59,92,0.5)' }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>SOS</span>
          </div>
        </button>
      </div>

      <ElectraVoice />

      {/* Bottom Nav */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '8px 0 10px', zIndex: 100 }}>
        {[['🏠','Home','/home'],['🗺','Estações','/estacoes'],['🆘','SOS','/sos'],['👤','Perfil','/perfil']].map(([icon,label,href]) => (
          <button key={href} onClick={() => router.push(href as string)} style={{ flex: 1, background: 'transparent', border: 'none', color: href==='/home'?'#00E5FF':'rgba(238,242,247,0.38)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
