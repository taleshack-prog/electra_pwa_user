'use client';
import { useEffect, useState, useRef, useCallback } from 'react';

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

type Estado = 'idle' | 'escutando' | 'processando' | 'falando';

const buildPrompt = (estacoes: Station[]) => {
  const lista = estacoes.map(e =>
    `- ${e.name}: ${e.powerKw}kW, R$${e.pricePerKwh}/kWh, ${e.status==='available'?'Livre':'Ocupado'}, ${e.address}`
  ).join('\n');

  return `Você é ELECTRA, a assistente pessoal de bordo do proprietário de um veículo elétrico.

Fale como uma pessoa real — natural, direta, sem formalidades. Use linguagem coloquial brasileira.

DADOS DO VEÍCULO:
- Veículo: BYD Seal 03
- Bateria atual: 42%
- Autonomia estimada: 168 km
- Localização: Porto Alegre, RS

ESTAÇÕES PRÓXIMAS:
${lista || '- Sem estações disponíveis no momento'}

CAPACIDADES:
- Pode acionar SOS/Resgate por comando de voz
- Pode navegar até a estação mais próxima
- Informa bateria e autonomia
- Encontra o posto mais barato ou mais próximo

REGRAS:
- Máximo 2 frases curtas — será lido em voz alta
- Português brasileiro natural, como um copiloto
- Se usuário pedir socorro/SOS/resgate, responda: "ACIONAR_SOS"
- Se pedir navegar até posto, responda: "NAVEGAR:[id do posto]"
- Nunca use listas ou bullet points`;
};

