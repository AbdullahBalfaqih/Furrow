'use client';

import React, { useState } from 'react';
import {
  HiOutlineArrowDownTray,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineArrowRight,
  HiOutlineTruck,
  HiOutlineCreditCard,
  HiOutlineMapPin,
  HiOutlineArrowUpRight,
  HiOutlineEnvelope,
  HiOutlineArrowLeft,
} from 'react-icons/hi2';

const SaveFloppyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33">
    <path d="M10.667 2.66675H4.00033C3.6467 2.66675 3.30756 2.80722 3.05752 3.05727C2.80747 3.30732 2.66699 3.64646 2.66699 4.00008V12.0001C2.66699 12.3537 2.80747 12.6928 3.05752 12.9429C3.30756 13.1929 3.6467 13.3334 4.00033 13.3334H12.0003C12.3539 13.3334 12.6931 13.1929 12.9431 12.9429C13.1932 12.6928 13.3337 12.3537 13.3337 12.0001V5.33341L10.667 2.66675Z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66699 9.33333C6.66699 9.68696 6.80747 10.0261 7.05752 10.2761C7.30757 10.5262 7.6467 10.6667 8.00033 10.6667C8.35395 10.6667 8.69309 10.5262 8.94313 10.2761C9.19318 10.0261 9.33366 9.68696 9.33366 9.33333C9.33366 8.97971 9.19318 8.64057 8.94313 8.39052C8.69309 8.14048 8.35395 8 8.00033 8C7.6467 8 7.30757 8.14048 7.05752 8.39052C6.80747 8.64057 6.66699 8.97971 6.66699 9.33333Z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface OrderDetailViewProps {
  orderId?: string;
  onBack?: () => void;
  showToast?: (msg: string) => void;
}

