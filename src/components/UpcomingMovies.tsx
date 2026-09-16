import React, { useState } from 'react';
import { Clock, Volume2, Calendar } from 'lucide-react';
import { UPCOMING_MOVIES } from '../data/portfolioData';
import { soundEngine } from '../utils/audioEngine';

export const UpcomingMovies: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const toggle = (id: string, type: 'action' | 'sci-fi' | 'horror' | 'foley' | 'drama') => {
    if (playingId === id) { soundEngine.stopTrack(); setPlayingId(null); }
    else { soundEngine.startTrack(type); setPlayingId(id); }
  };

  const STAGE_COLOR: Record<string, string> = {
    'Location Recording': 'badge-emerald',
    'Foley & Sound Design': 'badge-cyan',
    'ADR Dubbing': 'badge-violet',
    'Final Re-Recording Mix': 'badge-amber',
    'Dolby Atmos Mastering': 'badge-rose',
  };

  return (
    <section className="section page-enter" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p className="section-label"><Clock size={12} /> In Production</p>
          <h2 className="section-title">Upcoming <span>Movie Releases</span></h2>
          <p className="section-desc">
            Live pipeline tracker for feature films undergoing Foley stage, ADR dubbing, and Dolby Atmos re-recording mix.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {UPCOMING_MOVIES.map((movie, idx) => (
            <div
              key={movie.id}
              className="card hover-lift animate-fade-up"
              style={{ animationDelay: `${idx * 0.08}s`, display: 'flex', flexDirection: 'column' }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: 200, overflow: 'hidden', borderRadius: '20px 20px 0 0', flexShrink: 0 }}>
                <img src={movie.backdropUrl} alt={movie.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #050608 0%, rgba(5,6,8,0.2) 60%, transparent 100%)' }} />

                {/* Stage badge */}
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <span className={`badge ${STAGE_COLOR[movie.productionStage || ''] || 'badge-cyan'}`} style={{ fontSize: 9 }}>
                    {movie.productionStage}
                  </span>
                </div>

                {/* Teaser audio */}
                <button
                  onClick={() => toggle(movie.id, movie.sampleAudioType)}
                  style={{
                    position: 'absolute', bottom: 12, right: 12, width: 36, height: 36, borderRadius: '50%',
                    background: playingId === movie.id ? 'var(--cyan)' : 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: playingId === movie.id ? '#000' : '#fff', transition: 'all 0.2s',
                  }}
                >
                  <Volume2 size={15} />
                </button>

                {/* Release target */}
                <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Calendar size={11} color="var(--amber)" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)' }}>
                    {movie.releaseTarget}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '20px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, lineHeight: 1.2, marginBottom: 4 }}>
                    {movie.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                    DIR: {movie.director} · {movie.productionHouse}
                  </p>
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }} className="line-clamp-3">
                  {movie.synopsis}
                </p>

                {/* Stage highlights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {movie.soundHighlights.slice(0, 2).map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11.5, color: '#64748b', lineHeight: 1.4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--cyan)', flexShrink: 0, marginTop: 4 }} />
                      {h}
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                      POST-PRODUCTION PROGRESS
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan)', fontWeight: 700 }}>
                      {movie.completionPercentage}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${movie.completionPercentage}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
