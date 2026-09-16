import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Zap, Volume2, RotateCcw, Activity, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';

const FX_BTNS = [
  { id: 'recoil',    label: 'Gunfire Recoil', sub: 'Action Impact',     icon: <Zap size={18} />,      color: 'var(--amber)' },
  { id: 'laser',     label: 'Plasma Laser',   sub: 'Sci-Fi Blast',      icon: <Sparkles size={18} />, color: 'var(--cyan)' },
  { id: 'foley_step',label: 'Boot Foley',     sub: 'Mud Step',          icon: <Volume2 size={18} />,  color: '#34d399' },
  { id: 'tube_warm', label: 'Tube Sweep',     sub: 'Analog Saturation', icon: <Activity size={18} />, color: '#a78bfa' },
] as const;

export const InteractiveMixerWorkbench: React.FC = () => {
  const [cutoff, setCutoff] = useState(5000);
  const [lastFX, setLastFX] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Oscilloscope */
  useEffect(() => {
    let raf: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Grid lines */
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const y = (canvas.height / 4) * i;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      for (let i = 0; i < 9; i++) {
        const x = (canvas.width / 8) * i;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }

      /* Center line */
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2); ctx.stroke();

      /* Waveform */
      const data = soundEngine.getTimeDomainData();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#22d3ee';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 8;
      const sw = canvas.width / data.length;
      let x = 0;
      for (let i = 0; i < data.length; i++) {
        const v = data[i] / 128;
        const y = (v * canvas.height * 0.38) + canvas.height / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sw;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(render);
    };
    render();
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const handleCutoff = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setCutoff(v);
    soundEngine.setFilterFrequency(v);
  };

  const triggerFX = (type: 'recoil' | 'laser' | 'foley_step' | 'tube_warm') => {
    setLastFX(type);
    soundEngine.triggerOneShot(type);
  };

  const reset = () => {
    setCutoff(5000);
    soundEngine.setFilterFrequency(5000);
    setLastFX(null);
  };

  return (
    <section className="section page-enter">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p className="section-label"><Zap size={12} /> Browser DSP Lab</p>
          <h2 className="section-title">Interactive <span>FX Design Lab</span></h2>
          <p className="section-desc">
            Trigger real-time transient samples and manipulate DSP filter frequency — directly in your browser via Web Audio API.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          {/* Left: Oscilloscope + FX pads */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Scope */}
            <div style={{
              position: 'relative', borderRadius: 16,
              background: '#020304', border: '1px solid rgba(34,211,238,0.2)',
              overflow: 'hidden', height: 200,
            }}>
              <div style={{ position: 'absolute', top: 12, left: 14, display: 'flex', gap: 8, zIndex: 1 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cyan)' }}>
                  <span className="led led-cyan animate-pulse" /> OSCILLOSCOPE
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>48kHz / 32-BIT</span>
              </div>
              <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            </div>

            {/* FX trigger pads */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {FX_BTNS.map(btn => {
                const active = lastFX === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => triggerFX(btn.id as 'recoil' | 'laser' | 'foley_step' | 'tube_warm')}
                    style={{
                      padding: '20px 16px', borderRadius: 14, textAlign: 'left',
                      background: active ? `${btn.color}18` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${active ? `${btn.color}50` : 'rgba(255,255,255,0.07)'}`,
                      cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', flexDirection: 'column', gap: 8,
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; } }}
                  >
                    <span style={{ color: active ? btn.color : '#475569', display: 'flex' }}>{btn.icon}</span>
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: active ? '#f1f5f9' : '#64748b', lineHeight: 1.2 }}>{btn.label}</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{btn.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: DSP controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: '24px 22px', background: 'var(--bg-elevated)', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sliders size={16} color="var(--cyan)" />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>DSP Filter Control</span>
              </div>

              {/* Cutoff */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>LOW PASS CUTOFF</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--cyan)' }}>
                    {cutoff >= 1000 ? `${(cutoff / 1000).toFixed(1)}k` : cutoff} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Hz</span>
                  </span>
                </div>
                <input type="range" min="200" max="18000" step="50" value={cutoff} onChange={handleCutoff} style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>200Hz</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>18kHz</span>
                </div>
                <p style={{ marginTop: 10, fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Drag left to simulate underwater/distance. Drag right for full high-frequency clarity.
                </p>
              </div>

              {/* Quick presets */}
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 10 }}>QUICK PRESETS</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: 'Underwater / Muffled', val: 400 },
                    { label: 'Through Wall',          val: 1200 },
                    { label: 'Natural Cinematic',     val: 5000 },
                    { label: 'Full Atmos Clarity',    val: 18000 },
                  ].map(p => (
                    <button
                      key={p.val}
                      onClick={() => { setCutoff(p.val); soundEngine.setFilterFrequency(p.val); }}
                      style={{
                        padding: '9px 14px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.07)',
                        background: cutoff === p.val ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.03)',
                        color: cutoff === p.val ? 'var(--cyan)' : '#64748b',
                        fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-body)',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                        display: 'flex', justifyContent: 'space-between',
                      }}
                    >
                      <span>{p.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                        {p.val >= 1000 ? `${(p.val / 1000).toFixed(1)}k` : p.val}Hz
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn btn-ghost" onClick={reset} style={{ width: '100%', justifyContent: 'center' }}>
                <RotateCcw size={14} /> Reset All Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive two-column → single column */}
      <style>{`
        @media (max-width: 900px) {
          .fx-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};