export default function ElectraVoice() {
  const [estado, setEstado] = useState<Estado>('idle');
  const [transcricao, setTranscricao] = useState('');
  const [resposta, setResposta] = useState('');
  const [aberto, setAberto] = useState(false);
  const [estacoes, setEstacoes] = useState<Station[]>([]);
  const [historico, setHistorico] = useState<{role: string; content: string}[]>([]);
  const [pulso, setPulso] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetch('https://electra-dashboard-steel.vercel.app/api/estacoes')
      .then(r => r.json())
      .then(d => { if (d.stations) setEstacoes(d.stations); });
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (estado === 'escutando' || estado === 'processando') {
      interval = setInterval(() => setPulso(p => !p), 500);
    } else {
      setPulso(false);
    }
    return () => clearInterval(interval);
  }, [estado]);

  const falar = useCallback((texto: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(texto);
    utt.lang = 'pt-BR';
    utt.rate = 1.1;
    utt.pitch = 1.1;
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt'));
    if (ptVoice) utt.voice = ptVoice;
    utt.onend = () => {
      setEstado('idle');
      setTimeout(() => setAberto(false), 1500);
    };
    window.speechSynthesis.speak(utt);
  }, []);

  const chamarClaude = useCallback(async (texto: string) => {
    try {
      const r = await fetch('https://electra-dashboard-steel.vercel.app/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensagem: texto,
          system: buildPrompt(estacoes),
          historico: historico.slice(-6),
        }),
      });
      const d = await r.json();
      const respostaIA = d.resposta || 'Não consegui processar agora.';

      setHistorico(prev => [...prev.slice(-8), { role: 'user', content: texto }, { role: 'assistant', content: respostaIA }]);

      // Comandos especiais
      if (respostaIA.includes('ACIONAR_SOS')) {
        window.location.href = '/confirmar-socorro';
        return;
      }
      if (respostaIA.includes('NAVEGAR:')) {
        const id = respostaIA.split('NAVEGAR:')[1].trim();
        const s = estacoes.find(e => e.id === id);
        if (s) window.open(`https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`, '_blank');
        return;
      }

      return respostaIA;
    } catch {
      return 'Sem conexão no momento.';
    }
  }, [estacoes, historico]);

  const iniciar = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Seu browser não suporta reconhecimento de voz. Use Chrome.');
      return;
    }

    setAberto(true);
    setEstado('escutando');
    setTranscricao('');
    setResposta('');

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = async (event: any) => {
      const texto = event.results[0][0].transcript;
      setTranscricao(texto);
      setEstado('processando');

      const res = await chamarClaude(texto);
      if (res) {
        setResposta(res);
        setEstado('falando');
        falar(res);
      }
    };

    recognition.onerror = () => {
      setEstado('idle');
      setTimeout(() => setAberto(false), 1000);
    };

    recognition.onend = () => {
      if (estado === 'escutando') setEstado('idle');
    };

    recognition.start();
  }, [chamarClaude, estado, falar]);

  const fechar = () => {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    setEstado('idle');
    setAberto(false);
  };

  const COR: Record<Estado, string> = {
    idle: '#00E5FF', escutando: '#FF3B5C', processando: '#FFB800', falando: '#00FF87',
  };
  const LABEL: Record<Estado, string> = {
    idle: 'Toque para falar', escutando: 'Ouvindo...', processando: 'Pensando...', falando: 'Respondendo',
  };
  const ICON: Record<Estado, string> = {
    idle: '🎙', escutando: '🔴', processando: '⚡', falando: '🔊',
  };

  return (
    <>
      {/* Modal */}
      {aberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-end', padding: 16, paddingBottom: 100, zIndex: 9999 }}>
          <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: '#070B14', border: '1.5px solid rgba(0,229,255,0.2)', borderRadius: 28, padding: 20 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: COR[estado], transition: 'background 0.3s', boxShadow: `0 0 8px ${COR[estado]}` }} />
                <span style={{ fontSize: 17, fontWeight: 700, color: COR[estado], letterSpacing: 1 }}>⚡ ELECTRA</span>
              </div>
              <button onClick={fechar} style={{ background: 'transparent', border: 'none', color: 'rgba(238,242,247,0.3)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Área central animada */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 140, position: 'relative', marginBottom: 16 }}>
              <div style={{ position: 'absolute', width: 130, height: 130, borderRadius: '50%', border: `1px solid ${COR[estado]}`, opacity: 0.3, transform: `scale(${pulso ? 1.15 : 1})`, transition: 'transform 0.5s' }} />
              <div style={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', border: `1px solid ${COR[estado]}`, opacity: 0.15 }} />
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: `${COR[estado]}22`, border: `2px solid ${COR[estado]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, transform: `scale(${estado === 'escutando' && pulso ? 1.1 : 1})`, transition: 'transform 0.3s' }}>
                {ICON[estado]}
              </div>
            </div>

            <div style={{ fontFamily: 'monospace', fontSize: 12, letterSpacing: 2, textAlign: 'center', color: COR[estado], marginBottom: 16 }}>{LABEL[estado]}</div>

            {transcricao && (
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14, marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: 'rgba(238,242,247,0.3)', letterSpacing: 2, marginBottom: 6, fontFamily: 'monospace' }}>VOCÊ DISSE</div>
                <div style={{ fontSize: 15, color: 'rgba(238,242,247,0.85)', fontStyle: 'italic' }}>&#34;{transcricao}&#34;</div>
              </div>
            )}

            {resposta && (
              <div style={{ background: 'rgba(0,255,135,0.05)', border: '1px solid rgba(0,255,135,0.2)', borderRadius: 14, padding: 14, marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: '#00FF87', letterSpacing: 2, marginBottom: 6, fontFamily: 'monospace' }}>⚡ ELECTRA</div>
                <div style={{ fontSize: 15, color: '#EEF2F7', lineHeight: 1.6 }}>{resposta}</div>
              </div>
            )}

            {estado === 'escutando' && !transcricao && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {['Posto mais próximo', 'Quanto de autonomia?', 'Socorro!', 'Posto mais barato'].map(sg => (
                  <div key={sg} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '6px 12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'rgba(238,242,247,0.45)' }}>{sg}</div>
                ))}
              </div>
            )}

            {(estado === 'idle' || estado === 'falando') && (
              <button onClick={iniciar} style={{ width: '100%', marginTop: 12, height: 44, background: 'rgba(0,229,255,0.1)', borderRadius: 14, border: '1px solid rgba(0,229,255,0.2)', color: '#00E5FF', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                🎙 Perguntar novamente
              </button>
            )}
          </div>
        </div>
      )}

      {/* Botão flutuante */}
      <button onClick={iniciar} style={{
        position: 'fixed', bottom: 90, right: 20, zIndex: 1000,
        width: 56, height: 56, borderRadius: '50%',
        background: COR[estado],
        border: 'none', cursor: 'pointer', fontSize: 24,
        boxShadow: `0 0 20px ${COR[estado]}88`,
        transform: `scale(${pulso && estado !== 'idle' ? 1.1 : 1})`,
        transition: 'transform 0.3s, background 0.3s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {ICON[estado]}
      </button>
    </>
  );
}
