import React from 'react';
import { Star, Quote, Tv, Film, Clapperboard, Video, Camera, Disc, Radio } from 'lucide-react';
import { CLIENT_STUDIOS, TESTIMONIALS } from '../data/portfolioData';

const ICONS: Record<string, React.ReactNode> = {
  Tv: <Tv size={20} />,
  Film: <Film size={20} />,
  Clapperboard: <Clapperboard size={20} />,
  Video: <Video size={20} />,
  Camera: <Camera size={20} />,
  Disc: <Disc size={20} />,
  Radio: <Radio size={20} />,
};
const ICON_COLORS: Record<string, string> = {
  Tv: '#ef4444', Film: 'var(--amber)', Clapperboard: 'var(--cyan)',
  Video: '#34d399', Camera: '#a78bfa', Disc: '#60a5fa', Radio: 'var(--cyan)',
};

export const ClientsTestimonials: React.FC = () => (
  <section className="section page-enter">
    <div className="container">
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 56px' }}>
        <p className="section-label" style={{ justifyContent: 'center' }}>Trusted By Leaders</p>
        <h2 className="section-title">Top Studio <span>Clients & Directors</span></h2>
        <p className="section-desc" style={{ margin: '0 auto' }}>
          Partnering with global film studios, streaming platforms, and cinematic visionaries.
        </p>
      </div>

      {/* Client Logo Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 64 }}>
        {CLIENT_STUDIOS.map(c => (
          <div
            key={c.id}
            className="card"
            style={{ padding: '22px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              color: ICON_COLORS[c.iconName] || 'var(--cyan)',
            }}>
              {ICONS[c.iconName]}
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.03em', lineHeight: 1.3 }}>
              {c.logoText}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>
              {c.projectsCount} projects
            </span>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div>
        <p className="section-label" style={{ marginBottom: 28 }}>Director Endorsements</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {TESTIMONIALS.map(t => (
            <div
              key={t.id}
              className="card"
              style={{ padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 18, background: 'var(--bg-elevated)' }}
            >
              {/* Stars */}
              <div style={{ display: 'flex', gap: 3 }}>
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="var(--amber)" color="var(--amber)" />)}
              </div>

              {/* Quote */}
              <div style={{ position: 'relative' }}>
                <Quote size={32} color="rgba(255,255,255,0.05)" style={{ position: 'absolute', top: -8, right: 0 }} />
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, fontStyle: 'italic' }}>
                  "{t.quote}"
                </p>
              </div>

              {/* Author */}
              <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 12, alignItems: 'center' }}>
                <img src={t.avatarUrl} alt={t.name}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(245,158,11,0.35)' }}
                />
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>{t.name}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', marginTop: 2 }}>{t.role}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
