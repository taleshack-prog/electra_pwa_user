'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<{name?: string; email?: string; points?: number; level?: string} | null>(null);

  useEffect(() => {
    const u = localStorage.getItem('electra_user');
    if (!u) { router.replace('/login'); return; }
    setUser(JSON.parse(u));
  }, [router]);

  const logout = () => {
    localStorage.removeItem('electra_token');
    localStorage.removeItem('electra_user');
    router.replace('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', paddingBottom: 80 }}>
      <div style={{ padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,229,255,0.15)', border: '2px solid #00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32 }}>👤</div>
        <h2 style={{ color: '#EEF2F7', fontSize: 22, fontWeight: 700 }}>{user?.name}</h2>
        <button onClick={() => router.push('/perfil/editar')} style={{ background: 'transparent', border: 'none', color: '#00E5FF', fontSize: 13, cursor: 'pointer', marginTop: 4 }}>✏️ Editar perfil</button>
        <p style={{ color: 'rgba(238,242,247,0.4)', fontSize: 14 }}>{user?.email}</p>
      </div>

      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#111620', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#00E5FF' }}>{user?.points || 0}</div>
          <div style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)' }}>Pontos</div>
        </div>
        <div style={{ background: '#111620', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#00FF87' }}>{user?.level || 'Bronze'}</div>
          <div style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)' }}>Nível</div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {[
          { icon: '🚗', label: 'Meus Veículos', href: '/perfil/veiculos' },
          { icon: '📋', label: 'Histórico de Recargas', href: '/perfil/historico' },
          { icon: '💳', label: 'Métodos de Pagamento', href: '/perfil/pagamentos' },
          { icon: '🔔', label: 'Notificações', href: '/perfil/notificacoes' },
          { icon: '⚙️', label: 'Configurações', href: '/perfil/configuracoes' },
        ].map((item, i) => (
          <div key={i} onClick={() => item.href && router.push(item.href)} style={{ background: '#111620', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ color: '#EEF2F7', fontSize: 15 }}>{item.label}</span>
            <span style={{ marginLeft: 'auto', color: 'rgba(238,242,247,0.3)' }}>›</span>
          </div>
        ))}
        <button onClick={logout} style={{ width: '100%', padding: 14, background: 'rgba(255,59,92,0.1)', border: '1px solid rgba(255,59,92,0.3)', borderRadius: 12, color: '#FF3B5C', fontSize: 15, fontWeight: 600, marginTop: 8 }}>
          Sair da Conta
        </button>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', padding: '10px 0' }}>
        {[['🏠','Home','/home'],['🗺','Estações','/estacoes'],['🆘','SOS','/sos'],['👤','Perfil','/perfil']].map(([icon,label,href]) => (
          <button key={href} onClick={() => router.push(href as string)} style={{ flex: 1, background: 'transparent', color: href === '/perfil' ? '#00E5FF' : 'rgba(238,242,247,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, padding: '4px 0', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
