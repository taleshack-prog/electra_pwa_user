'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PagamentosPage() {
  const router = useRouter();
  const [aba, setAba] = useState<'metodos'|'creditos'>('metodos');
  const [metodos] = useState([
    { tipo: 'PIX', detalhe: 'Pagamento instantâneo', icon: '⚡', ativo: true },
    { tipo: 'Cartão •••• 4242', detalhe: 'Visa · Expira 12/27', icon: '💳', ativo: false },
    { tipo: 'Cripto', detalhe: 'USDT / BTC / ETH', icon: '🪙', ativo: false },
  ]);
  const [creditos] = useState(320);

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(238,242,247,0.6)', fontSize: 18, cursor: 'pointer' }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>💳 Pagamentos</h2>
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px', marginBottom: 20 }}>
        {[['metodos','Métodos'],['creditos','Créditos']].map(([v,l]) => (
          <button key={v} onClick={() => setAba(v as 'metodos' | 'creditos')} style={{ flex: 1, padding: '10px', borderRadius: 12, background: aba===v?'#00E5FF':'#1A1E25', border: aba===v?'none':'1px solid rgba(255,255,255,0.07)', color: aba===v?'#070B14':'rgba(238,242,247,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: '0 16px', paddingBottom: 80 }}>
        {aba === 'metodos' && (
          <>
            {metodos.map((m, i) => (
              <div key={i} style={{ background: '#1A1E25', border: `1px solid ${m.ativo?'rgba(0,229,255,0.25)':'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,229,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{m.tipo}</p>
                  <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{m.detalhe}</p>
                </div>
                {m.ativo && <span style={{ color: '#00FF87', fontSize: 12, fontFamily: 'monospace' }}>✓ ATIVO</span>}
              </div>
            ))}
            <div style={{ marginTop: 16, fontSize: 11, color: 'rgba(238,242,247,0.3)', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 10 }}>ADICIONAR MÉTODO</div>
            {[['💳','Cartão de débito'],['🪙','Criptomoedas (USDT/BTC/ETH)'],['🎫','Créditos ELECTRA']].map(([icon,label]) => (
              <button key={label} style={{ width: '100%', padding: '13px 16px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(238,242,247,0.5)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{icon}</span>{label}
                <span style={{ marginLeft: 'auto' }}>+</span>
              </button>
            ))}
          </>
        )}

        {aba === 'creditos' && (
          <>
            <div style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,255,135,0.08))', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 20, padding: 24, textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'rgba(238,242,247,0.4)', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 8 }}>SEUS CRÉDITOS</div>
              <div style={{ fontSize: 52, fontWeight: 800, color: '#00E5FF' }}>{creditos}</div>
              <div style={{ fontSize: 13, color: 'rgba(238,242,247,0.4)', marginTop: 4 }}>≈ R$ {(creditos * 0.32).toFixed(2)} em recargas</div>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(238,242,247,0.3)', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 10 }}>COMPRAR CRÉDITOS</div>
            {[['50 créditos','R$ 16,00','⚡'],['100 créditos','R$ 30,00','⚡⚡'],['300 créditos','R$ 80,00','🔥 Popular'],['500 créditos','R$ 120,00','💎 Melhor valor']].map(([qtd,preco,badge]) => (
              <div key={qtd} style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 15 }}>{qtd}</p>
                  <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{badge}</p>
                </div>
                <button style={{ padding: '8px 16px', background: '#00E5FF', border: 'none', borderRadius: 10, color: '#070B14', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{preco}</button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
