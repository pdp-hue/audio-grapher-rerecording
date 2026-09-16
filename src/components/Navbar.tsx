import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2, VolumeX, Menu, X, Calendar, Radio,
  Home, Disc, Film, Clock, Cpu, Trophy, Zap
} from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';
import type { NavView } from '../types';

interface NavbarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  onOpenBooking: () => void;
}

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',        label: 'Home',            icon: <Home className="w-3.5 h-3.5" />,  color: 'var(--cyan)' },
  { id: 'console',     label: 'Sound Console',   icon: <Disc className="w-3.5 h-3.5" />,  color: 'var(--cyan)' },
  { id: 'filmography', label: 'Filmography',     icon: <Film className="w-3.5 h-3.5" />,  color: 'var(--amber)' },
  { id: 'upcoming',    label: 'Upcoming',        icon: <Clock className="w-3.5 h-3.5" />, color: 'var(--cyan)' },
  { id: 'gear',        label: 'Studio Gear',     icon: <Cpu className="w-3.5 h-3.5" />,   color: '#a78bfa' },
  { id: 'clients',     label: 'Clients',         icon: <Trophy className="w-3.5 h-3.5" />,color: 'var(--amber)' },
  { id: 'workbench',   label: 'FX Lab',          icon: <Zap className="w-3.5 h-3.5" />,   color: '#34d399' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentView, onSelectView, onOpenBooking }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  /* ── Scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Sliding indicator ── */
  useEffect(() => {
    if (!navRef.current) return;
    const activeBtn = navRef.current.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (activeBtn) {
      const navRect = navRef.current.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      });
    }
  }, [currentView]);

  /* ── Audio ── */
  const toggleMute = () => {
    if (isMuted) { soundEngine.setMasterVolume(volume); setIsMuted(false); }
    else { soundEngine.setMasterVolume(0); setIsMuted(true); }
  };
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
    soundEngine.setMasterVolume(v);
  };

  const navigate = (id: NavView) => {
    onSelectView(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          transition: 'all 0.3s ease',
          background: scrolled ? 'rgba(5,6,8,0.92)' : 'rgba(5,6,8,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66 }}>

          {/* ── Brand ── */}
          <button
            onClick={() => navigate('home')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #22d3ee, #f59e0b)',
              padding: 1.5, flexShrink: 0,
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: 9,
                background: '#050608', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Radio size={16} color="#22d3ee" />
              </div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.03em' }}>
                  VICKY
                </span>
                <span className="badge badge-cyan" style={{ fontSize: 9 }}>DOLBY ATMOS 7.1.4</span>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', marginTop: 1 }}>
                AUDIOGRAPHER & RE-RECORDING MIXER
              </p>
            </div>
          </button>

          {/* ── Desktop Nav (pill tabs with sliding indicator) ── */}
          <nav
            ref={navRef}
            className="hide-mobile"
            style={{
              display: 'flex', alignItems: 'center', gap: 2,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 99, padding: '4px',
              position: 'relative',
            }}
          >
            {/* Animated sliding pill background */}
            <div
              style={{
                position: 'absolute',
                top: 4, height: 'calc(100% - 8px)',
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                borderRadius: 99,
                background: 'linear-gradient(135deg, rgba(34,211,238,0.18), rgba(245,158,11,0.1))',
                border: '1px solid rgba(34,211,238,0.25)',
                transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: 'none',
              }}
            />
            {NAV_ITEMS.map(item => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  data-active={active}
                  onClick={() => navigate(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 13px', borderRadius: 99,
                    border: 'none', background: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontWeight: active ? 600 : 500,
                    fontSize: 12.5, letterSpacing: '0.01em',
                    color: active ? '#f1f5f9' : '#64748b',
                    transition: 'color 0.2s ease',
                    position: 'relative', zIndex: 1,
                  }}
                >
                  <span style={{ color: active ? item.color : 'currentColor', display: 'flex' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* ── Right: Volume + Book + Hamburger ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Volume strip */}
            <div
              className="hide-mobile"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: '7px 12px',
              }}
            >
              <button onClick={toggleMute} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: isMuted ? 'var(--rose)' : 'var(--cyan)' }}>
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <input type="range" min="0" max="1" step="0.05"
                value={isMuted ? 0 : volume} onChange={handleVolume}
                style={{ width: 60 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cyan)', minWidth: 26, textAlign: 'right' }}>
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>

            {/* Book Studio CTA */}
            <button onClick={onOpenBooking} className="btn btn-primary" style={{ padding: '9px 18px', fontSize: 12 }}>
              <Calendar size={14} />
              Book Studio
            </button>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer', color: '#94a3b8',
              }}
              className="show-mobile"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {mobileOpen && (
          <div
            className="animate-slide-down"
            style={{
              background: 'rgba(5,6,8,0.98)',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 4,
            }}
          >
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8, paddingLeft: 4 }}>
              NAVIGATION
            </p>
            {NAV_ITEMS.map(item => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                    borderRadius: 12, border: active ? '1px solid rgba(34,211,238,0.25)' : '1px solid transparent',
                    background: active ? 'rgba(34,211,238,0.08)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: active ? 600 : 400,
                    color: active ? '#f1f5f9' : '#64748b',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ color: active ? item.color : '#475569' }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {/* Mobile Volume */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>MASTER LEVEL</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={toggleMute} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isMuted ? 'var(--rose)' : 'var(--cyan)' }}>
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={handleVolume} style={{ width: 80 }} />
                </div>
              </div>
              <button onClick={() => { setMobileOpen(false); onOpenBooking(); }} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px 0' }}>
                <Calendar size={15} /> Book Studio Session
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Bottom Mobile Tab Bar (extra navigation comfort) ── */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99,
          display: 'none',
          background: 'rgba(5,6,8,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
        }}
        className="mobile-bottom-bar"
      >
        {NAV_ITEMS.slice(0, 5).map(item => {
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer',
                color: active ? 'var(--cyan)' : '#475569', padding: '4px 0',
              }}
            >
              <span style={{ display: 'flex' }}>{item.icon}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: active ? 600 : 400, letterSpacing: '0.04em' }}>
                {item.label.split(' ')[0]}
              </span>
              {active && (
                <span style={{ width: 16, height: 2, borderRadius: 99, background: 'var(--cyan)' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Spacer for fixed header */}
      <div style={{ height: 66 }} />

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .mobile-bottom-bar { display: flex !important; }
          body { padding-bottom: 70px; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
};
