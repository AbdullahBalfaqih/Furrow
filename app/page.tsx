'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CountdownTimer from '@/components/CountdownTimer';
import WaitlistForm from '@/components/WaitlistForm';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import Aurora from '@/components/Aurora';
import { HiUserGroup } from 'react-icons/hi2';

const ROTATING_PHRASES = [
  "What's Next",
  "Smart Escrow",
  "AI Quality",
  "0G Provenance",
  "Future Crops",
  "Direct Trade",
];

export default function Home() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
    }, 3600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="layout-container">
      {/* FIXED LEFT SIDEBAR BANNER PANEL */}
      <aside className="sidebar-panel">
        {/* Dynamic React Bits Aurora WebGL Background (Warm Greige Plasma) */}
        <div className="bg-image-container">
          <Aurora
            colorStops={["#181E25", "#9B9485", "#DCD7CB"]}
            blend={0.9}
            amplitude={1.2}
            speed={0.6}
          />
        </div>

        {/* Sidebar Fixed Content */}
        <div className="sidebar-content">
          {/* Top Social Proof Badge */}
          <div className="sidebar-top-badge">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <HiUserGroup size={22} color="#FFFFFF" />
            </div>
            <p className="badge-text">
              Join <span className="highlight font-semibold">2,000+ agricultural leaders</span> on the waitlist
            </p>
          </div>

          {/* Bottom Countdown Timer */}
          <div className="sidebar-bottom-timer">
            <CountdownTimer darkTheme={true} />
          </div>
        </div>
      </aside>

      {/* FLOATING NAVBAR THAT FOLLOWS THE USER AS THEY SCROLL DOWN */}
      <header className="navbar-wrapper">
        <Navbar />
      </header>

      {/* RIGHT SCROLLABLE MAIN CONTENT AREA */}
      <main className="main-content" style={{ position: 'relative' }}>
        {/* FULL BLEED DOCKED HERO BACKGROUND IMAGE (SOFT TRANSPARENCY) */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            left: 0,
            right: 0,
            height: '920px',
            backgroundImage: "url('/hero.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            opacity: 0.68,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* LIGHT SOFT OVERLAY FOR TEXT LEGIBILITY */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            left: 0,
            right: 0,
            height: '920px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(248, 249, 250, 0.5) 70%, #F8F9FA 100%)',
            backdropFilter: 'blur(2px)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Hero Section */}
        <section
          className="hero-section"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '640px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px',
            marginBottom: '60px',
          }}
        >
          <h1 className="hero-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span>Join the waitlist for</span>
            <span
              style={{
                height: '1.25em',
                display: 'inline-block',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                minWidth: '320px',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROTATING_PHRASES[phraseIndex]}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'block',
                    position: 'absolute',
                    inset: 0,
                    textAlign: 'center',
                    color: '#181E25',
                    fontStyle: 'normal',
                  }}
                >
                  {ROTATING_PHRASES[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <p className="hero-subtitle">
            Get early access, exclusive updates, and priority onboarding when we launch.
          </p>

          <div className="form-wrapper">
            <WaitlistForm />
          </div>
        </section>

        {/* Features Section - MOVED DOWN WITH SPACIOUS MARGIN TOP */}
        <div style={{ marginTop: '120px', position: 'relative', zIndex: 2 }}>
          <FeaturesSection />
        </div>

        {/* Pricing Section */}
        <PricingSection />

        {/* FAQ Accordion Section */}
        <FaqSection />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
