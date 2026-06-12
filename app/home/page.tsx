'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{name?: string; email?: string} | null>(null);
  const [estacoes, setEstacoes] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('electra_token');
    const u = localStorage.getItem('electra_user');
    if (!token) { router.replace('/login'); return; }
    if (u) setUser(JSON.parse(u));
    fetch('https://electra-dashboard-steel.vercel.app/api/estacoes')
      .then(r => r.json())
      .then(d => { if (d.stations) setEstacoes(d.stations); });
  }, [router]);

  const logout = () => {
    localStorage.removeItem('electra_token');
    localStorage.removeItem('electra_user');
    router.replace('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'rgba(238,242,247,0.4)', fontSize: 12 }}>Olá,</p>
          <h2 style={{ color: '#EEF2F7', fontSize: 20, fontWeight: 700 }}>{user?.name || 'Usuário'} ⚡</h2>
        </div>
        <button onClick={logout} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '6px 14px', color: 'rgba(238,242,247,0.6)', fontSize: 13 }}>Sair</button>
      </div>

      {/* SOS Button */}
      <div style={{ padding: '0 20px 20px' }}>
        <button onClick={() => router.push('/sos')} style={{ width: '100%', padding: 20, background: 'rgba(255,59,92,0.15)', border: '2px solid #FF3B5C', borderRadius: 16, color: '#FF3B5C', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          🆘 Solicitar Resgate SOS
        </button>
      </div>

      {/* Estações */}
      <div style={{ padding: '0 20px' }}>
        <h3 style={{ color: '#EEF2F7', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>⚡ Estações próximas</h3>
        {estacoes.length === 0 && (
          <div style={{ background: '#111620', borderRadius: 12, padding: 20, textAlign: 'center', color: 'rgba(238,242,247,0.4)' }}>
            Nenhuma estação encontrada
          </div>
        )}
        {estacoes.map((s, i) => (
          <div key={i} style={{ background: '#111620', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: '#EEF2F7', fontWeight: 600, fontSize: 15 }}>{s.name}</p>
                <p style={{ color: 'rgba(238,242,247,0.4)', fontSize: 12, marginTop: 2 }}>{s.address}</p>
              </div>
              <span style={{ background: s.status === 'available' ? 'rgba(0,255,135,0.15)' : 'rgba(255,59,92,0.15)', color: s.status === 'available' ? '#00FF87' : '#FF3B5C', fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>
                {s.status === 'available' ? 'Livre' : 'Ocupado'}
              </span>
            </div>
            {s.pricePerKwh && <p style={{ color: '#00E5FF', fontSize: 13, marginTop: 8 }}>R$ {s.pricePerKwh}/kWh</p>}
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', padding: '10px 0' }}>
        {[['🏠','Home','/home'],['⚡','Recargar','/recarga'],['🆘','SOS','/sos'],['👤','Perfil','/perfil']].map(([icon,label,href]) => (
          <button key={href} onClick={() => router.push(href)} style={{ flex: 1, background: 'transparent', color: href === '/home' ? '#00E5FF' : 'rgba(238,242,247,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, padding: '4px 0' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
