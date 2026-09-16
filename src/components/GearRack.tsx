import React from 'react';
import { Cpu, Mic, Volume2, Sliders, Radio, Zap, ShieldCheck } from 'lucide-react';
import { GEAR_ITEMS } from '../data/portfolioData';
import { soundEngine } from '../utils/audioEngine';

const ICONS: Record<string, React.ReactNode> = {
  Cpu: <Cpu size={20} />, Mic: <Mic size={20} />, Mic2: <Mic size={20} />,
  Volume2: <Volume2 size={20} />, Sliders: <Sliders size={20} />, Radio: <Radio size={20} />,
};
const ICON_COLORS: Record<string, string> = {
  Cpu: 'var(--amber)', Mic: 'var(--cyan)', Mic2: '#a78bfa',
  Volume2: '#34d399', Sliders: 'var(--cyan)', Radio: '#f43f5e',
};

const CAT_COLOR: Record<string, string> = {
  'Microphone': 'badge-cyan',
  'Field Recorder': 'badge-amber',
  'Monitors & Headphones': 'badge-emerald',
  'Outboard & Preamps': 'badge-rose',
  'DAW & DSP': 'badge-violet',
};

export const GearRack: React.FC = () => {
  const handleTest = (gearId: string) => {
    soundEngine.triggerOneShot(
      gearId === 'tubetech' ? 'tube_warm' :
      gearId === 'mkh416' ? 'foley_step' : 'laser'
    );
  };

  return (
    <section className="section page-enter" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 48 }}>
          <div>
            <p className="section-label"><Cpu size={12} /> Virtual 19" Studio Rack</p>
            <h2 className="section-title">Hardware <span>& Gear Rack</span></h2>
            <p className="section-desc">High-grade field recorders, shotgun microphones, Dolby Atmos monitors, and analog outboard.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.06)' }}>
            <ShieldCheck size={14} color="#34d399" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#34d399', letterSpacing: '0.08em' }}>
              CALIBRATED · DOLBY ATMOS 7.1.4
            </span>
          </div>
        </div>

        {/* Rack chassis */}
        <div style={{
          background: '#03040a', border: '2px solid #1a1e2e',
          borderRadius: 20, padding: '32px 28px',
          boxShadow: 'inset 0 4px 24px rgba(0,0,0,0.6), 0 0 80px rgba(0,0,0,0.8)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {GEAR_ITEMS.map(gear => (
              <div
                key={gear.id}
                className="card hover-lift"
                style={{
                  padding: '20px 18px',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex', flexDirection: 'column', gap: 14,
                }}
              >
                {/* Rack module header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      color: ICON_COLORS[gear.iconName] || 'var(--cyan)',
                    }}>
                      {ICONS[gear.iconName]}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
                        {gear.brand}
                      </p>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, lineHeight: 1.2, color: '#f1f5f9' }}>
                        {gear.name}
                      </h3>
                    </div>
                  </div>
                  {/* Status LED */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.5)', borderRadius: 99, padding: '4px 8px', border: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
                    <span className="led led-green" style={{ width: 6, height: 6 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#22c55e' }}>LIVE</span>
                  </div>
                </div>

                <span className={`badge ${CAT_COLOR[gear.category] || 'badge-cyan'}`} style={{ alignSelf: 'flex-start', fontSize: 9 }}>
                  {gear.category}
                </span>

                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{gear.description}</p>

                {/* Specs & Test tone */}
                <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }} className="line-clamp-2">
                    {gear.specs}
                  </p>
                  <button
                    onClick={() => handleTest(gear.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '6px 10px', borderRadius: 8, flexShrink: 0,
                      background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)',
                      color: 'var(--cyan)', fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,211,238,0.16)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,211,238,0.08)'; }}
                  >
                    <Zap size={11} /> Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
