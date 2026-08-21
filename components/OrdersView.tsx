'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  HiOutlineShoppingCart,
  HiOutlineSparkles,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlinePaperClip,
  HiOutlineChatBubbleLeftRight,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineArrowDownTray,
  HiOutlineXMark,
  HiOutlineTruck,
  HiOutlineCurrencyDollar,
} from 'react-icons/hi2';
import OrderDetailView from '@/components/OrderDetailView';

interface OrdersViewProps {
  showToast?: (msg: string) => void;
}

interface OrderItem {
  id: string;
  orderNumber: string;
  cropName: string;
  cropType: string;
  buyerName: string;
  buyerHandle: string;
  location: string;
  quantity: string;
  totalPrice: string;
  pricePerTon: string;
  aiGrade: string;
  status: 'Completed' | 'In Escrow' | 'Processing' | 'Pending Escrow';
  paymentMethod: 'Blockchain Escrow' | 'Direct Wire' | 'Letter of Credit';
  date: string;
  image: string;
  trackingStep: number; // 1 to 4
}

// Custom Filter Dropdown Component
function CustomFilterDropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height: '42px',
          borderRadius: '12px',
          border: isOpen ? '1px solid #111827' : '1px solid #E5E7EB',
          background: '#F5F7F8',
          padding: '0 14px',
          fontSize: '13px',
          color: '#111827',
          outline: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.15s ease',
          fontWeight: 400,
          boxShadow: isOpen ? '0 0 0 3px rgba(17, 24, 39, 0.08)' : 'none',
        }}
      >
        <span>{selectedOption?.label}</span>
        <HiOutlineChevronDown
          size={14}
          color="#6D6E6E"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
            marginLeft: '8px',
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 100,
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            minWidth: '160px',
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: isSelected ? '#F5F7F8' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: isSelected ? '#111827' : '#4B5563',
                  fontWeight: isSelected ? 500 : 400,
                }}
              >
                <span>{option.label}</span>
                {isSelected && <HiOutlineCheck size={14} color="#111827" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrdersView({ showToast }: OrdersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cropFilter, setCropFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [activeTabMode, setActiveTabMode] = useState<'cards' | 'table'>('cards');

  const [ordersList, setOrdersList] = useState<OrderItem[]>([
    {
      id: '1',
      orderNumber: '#TX-8821',
      cropName: 'Sukari Dates Premium Batch #8812',
      cropType: 'Sukari Dates',
      buyerName: 'Al Rasheed Wholesale',
      buyerHandle: '@alrasheed_farm',
      location: 'Riyadh, KSA',
      quantity: '5.0 Tons',
      totalPrice: '$31,000',
      pricePerTon: '$6,200 / Ton',
      aiGrade: 'Grade A+ (98.6%)',
      status: 'In Escrow',
      paymentMethod: 'Blockchain Escrow',
      date: 'Just now',
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&auto=format&fit=crop&q=80',
      trackingStep: 2,
    },
    {
      id: '2',
      orderNumber: '#TX-8820',
      cropName: 'Al-Jouf Extra Virgin Olive Oil Batch #940',
      cropType: 'Al-Jouf Olives',
      buyerName: 'Jeddah Trading Co',
      buyerHandle: '@jeddah_olives',
      location: 'Jeddah, KSA',
      quantity: '1,200 Liters',
      totalPrice: '$16,800',
      pricePerTon: '$14.0 / Liter',
      aiGrade: 'Grade A (95.2%)',
      status: 'In Escrow',
      paymentMethod: 'Blockchain Escrow',
      date: '12m ago',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
      trackingStep: 3,
    },
    {
      id: '3',
      orderNumber: '#TX-8819',
      cropName: 'Taif Organic Rose Extract Batch #510',
      cropType: 'Taif Roses',
      buyerName: 'Saudi Perfumery House',
      buyerHandle: '@saudi_perfumes',
      location: 'Taif, KSA',
      quantity: '50 Liters',
      totalPrice: '$42,500',
      pricePerTon: '$850 / Liter',
      aiGrade: 'Grade A+ (99.1%)',
      status: 'Completed',
      paymentMethod: 'Direct Wire',
      date: '1h ago',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      trackingStep: 4,
    },
    {
      id: '4',
      orderNumber: '#TX-8818',
      cropName: 'Medjool Jumbo Dates Batch #22',
      cropType: 'Medjool Dates',
      buyerName: 'Dammam Distributors',
      buyerHandle: '@dammam_distributors',
      location: 'Dammam, KSA',
      quantity: '3.5 Tons',
      totalPrice: '$18,400',
      pricePerTon: '$5,257 / Ton',
      aiGrade: 'Grade A (94.0%)',
      status: 'Processing',
      paymentMethod: 'Letter of Credit',
      date: '3h ago',
      image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80',
      trackingStep: 1,
    },
  ]);

  const filteredOrders = ordersList.filter((item) => {
    const matchesSearch =
      item.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cropName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesCrop = cropFilter === 'All' || item.cropType === cropFilter;
    const matchesPayment = paymentFilter === 'All' || item.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesCrop && matchesPayment;
  });

  if (selectedOrder) {
    return <OrderDetailView orderId={selectedOrder.orderNumber} onBack={() => setSelectedOrder(null)} showToast={showToast} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* PAGE HEADER ROW */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
            Sales Orders & Escrow Deals
          </h1>
          <p style={{ fontSize: '14px', color: '#6D6E6E', margin: '4px 0 0 0', fontWeight: 400 }}>
            Manage verified crop orders, monitor live escrow contracts, and track refrigerated logistics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => showToast && showToast('Exporting transaction ledger to CSV...')}
            style={{
              height: '42px',
              padding: '0 16px',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              color: '#111827',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <HiOutlineArrowDownTray size={16} color="#111827" />
            <span>Export Ledger</span>
          </button>
        </div>
      </div>

      {/* METRIC SUMMARY CARDS (4 CARDS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {[
          { title: 'Total Sales Orders', val: '1,284', trend: '+18.2% this month', icon: HiOutlineShoppingCart },
          { title: 'Locked in Escrow', val: '$148.5K', trend: '8 Active Escrows', icon: HiOutlineShieldCheck },
          { title: 'Settled Payouts', val: '$1.20M', trend: 'Instant Settlements', icon: HiOutlineCurrencyDollar },
          { title: 'Dispute Rate', val: '0.02%', trend: 'AI Verified Lots', icon: HiOutlineCheckCircle },
        ].map((m, idx) => (
          <div
            key={idx}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '18px 20px',
              border: '1px solid rgba(0, 0, 0, 0.04)',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>{m.title}</span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: '#F5F7F8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <m.icon size={16} color="#8C7355" />
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>
                {m.val}
              </div>
              <div style={{ fontSize: '11px', color: '#8C7355', fontWeight: 500, marginTop: '2px' }}>
                {m.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CONTROLS BAR: SEARCH, FILTERS & VIEW MODE */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '16px 20px',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* TOP SEARCH & VIEW MODE SWITCHER (ENLARGED TO 48px HEIGHT) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#F5F7F8',
              border: '1px solid #E5E7EB',
              borderRadius: '14px',
              padding: '0 18px',
              height: '48px',
              flex: 1,
              minWidth: '300px',
              boxSizing: 'border-box',
            }}
          >
            <HiOutlineMagnifyingGlass size={20} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search order number (#TX-...), buyer name, or crop batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '14px',
                color: '#111827',
                width: '100%',
                fontWeight: 400,
              }}
            />
          </div>

          {/* VIEW SWITCHER BUTTONS (ENLARGED TO 48px HEIGHT & ROOMIER PADDING) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '48px',
              background: '#F5F7F8',
              borderRadius: '14px',
              padding: '4px',
              border: '1px solid #E5E7EB',
              boxSizing: 'border-box',
            }}
          >
            <button
              onClick={() => setActiveTabMode('cards')}
              style={{
                height: '38px',
                padding: '0 20px',
                borderRadius: '10px',
                border: 'none',
                background: activeTabMode === 'cards' ? '#E6E8DD' : 'transparent',
                color: activeTabMode === 'cards' ? '#111827' : '#6D6E6E',
                fontSize: '13px',
                fontWeight: activeTabMode === 'cards' ? 600 : 500,
                cursor: 'pointer',
                boxShadow: activeTabMode === 'cards' ? '0 1px 4px rgba(0,0,0,0.04)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              Card View
            </button>
            <button
              onClick={() => setActiveTabMode('table')}
              style={{
                height: '38px',
                padding: '0 20px',
                borderRadius: '10px',
                border: 'none',
                background: activeTabMode === 'table' ? '#E6E8DD' : 'transparent',
                color: activeTabMode === 'table' ? '#111827' : '#6D6E6E',
                fontSize: '13px',
                fontWeight: activeTabMode === 'table' ? 600 : 500,
                cursor: 'pointer',
                boxShadow: activeTabMode === 'table' ? '0 1px 4px rgba(0,0,0,0.04)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              Table View
            </button>
          </div>
        </div>

        {/* BOTTOM DROPDOWN FILTERS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#6D6E6E', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Order Status</span>
            <CustomFilterDropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'All Statuses', value: 'All' },
                { label: 'In Escrow', value: 'In Escrow' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Processing', value: 'Processing' },
              ]}
            />
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#6D6E6E', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Crop Type</span>
            <CustomFilterDropdown
              value={cropFilter}
              onChange={setCropFilter}
              options={[
                { label: 'All Crops', value: 'All' },
                { label: 'Sukari Dates', value: 'Sukari Dates' },
                { label: 'Al-Jouf Olives', value: 'Al-Jouf Olives' },
                { label: 'Taif Roses', value: 'Taif Roses' },
                { label: 'Medjool Dates', value: 'Medjool Dates' },
              ]}
            />
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#6D6E6E', fontWeight: 500, marginBottom: '4px', display: 'block' }}>Payment Method</span>
            <CustomFilterDropdown
              value={paymentFilter}
              onChange={setPaymentFilter}
              options={[
                { label: 'All Payments', value: 'All' },
                { label: 'Blockchain Escrow', value: 'Blockchain Escrow' },
                { label: 'Direct Wire', value: 'Direct Wire' },
                { label: 'Letter of Credit', value: 'Letter of Credit' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* MAIN ORDERS CONTENT: CARD VIEW OR TABLE VIEW */}
      {activeTabMode === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {filteredOrders.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* TALL CROP PHOTO (240px HEIGHT, 100% CLEAN HD PHOTO, NO TEXT OVERLAYS) */}
              <div style={{ height: '240px', width: '100%', background: '#111827' }}>
                <img
                  src={item.image}
                  alt={item.cropName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* CARD CONTENT DETAILS */}
              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* NEUTRAL STATUS & TAGS ROW (NO COLORED HIGHLIGHTS / NO COLORED BADGES) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#111827',
                        background: '#F3F4F6',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {item.status}
                    </span>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#111827',
                        background: '#F3F4F6',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {item.aiGrade.split(' (')[0]}
                    </span>
                  </div>

                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#6D6E6E' }}>
                    {item.orderNumber}
                  </span>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: '#111827',
                      margin: 0,
                      lineHeight: '1.3',
                    }}
                  >
                    {item.cropName}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#6D6E6E', marginTop: '4px', fontWeight: 400 }}>
                    Buyer: <span style={{ color: '#111827', fontWeight: 500 }}>{item.buyerName}</span> ({item.location})
                  </div>
                </div>

                {/* PRICE & QUANTITY (UN-NESTED DIRECT LAYOUT - NO GREY CARD BOX) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    padding: '2px 0',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', color: '#6D6E6E', display: 'block', fontWeight: 500 }}>إجمالي قيمة الصفقة</span>
                    <span style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>{item.totalPrice}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: '#6D6E6E', display: 'block', fontWeight: 500 }}>حجم الشحنة</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827', marginTop: '2px', display: 'block' }}>{item.quantity}</span>
                  </div>
                </div>

                {/* ESCROW TRACKING STEPPER */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6D6E6E', marginBottom: '6px', fontWeight: 500 }}>
                    <span>تتبع الصفقة واللوجستيات</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>الخطوة {item.trackingStep} من 4</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', height: '6px' }}>
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        style={{
                          flex: 1,
                          height: '100%',
                          borderRadius: '3px',
                          background: step <= item.trackingStep ? '#111827' : '#E5E7EB',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* CARD FOOTER ACTIONS */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '6px', borderTop: '1px solid #F3F4F6' }}>
                  <button
                    onClick={() => setSelectedOrder(item)}
                    style={{
                      flex: 1,
                      height: '38px',
                      borderRadius: '10px',
                      background: '#111827',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span>View Deal Details</span>
                  </button>

                  <button
                    onClick={() => showToast && showToast(`Downloading Invoice for ${item.orderNumber}...`)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: '#F5F7F8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <HiOutlineDocumentText size={16} color="#111827" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px 24px',
            border: '1px solid rgba(0, 0, 0, 0.04)',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)',
            overflowX: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6', color: '#6D6E6E', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px 12px 0', fontWeight: 500 }}>ORDER ID</th>
                <th style={{ padding: '12px 16px 12px 0', fontWeight: 500 }}>CROP BATCH</th>
                <th style={{ padding: '12px 16px 12px 0', fontWeight: 500 }}>BUYER</th>
                <th style={{ padding: '12px 16px 12px 0', fontWeight: 500 }}>AMOUNT</th>
                <th style={{ padding: '12px 16px 12px 0', fontWeight: 500 }}>PAYMENT</th>
                <th style={{ padding: '12px 16px 12px 0', fontWeight: 500 }}>STATUS</th>
                <th style={{ padding: '12px 0', fontWeight: 500, textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                  <td style={{ padding: '14px 16px 14px 0', fontWeight: 600, color: '#111827' }}>{row.orderNumber}</td>
                  <td style={{ padding: '14px 16px 14px 0', color: '#111827', fontWeight: 500 }}>{row.cropName}</td>
                  <td style={{ padding: '14px 16px 14px 0', color: '#6D6E6E' }}>{row.buyerName}</td>
                  <td style={{ padding: '14px 16px 14px 0', fontWeight: 700, color: '#111827' }}>{row.totalPrice}</td>
                  <td style={{ padding: '14px 16px 14px 0', color: '#6D6E6E' }}>{row.paymentMethod}</td>
                  <td style={{ padding: '14px 16px 14px 0' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: row.status === 'Completed' ? '#ECFDF5' : row.status === 'In Escrow' ? '#EFF6FF' : '#FEF3C7',
                        color: row.status === 'Completed' ? '#059669' : row.status === 'In Escrow' ? '#2563EB' : '#D97706',
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 0', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedOrder(row)}
                      style={{
                        background: '#111827',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ORDER DETAIL & ESCROW MODAL */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(8px)',
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '680px',
              background: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0 32px 80px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {selectedOrder && (
              <>
                {/* MODAL HEADER */}
                <div
                  style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 500 }}>Escrow Contract Audit</div>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '2px 0 0 0' }}>
                      {(selectedOrder as OrderItem).orderNumber} • {(selectedOrder as OrderItem).cropType}
                    </h2>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(null)}
                    style={{
                      background: '#F3F4F6',
                      border: 'none',
                      borderRadius: '10px',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <HiOutlineXMark size={18} color="#111827" />
                  </button>
                </div>

                {/* MODAL BODY */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#FAFAFA', padding: '16px', borderRadius: '14px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#6D6E6E' }}>Buyer Entity</span>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{(selectedOrder as OrderItem).buyerName}</div>
                      <div style={{ fontSize: '12px', color: '#6D6E6E' }}>{(selectedOrder as OrderItem).location}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#6D6E6E' }}>Locked Escrow Value</span>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{(selectedOrder as OrderItem).totalPrice}</div>
                      <div style={{ fontSize: '12px', color: '#059669', fontWeight: 500 }}>🔒 Funds Verified in Escrow</div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      onClick={() => {
                        showToast && showToast(`Escrow funds of ${(selectedOrder as OrderItem).totalPrice} released successfully!`);
                        setSelectedOrder(null);
                      }}
                      style={{
                        flex: 1,
                        height: '42px',
                        borderRadius: '10px',
                        background: '#111827',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Release Escrow Funds
                    </button>

                    <button
                      onClick={() => {
                        showToast && showToast('Downloading Escrow Contract Audit PDF...');
                      }}
                      style={{
                        height: '42px',
                        padding: '0 16px',
                        borderRadius: '10px',
                        background: '#F5F7F8',
                        border: '1px solid #E5E7EB',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#111827',
                        cursor: 'pointer',
                      }}
                    >
                      Contract Audit PDF
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
