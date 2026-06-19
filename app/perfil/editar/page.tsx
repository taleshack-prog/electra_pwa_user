'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditarPerfilPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('electra_user');
    if (u) {
      const user = JSON.parse(u);
      setNome(user.name || '');
      setEmail(user.email || '');
      setTelefone(user.phone || '');
    }
  }, []);

  const salvar = async () => {
    setSaving(true);
    const user = JSON.parse(localStorage.getItem('electra_user') || '{}');
    const updated = { ...user, name: nome, phone: telefone };
    localStorage.setItem('electra_user', JSON.stringify(updated));
    setTimeout(() => { setSaving(false); router.back(); }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(238,242,247,0.6)', fontSize: 18, cursor: 'pointer' }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>✏️ Editar Perfil</h2>
      </div>
      <div style={{ padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,229,255,0.15)', border: '2px solid #00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 32 }}>👤</div>
          <button style={{ background: 'transparent', border: 'none', color: '#00E5FF', fontSize: 13, cursor: 'pointer' }}>Alterar foto</button>
        </div>
        {[
          { label: 'Nome completo', value: nome, onChange: setNome, type: 'text' },
          { label: 'E-mail', value: email, onChange: setEmail, type: 'email' },
          { label: 'Telefone', value: telefone, onChange: setTelefone, type: 'tel' },
        ].map((f, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)', marginBottom: 6, display: 'block', fontFamily: 'monospace', letterSpacing: 1 }}>{f.label.toUpperCase()}</label>
            <input type={f.type} value={f.value} onChange={e => f.onChange(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', background: '#1A1E25', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#EEF2F7', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        ))}
        <button onClick={salvar} disabled={saving} style={{ width: '100%', padding: 16, background: '#00E5FF', borderRadius: 14, border: 'none', color: '#070B14', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8, opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Salvando...' : '✓ Salvar alterações'}
        </button>
      </div>
    </div>
  );
}
