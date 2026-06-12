'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PROBLEMAS = [
  { id: '1', icon: '🔋', label: 'Bateria descarregada' },
  { id: '2', icon: '🔌', label: 'Problema no carregador' },
  { id: '3', icon: '🚗', label: 'Veículo não liga' },
  { id: '4', icon: '⚡', label: 'Falha elétrica' },
  { id: '5', icon: '🛞', label: 'Pneu furado' },
  { id: '6', icon: '❓', label: 'Outro problema' },
];

export default function ConfirmarSocorroPage() {
  const router = useRouter();
  const [problema, setProblema] = useState('1');
  const [confirmando, setConfirmando] = useState(false);

  const confirmar = async () => {
    setConfirmando(true);
    const token = localStorage.getItem('electra_token');
    try {
      await fetch('https://electra-dashboard-steel.vercel.app/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ latitude: -30.0346, longitude: -51.2177, address: 'Porto Alegre, RS', description: PROBLEMAS.find(p=>p.id===problema)?.label, urgencyLevel: 'high' }),
      });
    } catch {}
    setConfirmando(false);
    router.push('/tracking');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: '#1A2236', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(238,242,247,0.6)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontSize: 17, fontWeight: 700 }}>Confirmar Socorro</div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '0 16px', overflowY: 'auto', paddingBottom: 100 }}>
        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)', borderRadius: 12, padding: 12, marginBottom: 20 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF87' }} />
          <span style={{ fontSize: 13, color: 'rgba(238,242,247,0.7)' }}>Resgatista disponível a <strong style={{ color: '#00FF87' }}>2,3 km</strong></span>
        </div>

        {/* Localização */}
        <div style={{ fontSize: 10, color: 'rgba(238,242,247,0.35)', letterSpacing: 2, marginBottom: 10 }}>SUA LOCALIZAÇÃO</div>
        <div style={{ display: 'flex', gap: 10, background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 14, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,59,92,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📍</div>
          <div>
            <div style={{ fontSize: 13, color: '#EEF2F7', lineHeight: 1.5 }}>Porto Alegre, RS — Brasil</div>
            <div style={{ fontSize: 12, color: '#00E5FF', marginTop: 4, cursor: 'pointer' }}>Corrigir endereço</div>
          </div>
        </div>

        {/* Mini mapa */}
        <div style={{ height: 140, background: '#0A1628', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 20, overflow: 'hidden', position: 'relative' }}>
          <iframe
            srcDoc={`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><style>*{margin:0;padding:0;}html,body,#map{width:100%;height:100%;background:#0A1628;}.leaflet-tile{filter:brightness(0.7) saturate(0.5) hue-rotate(180deg) invert(1) brightness(0.5);}.leaflet-control-attribution{display:none;}</style></head><body><div id="map"></div><script>const map=L.map('map',{zoomControl:false,attributionControl:false}).setView([-30.0346,-51.2177],14);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);const ui=L.divIcon({className:'',html:'<div style="width:14px;height:14px;border-radius:50%;background:#FF3B5C;border:3px solid #070B14;box-shadow:0 0 12px #FF3B5C88;"></div>',iconSize:[14,14],iconAnchor:[7,7]});L.marker([-30.0346,-51.2177],{icon:ui}).addTo(map);const ri=L.divIcon({className:'',html:'<div style="background:#111827;border:2px solid #00E5FF;border-radius:8px;padding:3px 5px;font-size:16px;">🚐</div>',iconSize:[36,30],iconAnchor:[18,15]});L.marker([-30.0200,-51.2100],{icon:ri}).addTo(map);L.polyline([[-30.0200,-51.2100],[-30.0346,-51.2177]],{color:'#00E5FF',weight:2,dashArray:'8,6',opacity:0.6}).addTo(map);</script></body></html>`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            sandbox="allow-scripts"
          />
        </div>

        {/* Tipo problema */}
        <div style={{ fontSize: 10, color: 'rgba(238,242,247,0.35)', letterSpacing: 2, marginBottom: 10 }}>TIPO DE PROBLEMA</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {PROBLEMAS.map(p => (
            <div key={p.id} onClick={() => setProblema(p.id)} style={{ background: problema===p.id ? 'rgba(255,59,92,0.08)' : '#111827', border: `1px solid ${problema===p.id ? 'rgba(255,59,92,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', position: 'relative' }}>
              <span style={{ fontSize: 20 }}>{p.icon}</span>
              <span style={{ fontSize: 13, color: problema===p.id ? '#EEF2F7' : 'rgba(238,242,247,0.6)', flex: 1, lineHeight: 1.3 }}>{p.label}</span>
              {problema===p.id && <div style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, background: '#FF3B5C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>✓</div>}
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 16, marginBottom: 20 }}>
          {[['Problema', PROBLEMAS.find(p=>p.id===problema)?.label, '#EEF2F7'],['Tempo estimado','~8 minutos','#00FF87'],['Custo estimado','R$ 85,00','#00E5FF']].map(([label,val,color])=>(
            <div key={label as string}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ fontSize: 13, color: 'rgba(238,242,247,0.4)' }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: color as string }}>{val}</span>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
            </div>
          ))}
        </div>

        {/* Botões */}
        <button onClick={confirmar} disabled={confirmando} style={{ width: '100%', height: 56, background: '#FF3B5C', borderRadius: 16, border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 10, boxShadow: '0 0 20px rgba(255,59,92,0.4)', opacity: confirmando ? 0.7 : 1 }}>
          {confirmando ? 'Enviando...' : '✅ Confirmar Socorro'}
        </button>
        <button onClick={() => router.back()} style={{ width: '100%', height: 50, background: 'transparent', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 16, color: 'rgba(238,242,247,0.5)', fontSize: 15, cursor: 'pointer' }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
