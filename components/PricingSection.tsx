'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiArrowRight } from 'react-icons/hi2';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll('.pricing-card');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          y: 45,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const plans = [
    {
      name: 'Furrow Starter',
      description: 'Best for small farms & emerging crop traders seeking basic AI proof.',
      monthlyPrice: 0,
      annualPrice: 0,
      buttonText: 'Try free for 14 days',
      buttonDark: false,
      features: [
        'Unified AI crop quality inspector',
        'Basic provenance & 0G hashes',
        'Direct farmer marketplace access',
        'Standard escrow settlements',
        'Up to 1 workspace',
      ],
    },
    {
      name: 'Furrow Pro',
      description: 'Best for growing agricultural cooperatives & wholesale buyers.',
      monthlyPrice: 49,
      annualPrice: 39,
      buttonText: 'Try free for 14 days',
      buttonDark: true,
      popular: true,
      badgeText: 'Save 20%',
      features: [
        'Everything in Furrow Starter',
        'Advanced 0G Computer Vision AI',
        'Priority Escrow & Logistics',
        'Smart market analytics & alerts',
        'Up to 5 workspaces',
      ],
    },
    {
      name: 'Furrow Enterprise',
      description: 'Best for global exporters requiring custom 0G AI model integrations.',
      monthlyPrice: 149,
      annualPrice: 119,
      buttonText: 'Try free for 14 days',
      buttonDark: false,
      features: [
        'Everything in Furrow Pro',
        'Dedicated 0G Storage Nodes',
        'Custom AI model training',
        'Full API & ERP integration',
        'Dedicated onboarding & support',
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="pricing-section-wrapper"
      style={{
        width: '100%',
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '40px 0 60px 0',
      }}
    >
      {/* SECTION HEADER TOGGLE FLUSH MERGED WITH CONTAINER */}
      <div className="toggle-container">
        <div className="toggle-track">
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setBillingCycle('annual')}
          >
            {billingCycle === 'annual' && (
              <motion.div
                layoutId="activePill"
                className="active-pill-bg"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className={`btn-label ${billingCycle === 'annual' ? 'active-label' : ''}`}>
              Annual
            </span>
          </button>

          <button
            type="button"
            className="toggle-btn"
            onClick={() => setBillingCycle('monthly')}
          >
            {billingCycle === 'monthly' && (
              <motion.div
                layoutId="activePill"
                className="active-pill-bg"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className={`btn-label ${billingCycle === 'monthly' ? 'active-label' : ''}`}>
              Monthly
            </span>
          </button>
        </div>
      </div>

      {/* GRADIENT MAIN CONTAINER FLUSH MERGED WITH TOGGLE */}
      <div
        className="pricing-gradient-box"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '12px',
          borderRadius: '24px',
          background: 'linear-gradient(180deg, #F5F4F0 0%, #E6E8DD 100%)',
          border: '1px solid rgba(24, 30, 37, 0.06)',
          width: '100%',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* 3 TALL PRICING CARDS ROW */}
        <div
          className="cards-grid"
          style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            alignItems: 'stretch',
            boxSizing: 'border-box',
          }}
        >
          {plans.map((plan, idx) => {
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

            // WHITE BADGE (#FFFFFF) EXPANDS FOR LIGHT BUTTONS, BEIGE (#E6E8DD) EXPANDS FOR DARK BUTTON
            const badgeBg = plan.buttonDark ? '#E6E8DD' : '#FFFFFF';
            const initialTextColor = plan.buttonDark ? '#FFFFFF' : '#181E25';
            const hoverTextColor = '#181E25';

            return (
              <div
                key={idx}
                className="pricing-card"
                style={{
                  flex: 1,
                  minHeight: '660px',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '40px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '48px',
                  border: '1px solid rgba(24, 30, 37, 0.06)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                  position: 'relative',
                  boxSizing: 'border-box',
                }}
              >
                {/* CARD TOP INFO */}
                <div className="card-top-content">
                  <div className="plan-header">
                    <div className="title-row">
                      <h3 className="plan-title">{plan.name}</h3>
                      {plan.badgeText && billingCycle === 'annual' && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="save-badge"
                        >
                          {plan.badgeText}
                        </motion.span>
                      )}
                    </div>
                    <p className="plan-desc">{plan.description}</p>
                  </div>

                  {/* ANIMATED PRICE COUNTER */}
                  <div className="price-box">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={price}
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.2 }}
                        className="price-amount"
                      >
                        ${price}<span className="price-unit">/mo</span>
                      </motion.div>
                    </AnimatePresence>
                    <div className="price-sub">per workspace</div>
                  </div>

                  {/* WHITE BADGE EXPANDING HOVER BUTTON */}
                  <motion.button
                    type="button"
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '16px',
                      border: 'none',
                      position: 'relative',
                      background: plan.buttonDark ? '#181E25' : '#F5F4F0',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                      outline: 'none',
                      overflow: 'hidden',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    initial="initial"
                    whileHover="hover"
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* WHITE BADGE (#FFFFFF) SLOWLY & ELEGANTLY EXPANDS RIGHT ON HOVER */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        left: '4px',
                        top: '4px',
                        bottom: '4px',
                        background: badgeBg,
                        borderRadius: '12px',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '12px',
                        boxSizing: 'border-box',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                      variants={{
                        initial: { width: '40px' },
                        hover: { width: 'calc(100% - 8px)' },
                      }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* ARROW SLIDES RIGHT (ALWAYS DARK CHARCOAL FOR CRISP READABILITY) */}
                      <HiArrowRight size={16} color="#181E25" />
                    </motion.div>

                    {/* BUTTON TEXT OVERLAY */}
                    <motion.span
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        width: '100%',
                        textAlign: 'center',
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        letterSpacing: '-0.2px',
                        pointerEvents: 'none',
                        paddingLeft: '32px',
                      }}
                      variants={{
                        initial: { color: initialTextColor },
                        hover: { color: hoverTextColor },
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {plan.buttonText}
                    </motion.span>
                  </motion.button>
                </div>

                {/* CARD FEATURES LIST WITH PLUS ICON (+) */}
                <div className="features-list">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="feature-item">
                      <div className="check-icon">
                        <HiPlus size={15} color="#181E25" />
                      </div>
                      <span className="feature-text">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ENTERPRISE CUSTOM PRICING BANNER */}
        <div
          className="enterprise-banner"
          style={{
            width: '100%',
            borderRadius: '16px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 244, 240, 0.8) 100%)',
            padding: '36px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            border: '1px solid rgba(24, 30, 37, 0.08)',
            backdropFilter: 'blur(10px)',
            boxSizing: 'border-box',
          }}
        >
          <div className="enterprise-info">
            <div className="enterprise-badge">
              <span className="badge-dot"></span>
              <span>Enterprise plans</span>
            </div>
            <h4 className="enterprise-title">Get custom pricing</h4>
            <p className="enterprise-desc">
              If you manage high transaction volumes, multiple entities, or require custom integrations, our team can tailor Furrow Chain to your needs.
            </p>
          </div>

          {/* ENTERPRISE EXPANDING SLIDE BUTTON */}
          <motion.button
            type="button"
            style={{
              height: '56px',
              borderRadius: '16px',
              background: '#181E25',
              border: 'none',
              position: 'relative',
              cursor: 'pointer',
              flexShrink: 0,
              boxSizing: 'border-box',
              outline: 'none',
              overflow: 'hidden',
              padding: '4px',
              minWidth: '220px',
              display: 'flex',
              alignItems: 'center',
            }}
            initial="initial"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
          >
            {/* ACCENT BADGE SLOWLY EXPANDS RIGHT ON HOVER */}
            <motion.div
              style={{
                position: 'absolute',
                left: '4px',
                top: '4px',
                bottom: '4px',
                borderRadius: '12px',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '14px',
                boxSizing: 'border-box',
              }}
              variants={{
                initial: { width: '48px', background: '#E6E8DD' },
                hover: { width: 'calc(100% - 8px)', background: '#E6E8DD' },
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <HiArrowRight size={18} color="#181E25" />
            </motion.div>

            {/* BUTTON TEXT OVERLAY */}
            <motion.span
              style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                textAlign: 'center',
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '16px',
                fontWeight: 500,
                padding: '0 24px 0 40px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
              variants={{
                initial: { color: '#FFFFFF' },
                hover: { color: '#181E25' },
              }}
              transition={{ duration: 0.3 }}
            >
              Contact sales
            </motion.span>
          </motion.button>
        </div>
      </div>

      <style jsx>{`
        .toggle-container {
          display: flex;
          justify-content: center;
          margin-bottom: 0;
          position: relative;
          z-index: 2;
        }

        .toggle-track {
          display: flex;
          align-items: center;
          padding: 6px 6px 0 6px;
          border-radius: 20px 20px 0 0;
          background: #F5F4F0;
          border: 1px solid rgba(24, 30, 37, 0.06);
          border-bottom: none;
          width: 360px;
          position: relative;
          box-sizing: border-box;
          margin-bottom: -1px;
        }

        .toggle-btn {
          flex: 1;
          height: 40px;
          border: none;
          background: transparent;
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .active-pill-bg {
          position: absolute;
          inset: 0;
          border-radius: 16px 16px 0 0;
          background: #FFFFFF;
          box-shadow: 0 -2px 10px rgba(24, 30, 37, 0.04);
          z-index: 1;
        }

        .btn-label {
          position: relative;
          z-index: 2;
          font-family: var(--font-inter), sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: rgba(24, 30, 37, 0.55);
          transition: color 0.2s ease;
        }

        .active-label {
          color: #181E25;
          font-weight: 600;
        }

        .card-top-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .plan-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .plan-title {
          font-family: var(--font-inter), sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #181E25;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .save-badge {
          background: #181E25;
          color: #E6E8DD;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 500px;
          letter-spacing: 0.2px;
        }

        .plan-desc {
          font-family: var(--font-inter), sans-serif;
          font-size: 14px;
          line-height: 1.45;
          color: rgba(24, 30, 37, 0.6);
          margin: 0;
        }

        .price-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
          height: 64px;
        }

        .price-amount {
          font-family: var(--font-inter), sans-serif;
          font-size: 46px;
          font-weight: 600;
          color: #181E25;
          letter-spacing: -1.5px;
          line-height: 1.1;
        }

        .price-unit {
          font-size: 20px;
          font-weight: 400;
          color: rgba(24, 30, 37, 0.6);
          letter-spacing: normal;
        }

        .price-sub {
          font-family: var(--font-inter), sans-serif;
          font-size: 14px;
          color: rgba(24, 30, 37, 0.5);
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .check-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-text {
          font-family: var(--font-inter), sans-serif;
          font-size: 14px;
          color: #181E25;
          line-height: 1.4;
        }

        .enterprise-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 680px;
        }

        .enterprise-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 14px;
          border-radius: 500px;
          background: #E6E8DD;
          font-family: var(--font-inter), sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #181E25;
          width: fit-content;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #181E25;
        }

        .enterprise-title {
          font-family: var(--font-inter), sans-serif;
          font-size: 30px;
          font-weight: 600;
          color: #181E25;
          letter-spacing: -0.8px;
          margin: 0;
        }

        .enterprise-desc {
          font-family: var(--font-inter), sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(24, 30, 37, 0.7);
          margin: 0;
        }

        @media (max-width: 900px) {
          .cards-grid {
            flex-direction: column !important;
          }
          .pricing-card {
            min-height: auto !important;
          }
          .enterprise-banner {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .enterprise-cta {
            width: 100% !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
    </section>
  );
}
