'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SOSPage() {
  const router = useRouter();
  const [pressionado, setPressionado] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [rings, setRings] = useState([1,1,1]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('electra_token');
    if (!token) { router.replace('/login'); return; }
    // Anima rings
    let frame = 0;
    const ring = setInterval(() => {
      frame++;
      setRings([
        1 + (Math.sin(frame * 0.05) * 0.4),
        1 + (Math.sin(frame * 0.05 + 2) * 0.4),
        1 + (Math.sin(frame * 0.05 + 4) * 0.4),
      ]);
    }, 50);
    return () => clearInterval(ring);
  }, [router]);

  const handlePressIn = () => {
    setPressionado(true);
    setProgresso(0);
    intervalRef.current = setInterval(() => {
      setProgresso(p => {
        if (p >= 100) {
          clearInterval(intervalRef.current!);
          router.push('/confirmar-socorro');
          return 100;
        }
        return p + 2;
      });
    }, 40);
  };

  const handlePressOut = () => {
    setPressionado(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgresso(0);
  };

  const circunferencia = 2 * Math.PI * 96;
  const strokeDashoffset = circunferencia * (1 - progresso / 100);

  return (
    <div style={{ height: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
      {/* Glow vermelho fundo */}
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,59,92,0.05)', top: '20%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ textAlign: 'center', paddingTop: 60, paddingBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#FF3B5C', letterSpacing: 2 }}>SOS RESCUE</div>
        <div style={{ fontSize: 14, color: 'rgba(238,242,247,0.4)', marginTop: 6 }}>
          {pressionado ? 'Aguarde...' : 'Pressione e segure para acionar'}
        </div>
      </div>

      {/* Área central */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* Rings animados */}
        {rings.map((scale, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 260 + i * 40,
            height: 260 + i * 40,
            borderRadius: '50%',
            border: '1.5px solid rgba(255,59,92,0.3)',
            transform: `scale(${scale})`,
            transition: 'transform 0.05s linear',
            opacity: 0.3 - i * 0.08,
          }} />
        ))}

        {/* Botão SOS */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Anel de progresso SVG */}
          <svg width="212" height="212" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <circle cx="106" cy="106" r="96" fill="none" stroke="rgba(255,59,92,0.15)" strokeWidth="4" />
            <circle cx="106" cy="106" r="96" fill="none" stroke="#FF3B5C" strokeWidth="4"
              strokeDasharray={circunferencia} strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.04s linear' }} />
          </svg>
          <div
            onMouseDown={handlePressIn}
            onMouseUp={handlePressOut}
            onTouchStart={handlePressIn}
            onTouchEnd={handlePressOut}
            style={{
              width: 180, height: 180, borderRadius: '50%',
              background: '#FF3B5C',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', userSelect: 'none',
              boxShadow: `0 0 ${pressionado ? 60 : 30}px rgba(255,59,92,${pressionado ? 0.8 : 0.5})`,
              transform: `scale(${pressionado ? 0.97 : 1})`,
              transition: 'transform 0.1s, box-shadow 0.1s',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 800, color: '#fff', letterSpacing: 2, lineHeight: 1 }}>SOS</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4, textAlign: 'center' }}>
              {pressionado ? 'Aguarde...' : 'Pressione\ne segure'}
            </div>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[['⏱','~8 min','Tempo médio'],['📍','2,3 km','Resgatista próximo'],['⚡','42%','Sua bateria']].map(([icon,val,label])=>(
            <div key={label} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>{icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#EEF2F7', marginTop: 4 }}>{val}</div>
              <div style={{ fontSize: 10, color: 'rgba(238,242,247,0.35)', marginTop: 2, lineHeight: 1.3 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.2)', borderRadius: 14, padding: 14 }}>
          <span style={{ fontSize: 16, color: '#FFB800' }}>⚠</span>
          <span style={{ fontSize: 12, color: 'rgba(238,242,247,0.5)', lineHeight: 1.6 }}>Use apenas em emergências reais. Acionamentos falsos afetam sua avaliação.</span>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '8px 0 10px' }}>
        {[['🏠','Home','/home'],['⚡','Recargar','/recarga'],['🆘','SOS','/sos'],['👤','Perfil','/perfil']].map(([icon,label,href])=>(
          <button key={href} onClick={()=>router.push(href as string)} style={{ flex:1, background:'transparent', border:'none', color: href==='/sos'?'#FF3B5C':'rgba(238,242,247,0.38)', display:'flex', flexDirection:'column', alignItems:'center', gap:2, fontSize:10, cursor:'pointer' }}>
            <span style={{ fontSize:20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
