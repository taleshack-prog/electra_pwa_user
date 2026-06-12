'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const entrar = async () => {
    setLoading(true); setErro('');
    try {
      const r = await fetch('https://electra-dashboard-steel.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      });
      const d = await r.json();
      if (d.ok) {
        localStorage.setItem('electra_token', d.token);
        localStorage.setItem('electra_user', JSON.stringify(d.user));
        router.push('/home');
      } else {
        setErro(d.error || 'Credenciais inválidas');
      }
    } catch { setErro('Erro de conexão'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ fontSize: 56, marginBottom: 8 }}>⚡</div>
      <h1 style={{ fontFamily: 'sans-serif', fontSize: 28, fontWeight: 800, color: '#00E5FF', marginBottom: 4 }}>ELECTRA</h1>
      <p style={{ color: 'rgba(238,242,247,0.4)', fontSize: 13, marginBottom: 40 }}>EV Charging Platform</p>

      <div style={{ width: '100%', maxWidth: 380 }}>
        <input
          type="email" placeholder="E-mail" value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '14px 16px', background: '#111620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#EEF2F7', fontSize: 15, marginBottom: 12 }}
        />
        <input
          type="password" placeholder="Senha" value={senha}
          onChange={e => setSenha(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && entrar()}
          style={{ width: '100%', padding: '14px 16px', background: '#111620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#EEF2F7', fontSize: 15, marginBottom: 16 }}
        />
        {erro && <p style={{ color: '#FF3B5C', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{erro}</p>}
        <button onClick={entrar} disabled={loading} style={{ width: '100%', padding: '16px', background: '#00E5FF', borderRadius: 12, color: '#070B14', fontSize: 16, fontWeight: 700 }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <button onClick={() => router.push('/cadastro')} style={{ width: '100%', padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(238,242,247,0.6)', fontSize: 15, marginTop: 12 }}>
          Criar conta
        </button>
      </div>
    </div>
  );
}
