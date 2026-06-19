'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackingPage() {
  const router = useRouter();
  const [eta, setEta] = useState(8);
  const [, setStatus] = useState('A caminho');
  const [distancia, setDistancia] = useState('2,3');

  useEffect(() => {
    const interval = setInterval(() => {
      setEta(e => {
        if (e <= 1) { setStatus('Chegou!'); setDistancia('0,0'); clearInterval(interval); return 0; }
        setDistancia(d => (parseFloat(d) - 0.3).toFixed(1));
        return e - 1;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const mapaHTML = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><style>*{margin:0;padding:0;}html,body,#map{width:100%;height:100%;background:#0A1628;}.leaflet-tile{filter:brightness(0.7) saturate(0.5) hue-rotate(180deg) invert(1) brightness(0.5);}.leaflet-control-attribution{display:none;}</style></head><body><div id="map"></div><script>const map=L.map('map',{zoomControl:false,attributionControl:false}).setView([-30.0273,-51.2138],14);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);const ui=L.divIcon({className:'',html:'<div style="width:16px;height:16px;border-radius:50%;background:#FF3B5C;border:3px solid #070B14;box-shadow:0 0 16px #FF3B5C88;"></div>',iconSize:[16,16],iconAnchor:[8,8]});L.marker([-30.0346,-51.2177],{icon:ui}).addTo(map);const ri=L.divIcon({className:'',html:'<div style="background:#111827;border:2px solid #00E5FF;border-radius:8px;padding:4px 6px;font-size:18px;white-space:nowrap;">🚐</div>',iconSize:[40,34],iconAnchor:[20,17]});const rm=L.marker([-30.0200,-51.2100],{icon:ri}).addTo(map);const steps=[[-30.0200,-51.2100],[-30.0240,-51.2120],[-30.0280,-51.2140],[-30.0310,-51.2155],[-30.0346,-51.2177]];L.polyline(steps,{color:'#00E5FF',weight:2.5,dashArray:'8,6',opacity:0.7}).addTo(map);let s=0;setInterval(()=>{if(s<steps.length-1){s++;rm.setLatLng(steps[s]);}},5000);map.fitBounds([[-30.0200,-51.2100],[-30.0346,-51.2177]],{padding:[40,40]});</script></body></html>`;

  return (
    <div style={{ height: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.25)', borderRadius: 20, padding: '4px 12px' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00FF87' }} />
          <span style={{ fontSize: 12, color: '#00FF87', fontWeight: 600 }}>RESGATE ATIVO</span>
        </div>
      </div>

      {/* Mapa tela inteira */}
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe srcDoc={mapaHTML} style={{ width: '100%', height: '100%', border: 'none' }} sandbox="allow-scripts" />
        {/* Gradiente inferior */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(transparent, #070B14)', pointerEvents: 'none' }} />
      </div>

      {/* Card info */}
      <div style={{ padding: '16px 16px 20px', flexShrink: 0 }}>
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🚐</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Resgatista ELECTRA</div>
                <div style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)' }}>⭐ 4.9 · 234 resgates</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#00E5FF' }}>{eta}</div>
              <div style={{ fontSize: 11, color: 'rgba(238,242,247,0.4)' }}>minutos</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[['📍', distancia + ' km', 'Distância'],['⚡','Elétrico','Veículo'],['🔋','85%','Bateria unidade']].map(([icon,val,label])=>(
              <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 16 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#EEF2F7', marginTop: 3 }}>{val}</div>
                <div style={{ fontSize: 10, color: 'rgba(238,242,247,0.35)', marginTop: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ flex: 1, height: 48, background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 14, color: '#00E5FF', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>📞 Ligar</button>
          <button onClick={() => router.push('/home')} style={{ flex: 1, height: 48, background: 'rgba(255,59,92,0.1)', border: '1px solid rgba(255,59,92,0.25)', borderRadius: 14, color: '#FF3B5C', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>✕ Cancelar</button>
        </div>
      </div>
    </div>
  );
}
