import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import type { NavView } from '../types';

interface ViewHeaderBannerProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
}

const META: Record<Exclude<NavView, 'home'>, {
  eyebrow: string;
  title: string;
  highlight: string;
  desc: string;
  accentColor: string;
}> = {
  console: {
    eyebrow: 'Interactive Demo',
    title: 'Sound Console &',
    highlight: 'Stems Mixer',
    desc: 'Real-time 10-band spectrum analyzer and multi-track film audio stems console.',
    accentColor: 'var(--cyan)',
  },
  filmography: {
    eyebrow: 'Portfolio',
    title: 'Cinematic',
    highlight: 'Filmography',
    desc: 'Blockbuster feature films, web series, Dolby Atmos engineering highlights.',
    accentColor: 'var(--amber)',
  },
  upcoming: {
    eyebrow: 'Production Pipeline',
    title: 'Upcoming',
    highlight: 'Movie Releases',
    desc: 'Live tracker of films undergoing Foley recording, ADR dubbing, and Dolby Atmos mix.',
    accentColor: 'var(--cyan)',
  },
  gear: {
    eyebrow: 'Virtual Rack',
    title: 'Studio Hardware',
    highlight: '& Gear Rack',
    desc: 'Field recorders, shotgun microphones, Atmos monitor rigs, and outboard analog preamps.',
    accentColor: '#a78bfa',
  },
  clients: {
    eyebrow: 'Recognition & Partners',
    title: 'Clients, Directors',
    highlight: '& Awards',
    desc: 'Global studio clients, top director endorsements, and national film academy honors.',
    accentColor: 'var(--amber)',
  },
  workbench: {
    eyebrow: 'Live Browser DSP',
    title: 'Interactive',
    highlight: 'FX Design Lab',
    desc: 'Real-time low-pass filter sliders, transient trigger samples, and oscilloscope display.',
    accentColor: '#34d399',
  },
};

export const ViewHeaderBanner: React.FC<ViewHeaderBannerProps> = ({ currentView, onSelectView }) => {
  if (currentView === 'home') return null;
  const m = META[currentView as Exclude<NavView, 'home'>];

  return (
    <div
      className="page-enter"
      style={{
        paddingTop: 64,
        paddingBottom: 48,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: `radial-gradient(ellipse 60% 80% at 0% 50%, ${m.accentColor}09 0%, transparent 70%)`,
      }}
    >
      <div className="container">
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
          <button
            onClick={() => onSelectView('home')}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
              letterSpacing: '0.06em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <Home size={12} />
            HOME
          </button>
          <ChevronRight size={12} color="var(--text-muted)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: m.accentColor, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {currentView}
          </span>
        </nav>

        {/* Header content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 640 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: m.accentColor, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            // {m.eyebrow}
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {m.title}{' '}
            <span style={{
              background: `linear-gradient(135deg, ${m.accentColor}, ${m.accentColor === 'var(--cyan)' ? 'var(--amber)' : 'var(--cyan)'})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {m.highlight}
            </span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {m.desc}
          </p>
        </div>
      </div>
    </div>
  );
};
