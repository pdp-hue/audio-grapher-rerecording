import React, { useState } from 'react';
import { Film, Award, Volume2, X, CheckCircle2, Mic, Info } from 'lucide-react';
import { MOVIES_DATA } from '../data/portfolioData';
import type { MovieCategory, MovieProject } from '../types';
import { soundEngine } from '../utils/audioEngine';

const CATS: { label: string; value: MovieCategory }[] = [
  { label: 'All Works',     value: 'all' },
  { label: 'Blockbusters',  value: 'blockbuster' },
  { label: 'Feature Films', value: 'feature' },
  { label: 'Web Series',    value: 'web-series' },
];

const ROLE_COLOR: Record<string, string> = {
  'Lead Audiographer': 'badge-cyan',
  'Re-Recording Mixer': 'badge-amber',
  'Location Sound Engineer': 'badge-emerald',
  'Foley & SFX Specialist': 'badge-violet',
  'Sound Designer': 'badge-rose',
};

export const MovieShowcase: React.FC = () => {
  const [cat, setCat] = useState<MovieCategory>('all');
  const [selected, setSelected] = useState<MovieProject | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const movies = cat === 'all' ? MOVIES_DATA : MOVIES_DATA.filter(m => m.category === cat);

  const handleSample = (movie: MovieProject, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingId === movie.id) { soundEngine.stopTrack(); setPlayingId(null); }
    else { soundEngine.startTrack(movie.sampleAudioType); setPlayingId(movie.id); }
  };

  return (
    <section className="section page-enter">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 40 }}>
          <div>
            <p className="section-label"><Film size={12} /> Featured Portfolio</p>
            <h2 className="section-title">Cinematic <span>Filmography</span></h2>
            <p className="section-desc">Blockbuster films, web series, and indie titles shaped by world-class sound engineering.</p>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATS.map(c => (
              <button
                key={c.value}
                onClick={() => setCat(c.value)}
                style={{
                  padding: '8px 16px', borderRadius: 99, border: '1px solid',
                  borderColor: cat === c.value ? 'rgba(245,158,11,0.45)' : 'rgba(255,255,255,0.08)',
                  background: cat === c.value ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)',
                  color: cat === c.value ? 'var(--amber-bright)' : 'var(--text-muted)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {movies.map(movie => (
            <div
              key={movie.id}
              className="card hover-lift"
              onClick={() => setSelected(movie)}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            >
              {/* Poster */}
              <div style={{ position: 'relative', height: 220, overflow: 'hidden', borderRadius: '20px 20px 0 0', flexShrink: 0 }}>
                <img src={movie.backdropUrl} alt={movie.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #050608 0%, rgba(5,6,8,0.3) 50%, transparent 100%)' }} />

                {/* Format badge */}
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <span className="badge badge-cyan" style={{ fontSize: 9 }}>{movie.soundFormat}</span>
                </div>

                {/* Play button */}
                <button
                  onClick={e => handleSample(movie, e)}
                  style={{
                    position: 'absolute', bottom: 12, right: 12,
                    width: 40, height: 40, borderRadius: '50%',
                    background: playingId === movie.id ? 'var(--amber)' : 'rgba(0,0,0,0.7)',
                    border: `1px solid ${playingId === movie.id ? 'var(--amber)' : 'rgba(255,255,255,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)',
                    color: playingId === movie.id ? '#000' : '#fff',
                  }}
                >
                  <Volume2 size={16} />
                </button>

                {/* Title overlay */}
                <div style={{ position: 'absolute', bottom: 12, left: 14, right: 60 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', marginBottom: 4 }}>
                    {movie.year} • {movie.productionHouse}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
                    {movie.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span className={`badge ${ROLE_COLOR[movie.role] || 'badge-cyan'}`} style={{ alignSelf: 'flex-start', fontSize: 9 }}>
                  {movie.role}
                </span>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.65 }} className="line-clamp-3">
                  {movie.synopsis}
                </p>
                {movie.awards && movie.awards.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <Award size={13} color="var(--amber)" />
                    <span style={{ fontSize: 11, color: 'var(--amber-bright)', fontWeight: 500 }} className="truncate">{movie.awards[0]}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>DIR: {movie.director}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Details <Info size={11} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="animate-fade-in"
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="animate-fade-up"
            style={{
              width: '100%', maxWidth: 840,
              background: '#0a0c12', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 24, overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto',
              position: 'relative',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute', top: 16, right: 16, zIndex: 10,
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#94a3b8',
              }}
            >
              <X size={16} />
            </button>

            {/* Hero image */}
            <div style={{ position: 'relative', height: 320 }}>
              <img src={selected.backdropUrl} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0c12 0%, rgba(10,12,18,0.5) 50%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: 28, left: 32 }}>
                <span className="badge badge-amber" style={{ marginBottom: 10, display: 'inline-flex' }}>{selected.soundFormat}</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em' }}>
                  {selected.title} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({selected.year})</span>
                </h2>
                <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>
                  Directed by <strong style={{ color: 'var(--amber)' }}>{selected.director}</strong> · {selected.productionHouse}
                </p>
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 28 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 10 }}>SYNOPSIS</h4>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{selected.synopsis}</p>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)', letterSpacing: '0.1em', marginBottom: 12 }}>SOUND DESIGN HIGHLIGHTS</h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selected.soundHighlights.map((h, i) => (
                      <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
                        <CheckCircle2 size={15} color="var(--cyan)" style={{ flexShrink: 0, marginTop: 1 }} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ minWidth: 200, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>ROLE</p>
                  <span className={`badge ${ROLE_COLOR[selected.role] || 'badge-cyan'}`}>{selected.role}</span>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Mic size={10} /> GEAR USED
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {selected.recordingGearUsed.map((g, i) => (
                      <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#64748b', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '4px 8px' }}>{g}</span>
                    ))}
                  </div>
                </div>
                {selected.awards && selected.awards.length > 0 && (
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '0.1em', marginBottom: 8 }}>AWARDS</p>
                    {selected.awards.map((a, i) => (
                      <p key={i} style={{ display: 'flex', gap: 6, fontSize: 11, color: 'var(--amber-bright)', lineHeight: 1.5 }}>
                        <Award size={12} style={{ flexShrink: 0 }} /> {a}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
