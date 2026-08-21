'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AiMicIcon,
  ThreeDViewIcon,
  SquareLock02Icon,
  ShoppingBag01Icon,
  DeliveryTruck01Icon,
} from '@hugeicons/core-free-icons';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.forerunner-card');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          y: 40,
          opacity: 0,
          scale: 0.96,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="forerunner-features-wrapper"
      style={{
        width: '100%',
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '40px 0 60px 0',
        position: 'relative',
        zIndex: 5,
      }}
    >
      {/* 3-COLUMN ASYMMETRIC FORERUNNER CONTAINER LAYOUT */}
      <div
        className="forerunner-container"
        style={{
          display: 'flex',
          gap: '20px',
          width: '100%',
          alignItems: 'stretch',
        }}
      >
        {/* LEFT COLUMN: 2 STACKED CARDS */}
        <div className="forerunner-column" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* CARD 1: 0G AI QUALITY INSPECTOR (AiMicIcon) */}
          <div className="forerunner-card standard-card">
            <div className="icon-box">
              <HugeiconsIcon icon={AiMicIcon} size={24} color="#181E25" strokeWidth={1.5} />
            </div>
            <div className="card-text">
              <h3 className="card-title">0G AI Quality Inspector</h3>
              <p className="card-desc">
                Run 0G Computer Vision AI models to grade crop batches, assess quality score, and detect defects instantly.
              </p>
            </div>
          </div>

          {/* CARD 2: ONCHAIN PROVENANCE & CERTIFICATE (ThreeDViewIcon) */}
          <div className="forerunner-card standard-card">
            <div className="icon-box">
              <HugeiconsIcon icon={ThreeDViewIcon} size={24} color="#181E25" strokeWidth={1.5} />
            </div>
            <div className="card-text">
              <h3 className="card-title">Onchain Provenance & Certificate</h3>
              <p className="card-desc">
                Mint immutable 0G Storage hashes verifying harvest origin, GPS farm location, and authentic credentials.
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: 1 TALL FULL-HEIGHT FEATURED CARD (SquareLock02Icon) */}
        <div className="forerunner-column" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* CARD 3: SMART ESCROW SETTLEMENTS (TALL CARD) */}
          <div className="forerunner-card tall-card">
            <div className="icon-box">
              <HugeiconsIcon icon={SquareLock02Icon} size={26} color="#181E25" strokeWidth={1.5} />
            </div>
            <div className="card-text">
              <h3 className="card-title tall-title">Smart Escrow Settlements</h3>
              <p className="card-desc tall-desc">
                Lock transaction funds in transparent 0G Chain smart contract escrows. Automated payouts release instantly upon verified logistics dispatch and buyer inspection.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 2 STACKED CARDS */}
        <div className="forerunner-column" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* CARD 4: DIRECT FARMER MARKETPLACE (ShoppingBag01Icon) */}
          <div className="forerunner-card standard-card">
            <div className="icon-box">
              <HugeiconsIcon icon={ShoppingBag01Icon} size={24} color="#181E25" strokeWidth={1.5} />
            </div>
            <div className="card-text">
              <h3 className="card-title">Direct Farmer Marketplace</h3>
              <p className="card-desc">
                Connect smallholder farmers directly with wholesale buyers worldwide for fair market pricing and zero middleman fees.
              </p>
            </div>
          </div>

          {/* CARD 5: REAL-TIME LOGISTICS TRACKING (DeliveryTruck01Icon) */}
          <div className="forerunner-card standard-card">
            <div className="icon-box">
              <HugeiconsIcon icon={DeliveryTruck01Icon} size={24} color="#181E25" strokeWidth={1.5} />
            </div>
            <div className="card-text">
              <h3 className="card-title">Real-Time Logistics Tracking</h3>
              <p className="card-desc">
                Track shipment progress step-by-step from farm harvest to buyer warehouse with cryptographic verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .forerunner-card {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 28px;
          border: 1px solid rgba(24, 30, 37, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.025);
          display: flex;
          flex-direction: column;
          gap: 20px;
          justify-content: flex-start;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          box-sizing: border-box;
          position: relative;
          z-index: 1;
        }

        .standard-card {
          flex: 1;
          min-height: 220px;
        }

        .tall-card {
          flex: 1;
          min-height: 460px;
          padding: 32px;
        }

        .forerunner-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(24, 30, 37, 0.08);
          border-color: rgba(24, 30, 37, 0.16);
          z-index: 10;
        }

        .icon-box {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(24, 30, 37, 0.05);
        }

        .card-text {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .card-title {
          font-family: var(--font-inter), sans-serif;
          font-size: 19px;
          font-weight: 700;
          color: #181E25;
          letter-spacing: -0.4px;
          margin: 0;
          line-height: 1.25;
        }

        .tall-title {
          font-size: 22px;
        }

        .card-desc {
          font-family: var(--font-inter), sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(24, 30, 37, 0.65);
          letter-spacing: -0.2px;
          margin: 0;
        }

        .tall-desc {
          font-size: 15px;
          line-height: 1.55;
        }

        @media (max-width: 860px) {
          .forerunner-container {
            flex-direction: column !important;
          }
          .standard-card, .tall-card {
            height: auto !important;
            min-height: 200px !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