export default function OrderDetailView({
  orderId = 'ORD-2026-1030',
  onBack,
  showToast,
}: OrderDetailViewProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [activeAddressTab, setActiveAddressTab] = useState<'shipping' | 'billing'>('shipping');
  const [orderStatus, setOrderStatus] = useState<'Confirmed' | 'Processing' | 'Shipped' | 'Delivered'>('Confirmed');

  const steps = [
    { num: 1, label: 'Pending', completed: true },
    { num: 2, label: 'Confirmed', completed: orderStatus !== 'Confirmed' ? true : false, current: orderStatus === 'Confirmed' },
    { num: 3, label: 'Processing', completed: ['Shipped', 'Delivered'].includes(orderStatus), current: orderStatus === 'Processing' },
    { num: 4, label: 'Shipped', completed: orderStatus === 'Delivered', current: orderStatus === 'Shipped' },
    { num: 5, label: 'Delivered', completed: false, current: orderStatus === 'Delivered' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        fontFamily: "'Plus Jakarta Sans', 'Readex Pro', 'Outfit', sans-serif",
      }}
    >
      {/* HEADER BAR WITH BACK BUTTON & BREADCRUMB */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#B3B4B5' }}>
            {onBack && (
              <button
                onClick={onBack}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: '#111827',
                  fontWeight: 500,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <HiOutlineArrowLeft size={14} color="#111827" />
                <span>Back to Orders</span>
              </button>
            )}
            <span style={{ color: '#111827', fontWeight: 600, fontSize: '14px' }}>{orderId}</span>
          </div>

          <button
            onClick={() => showToast && showToast(`Exporting order ${orderId} as CSV...`)}
            style={{
              height: '38px',
              padding: '0 16px',
              borderRadius: '10px',
              background: '#F3F3F3',
              border: '1px solid #E5E7EB',
              color: '#111827',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <HiOutlineArrowDownTray size={14} color="#111827" />
            <span>Export CSV</span>
          </button>
        </div>

        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>{orderId}</h1>
          <div style={{ fontSize: '15px', color: '#6D6E6E', marginTop: '4px' }}>August 17, 2026 at 09:21 AM</div>
        </div>
      </div>

      {/* MAIN 3-COLUMN FIGMA GRID LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px', width: '100%' }}>
        {/* LEFT COLUMN (COL SPAN 8) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* CARD 1: STATUS & STEPPER PROGRESSION */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '30px',
              padding: '24px 26px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* STATUS BADGES ROW (EXACT BEIGE E6E8DD THEME) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D4D7C8',
                  background: '#E6E8DD',
                  color: '#111827',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                Confirmed
              </div>
              <div
                style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  border: '1px solid #A4F4CF',
                  background: '#ECFDF5',
                  color: '#007A55',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                Paid
              </div>
            </div>

            {/* 5-STEP STEPPER BAR (EXACT BEIGE #E6E8DD ACCENTS) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {steps.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* Connecting Bar */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '11px',
                        left: idx === 0 ? '50%' : '0',
                        right: idx === 4 ? '50%' : '0',
                        height: '3px',
                        background: s.completed ? '#E6E8DD' : '#F5F7F8',
                        zIndex: 1,
                      }}
                    />
                    {/* Circle Node */}
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: s.completed || s.current ? '#E6E8DD' : '#F5F7F8',
                        color: s.completed || s.current ? '#111827' : '#6D6E6E',
                        border: s.completed || s.current ? '1px solid #D4D7C8' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 600,
                        zIndex: 2,
                        position: 'relative',
                      }}
                    >
                      {s.completed ? <HiOutlineCheck size={12} color="#111827" /> : s.num}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: s.current || s.completed ? '#111827' : '#6D6E6E',
                      fontWeight: 500,
                      textAlign: 'center',
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* STEPPER ACTIONS (EXACT BEIGE #E6E8DD SQUARED BUTTON) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', paddingTop: '8px' }}>
              <button
                onClick={() => showToast && showToast('Order cancellation initiated.')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <HiOutlineXMark size={14} color="#EF4444" />
                <span>Cancel order</span>
              </button>

              <button
                onClick={() => {
                  setOrderStatus('Processing');
                  showToast && showToast('Order status updated to Processing');
                }}
                style={{
                  height: '38px',
                  padding: '0 18px',
                  borderRadius: '10px',
                  background: '#E6E8DD',
                  color: '#111827',
                  border: '1px solid #D4D7C8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                }}
              >
                <span>Mark as Processing</span>
                <HiOutlineArrowRight size={14} color="#111827" />
              </button>
            </div>
          </div>

          {/* CARD 2: CUSTOMER INFO & TRACKING NUMBER (2 COLS) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* CUSTOMER CARD */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '30px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>Customer</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="James Garcia"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>James Garcia</div>
                  <div style={{ fontSize: '12px', color: '#6D6E6E', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <HiOutlineEnvelope size={13} color="#6D6E6E" />
                    <span>james.garcia@example.com</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => showToast && showToast('Viewing customer profile...')}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#F5F7F8',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <HiOutlineArrowUpRight size={16} color="#6D6E6E" />
              </button>
            </div>

            {/* TRACKING NUMBER CARD */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '30px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>
                <HiOutlineTruck size={16} color="#6D6E6E" />
                <span>Tracking Number</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  style={{
                    flex: 1,
                    height: '38px',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    background: '#F5F7F8',
                    padding: '0 12px',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => showToast && showToast('Tracking number saved!')}
                  style={{
                    height: '38px',
                    padding: '0 16px',
                    borderRadius: '10px',
                    background: '#E6E8DD',
                    color: '#111827',
                    border: '1px solid #D4D7C8',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <SaveFloppyIcon />
                  <span>Save</span>
                </button>
              </div>

              <div style={{ fontSize: '11px', color: '#6D6E6E', marginTop: '8px' }}>
                Saved on its own. The customer can use it to follow the parcel.
              </div>
            </div>
          </div>

          {/* CARD 3: ORDER ITEMS LIST */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '30px',
              padding: '24px 26px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>Order Items</div>
              <span style={{ fontSize: '12px', color: '#6D6E6E' }}>2 lines</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  title: 'Sukari Dates Premium Batch #8812',
                  price: '$31,000.00',
                  qty: '×1',
                  total: '$31,000.00',
                  img: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=200&auto=format&fit=crop&q=80',
                },
                {
                  title: 'Al-Jouf Extra Virgin Olive Oil Batch #940',
                  price: '$16,800.00',
                  qty: '×2',
                  total: '$33,600.00',
                  img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&auto=format&fit=crop&q=80',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '16px',
                    background: '#F9FAFB',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#6D6E6E', marginTop: '2px' }}>{item.price}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <span style={{ fontSize: '12px', color: '#6D6E6E' }}>{item.qty}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{item.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (COL SPAN 4) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* CARD 4: ORDER TOTAL & BREAKDOWN */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '30px',
              padding: '24px 26px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>Order Total</div>
              <div style={{ fontSize: '34px', fontWeight: 700, color: '#111827', marginTop: '4px', letterSpacing: '-0.5px' }}>
                $64,600.00
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '12px', color: '#6D6E6E' }}>
                <span>3 items</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <HiOutlineCreditCard size={14} color="#6D6E6E" /> Card
                </span>
              </div>
            </div>

            {/* BREAKDOWN CONTAINER */}
            <div
              style={{
                background: '#F5F7F8',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#6D6E6E' }}>Subtotal</span>
                <span style={{ color: '#111827', fontWeight: 500 }}>$64,600.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#6D6E6E' }}>Shipping</span>
                <span style={{ color: '#111827', fontWeight: 500 }}>$0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#6D6E6E' }}>Tax (15% VAT)</span>
                <span style={{ color: '#111827', fontWeight: 500 }}>$9,690.00</span>
              </div>
            </div>
          </div>

          {/* CARD 5: SHIPPING & BILLING ADDRESSES TABS */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '30px',
              padding: '24px 26px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* TABS CONTAINER */}
            <div style={{ display: 'flex', background: '#F5F7F8', borderRadius: '12px', padding: '4px' }}>
              <button
                onClick={() => setActiveAddressTab('shipping')}
                style={{
                  flex: 1,
                  height: '34px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeAddressTab === 'shipping' ? '#E6E8DD' : 'transparent',
                  color: activeAddressTab === 'shipping' ? '#111827' : '#6D6E6E',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <HiOutlineTruck size={14} />
                <span>Shipping Address</span>
              </button>
              <button
                onClick={() => setActiveAddressTab('billing')}
                style={{
                  flex: 1,
                  height: '34px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeAddressTab === 'billing' ? '#E6E8DD' : 'transparent',
                  color: activeAddressTab === 'billing' ? '#111827' : '#6D6E6E',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <HiOutlineMapPin size={14} />
                <span>Billing Address</span>
              </button>
            </div>

            {/* ADDRESS DETAILS */}
            <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#6D6E6E' }}>
              <div style={{ fontWeight: 600, color: '#111827' }}>James Garcia</div>
              <div>20 Bergstrasse</div>
              <div>Berlin, Berlin 10115</div>
              <div>Germany</div>
              <div style={{ marginTop: '4px', color: '#111827' }}>+1 555 951 753</div>
            </div>
          </div>

          {/* CARD 6: TIMELINE HISTORY */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '30px',
              padding: '24px 26px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>Timeline</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#E6E8DD',
                  border: '1px solid #D4D7C8',
                  marginTop: '4px',
                }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>Order placed</div>
                <div style={{ fontSize: '11px', color: '#6D6E6E', marginTop: '2px' }}>Aug 17, 2026, 09:21 AM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
