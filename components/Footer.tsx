'use client';

import React from 'react';
import { RiFacebookFill, RiInstagramLine, RiLinkedinFill } from 'react-icons/ri';
import { HiSparkles } from 'react-icons/hi2';

export default function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '0',
        boxSizing: 'border-box',
      }}
    >
      {/* MAKRO SIGNATURE ELEGANT BRAND FOOTER BOX - DOCKED FLUSH TO BOTTOM */}
      <div
        style={{
          width: '100%',
          borderRadius: '28px 28px 0 0',
          background: 'linear-gradient(180deg, #F5F4F0 0%, #E6E8DD 100%)',
          border: 'none',
          padding: '64px 56px 56px 56px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          overflow: 'hidden',
        }}
      >
        {/* TOP MAIN CONTENT GRID: BRAND INFO LEFT + 3 COLUMNS RIGHT */}
        <div
          className="footer-top-grid"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '60px',
            width: '100%',
          }}
        >
          {/* CONCISE BRAND COLUMN LEFT */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxWidth: '340px',
            }}
          >
            {/* LOGO + BRAND NAME */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#181E25',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E6E8DD',
                }}
              >
                <HiSparkles size={18} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#181E25',
                  letterSpacing: '-0.6px',
                }}
              >
                Furrow Chain™
              </span>
            </div>

            {/* SHORT & PUNCHY BRAND DESCRIPTION */}
            <p
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '15px',
                lineHeight: '1.6',
                color: 'rgba(24, 30, 37, 0.6)',
                margin: 0,
              }}
            >
              Decentralized agricultural AI provenance and smart escrow platform powered by 0G.
            </p>
          </div>

          {/* 3 TITLE-CASE NAVIGATION COLUMNS RIGHT */}
          <div
            className="footer-nav-columns"
            style={{
              display: 'flex',
              gap: '64px',
            }}
          >
            {/* COLUMN 1: PLATFORM */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'rgba(24, 30, 37, 0.45)',
                  letterSpacing: 'normal',
                }}
              >
                Platform
              </span>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <a href="/marketplace" className="footer-link bold-link">
                  Crop Marketplace
                </a>
                <a href="#features" className="footer-link bold-link">
                  AI Quality Inspector
                </a>
                <a href="#pricing" className="footer-link bold-link">
                  Smart Escrow
                </a>
                <a href="#features" className="footer-link bold-link">
                  0G Storage Hashes
                </a>
              </div>
            </div>

            {/* COLUMN 2: SOLUTIONS */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'rgba(24, 30, 37, 0.45)',
                  letterSpacing: 'normal',
                }}
              >
                Solutions
              </span>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <a href="#features" className="footer-link bold-link">
                  Agricultural Co-ops
                </a>
                <a href="#features" className="footer-link bold-link">
                  Food Exporters
                </a>
                <a href="#features" className="footer-link">
                  Quality Inspectors
                </a>
                <a href="#features" className="footer-link bold-link">
                  Commodity Traders
                </a>
                <a href="#pricing" className="footer-link bold-link">
                  Pricing Plans
                </a>
                <a href="#faq" className="footer-link bold-link">
                  FAQ & Help
                </a>
              </div>
            </div>

            {/* COLUMN 3: RESOURCES */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'rgba(24, 30, 37, 0.45)',
                  letterSpacing: 'normal',
                }}
              >
                Resources
              </span>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <a href="/docs" className="footer-link bold-link">
                  Documentation
                </a>
                <a href="https://0g.ai" target="_blank" rel="noopener noreferrer" className="footer-link bold-link">
                  0G Storage Explorer
                </a>
                <a href="#features" className="footer-link bold-link">
                  Smart Contracts
                </a>
                <a href="#features" className="footer-link muted-link">
                  Security Audit
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: DIVIDER + LEGAL LINKS & SOCIAL MEDIA ICONS */}
        <div
          style={{
            width: '100%',
            paddingTop: '20px',
            borderTop: '1px solid rgba(24, 30, 37, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* LEGAL LINKS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '13px',
              color: 'rgba(24, 30, 37, 0.55)',
            }}
          >
            <a href="#privacy" className="legal-link">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="#terms" className="legal-link">
              Terms of Service
            </a>
            <span>·</span>
            <a href="#audit" className="legal-link">
              Security Audit
            </a>
          </div>

          {/* PERFECTLY CENTERED SOCIAL MEDIA ICONS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Facebook"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(24, 30, 37, 0.08)',
                color: '#181E25',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                boxSizing: 'border-box',
                padding: 0,
                lineHeight: 0,
                transition: 'all 0.2s ease',
              }}
            >
              <RiFacebookFill size={18} style={{ display: 'block', margin: 'auto' }} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Instagram"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(24, 30, 37, 0.08)',
                color: '#181E25',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                boxSizing: 'border-box',
                padding: 0,
                lineHeight: 0,
                transition: 'all 0.2s ease',
              }}
            >
              <RiInstagramLine size={18} style={{ display: 'block', margin: 'auto' }} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="LinkedIn"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(24, 30, 37, 0.08)',
                color: '#181E25',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                boxSizing: 'border-box',
                padding: 0,
                lineHeight: 0,
                transition: 'all 0.2s ease',
              }}
            >
              <RiLinkedinFill size={18} style={{ display: 'block', margin: 'auto' }} />
            </a>
          </div>
        </div>

        {/* MAKRO PERFECT HORIZONTAL BOTTOM ROW: PILL BADGE LEFT + GIANT TEXT RIGHT */}
        <div
          className="giant-brand-row"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '24px',
            marginTop: '12px',
            boxSizing: 'border-box',
          }}
        >
          {/* DARK CHARCOAL PILL BADGE (LEFT SIDE) */}
          <div
            style={{
              background: '#181E25',
              color: '#E6E8DD',
              borderRadius: '12px',
              padding: '12px 22px',
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '-0.2px',
              marginBottom: '8px',
              flexShrink: 0,
              boxShadow: '0 4px 16px rgba(24, 30, 37, 0.08)',
            }}
          >
            © 2026 Furrow Chain LLC. All Rights reserved.
          </div>

          {/* ELEGANT PROPORTIONAL GIANT BRAND TEXT (RIGHT SIDE) */}
          <h1
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: 'clamp(50px, 8.5vw, 115px)',
              fontWeight: 700,
              color: '#181E25',
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              margin: 0,
              padding: 0,
              marginBottom: '-6px',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            Furrow.
          </h1>
        </div>
      </div>

      <style jsx>{`
        .footer-link {
          font-family: var(--font-inter), sans-serif;
          font-size: 14px;
          color: rgba(24, 30, 37, 0.7);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-link.bold-link {
          color: #181E25;
          font-weight: 500;
        }

        .footer-link.muted-link {
          color: rgba(24, 30, 37, 0.35);
        }

        .footer-link:hover {
          color: #181E25;
        }

        .legal-link {
          color: rgba(24, 30, 37, 0.55);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .legal-link:hover {
          color: #181E25;
        }

        .social-icon-btn:hover {
          background-color: #181E25 !important;
          color: #E6E8DD !important;
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .footer-top-grid {
            flex-direction: column !important;
            gap: 40px !important;
          }
          .footer-nav-columns {
            gap: 32px !important;
            flex-wrap: wrap !important;
          }
          .giant-brand-row {
            flex-direction: column-reverse !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </footer>
  );
}
