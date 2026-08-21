'use client';

import { useState } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineUser } from 'react-icons/hi2';
import WorldMapDemo from '@/components/world-map-demo';

interface OverviewViewProps {
  showToast: (msg: string) => void;
}

export default function OverviewView({ showToast }: OverviewViewProps) {
  const [salesProgress, setSalesProgress] = useState(66);

  // Reusable Top-Right Notch Cutout with Action Buttons
  const CardNotch = () => (
    <>
      <svg
        width="136"
        height="82"
        viewBox="0 0 136 82"
        fill="none"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <path
          d="M0 0C5.3 0 10.4 2.1 14.1 5.9C17.9 9.6 20 14.7 20 20V36C20 42.9 22.7 49.5 27.6 54.4C32.5 59.3 39.1 62 46 62H116C121.3 62 126.4 64.1 130.1 67.9C133.9 71.6 136 76.7 136 82V0H0Z"
          fill="#F5F7F8"
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: 2,
          display: 'flex',
          gap: '8px',
        }}
      >
        <button
          onClick={() => showToast('Notifications checked')}
          title="Notifications"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            border: 'none',
            background: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#6D6E6E" strokeWidth="1.4">
            <path d="M15 6.67C15 3.9 12.76 1.67 10 1.67C7.24 1.67 5 3.9 5 6.67C5 12.5 2.5 14.17 2.5 14.17H17.5C17.5 14.17 15 12.5 15 6.67Z" />
            <path d="M11.44 17.5C11.1 18 10.58 18.33 10 18.33C9.42 18.33 8.9 18 8.56 17.5" />
          </svg>
        </button>

        <button
          onClick={() => showToast('Quick action triggered')}
          title="Quick Action"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            border: 'none',
            background: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 19 19" fill="none">
            <path d="M7.6 1.19C7.6 4.91 10.29 7.6 14.01 7.6C10.29 7.6 7.6 10.29 7.6 14.01C7.6 10.29 4.91 7.6 1.19 7.6C4.91 7.6 7.6 4.91 7.6 1.19Z" fill="#6D6E6E" />
            <path d="M14.41 11C14.41 12.98 15.83 14.41 17.81 14.41C15.83 14.41 14.41 15.83 14.41 17.81C14.41 15.83 12.98 14.41 11 14.41C12.98 14.41 14.41 12.98 14.41 11Z" fill="#6D6E6E" />
          </svg>
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* ROW 1: TOTAL REVENUE (WIDE) + CUSTOMER GROWTH + WEEKLY VISITORS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* TOTAL REVENUE CARD (COL SPAN 6) */}
        <div
          style={{
            gridColumn: 'span 6',
            borderRadius: '30px',
            background: '#FFFFFF',
            padding: '24px 28px',
            minHeight: '260px',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          <CardNotch />

          <div>
            <span style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>This month</span>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '4px 0 0 0' }}>Total Revenue</h3>

            {/* Big $84.3K with Sub Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', margin: '16px 0 8px 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                <span style={{ fontSize: '28px', fontWeight: 400, color: '#6D6E6E' }}>$</span>
                <span style={{ fontSize: '58px', fontWeight: 700, color: '#111827', letterSpacing: '-0.9px', lineHeight: '1' }}>84.3K</span>
              </div>

              <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#6D6E6E' }}>
                <div>
                  Orders
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>1,284</div>
                </div>
                <div>
                  Avg order
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>$66</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: '#E6E8DD',
                  border: '1px solid #D4D7C8',
                  color: '#111827',
                  fontSize: '12px',
                  fontWeight: 600,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#111827" strokeWidth="1.5">
                  <path d="M3.5 8.5L8.5 3.5M4 3.5H8.5V8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                18.2%
              </span>
              <span style={{ color: '#6D6E6E', fontWeight: 400, fontSize: '13px' }}>vs last month</span>
            </div>
          </div>

          {/* Bottom Sage Beige Wave SVG Fill (#E6E8DD / #C5C8B4) */}
          <div style={{ height: '48px', width: '100%', marginTop: '12px' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 48" preserveAspectRatio="none" fill="none">
              <path
                d="M0 32C40 28 80 36 120 34C160 32 200 16 240 18C280 20 320 28 360 24C380 22 390 20 400 18V48H0V32Z"
                fill="url(#beigeGradient)"
                opacity="0.35"
              />
              <path
                d="M0 32C40 28 80 36 120 34C160 32 200 16 240 18C280 20 320 28 360 24C380 22 390 20 400 18"
                stroke="#C5C8B4"
                strokeWidth="2.5"
              />
              <defs>
                <linearGradient id="beigeGradient" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E6E8DD" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#E6E8DD" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* CUSTOMER GROWTH CARD (COL SPAN 3) */}
        <div
          style={{
            gridColumn: 'span 3',
            borderRadius: '30px',
            background: '#FFFFFF',
            padding: '24px',
            minHeight: '260px',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          <CardNotch />

          <div>
            <span style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>Customer growth</span>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '4px 0 12px 0' }}>New vs Returning</h3>

            <div style={{ fontSize: '32px', fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>
              89.4%
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: '#E6E8DD',
                  border: '1px solid #D4D7C8',
                  color: '#111827',
                  fontSize: '12px',
                  fontWeight: 600,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#111827" strokeWidth="1.5">
                  <path d="M3.5 8.5L8.5 3.5M4 3.5H8.5V8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                +4.2%
              </span>
              <span style={{ color: '#6D6E6E', fontWeight: 400, fontSize: '13px' }}>return rate</span>
            </div>
          </div>

          {/* Concentric Circle Progress Visual (#C5C8B4 / #E6E8DD) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', marginTop: '8px' }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#C5C8B4"
                strokeWidth="8"
                strokeDasharray="251"
                strokeDashoffset="35"
                strokeLinecap="round"
              />
              <circle cx="50" cy="50" r="26" fill="none" stroke="#111827" strokeWidth="6" strokeDasharray="163" strokeDashoffset="40" />
            </svg>
          </div>
        </div>

        {/* WEEKLY VISITORS CARD (COL SPAN 3) WITH SEARCH BAR DIRECTLY ABOVE IT */}
        <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* SEARCH INPUT BOX MOVED ABOVE THIS CHART */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              borderRadius: '14px',
              background: '#FFFFFF',
              border: '1px solid #E2DDD7',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <HiOutlineMagnifyingGlass size={18} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search orders, crops, buyers..."
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '13px',
                color: '#111827',
                width: '100%',
                fontWeight: 500,
              }}
            />
          </div>

          {/* WEEKLY VISITORS CARD */}
          <div
            style={{
              borderRadius: '30px',
              background: '#FFFFFF',
              padding: '24px',
              minHeight: '260px',
              position: 'relative',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            <CardNotch />

            <div>
              <span style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>Active traffic</span>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '4px 0 12px 0' }}>Weekly Visitors</h3>

              <div style={{ fontSize: '32px', fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>
                42.1K
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: '#E6E8DD',
                    border: '1px solid #D4D7C8',
                    color: '#111827',
                    fontSize: '12px',
                    fontWeight: 600,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#111827" strokeWidth="1.5">
                    <path d="M3.5 8.5L8.5 3.5M4 3.5H8.5V8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  12%
                </span>
                <span style={{ color: '#6D6E6E', fontWeight: 400, fontSize: '13px' }}>active now</span>
              </div>
            </div>

            {/* Ultra-Modern Pill Bar Chart Bars with Day Labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '65px', gap: '6px' }}>
                {[
                  { val: 40, day: 'M', active: false },
                  { val: 65, day: 'T', active: false },
                  { val: 80, day: 'W', active: false },
                  { val: 50, day: 'T', active: false },
                  { val: 95, day: 'F', active: true },
                  { val: 75, day: 'S', active: false },
                  { val: 85, day: 'S', active: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: `${item.val}%`,
                        borderRadius: '6px 6px 3px 3px',
                        background: item.active
                          ? 'linear-gradient(180deg, #111827 0%, #374151 100%)'
                          : idx % 2 === 0
                          ? '#E6E8DD'
                          : '#F3F4F6',
                        boxShadow: item.active ? '0 4px 10px rgba(17, 24, 39, 0.25)' : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 600, color: '#9CA3AF', padding: '0 4px' }}>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: TOTAL SALES + MONTHLY GOAL */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* TOTAL SALES CARD (COL SPAN 6) */}
        <div
          style={{
            gridColumn: 'span 6',
            borderRadius: '30px',
            background: '#FFFFFF',
            padding: '24px 28px',
            minHeight: '220px',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          <CardNotch />

          <div>
            <span style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>This week</span>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '4px 0 12px 0' }}>Total Sales</h3>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
              <span style={{ fontSize: '26px', fontWeight: 400, color: '#6D6E6E' }}>$</span>
              <span style={{ fontSize: '52px', fontWeight: 700, color: '#111827', letterSpacing: '-0.9px', lineHeight: '1' }}>
                {((salesProgress / 100) * 35).toFixed(1)}K
              </span>
            </div>
          </div>

          {/* DRAGGABLE INTERACTIVE SLIDER BAR */}
          <div>
            <div
              style={{
                width: '100%',
                height: '18px',
                borderRadius: '10px',
                background: '#F3F4F6',
                position: 'relative',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: `${salesProgress}%`,
                  height: '100%',
                  borderRadius: '10px',
                  background: '#C5C8B4',
                  transition: 'width 0.05s ease-out',
                }}
              />

              {/* Slider Knob */}
              <div
                style={{
                  position: 'absolute',
                  top: '-3px',
                  left: `${salesProgress}%`,
                  transform: 'translateX(-50%)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  border: '2px solid #C5C8B4',
                  pointerEvents: 'none',
                  transition: 'left 0.05s ease-out',
                }}
              />

              {/* Native Invisible Range Input Overlay */}
              <input
                type="range"
                min="0"
                max="100"
                value={salesProgress}
                onChange={(e) => setSalesProgress(Number(e.target.value))}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'grab',
                  margin: 0,
                  zIndex: 5,
                }}
              />
            </div>

            {/* WEEK DAY STEP LABELS UNDER THE SLIDER */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                fontSize: '11px',
                fontWeight: 600,
                color: '#9CA3AF',
                margin: '8px 0 12px 0',
              }}
            >
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const currentDayIndex = Math.min(6, Math.floor((salesProgress / 100) * 7));
                const isActive = idx === currentDayIndex;
                const isPassed = idx <= currentDayIndex;
                return (
                  <span
                    key={day}
                    style={{
                      flex: 1,
                      textAlign: idx === 0 ? 'left' : idx === 6 ? 'right' : 'center',
                      color: isActive ? '#111827' : isPassed ? '#4B5563' : '#9CA3AF',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: isActive ? '12px' : '11px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {day}
                  </span>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>
              <span>Weekly target: $35.0K</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{salesProgress}% completed</span>
            </div>
          </div>
        </div>

        {/* MONTHLY GOAL CARD (COL SPAN 6) */}
        <div
          style={{
            gridColumn: 'span 6',
            borderRadius: '30px',
            background: '#FFFFFF',
            padding: '24px 28px',
            minHeight: '220px',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          <CardNotch />

          <div>
            <span style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>Target progress</span>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '4px 0 12px 0' }}>Monthly Goal</h3>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '36px', fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>
                $36K
              </span>
              <span style={{ fontSize: '16px', color: '#6D6E6E', fontWeight: 500 }}>
                / $50K
              </span>
            </div>
          </div>

          <div>
            <div
              style={{
                width: '100%',
                height: '16px',
                borderRadius: '10px',
                background: '#F3F4F6',
                position: 'relative',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  width: '72%',
                  height: '100%',
                  borderRadius: '10px',
                  background: '#111827',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>
              <span>72% achieved</span>
              <span>14 days remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: RECENT ACTIVITIES + SALES BY REGION (WORLD MAP DEMO) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* RECENT ACTIVITIES CARD (COL SPAN 6) */}
        <div
          style={{
            gridColumn: 'span 6',
            borderRadius: '30px',
            background: '#FFFFFF',
            padding: '24px 28px',
            minHeight: '360px',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          <CardNotch />

          <div>
            <span style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>Audit log</span>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '4px 0 16px 0' }}>Recent Activities</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: 'New order #ORD-2026-1031 received', time: '5 mins ago', badge: '$639.45', type: 'order' },
                { title: 'Customer James Garcia registered', time: '32 mins ago', badge: 'User', type: 'user' },
                { title: 'Payout #PAY-8812 processed', time: '2 hours ago', badge: 'Completed', type: 'payout' },
                { title: 'Store settings updated', time: '5 hours ago', badge: 'System', type: 'system' },
              ].map((act, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '12px',
                    borderBottom: idx === 3 ? 'none' : '1px solid #F3F4F6',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#F9FAFB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {act.type === 'order' && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#B5AA96" strokeWidth="1.33">
                          <path d="M4 2L2 5V13C2 13.55 2.45 14 3 14H13C13.55 14 14 13.55 14 13V5L12 2H4Z" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M2 5H14" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M11 8C11 9.66 9.66 11 8 11C6.34 11 5 9.66 5 8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {act.type === 'user' && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#111827" strokeWidth="1.33">
                          <path d="M13.33 14V12.67C13.33 11.2 11.8 10 9.33 10H6.67C4.2 10 2.67 11.2 2.67 12.67V14" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="8" cy="4.67" r="2.67" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {act.type === 'payout' && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#10B981" strokeWidth="1.33">
                          <path d="M8 1V15M12 4H5.5C4.67 4 4 4.67 4 5.5C4 6.33 4.67 7 5.5 7H10.5C11.33 7 12 7.67 12 8.5C12 9.33 11.33 10 10.5 10H4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {act.type === 'system' && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6B7280" strokeWidth="1.33">
                          <path d="M8 1.33V2.67M8 13.33V14.67M1.33 8H2.67M13.33 8H14.67" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{act.title}</div>
                      <div style={{ fontSize: '11px', color: '#6D6E6E' }}>{act.time}</div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: act.type === 'order' ? '#B5AA96' : '#111827',
                      background: '#F3F4F6',
                      padding: '4px 10px',
                      borderRadius: '12px',
                    }}
                  >
                    {act.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SALES BY REGION WORLD MAP DEMO CARD (COL SPAN 6) */}
        <div
          style={{
            gridColumn: 'span 6',
            borderRadius: '30px',
            background: '#FFFFFF',
            padding: '24px',
            minHeight: '360px',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          <CardNotch />

          <div>
            <span style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>Top territories</span>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '4px 0 16px 0' }}>Sales by Region</h3>
          </div>

          <WorldMapDemo />
        </div>
      </div>

      {/* ROW 4: ALL ORDERS FULL TABLE CARD */}
      <div
        style={{
          borderRadius: '30px',
          background: '#FFFFFF',
          padding: '24px 28px',
          position: 'relative',
          boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
          overflow: 'hidden',
        }}
      >
        <CardNotch />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>Live fulfillment</span>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '4px 0 0 0' }}>Recent Orders</h3>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  background: '#E6E8DD',
                  borderRadius: '10px',
                  color: '#111827',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <th style={{ padding: '12px 16px', borderRadius: '10px 0 0 10px' }}>Order #</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Total</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', borderRadius: '0 10px 10px 0' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: '#ORD-2026-1031',
                  name: 'Abdullah Balfaqih',
                  email: 'abdullah@example.com',
                  total: '$639.45',
                  status: 'Delivered',
                  date: 'Aug 14, 2026',
                },
                {
                  id: '#ORD-2026-1030',
                  name: 'Saud Al-Otaibi',
                  email: 'saud.otaibi@example.co',
                  total: '$811.65',
                  status: 'Delivered',
                  date: 'Aug 14, 2026',
                },
                {
                  id: '#ORD-2026-1000',
                  name: 'Khalid Al-Tamimi',
                  email: 'khalid.tamimi@example.co',
                  total: '$1,095.15',
                  status: 'Processing',
                  date: 'Aug 15, 2026',
                },
                {
                  id: '#ORD-2026-1001',
                  name: 'Faisal Al-Shammari',
                  email: 'faisal.shammari@example.com',
                  total: '$77.19',
                  status: 'Delivered',
                  date: 'Aug 14, 2026',
                },
                {
                  id: '#ORD-2026-1032',
                  name: 'Noura Al-Subaie',
                  email: 'noura.subaie@example.com',
                  total: '$138.24',
                  status: 'Processing',
                  date: 'Aug 13, 2026',
                },
                {
                  id: '#ORD-2026-1002',
                  name: 'Reem Al-Harthi',
                  email: 'reem.harthi@example.com',
                  total: '$582.75',
                  status: 'Confirmed',
                  date: 'Aug 12, 2026',
                },
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F9FAFB' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#111827' }}>{row.id}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: '#E6E8DD',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #D4D7C8',
                          flexShrink: 0,
                        }}
                      >
                        <HiOutlineUser size={16} color="#111827" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{row.name}</div>
                        <div style={{ fontSize: '11px', color: '#6D6E6E' }}>{row.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#111827' }}>{row.total}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: '#F5F7F8',
                        border: '1px solid #E5E7EB',
                        color: '#111827',
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#6D6E6E' }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VIEW ALL LINK - ALIGNED TO THE RIGHT */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            onClick={() => showToast('Viewing full order ledger database')}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              color: '#111827',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>View all</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="#111827" strokeWidth="1.25">
              <path d="M3.125 7.5H11.875M8.125 11.25L11.875 7.5L8.125 3.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
