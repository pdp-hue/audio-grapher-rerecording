import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ViewHeaderBanner } from './components/ViewHeaderBanner';
import { Hero } from './components/Hero';
import { AudioVisualizerPlayer } from './components/AudioVisualizerPlayer';
import { MovieShowcase } from './components/MovieShowcase';
import { UpcomingMovies } from './components/UpcomingMovies';
import { ClientsTestimonials } from './components/ClientsTestimonials';
import { GearRack } from './components/GearRack';
import { InteractiveMixerWorkbench } from './components/InteractiveMixerWorkbench';
import { AwardsSection } from './components/AwardsSection';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';
import type { NavView } from './types';
import { ArrowRight, Disc, Film, Clock, Cpu, Trophy, Zap } from 'lucide-react';

const HOME_SECTIONS = [
  {
    id: 'console' as NavView,
    title: 'Sound Console & Stems',
    desc: 'Interactive 10-band spectrum analyzer & 4-track film audio stems mixer.',
    icon: <Disc size={22} />,
    color: 'var(--cyan)',
    borderColor: 'rgba(34,211,238,0.3)',
    bg: 'rgba(34,211,238,0.06)',
    cta: 'Open Stems Mixer',
  },
  {
    id: 'filmography' as NavView,
    title: 'Cinematic Filmography',
    desc: 'Blockbuster feature films — Kalki 2898 AD, Jawan, RRR, Vikram, and more.',
    icon: <Film size={22} />,
    color: 'var(--amber)',
    borderColor: 'rgba(245,158,11,0.3)',
    bg: 'rgba(245,158,11,0.06)',
    cta: 'Browse Movie Catalog',
  },
  {
    id: 'upcoming' as NavView,
    title: 'Upcoming Movie Pipeline',
    desc: 'Films undergoing Foley stage, ADR dubbing, and Dolby Atmos mix.',
    icon: <Clock size={22} />,
    color: 'var(--cyan)',
    borderColor: 'rgba(34,211,238,0.25)',
    bg: 'rgba(34,211,238,0.05)',
    cta: 'Check Pipeline',
  },
  {
    id: 'gear' as NavView,
    title: 'Virtual 19" Gear Rack',
    desc: 'Field recorders, Sennheiser shotguns, Neumann mics, and tube preamps.',
    icon: <Cpu size={22} />,
    color: '#a78bfa',
    borderColor: 'rgba(139,92,246,0.3)',
    bg: 'rgba(139,92,246,0.06)',
    cta: 'Inspect Hardware',
  },
  {
    id: 'clients' as NavView,
    title: 'Clients, Directors & Awards',
    desc: 'Netflix, Red Chillies, Warner Bros, Nag Ashwin, S.S. Rajamouli, Atlee.',
    icon: <Trophy size={22} />,
    color: 'var(--amber)',
    borderColor: 'rgba(245,158,11,0.3)',
    bg: 'rgba(245,158,11,0.06)',
    cta: 'Read Testimonials',
  },
  {
    id: 'workbench' as NavView,
    title: 'Interactive FX Lab',
    desc: 'Live DSP filter sliders and transient sound trigger pads in your browser.',
    icon: <Zap size={22} />,
    color: '#34d399',
    borderColor: 'rgba(52,211,153,0.3)',
    bg: 'rgba(52,211,153,0.06)',
    cta: 'Launch FX Lab',
  },
];

export const App: React.FC = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [currentView, setCurrentView] = useState<NavView>('home');

  /* Hash routing */
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace('#', '') as NavView;
      const valid: NavView[] = ['home', 'console', 'filmography', 'upcoming', 'gear', 'clients', 'workbench'];
      setCurrentView(valid.includes(hash) ? hash : 'home');
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const navigate = (view: NavView) => {
    setCurrentView(view);
    window.location.hash = view === 'home' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      <Navbar
        currentView={currentView}
        onSelectView={navigate}
        onOpenBooking={() => setBookingOpen(true)}
      />

      {/* Per-view breadcrumb header (not on home) */}
      <ViewHeaderBanner currentView={currentView} onSelectView={navigate} />

      <main>
        {/* ── HOME ── */}
        {currentView === 'home' && (
          <>
            <Hero
              onExploreConsole={() => navigate('console')}
              onOpenBooking={() => setBookingOpen(true)}
            />

            {/* Studio Departments Hub */}
            <section className="section-sm" style={{ background: 'var(--bg-surface)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                    STUDIO SECTIONS
                  </p>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em' }}>
                    Explore Vicky's Sound Engineering Hub
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                  {HOME_SECTIONS.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => navigate(s.id)}
                      className="card hover-lift animate-fade-up"
                      style={{
                        padding: '22px 20px', textAlign: 'left', cursor: 'pointer', border: `1px solid ${s.borderColor}`,
                        background: s.bg, display: 'flex', flexDirection: 'column', gap: 12,
                        animationDelay: `${i * 0.06}s`,
                      }}
                    >
                      <div style={{ color: s.color }}>{s.icon}</div>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 6, color: '#f1f5f9' }}>
                          {s.title}
                        </h3>
                        <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: s.color, marginTop: 'auto' }}>
                        {s.cta} <ArrowRight size={13} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── SECTION VIEWS ── */}
        {currentView === 'console' && <AudioVisualizerPlayer />}
        {currentView === 'filmography' && <MovieShowcase />}
        {currentView === 'upcoming' && <UpcomingMovies />}
        {currentView === 'gear' && <GearRack />}
        {currentView === 'clients' && (
          <>
            <ClientsTestimonials />
            <AwardsSection />
          </>
        )}
        {currentView === 'workbench' && <InteractiveMixerWorkbench />}
      </main>

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
      <Footer />
    </div>
  );
};

export default App;
