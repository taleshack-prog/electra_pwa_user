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

export default function EstacoesPage() {
  const router = useRouter();
  const [stations, setStations] = useState<Station[]>([]);
  const [selected, setSelected] = useState<Station | null>(null);
  const [view, setView] = useState<'map' | 'list'>('map');

  useEffect(() => {
    const token = localStorage.getItem('electra_token');
    if (!token) { router.replace('/login'); return; }
    fetch('https://electra-dashboard-steel.vercel.app/api/estacoes')
      .then(r => r.json())
      .then(d => { if (d.stations) setStations(d.stations); });

    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'station_select') {
        const s = e.data.station;
        setSelected(s);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [router]);

  const mapaHTML = (sts: Station[]) => `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body,#map{width:100%;height:100%;background:#0A1628;}
.leaflet-tile{filter:brightness(0.85) saturate(0.7) hue-rotate(180deg) invert(1) brightness(0.55);}
.leaflet-control-attribution,.leaflet-control-zoom{display:none;}
.popup{background:rgba(13,19,32,0.97);border:1px solid rgba(0,229,255,0.25);border-radius:16px;padding:14px;min-width:220px;font-family:sans-serif;box-shadow:0 8px 32px rgba(0,0,0,0.5);}
.popup-name{font-size:15px;font-weight:700;color:#EEF2F7;margin-bottom:3px;}
.popup-addr{font-size:11px;color:rgba(238,242,247,0.45);margin-bottom:10px;}
.popup-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;}
.tag{font-size:11px;padding:3px 9px;border-radius:20px;font-weight:500;}
.tag-blue{background:rgba(74,143,255,0.18);color:#4A8FFF;}
.tag-green{background:rgba(50,201,90,0.15);color:#32C95A;}
.tag-amber{background:rgba(255,184,0,0.15);color:#FFB800;}
.popup-btns{display:flex;gap:8px;}
.btn-nav{flex:1;padding:9px;background:#00E5FF;border:none;border-radius:10px;color:#070B14;font-size:13px;font-weight:700;cursor:pointer;}
.btn-charge{flex:1;padding:9px;background:rgba(74,143,255,0.15);border:1px solid rgba(74,143,255,0.3);border-radius:10px;color:#4A8FFF;font-size:13px;font-weight:600;cursor:pointer;}
.leaflet-popup-content-wrapper{background:transparent;border:none;box-shadow:none;padding:0;}
.leaflet-popup-content{margin:0;}
.leaflet-popup-tip-container{display:none;}
</style></head>
<body><div id="map"></div>
<script>
const map=L.map('map',{zoomControl:false,attributionControl:false}).setView([-30.0346,-51.2177],13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
const sts=${JSON.stringify(sts)};
sts.forEach(s=>{
  const cor=s.status==='available'?'#32C95A':'#FFB800';
  const icon=L.divIcon({
    className:'',
    html:'<div style="width:18px;height:18px;border-radius:50%;background:'+cor+';border:2.5px solid #070B14;box-shadow:0 0 14px '+cor+'99;"></div>',
    iconSize:[18,18],iconAnchor:[9,9]
  });
  const marker=L.marker([s.latitude,s.longitude],{icon}).addTo(map);
  const popup='<div class="popup"><div class="popup-name">'+s.name+'</div><div class="popup-addr">'+s.address+', '+s.city+'</div><div class="popup-tags"><span class="tag tag-blue">⚡ '+s.powerKw+'kW</span><span class="tag tag-green">R$'+s.pricePerKwh+'/kWh</span><span class="tag '+(s.status==='available'?'tag-green':'tag-amber')+'">'+(s.status==='available'?'● Livre':'● Ocupado')+'</span></div><div class="popup-btns"><button class="btn-nav" onclick="window.open(\'https://www.google.com/maps/dir/?api=1&destination='+s.latitude+','+s.longitude+'\',\'_blank\')">🗺 Navegar</button><button class="btn-charge" onclick="window.parent.postMessage({type:\'station_select\',station:{id:\''+s.id+'\',name:\''+s.name+'\',address:\''+s.address+'\',city:\''+s.city+'\',status:\''+s.status+'\',powerKw:'+s.powerKw+',pricePerKwh:'+s.pricePerKwh+',latitude:'+s.latitude+',longitude:'+s.longitude+'}},'*')">⚡ Recargar</button></div></div>';
  marker.bindPopup(popup,{maxWidth:260,closeButton:false});
});
const ui=L.divIcon({className:'',html:'<div style="width:16px;height:16px;border-radius:50%;background:#00E5FF;border:3px solid #070B14;box-shadow:0 0 14px #00E5FF99;"></div>',iconSize:[16,16],iconAnchor:[8,8]});
L.marker([-30.0346,-51.2177],{icon:ui}).addTo(map);
</script></body></html>`;

  return (
    <div style={{ height: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ padding: '16px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>⚡ Estações</h2>
          <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{stations.length} postos encontrados</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['map','🗺'],['list','☰']].map(([v,icon])=>(
            <button key={v} onClick={()=>setView(v as 'map'|'list')} style={{ width: 36, height: 36, borderRadius: 10, background: view===v ? '#00E5FF' : '#1A1E25', border: view===v ? 'none' : '1px solid rgba(255,255,255,0.07)', color: view===v ? '#070B14' : 'rgba(238,242,247,0.5)', fontSize: 16, cursor: 'pointer' }}>{icon}</button>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 10px', overflowX: 'auto', flexShrink: 0 }}>
        {[['Todos','#00E5FF'],['Livre','#32C95A'],['DC Fast','#4A8FFF'],['24h','#FFB800']].map(([label,color],i)=>(
          <div key={label} style={{ padding: '6px 14px', borderRadius: 20, background: i===0?'rgba(0,229,255,0.15)':'#1A1E25', border: `1px solid ${i===0?color:'rgba(255,255,255,0.07)'}`, color: i===0?color:'rgba(238,242,247,0.5)', fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0 }}>{label}</div>
        ))}
      </div>

      {/* Mapa ou Lista */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {view === 'map' ? (
          <>
            {stations.length > 0 ? (
              <iframe srcDoc={mapaHTML(stations)} style={{ width: '100%', height: '100%', border: 'none' }} sandbox="allow-scripts allow-same-origin allow-popups" />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(238,242,247,0.3)' }}>Carregando mapa...</div>
            )}
            {/* Legenda */}
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 1000 }}>
              {[['#32C95A','Livre'],['#FFB800','Ocupado'],['#00E5FF','Você']].map(([c,l])=>(
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(13,19,32,0.92)', borderRadius: 8, padding: '3px 10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c as string }} />
                  <span style={{ fontSize: 11, color: 'rgba(238,242,247,0.7)', fontFamily: 'monospace' }}>{l}</span>
                </div>
              ))}
            </div>
            {/* Card da estação selecionada */}
            {selected && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(13,19,32,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px 20px 0 0', padding: 20, zIndex: 1000 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 16, color: '#EEF2F7' }}>{selected.name}</p>
                    <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)', marginTop: 2 }}>{selected.address}, {selected.city}</p>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(238,242,247,0.4)', fontSize: 20, cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <span style={{ background: 'rgba(74,143,255,0.18)', color: '#4A8FFF', fontSize: 12, padding: '4px 10px', borderRadius: 20 }}>⚡ {selected.powerKw}kW</span>
                  <span style={{ background: 'rgba(50,201,90,0.15)', color: '#32C95A', fontSize: 12, padding: '4px 10px', borderRadius: 20 }}>R$ {selected.pricePerKwh}/kWh</span>
                  <span style={{ background: selected.status==='available'?'rgba(50,201,90,0.15)':'rgba(255,184,0,0.15)', color: selected.status==='available'?'#32C95A':'#FFB800', fontSize: 12, padding: '4px 10px', borderRadius: 20 }}>
                    {selected.status==='available'?'● Livre':'● Ocupado'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`, '_blank')} style={{ flex: 1, height: 46, background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 12, color: '#00E5FF', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>🗺 Navegar</button>
                  <button onClick={() => router.push('/recarga?id=' + selected.id)} style={{ flex: 1, height: 46, background: '#4A8FFF', borderRadius: 12, border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>⚡ Recargar</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ overflowY: 'auto', height: '100%', padding: '0 16px 80px' }}>
            {stations.map((s, i) => (
              <div key={i} onClick={() => { setSelected(s); setView('map'); }} style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 10, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 15, color: '#EEF2F7' }}>{s.name}</p>
                    <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{s.address}, {s.city}</p>
                  </div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.status==='available'?'#32C95A':'#FFB800', marginTop: 4, flexShrink: 0, boxShadow: `0 0 6px ${s.status==='available'?'#32C95A':'#FFB800'}` }} />
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

      {/* Bottom Nav */}
      <div style={{ background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '8px 0 10px', flexShrink: 0 }}>
        {[['🏠','Home','/home'],['🗺','Estações','/estacoes'],['🆘','SOS','/sos'],['👤','Perfil','/perfil']].map(([icon,label,href])=>(
          <button key={href} onClick={()=>router.push(href as string)} style={{ flex:1, background:'transparent', border:'none', color: href==='/estacoes'?'#00E5FF':'rgba(238,242,247,0.38)', display:'flex', flexDirection:'column', alignItems:'center', gap:2, fontSize:10, cursor:'pointer' }}>
            <span style={{ fontSize:20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
