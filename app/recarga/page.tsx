'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

function RecargaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showQR = searchParams.get('qr') === '1';
  const stationId = searchParams.get('id');
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrStation, setQrStation] = useState<Station | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [kwhDelivered, setKwhDelivered] = useState(0);
  const [cost, setCost] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('electra_token');
    if (!token) { router.replace('/login'); return; }
    fetch('https://electra-dashboard-steel.vercel.app/api/estacoes')
      .then(r => r.json())
      .then(d => {
        if (d.stations) {
          setStations(d.stations);
          if (stationId) {
            const s = d.stations.find((s: Station) => s.id === stationId);
            if (s) setQrStation(s);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router, stationId]);

  useEffect(() => {
    if (!sessionActive) return;
    const interval = setInterval(() => {
      setSessionTime(t => t + 1);
      setKwhDelivered(k => parseFloat((k + 0.04).toFixed(2)));
      setCost(c => parseFloat((c + 0.04 * (qrStation?.pricePerKwh || 3.2)).toFixed(2)));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionActive, qrStation]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const QRCode = ({ value }: { value: string }) => {
    const size = 200;
    const modules = 25;
    const cellSize = size / modules;
    const hash = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const pattern = Array.from({length: modules}, (_, i) =>
      Array.from({length: modules}, (_, j) => {
        if (i < 7 && j < 7) return true;
        if (i < 7 && j > modules-8) return true;
        if (i > modules-8 && j < 7) return true;
        return ((i * modules + j + hash) % 3 === 0);
      })
    );
    return (
      <svg width={size} height={size} style={{ background: '#fff', borderRadius: 12, padding: 8 }}>
        {pattern.map((row, i) => row.map((cell, j) => cell ? (
          <rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill="#0C0E12" />
        ) : null))}
      </svg>
    );
  };

  if (qrStation && !sessionActive) {
    return (
      <div style={{ minHeight: '100vh', background: '#0C0E12', color: '#EEF2F7', fontFamily: 'DM Sans, sans-serif', paddingBottom: 80 }}>
        <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setQrStation(null)} style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '6px 14px', color: 'rgba(238,242,247,0.6)', fontSize: 13, cursor: 'pointer' }}>← Voltar</button>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Iniciar Recarga</h2>
        </div>
        <div style={{ padding: '24px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'rgba(238,242,247,0.6)', marginBottom: 6 }}>{qrStation.name}</p>
          <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginBottom: 24 }}>{qrStation.address}, {qrStation.city}</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <QRCode value={`electra://charge/${qrStation.id}`} />
          </div>
          <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.38)', marginBottom: 24 }}>Aponte a câmera do conector ou use o botão abaixo</p>
          <div style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#4A8FFF' }}>{qrStation.powerKw}kW</p>
              <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.38)' }}>Potência</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#32C95A' }}>R${qrStation.pricePerKwh}</p>
              <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.38)' }}>por kWh</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: qrStation.status === 'available' ? '#32C95A' : '#FFB800' }}>
                {qrStation.status === 'available' ? 'Livre' : 'Ocupado'}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.38)' }}>Status</p>
            </div>
          </div>
          <button onClick={() => setSessionActive(true)} disabled={qrStation.status !== 'available'} style={{ width: '100%', padding: '16px', background: qrStation.status === 'available' ? '#4A8FFF' : '#21262F', borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: qrStation.status === 'available' ? 'pointer' : 'not-allowed' }}>
            {qrStation.status === 'available' ? '⚡ Confirmar e Iniciar Recarga' : 'Estação Ocupada'}
          </button>
        </div>
      </div>
    );
  }

  if (sessionActive) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A1628', color: '#EEF2F7', fontFamily: 'DM Sans, sans-serif', paddingBottom: 80 }}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(50,201,90,0.15)', border: '1px solid rgba(50,201,90,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#32C95A' }} />
            <span style={{ fontSize: 12, color: '#32C95A', fontWeight: 600 }}>SESSÃO ATIVA</span>
          </div>
          <div style={{ fontSize: 72, marginBottom: 8 }}>⚡</div>
          <p style={{ fontSize: 14, color: 'rgba(238,242,247,0.6)', marginBottom: 4 }}>{qrStation?.name}</p>
          <p style={{ fontFamily: 'monospace', fontSize: 48, fontWeight: 300, color: '#EEF2F7' }}>{formatTime(sessionTime)}</p>
          <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginBottom: 24 }}>Tempo de sessão</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Energia entregue', value: `${kwhDelivered} kWh`, color: '#4A8FFF' },
              { label: 'Custo acumulado', value: `R$ ${cost.toFixed(2)}`, color: '#32C95A' },
            ].map((m, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</p>
                <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginTop: 4 }}>{m.label}</p>
              </div>
            ))}
          </div>
          <button onClick={() => { setSessionActive(false); setQrStation(null); setSessionTime(0); setKwhDelivered(0); setCost(0); }} style={{ width: '100%', padding: '16px', background: '#FF3B30', borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            ⏹ Parar Recarga
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0C0E12', color: '#EEF2F7', fontFamily: 'DM Sans, sans-serif', paddingBottom: 80 }}>
      <div style={{ padding: '20px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>⚡ Recargas</h2>
          <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>Selecione uma estação</p>
        </div>
        {showQR && <div style={{ fontSize: 12, color: '#4A8FFF' }}>📷 Modo QR</div>}
      </div>
      <div style={{ padding: '0 20px' }}>
        {loading && <div style={{ textAlign: 'center', color: 'rgba(238,242,247,0.38)', padding: 40 }}>Carregando...</div>}
        {stations.map((s, i) => (
          <div key={i} onClick={() => setQrStation(s)} style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 10, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</p>
                <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{s.address}, {s.city}</p>
              </div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.status === 'available' ? '#32C95A' : '#FFB800', marginTop: 4, flexShrink: 0, boxShadow: s.status === 'available' ? '0 0 6px #32C95A' : '0 0 6px #FFB800' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ background: 'rgba(74,143,255,0.14)', color: '#4A8FFF', fontSize: 11, padding: '3px 8px', borderRadius: 20 }}>⚡ {s.powerKw}kW</span>
              <span style={{ background: 'rgba(50,201,90,0.13)', color: '#32C95A', fontSize: 11, padding: '3px 8px', borderRadius: 20 }}>R$ {s.pricePerKwh}/kWh</span>
              <span style={{ background: 'rgba(255,184,0,0.13)', color: '#FFB800', fontSize: 11, padding: '3px 8px', borderRadius: 20 }}>📷 QR Code</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#13161B', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '8px 0 10px' }}>
        {[['🏠','Home','/home'],['⚡','Recargar','/recarga'],['🆘','SOS','/sos'],['👤','Perfil','/perfil']].map(([icon,label,href]) => (
          <button key={href} onClick={() => router.push(href as string)} style={{ flex: 1, background: 'transparent', border: 'none', color: href === '/recarga' ? '#4A8FFF' : 'rgba(238,242,247,0.38)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RecargaPage() {
  return <Suspense fallback={<div style={{background:'#0C0E12',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#EEF2F7'}}>⚡</div>}><RecargaContent /></Suspense>;
}
