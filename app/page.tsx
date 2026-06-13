'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [showCadastro, setShowCadastro] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', lgpd: false });
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('electra_token');
    if (token) router.replace('/home');
    const t = setInterval(() => setTick(x => x + 1), 60);
    return () => clearInterval(t);
  }, [router]);

  const cadastrar = async () => {
    if (!form.name || !form.email || !form.password) { setErro('Preencha todos os campos.'); return; }
    if (!form.lgpd) { setErro('Aceite a Política de Privacidade para continuar.'); return; }
    setSaving(true); setErro('');
    try {
      const r = await fetch('https://electra-dashboard-steel.vercel.app/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const d = await r.json();
      if (d.token) {
        localStorage.setItem('electra_token', d.token);
        localStorage.setItem('electra_user', JSON.stringify(d.user));
        router.push('/home');
      } else { setErro(d.error || 'Erro ao criar conta.'); }
    } catch { setErro('Sem conexão. Tente novamente.'); }
    setSaving(false);
  };

  const pulso = Math.sin(tick * 0.08) * 0.15 + 1;

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(0,229,255,0.3); }
        .glow { animation: glow 3s ease-in-out infinite; }
        @keyframes glow { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        .fade-up { animation: fadeUp 0.8s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .bolt-pulse { animation: boltPulse 2s ease-in-out infinite; }
        @keyframes boltPulse { 0%,100% { filter:drop-shadow(0 0 20px #00E5FF88); } 50% { filter:drop-shadow(0 0 40px #00E5FF); } }
        input:focus { outline: none; border-color: #00E5FF !important; }
        input { transition: border-color 0.2s; }
        .feature-card:hover { border-color: rgba(0,229,255,0.3) !important; transform: translateY(-2px); transition: all 0.2s; }
      `}</style>

      {/* Nav */}
      <nav style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, background: 'rgba(7,11,20,0.92)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" className="bolt-pulse">
            <polygon points="16,2 7,15 13,15 11,26 21,13 15,13" fill="#00E5FF"/>
          </svg>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, letterSpacing: 1, color: '#EEF2F7' }}>ELECTRA</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => router.push('/login')} style={{ padding: '8px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, color: 'rgba(238,242,247,0.7)', fontSize: 13, cursor: 'pointer' }}>Entrar</button>
          <button onClick={() => setShowCadastro(true)} style={{ padding: '8px 18px', background: '#00E5FF', border: 'none', borderRadius: 20, color: '#070B14', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Criar conta</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 480, margin: '0 auto', padding: '72px 24px 48px', textAlign: 'center' }}>
        {/* Orb */}
        <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto 40px' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)', transform: `scale(${pulso})`, transition: 'transform 0.1s' }} />
          <div style={{ position: 'absolute', inset: 20, borderRadius: '50%', border: '1px solid rgba(0,229,255,0.2)' }} />
          <div style={{ position: 'absolute', inset: 40, borderRadius: '50%', border: '1px solid rgba(0,229,255,0.1)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="72" height="72" viewBox="0 0 40 40" className="bolt-pulse">
              <polygon points="23,3 10,21 19,21 17,37 30,19 21,19" fill="#00E5FF"/>
            </svg>
          </div>
        </div>

        <div className="fade-up">
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#00E5FF', letterSpacing: 3, marginBottom: 16, opacity: 0.7 }}>PLATAFORMA DE CARREGAMENTO EV · BRASIL</p>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 42, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: '#EEF2F7' }}>
            Carregue.<br />
            <span style={{ color: '#00E5FF' }}>Resgate.</span><br />
            Continue.
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(238,242,247,0.55)', lineHeight: 1.7, marginBottom: 36, maxWidth: 360, margin: '0 auto 36px' }}>
            A única plataforma que conecta donos de EVs a eletropostos em tempo real — e envia um resgatista quando a bateria zera.
          </p>
          <button onClick={() => setShowCadastro(true)} style={{ padding: '16px 40px', background: '#00E5FF', border: 'none', borderRadius: 14, color: '#070B14', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 40px rgba(0,229,255,0.3)' }}>
            Faça seu cadastro
          </button>
          <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.25)', marginTop: 12 }}>Sem cartão de crédito · Cancela quando quiser</p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[['⚡','Eletropostos','em Porto Alegre'],['🚐','< 8 min','tempo de resgate'],['🔋','24/7','disponibilidade']].map(([icon,val,label]) => (
            <div key={label} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#00E5FF', marginBottom: 2 }}>{val}</div>
              <div style={{ fontSize: 10, color: 'rgba(238,242,247,0.35)', lineHeight: 1.3 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px 64px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(238,242,247,0.3)', letterSpacing: 3, marginBottom: 24, textAlign: 'center' }}>O QUE A ELECTRA FAZ</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: '🗺', title: 'Mapa em tempo real', desc: 'Encontre eletropostos livres perto de você. Veja preço, potência e disponibilidade antes de sair.' },
            { icon: '⚡', title: 'Recarga com QR Code', desc: 'Aponte o celular, confirme e a recarga começa. Acompanhe kWh, custo e tempo estimado na tela.' },
            { icon: '🆘', title: 'SOS Rescue 24h', desc: 'Ficou sem bateria? Pressione o botão e um resgatista elétrico chega em até 8 minutos com carga.' },
            { icon: '🤖', title: 'ELECTRA IA de voz', desc: 'Diga "posto mais próximo" e a IA guia você até lá. Acione socorro por voz sem tirar os olhos da estrada.' },
          ].map(f => (
            <div key={f.title} className="feature-card" style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start', cursor: 'default' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,229,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: '#EEF2F7' }}>{f.title}</p>
                <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.45)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.08), rgba(0,255,135,0.05))', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 24, padding: '40px 24px' }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>⚡</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 12 }}>Pronto para carregar?</h2>
          <p style={{ fontSize: 14, color: 'rgba(238,242,247,0.5)', marginBottom: 24, lineHeight: 1.6 }}>Crie sua conta em 30 segundos e encontre o posto mais próximo agora.</p>
          <button onClick={() => setShowCadastro(true)} style={{ padding: '14px 36px', background: '#00E5FF', border: 'none', borderRadius: 12, color: '#070B14', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Faça seu cadastro</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <svg width="16" height="16" viewBox="0 0 28 28"><polygon points="16,2 7,15 13,15 11,26 21,13 15,13" fill="#00E5FF"/></svg>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: '#EEF2F7' }}>ELECTRA</span>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.2)' }}>© 2026 ELECTRA · HackTechFarm · Porto Alegre, Brasil</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12 }}>
          {['Privacidade', 'Termos', 'Suporte'].map(l => (
            <span key={l} style={{ fontSize: 11, color: 'rgba(238,242,247,0.25)', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>

      {/* Modal Cadastro */}
      {showCadastro && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: '#0D1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px 24px 0 0', padding: '28px 24px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div>
                <h3 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800 }}>Criar conta</h3>
                <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.35)', marginTop: 2 }}>Grátis · Sem cartão</p>
              </div>
              <button onClick={() => { setShowCadastro(false); setErro(''); }} style={{ background: 'transparent', border: 'none', color: 'rgba(238,242,247,0.3)', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ marginTop: 20 }}>
              {[{ label: 'Nome completo', key: 'name', type: 'text', placeholder: 'Seu nome' }, { label: 'E-mail', key: 'email', type: 'email', placeholder: 'seu@email.com' }, { label: 'Senha', key: 'password', type: 'password', placeholder: 'Mínimo 6 caracteres' }].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, color: 'rgba(238,242,247,0.38)', fontFamily: 'monospace', letterSpacing: 1, display: 'block', marginBottom: 6 }}>{f.label.toUpperCase()}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form] as string}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '13px 14px', background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#EEF2F7', fontSize: 15 }} />
                </div>
              ))}

              {/* LGPD */}
              <div style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.12)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.5)', lineHeight: 1.6, marginBottom: 12 }}>
                  Seus dados são protegidos pela <strong style={{ color: '#EEF2F7' }}>LGPD (Lei 13.709/2018)</strong>. Utilizamos suas informações exclusivamente para operar os serviços ELECTRA — localização de eletropostos, resgate de emergência e histórico de recargas. Não compartilhamos dados com terceiros para fins comerciais.
                </p>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <div onClick={() => setForm(p => ({ ...p, lgpd: !p.lgpd }))} style={{ width: 20, height: 20, borderRadius: 6, background: form.lgpd ? '#00E5FF' : '#1A1E25', border: `1px solid ${form.lgpd ? '#00E5FF' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {form.lgpd && <span style={{ fontSize: 12, color: '#070B14', fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(238,242,247,0.55)', lineHeight: 1.5 }}>
                    Li e aceito a <span style={{ color: '#00E5FF', textDecoration: 'underline', cursor: 'pointer' }}>Política de Privacidade</span> e os <span style={{ color: '#00E5FF', textDecoration: 'underline', cursor: 'pointer' }}>Termos de Uso</span> da ELECTRA, em conformidade com a LGPD.
                  </span>
                </label>
              </div>

              {erro && <p style={{ fontSize: 13, color: '#FF3B5C', marginBottom: 12, textAlign: 'center' }}>{erro}</p>}

              <button onClick={cadastrar} disabled={saving} style={{ width: '100%', padding: 16, background: '#00E5FF', border: 'none', borderRadius: 14, color: '#070B14', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 30px rgba(0,229,255,0.25)', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Criando conta...' : '⚡ Faça seu cadastro'}
              </button>
              <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(238,242,247,0.35)', marginTop: 14 }}>
                Já tem conta? <span onClick={() => router.push('/login')} style={{ color: '#00E5FF', cursor: 'pointer' }}>Entrar</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
