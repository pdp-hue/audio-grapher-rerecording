import React from 'react';
import { Radio, ArrowUp, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer style={{ background: '#030405', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 64, paddingBottom: 32 }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radio size={16} color="var(--cyan)" />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#fff' }}>VICKY</span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.06em', marginTop: 1 }}>AUDIOGRAPHER & RE-RECORDING MIXER</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 360 }}>
            Specializing in high-octane blockbuster action sound design, organic Foley stage acoustics, and 3D spatial Dolby Atmos 7.1.4 re-recording for global cinema.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={13} color="#34d399" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#34d399', letterSpacing: '0.06em' }}>DOLBY ATMOS 7.1.4 CERTIFIED FACILITY</span>
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Studios</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <MapPin size={13} color="var(--amber)" style={{ flexShrink: 0, marginTop: 1 }} />
              Film City Complex, Goregaon East, Mumbai 400065
            </p>
            <p style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <MapPin size={13} color="var(--cyan)" style={{ flexShrink: 0, marginTop: 1 }} />
              Kodambakkam Film District, Chennai 600024
            </p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Contact</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              <Mail size={13} color="var(--cyan)" /> vicky.audiography@studio.com
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              <Phone size={13} color="var(--amber)" /> +91 (022) 8840-2910
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="divider" />

      {/* Bottom bar */}
      <div style={{ paddingTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Vicky Audiography & Sound Design Studios. All rights reserved.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="btn btn-ghost"
          style={{ padding: '8px 16px', fontSize: 12 }}
        >
          Back to top <ArrowUp size={13} />
        </button>
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        footer .container > div:first-child { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </footer>
);
