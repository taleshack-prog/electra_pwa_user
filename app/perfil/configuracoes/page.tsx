'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [subTela, setSubTela] = useState<string|null>(null);

  const itens = [
    { icon: '🌍', label: 'Idioma', val: 'Português (BR)', tela: 'idioma' },
    { icon: '📏', label: 'Unidades', val: 'Métrico (km, kWh)', tela: 'unidades' },
    { icon: '🔒', label: 'Privacidade', val: '', tela: 'privacidade' },
    { icon: '📄', label: 'Termos de Uso', val: '', tela: 'termos' },
    { icon: '📋', label: 'Política de Privacidade', val: '', tela: 'politica' },
    { icon: 'ℹ️', label: 'Sobre o App', val: 'v1.0.0', tela: 'sobre' },
  ];

  const subTelas: Record<string, JSX.Element> = {
    idioma: (
      <div>
        {['🇧🇷 Português (BR)','🇺🇸 English','🇪🇸 Español'].map((l,i) => (
          <div key={l} style={{ background: i===0?'rgba(0,229,255,0.08)':'#1A1E25', border: `1px solid ${i===0?'rgba(0,229,255,0.25)':'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontSize: 14 }}>{l}</span>
            {i===0 && <span style={{ color: '#00E5FF' }}>✓</span>}
          </div>
        ))}
      </div>
    ),
    unidades: (
      <div>
        {[['Métrico','km, kWh, °C',true],['Imperial','mi, kWh, °F',false]].map(([l,d,a]) => (
          <div key={l as string} style={{ background: a?'rgba(0,229,255,0.08)':'#1A1E25', border: `1px solid ${a?'rgba(0,229,255,0.25)':'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div><p style={{ fontSize: 14, fontWeight: 500 }}>{l as string}</p><p style={{ fontSize: 11, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{d as string}</p></div>
            {a && <span style={{ color: '#00E5FF' }}>✓</span>}
          </div>
        ))}
      </div>
    ),
    privacidade: <div style={{ background: '#1A1E25', borderRadius: 14, padding: 16 }}><p style={{ lineHeight: 1.7, color: 'rgba(238,242,247,0.6)', fontSize: 13 }}>A ELECTRA respeita sua privacidade. Seus dados são utilizados exclusivamente para operar a plataforma de carregamento e resgate. Não vendemos seus dados a terceiros.</p></div>,
    termos: <div style={{ background: '#1A1E25', borderRadius: 14, padding: 16 }}><p style={{ lineHeight: 1.7, color: 'rgba(238,242,247,0.6)', fontSize: 13 }}>Ao usar a ELECTRA, você concorda com nossos termos de uso. O serviço é oferecido para proprietários de veículos elétricos no Brasil. O uso indevido do SOS pode resultar em suspensão da conta.</p></div>,
    politica: <div style={{ background: '#1A1E25', borderRadius: 14, padding: 16 }}><p style={{ lineHeight: 1.7, color: 'rgba(238,242,247,0.6)', fontSize: 13 }}>Coletamos localização, dados do veículo e histórico de recargas para melhorar sua experiência. Você pode solicitar exclusão dos seus dados a qualquer momento pelo suporte.</p></div>,
    sobre: (
      <div style={{ textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
        <p style={{ fontSize: 22, fontWeight: 800, color: '#00E5FF', marginBottom: 4 }}>ELECTRA</p>
        <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.4)', marginBottom: 16 }}>Versão 1.0.0</p>
        <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.3)', lineHeight: 1.6 }}>Plataforma de carregamento e resgate para veículos elétricos no Brasil. Desenvolvido por HackTechFarm.</p>
      </div>
    ),
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => subTela ? setSubTela(null) : router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(238,242,247,0.6)', fontSize: 18, cursor: 'pointer' }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{subTela ? itens.find(i=>i.tela===subTela)?.label : '⚙️ Configurações'}</h2>
      </div>
      <div style={{ padding: '0 16px', paddingBottom: 80 }}>
        {!subTela ? (
          itens.map((item, i) => (
            <div key={i} onClick={() => setSubTela(item.tela)} style={{ background: '#1A1E25', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              {item.val && <span style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)' }}>{item.val}</span>}
              <span style={{ color: 'rgba(238,242,247,0.25)', fontSize: 16 }}>›</span>
            </div>
          ))
        ) : (
          subTelas[subTela]
        )}
      </div>
    </div>
  );
}
