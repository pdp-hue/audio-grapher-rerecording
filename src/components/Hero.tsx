import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Volume2, Pause, Mic, Sparkles } from 'lucide-react';
import { ENGINEER_PROFILE } from '../data/portfolioData';
import { soundEngine } from '../utils/audioEngine';

interface HeroProps {
  onExploreConsole: () => void;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreConsole, onOpenBooking }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isAmbient, setIsAmbient] = useState(false);

  /* Live canvas visualizer */
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
      const bars = 60;
      const bw = canvas.width / bars;
      const t = Date.now() * 0.002;

      for (let i = 0; i < bars; i++) {
        const sample = freq[Math.floor((i / bars) * freq.length)] || 0;
        let h = sample > 0
          ? (sample / 255) * canvas.height * 0.72
          : (32 + Math.sin(t + i * 0.18) * 16 + Math.cos(t * 0.7 + i * 0.12) * 10);

        const x = i * bw;
        const y = canvas.height - h;

        const g = ctx.createLinearGradient(0, canvas.height, 0, y);
        g.addColorStop(0, 'rgba(34,211,238,0.02)');
        g.addColorStop(0.5, 'rgba(34,211,238,0.25)');
        g.addColorStop(1, 'rgba(245,158,11,0.7)');
        ctx.fillStyle = g;

        ctx.beginPath();
        ctx.roundRect(x + 2, y, bw - 4, h, 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };
    render();
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const toggleAmbient = () => {
    if (isAmbient) { soundEngine.stopTrack(); setIsAmbient(false); }
    else { soundEngine.startTrack('sci-fi'); setIsAmbient(true); }
  };

  return (
    <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {/* Canvas BG */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          opacity: 0.35, pointerEvents: 'none',
        }}
      />

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>

          {/* Eyebrow badge */}
          <div className="animate-fade-up" style={{ animationDelay: '0s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
            <span className="badge badge-cyan">
              <Sparkles size={10} />
              DOLBY ATMOS 7.1.4 CERTIFIED
            </span>
            <span className="badge badge-amber">15+ YEARS</span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up"
            style={{
              animationDelay: '0.08s',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(38px, 7vw, 80px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: 24,
            }}
          >
            Where Cinema Finds Its{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--cyan-bright) 0%, var(--cyan) 40%, var(--amber) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Sound
            </span>
          </h1>

          {/* Bio */}
          <p
            className="animate-fade-up"
            style={{ animationDelay: '0.14s', fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}
          >
            {ENGINEER_PROFILE.bio}
          </p>

          {/* CTA Row */}
          <div className="animate-fade-up" style={{ animationDelay: '0.2s', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 72 }}>
            <button className="btn btn-primary" onClick={onExploreConsole} style={{ padding: '13px 28px', fontSize: 14 }}>
              Open Stems Console
              <ArrowRight size={16} />
            </button>
            <button className="btn btn-ghost" onClick={toggleAmbient} style={{ padding: '13px 24px', fontSize: 14 }}>
              {isAmbient ? <><Pause size={15} />Stop Soundscape</> : <><Volume2 size={15} />Audition Soundscape</>}
            </button>
            <button className="btn btn-ghost" onClick={onOpenBooking} style={{ padding: '13px 24px', fontSize: 14, borderColor: 'rgba(245,158,11,0.3)', color: 'var(--amber-bright)' }}>
              <Mic size={15} />
              Book Studio
            </button>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-up"
            style={{
              animationDelay: '0.26s',
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, overflow: 'hidden',
            }}
          >
            {ENGINEER_PROFILE.stats.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: '24px 16px', textAlign: 'center',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}
              >
                <div className="stat-value">{s.value}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 6 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
