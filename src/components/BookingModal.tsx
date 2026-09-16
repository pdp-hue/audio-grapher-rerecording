import React, { useState } from 'react';
import { X, Calendar, CheckCircle, Send } from 'lucide-react';

interface BookingModalProps { isOpen: boolean; onClose: () => void; }

const SERVICES = [
  'Re-Recording Mixing & Dolby Atmos',
  'Location Sound Recording',
  'Foley Stage & SFX Creation',
  'ADR Dubbing & Dialogue Edit',
  'Full Film Sound Design Package',
];
const BUDGETS = [
  '$10k – $25k (Short Film / Web Series)',
  '$25k – $50k (Feature Film Mix)',
  '$50k – $100k+ (Blockbuster Dolby Atmos)',
];

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', title: '', service: SERVICES[0], budget: BUDGETS[0], notes: '' });

  if (!isOpen) return null;

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div
      className="animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div
        className="animate-fade-up"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto',
          background: '#0a0c12', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24, position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b',
            zIndex: 1,
          }}
        ><X size={15} /></button>

        {submitted ? (
          <div style={{ padding: '64px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={28} color="var(--cyan)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>Inquiry Received!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, maxWidth: 380 }}>
              Thank you, <strong style={{ color: 'var(--cyan)' }}>{form.name}</strong>. Vicky's production manager will review your project for <strong style={{ color: '#fff' }}>{form.title || 'your film'}</strong> and contact you within 24 hours.
            </p>
            <button className="btn btn-primary" onClick={() => { setSubmitted(false); onClose(); }} style={{ padding: '12px 28px', marginTop: 8 }}>
              Close Window
            </button>
          </div>
        ) : (
          <div style={{ padding: '32px 32px 36px' }}>
            {/* Modal header */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={16} color="var(--cyan)" />
                </div>
                <span className="badge badge-cyan" style={{ fontSize: 9 }}>DIRECT STUDIO BOOKING</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
                Book Studio Session
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Mumbai & Chennai facilities available for Foley recording, ADR, location sound, and Dolby Atmos 7.1.4 re-recording.
              </p>
            </div>

            <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>YOUR NAME *</label>
                  <input required className="input" placeholder="Director / Producer name" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>EMAIL *</label>
                  <input required type="email" className="input" placeholder="production@studio.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>PROJECT TITLE *</label>
                  <input required className="input" placeholder="Untitled Feature Film" value={form.title} onChange={e => set('title', e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>PRODUCTION HOUSE</label>
                  <input className="input" placeholder="Studio / Streaming / Indie" value={form.company} onChange={e => set('company', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>PRIMARY SERVICE</label>
                  <select className="input" value={form.service} onChange={e => set('service', e.target.value)}>
                    {SERVICES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>BUDGET RANGE</label>
                  <select className="input" value={form.budget} onChange={e => set('budget', e.target.value)}>
                    {BUDGETS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>PROJECT NOTES & STEM REQUIREMENTS</label>
                <textarea className="input" rows={3} placeholder="Number of stems, delivery deadlines, acoustic specs..." value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '14px 0', marginTop: 6, width: '100%', justifyContent: 'center', fontSize: 14 }}>
                <Send size={16} /> Submit Studio Inquiry
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
