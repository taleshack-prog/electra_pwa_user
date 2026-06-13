'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';

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

export default function EstacoesPage() {
  const router = useRouter();
  const mapDivRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<{map: any; L: any} | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('electra_token');
    if (!token) { router.replace('/login'); return; }
    fetch('https://electra-dashboard-steel.vercel.app/api/estacoes')
      .then(r => r.json())
      .then(d => { if (d.stations) setStations(d.stations); });
  }, [router]);

  useEffect(() => {
    if (view !== 'map' || !mapDivRef.current || mapRef.current) return;
    
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
  }, [view]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || stations.length === 0) return;
    const { map, L } = mapRef.current;

    stations.forEach((s: Station) => {
      const cor = s.status === 'available' ? '#32C95A' : '#FFB800';
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:18px;height:18px;border-radius:50%;background:${cor};border:2.5px solid #070B14;box-shadow:0 0 14px ${cor}99;"></div>`,
        iconSize: [18, 18], iconAnchor: [9, 9], popupAnchor: [0, -12],
      });

      const popup = `<div style="background:rgba(13,19,32,0.97);border:1px solid rgba(0,229,255,0.25);border-radius:16px;padding:14px;min-width:220px;font-family:sans-serif;box-shadow:0 8px 32px rgba(0,0,0,0.5);">
        <div style="font-size:15px;font-weight:700;color:#EEF2F7;margin-bottom:3px;">${s.name}</div>
        <div style="font-size:11px;color:rgba(238,242,247,0.45);margin-bottom:10px;">${s.address}, ${s.city}</div>
        <div style="display:flex;gap:6px;margin-bottom:10px;">
          <span style="font-size:11px;padding:3px 9px;border-radius:20px;background:rgba(74,143,255,0.18);color:#4A8FFF;">⚡ ${s.powerKw}kW</span>
          <span style="font-size:11px;padding:3px 9px;border-radius:20px;background:${s.status==='available'?'rgba(50,201,90,0.15)':'rgba(255,184,0,0.15)'};color:${s.status==='available'?'#32C95A':'#FFB800'};">${s.status==='available'?'● Livre':'● Ocupado'}</span>
        </div>
        <div style="display:flex;gap:8px;">
          <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}','_blank')" style="flex:1;padding:9px;background:#00E5FF;border:none;border-radius:10px;color:#070B14;font-size:13px;font-weight:700;cursor:pointer;">🗺 Navegar</button>
          <button onclick="location.href='/recarga?id=${s.id}'" style="flex:1;padding:9px;background:rgba(74,143,255,0.15);border:1px solid rgba(74,143,255,0.3);border-radius:10px;color:#4A8FFF;font-size:13px;cursor:pointer;">⚡ Recargar</button>
        </div>
      </div>`;

      L.marker([s.latitude, s.longitude], { icon }).addTo(map).bindPopup(popup, { maxWidth: 260 });
    });

    const ui = L.divIcon({
      className: '',
      html: '<div style="width:16px;height:16px;border-radius:50%;background:#00E5FF;border:3px solid #070B14;box-shadow:0 0 14px #00E5FF99;"></div>',
      iconSize: [16, 16], iconAnchor: [8, 8],
    });
    L.marker([-30.0346, -51.2177], { icon: ui }).addTo(map);
  }, [mapReady, stations]);

  return (
    <div style={{ height: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>⚡ Estações</h2>
          <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{stations.length} postos encontrados</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['map','list'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} style={{ width: 36, height: 36, borderRadius: 10, background: view===v?'#00E5FF':'#1A1E25', border: view===v?'none':'1px solid rgba(255,255,255,0.07)', color: view===v?'#070B14':'rgba(238,242,247,0.5)', fontSize: 16, cursor: 'pointer' }}>{v==='map'?'🗺':'☰'}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {view === 'map' ? (
          <>
            <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 1000 }}>
              {[['#32C95A','Livre'],['#FFB800','Ocupado'],['#00E5FF','Você']].map(([c,l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(13,19,32,0.92)', borderRadius: 8, padding: '3px 10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                  <span style={{ fontSize: 11, color: 'rgba(238,242,247,0.7)', fontFamily: 'monospace' }}>{l}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ overflowY: 'auto', height: '100%', padding: '0 16px 80px' }}>
            {stations.map((s, i) => (
              <div key={i} onClick={() => setView('map')} style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 10, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</p>
                    <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{s.address}, {s.city}</p>
                  </div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.status==='available'?'#32C95A':'#FFB800', marginTop: 4 }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ background: 'rgba(74,143,255,0.18)', color: '#4A8FFF', fontSize: 11, padding: '3px 8px', borderRadius: 20 }}>⚡ {s.powerKw}kW</span>
                  <span style={{ background: 'rgba(50,201,90,0.15)', color: '#32C95A', fontSize: 11, padding: '3px 8px', borderRadius: 20 }}>R$ {s.pricePerKwh}/kWh</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '8px 0 10px', flexShrink: 0 }}>
        {[['🏠','Home','/home'],['🗺','Estações','/estacoes'],['🆘','SOS','/sos'],['👤','Perfil','/perfil']].map(([icon,label,href]) => (
          <button key={href} onClick={() => router.push(href as string)} style={{ flex: 1, background: 'transparent', border: 'none', color: href==='/estacoes'?'#00E5FF':'rgba(238,242,247,0.38)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
