import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Activity } from 'lucide-react';
import { AUDIO_DEMO_TRACKS } from '../data/portfolioData';
import { soundEngine } from '../utils/audioEngine';
import type { AudioStem } from '../types';

const STEM_COLORS: Record<string, string> = {
  dialogue: 'var(--cyan)',
  foley:    '#34d399',
  sfx:      'var(--amber)',
  music:    '#f43f5e',
};

export const AudioVisualizerPlayer: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState(AUDIO_DEMO_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRaw, setIsRaw] = useState(false);
  const [stems, setStems] = useState<AudioStem[]>([
    { name: 'dialogue', label: 'Dialogue & ADR',   volume: 0.85, isMuted: false, isSolo: false, color: 'var(--cyan)' },
    { name: 'foley',    label: 'Foley & Props',     volume: 0.75, isMuted: false, isSolo: false, color: '#34d399' },
    { name: 'sfx',      label: 'SFX & Impacts',     volume: 0.80, isMuted: false, isSolo: false, color: 'var(--amber)' },
    { name: 'music',    label: 'Music Score',        volume: 0.70, isMuted: false, isSolo: false, color: '#f43f5e' },
  ]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Canvas render loop */
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
      const freq = soundEngine.getFrequencyData();
      const time = soundEngine.getTimeDomainData();

      /* Spectrum bars (left 70%) */
      const barCount = 40;
      const specW = canvas.width * 0.68;
      const bw = specW / barCount;
      for (let i = 0; i < barCount; i++) {
        const v = freq[i * 2] || (isPlaying ? Math.random() * 80 + 30 : 8);
        const h = (v / 255) * (canvas.height - 16);
        const x = i * (bw + 2);
        const y = canvas.height - h - 8;
        const g = ctx.createLinearGradient(0, canvas.height, 0, y);
        g.addColorStop(0, 'rgba(34,211,238,0.08)');
        g.addColorStop(0.5, 'rgba(34,211,238,0.5)');
        g.addColorStop(1, 'rgba(245,158,11,0.9)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.roundRect(x, y, bw, h, 2);
        ctx.fill();
        /* Peak cap */
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x, y - 3, bw, 2);
      }

      /* Oscilloscope (right 28%) */
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isRaw ? '#f43f5e' : 'rgba(34,211,238,0.75)';
      const wX = canvas.width * 0.73;
      const wW = canvas.width * 0.26;
      const sw = wW / time.length;
      let x = wX;
      for (let i = 0; i < time.length; i++) {
        const v = time[i] / 128;
        const y = (v * canvas.height * 0.35) + canvas.height / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sw;
      }
      ctx.stroke();

      raf = requestAnimationFrame(render);
    };
    render();
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, [isPlaying, isRaw]);

  const togglePlay = () => {
    if (isPlaying) { soundEngine.stopTrack(); setIsPlaying(false); }
    else { soundEngine.startTrack(selectedTrack.type); setIsPlaying(true); }
  };

  const selectTrack = (t: typeof AUDIO_DEMO_TRACKS[0]) => {
    setSelectedTrack(t);
    if (isPlaying) soundEngine.startTrack(t.type);
  };

  const updateVol = (name: string, val: number) => {
    setStems(prev => prev.map(s => {
      if (s.name !== name) return s;
      soundEngine.setStemVolume(name, val);
      return { ...s, volume: val, isMuted: val === 0 };
    }));
  };

  const toggleMute = (name: string) => {
    setStems(prev => prev.map(s => {
      if (s.name !== name) return s;
      const m = !s.isMuted;
      soundEngine.setStemVolume(name, m ? 0 : s.volume);
      return { ...s, isMuted: m };
    }));
  };

  const toggleSolo = (name: string) => {
    setStems(prev => {
      const solo = !prev.find(s => s.name === name)?.isSolo;
      return prev.map(s => {
        const isSolo = s.name === name ? solo : false;
        soundEngine.setStemVolume(s.name, isSolo || (!solo) ? (s.isMuted ? 0 : s.volume) : (s.name === name ? s.volume : 0));
        return { ...s, isSolo };
      });
    });
  };



  return (
    <section className="section page-enter" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 40 }}>
          <div>
            <p className="section-label"><Activity size={12} /> Live Demo Console</p>
            <h2 className="section-title">Audio Stems <span>Console</span></h2>
            <p className="section-desc">Mix 4-track film audio stems in real-time. Isolate dialogue, foley, SFX, and score.</p>
          </div>
          {/* RAW vs Atmos toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 4, gap: 4 }}>
            <button onClick={() => setIsRaw(false)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', transition: 'all 0.2s', background: !isRaw ? 'var(--cyan)' : 'transparent', color: !isRaw ? '#051015' : 'var(--text-secondary)' }}>
              Dolby Atmos Mix
            </button>
            <button onClick={() => setIsRaw(true)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', transition: 'all 0.2s', background: isRaw ? '#f43f5e' : 'transparent', color: isRaw ? '#fff' : 'var(--text-secondary)' }}>
              RAW Location
            </button>
          </div>
        </div>

        {/* Main console card */}
        <div className="card" style={{ padding: 32, background: 'rgba(0,0,0,0.4)' }}>
          {/* Visualizer screen */}
          <div style={{
            position: 'relative', height: 200, borderRadius: 14,
            background: '#020304', border: '1px solid rgba(34,211,238,0.2)',
            overflow: 'hidden', marginBottom: 28,
          }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            {/* Overlay info */}
            <div style={{ position: 'absolute', top: 12, left: 14, display: 'flex', gap: 8 }}>
              <span className="badge badge-cyan" style={{ fontSize: 9 }}>
                <span className="led led-cyan" style={{ width: 6, height: 6 }} />
                {selectedTrack.movie}
              </span>
              <span className="badge badge-amber" style={{ fontSize: 9 }}>DOLBY ATMOS 7.1.4</span>
            </div>
            <div style={{ position: 'absolute', top: 12, right: 14 }}>
              <span className="badge" style={{ background: 'rgba(0,0,0,0.6)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 9 }}>
                DSP LATENCY 0.8ms
              </span>
            </div>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '16px 14px 12px',
              background: 'linear-gradient(transparent, rgba(2,3,4,0.95))',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{selectedTrack.title}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{selectedTrack.description}</p>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan)', fontWeight: 600 }}>{selectedTrack.duration}</span>
            </div>
          </div>

          {/* Track selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, marginBottom: 28 }}>
            {AUDIO_DEMO_TRACKS.map(t => (
              <button
                key={t.id}
                onClick={() => selectTrack(t)}
                style={{
                  padding: '12px 14px', borderRadius: 10, border: '1px solid',
                  borderColor: selectedTrack.id === t.id ? 'rgba(34,211,238,0.4)' : 'rgba(255,255,255,0.07)',
                  background: selectedTrack.id === t.id ? 'rgba(34,211,238,0.08)' : 'rgba(255,255,255,0.03)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cyan)', fontWeight: 600 }}>{t.movie}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{t.duration}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: selectedTrack.id === t.id ? '#f1f5f9' : '#64748b', fontWeight: 500, lineHeight: 1.3 }}>{t.title}</p>
              </button>
            ))}
          </div>

          {/* Stems faders */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {stems.map(stem => (
              <div key={stem.name} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: 16,
              }}>
                {/* Stem header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#94a3b8', textTransform: 'uppercase' }}>
                    {stem.label}
                  </span>
                  <span className="led led-green" style={{ width: 7, height: 7, background: stem.isMuted ? '#374151' : STEM_COLORS[stem.name], boxShadow: stem.isMuted ? 'none' : `0 0 6px ${STEM_COLORS[stem.name]}` }} />
                </div>

                {/* Level meter */}
                <div className="progress-track" style={{ marginBottom: 12 }}>
                  <div className="progress-fill" style={{
                    width: `${stem.isMuted ? 0 : stem.volume * 100}%`,
                    background: STEM_COLORS[stem.name],
                  }} />
                </div>

                {/* Fader */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Volume2 size={12} color="var(--text-muted)" />
                  <input type="range" min="0" max="1" step="0.05"
                    value={stem.isMuted ? 0 : stem.volume}
                    onChange={e => updateVol(stem.name, parseFloat(e.target.value))}
                    style={{ flex: 1 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: stem.isMuted ? 'var(--rose)' : STEM_COLORS[stem.name], minWidth: 28, textAlign: 'right' }}>
                    {stem.isMuted ? 'M' : `${Math.round(stem.volume * 100)}`}
                  </span>
                </div>

                {/* Mute / Solo */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <button
                    onClick={() => toggleMute(stem.name)}
                    style={{
                      padding: '6px 0', borderRadius: 7, border: '1px solid',
                      borderColor: stem.isMuted ? 'rgba(244,63,94,0.5)' : 'rgba(255,255,255,0.1)',
                      background: stem.isMuted ? 'rgba(244,63,94,0.15)' : 'transparent',
                      color: stem.isMuted ? '#fb7185' : '#475569',
                      fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >MUTE</button>
                  <button
                    onClick={() => toggleSolo(stem.name)}
                    style={{
                      padding: '6px 0', borderRadius: 7, border: '1px solid',
                      borderColor: stem.isSolo ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.1)',
                      background: stem.isSolo ? 'rgba(245,158,11,0.15)' : 'transparent',
                      color: stem.isSolo ? 'var(--amber-bright)' : '#475569',
                      fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >SOLO</button>
                </div>
              </div>
            ))}
          </div>

          {/* Transport */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button className={isPlaying ? 'btn btn-amber' : 'btn btn-primary'} onClick={togglePlay} style={{ padding: '11px 24px' }}>
                {isPlaying ? <><Pause size={15} className="fill-current" /> Pause</> : <><Play size={15} className="fill-current" /> Play Stems</>}
              </button>
              <button className="btn btn-ghost btn-icon" onClick={() => { soundEngine.stopTrack(); setIsPlaying(false); }} title="Stop">
                <RotateCcw size={15} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="led led-cyan animate-pulse" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>32-BIT FLOAT • UNCOMPRESSED STEMS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
