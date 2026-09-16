import React from 'react';
import { Trophy } from 'lucide-react';
import { AWARDS_DATA } from '../data/portfolioData';

export const AwardsSection: React.FC = () => (
  <section className="section" style={{ background: 'var(--bg-surface)' }}>
    <div className="container">
      <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 48px' }}>
        <p className="section-label" style={{ justifyContent: 'center' }}><Trophy size={12} /> Recognition</p>
        <h2 className="section-title">Awards & <span>Honors</span></h2>
        <p className="section-desc" style={{ margin: '0 auto' }}>
          Honored by national academies, audio societies, and international sound guilds.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {AWARDS_DATA.map((award, idx) => (
          <div
            key={award.id}
            className="card hover-lift animate-fade-up"
            style={{
              padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 16,
              animationDelay: `${idx * 0.07}s`,
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 13,
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Trophy size={20} color="var(--amber)" />
              </div>
              <span className="badge badge-amber" style={{ fontSize: 9 }}>{award.badge}</span>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>
                {award.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                {award.organization} · {award.year}
              </p>
            </div>

            <div style={{ paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                <strong style={{ color: '#f1f5f9' }}>{award.project}</strong>
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--amber)', letterSpacing: '0.06em' }}>
                {award.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
