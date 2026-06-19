'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  batteryCapacity: number;
  chargingPort: string;
  maxChargingPower: number;
  range: number;
  isDefault: boolean;
}

const API = 'https://electra-dashboard-steel.vercel.app/api';

export default function VeiculosPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ make: '', model: '', year: '2024', color: '', licensePlate: '', batteryCapacity: '75', chargingPort: 'CCS2', maxChargingPower: '150', range: '400' });
  const [saving, setSaving] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('electra_token') : '';

  useEffect(() => {
    fetch(API + '/veiculos', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json())
      .then(d => { if (d.vehicles) setVehicles(d.vehicles); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const adicionar = async () => {
    if (!form.make || !form.model || !form.licensePlate) return;
    setSaving(true);
    const r = await fetch(API + '/veiculos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ ...form, year: parseInt(form.year), batteryCapacity: parseFloat(form.batteryCapacity), maxChargingPower: parseFloat(form.maxChargingPower), range: parseInt(form.range) }),
    });
    const d = await r.json();
    if (d.ok) {
      setAdding(false);
      setForm({ make: '', model: '', year: '2024', color: '', licensePlate: '', batteryCapacity: '75', chargingPort: 'CCS2', maxChargingPower: '150', range: '400' });
      fetch(API + '/veiculos', { headers: { 'Authorization': 'Bearer ' + token } })
        .then(r => r.json()).then(d => { if (d.vehicles) setVehicles(d.vehicles); });
    }
    setSaving(false);
  };

  const remover = async (id: string) => {
    await fetch(API + '/veiculos', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ id }) });
    setVehicles(v => v.filter(x => x.id !== id));
  };

  const PORTAS = ['CCS2', 'CHAdeMO', 'Type 2', 'Tesla', 'GB/T'];

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(238,242,247,0.6)', fontSize: 18, cursor: 'pointer' }}>←</button>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>🚗 Meus Veículos</h2>
        </div>
        <button onClick={() => setAdding(true)} style={{ padding: '8px 14px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 20, color: '#00E5FF', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Adicionar</button>
      </div>

      <div style={{ padding: '0 16px', paddingBottom: 80 }}>
        {loading && <div style={{ textAlign: 'center', color: 'rgba(238,242,247,0.38)', padding: 40 }}>Carregando...</div>}
        {!loading && vehicles.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🚗</div>
            <p style={{ color: 'rgba(238,242,247,0.4)', marginBottom: 16 }}>Nenhum veículo cadastrado</p>
            <button onClick={() => setAdding(true)} style={{ padding: '12px 24px', background: '#00E5FF', borderRadius: 12, border: 'none', color: '#070B14', fontWeight: 700, cursor: 'pointer' }}>Adicionar veículo</button>
          </div>
        )}
        {vehicles.map((v, i) => (
          <div key={i} style={{ background: '#1A1E25', border: `1px solid ${v.isDefault ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 16 }}>{v.make} {v.model}</p>
                <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)', marginTop: 2 }}>{v.year} · {v.licensePlate} · {v.color}</p>
              </div>
              {v.isDefault && <span style={{ background: 'rgba(0,229,255,0.15)', color: '#00E5FF', fontSize: 10, padding: '3px 8px', borderRadius: 20, fontFamily: 'monospace' }}>PRINCIPAL</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[['🔋', v.batteryCapacity + 'kWh', 'Bateria'], ['⚡', v.maxChargingPower + 'kW', 'Potência'], ['🛣️', v.range + 'km', 'Autonomia']].map(([icon, val, label]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 14 }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#00E5FF' }}>{val}</div>
                  <div style={{ fontSize: 10, color: 'rgba(238,242,247,0.35)' }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ background: 'rgba(74,143,255,0.15)', color: '#4A8FFF', fontSize: 11, padding: '3px 8px', borderRadius: 20 }}>🔌 {v.chargingPort}</span>
              <button onClick={() => remover(v.id)} style={{ marginLeft: 'auto', background: 'rgba(255,59,92,0.1)', border: '1px solid rgba(255,59,92,0.2)', borderRadius: 8, color: '#FF3B5C', fontSize: 12, padding: '3px 10px', cursor: 'pointer' }}>Remover</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal adicionar */}
      {adding && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', zIndex: 9999 }}>
          <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: '#0D1117', borderRadius: '20px 20px 0 0', padding: 20, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Adicionar Veículo</h3>
              <button onClick={() => setAdding(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(238,242,247,0.4)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            {[
              { label: 'Marca *', key: 'make', placeholder: 'Ex: BYD, Tesla, Volvo' },
              { label: 'Modelo *', key: 'model', placeholder: 'Ex: Seal 03, Model 3' },
              { label: 'Ano', key: 'year', placeholder: '2024' },
              { label: 'Cor', key: 'color', placeholder: 'Ex: Preto, Branco' },
              { label: 'Placa *', key: 'licensePlate', placeholder: 'ABC-1234' },
              { label: 'Bateria (kWh)', key: 'batteryCapacity', placeholder: '75' },
              { label: 'Autonomia (km)', key: 'range', placeholder: '400' },
              { label: 'Potência máx. (kW)', key: 'maxChargingPower', placeholder: '150' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: 'rgba(238,242,247,0.38)', fontFamily: 'monospace', letterSpacing: 1, display: 'block', marginBottom: 4 }}>{f.label.toUpperCase()}</label>
                <input value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ width: '100%', padding: '12px 14px', background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#EEF2F7', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: 'rgba(238,242,247,0.38)', fontFamily: 'monospace', letterSpacing: 1, display: 'block', marginBottom: 4 }}>PORTA DE CARREGAMENTO</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PORTAS.map(p => (
                  <button key={p} onClick={() => setForm(f => ({ ...f, chargingPort: p }))}
                    style={{ padding: '7px 14px', borderRadius: 20, background: form.chargingPort === p ? 'rgba(0,229,255,0.2)' : '#1A1E25', border: `1px solid ${form.chargingPort === p ? '#00E5FF' : 'rgba(255,255,255,0.08)'}`, color: form.chargingPort === p ? '#00E5FF' : 'rgba(238,242,247,0.5)', fontSize: 12, cursor: 'pointer' }}>{p}</button>
                ))}
              </div>
            </div>
            <button onClick={adicionar} disabled={saving} style={{ width: '100%', padding: 14, background: '#00E5FF', borderRadius: 12, border: 'none', color: '#070B14', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Salvando...' : '✓ Salvar Veículo'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
