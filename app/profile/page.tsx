'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  HiOutlineUser,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineCube,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlineShoppingBag,
  HiOutlineCamera,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowDownTray,
  HiOutlineShoppingCart,
  HiOutlineCurrencyDollar,
  HiOutlineTruck,
  HiOutlineXMark,
} from 'react-icons/hi2';

interface BuyerOrder {
  id: string;
  orderNumber: string;
  cropName: string;
  sellerName: string;
  sellerLocation: string;
  quantity: string;
  totalPrice: string;
  status: 'In Escrow' | 'Shipped' | 'Completed' | 'Processing';
  paymentMethod: 'Blockchain Escrow' | 'Direct Wire';
  date: string;
  image: string;
  trackingStep: number; // 1 to 4
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [role, setRole] = useState<'merchant' | 'buyer'>('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Buyer Orders State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeViewMode, setActiveViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedOrder, setSelectedOrder] = useState<BuyerOrder | null>(null);

  const [buyerOrders, setBuyerOrders] = useState<BuyerOrder[]>([
    {
      id: '1',
      orderNumber: '#TX-9012',
      cropName: 'Jolani Green Olives Batch #6621',
      sellerName: 'Al Rasheed Farm',
      sellerLocation: 'Jeddah, KSA',
      quantity: '3.2 Tons',
      totalPrice: '$90,000',
      status: 'In Escrow',
      paymentMethod: 'Blockchain Escrow',
      date: '10m ago',
      image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80',
      trackingStep: 2,
    },
    {
      id: '2',
      orderNumber: '#TX-8821',
      cropName: 'Sukari Premium Dates Batch #8812',
      sellerName: 'Qassim Heritage Agriculture',
      sellerLocation: 'Buraidah, KSA',
      quantity: '5.0 Tons',
      totalPrice: '$31,000',
      status: 'Shipped',
      paymentMethod: 'Blockchain Escrow',
      date: '2h ago',
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&auto=format&fit=crop&q=80',
      trackingStep: 3,
    },
    {
      id: '3',
      orderNumber: '#TX-8740',
      cropName: 'Al-Jouf Virgin Olive Oil Batch #940',
      sellerName: 'Al Jouf Organic Estate',
      sellerLocation: 'Al Jouf, KSA',
      quantity: '1,200 Liters',
      totalPrice: '$16,800',
      status: 'Completed',
      paymentMethod: 'Blockchain Escrow',
      date: '1d ago',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
      trackingStep: 4,
    },
  ]);

  useEffect(() => {
    if (!isConnected || !address) {
      setLoading(false);
      return;
    }

    // Fetch user profile from Supabase Cloud DB
    fetch(`/api/users/profile?address=${address}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setRole(data.profile.role || 'buyer');
          setName(data.profile.name || '');
          setEmail(data.profile.email || '');
          setPhone(data.profile.phone || '');
          setShippingAddress(data.profile.shippingAddress || '');
          setCity(data.profile.city || '');
          if (data.profile.avatarUrl) setAvatarUrl(data.profile.avatarUrl);
        }
      })
      .catch((err) => console.error('Failed to fetch profile:', err))
      .finally(() => setLoading(false));
  }, [address, isConnected]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setAvatarUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      open();
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          role,
          name,
          email,
          phone,
          shippingAddress,
          city,
          avatarUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredOrders = buyerOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#F5F7F8',
        color: '#111827',
        fontFamily: "'Plus Jakarta Sans', 'Readex Pro', 'Inter', sans-serif",
      }}
    >
      <div style={{ paddingTop: '20px' }}>
        <Navbar />
      </div>

      <section
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '40px 24px 80px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* BREADCRUMB & PAGE NAVIGATION TABS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#9CA3AF' }}>
            <span>Customer Portal</span>
            <span>/</span>
            <span style={{ color: '#111827', fontWeight: 600 }}>
              {activeTab === 'profile' ? 'Profile & Address' : 'My Orders & Escrows'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
                {activeTab === 'profile' ? 'Customer Profile & Shipping Address' : 'My Crop Orders & Escrow Deals'}
              </h1>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0 0' }}>
                {activeTab === 'profile'
                  ? 'Manage your personal details, avatar image, and verified shipping address.'
                  : 'Track your placed orders, active blockchain escrow contracts, and shipment progress.'}
              </p>
            </div>

            {/* TAB SWITCHER: PROFILE VS MY ORDERS */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '14px',
                padding: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
              }}
            >
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  padding: '8px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === 'profile' ? '#111827' : 'transparent',
                  color: activeTab === 'profile' ? '#FFFFFF' : '#4B5563',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Profile & Address
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  padding: '8px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === 'orders' ? '#111827' : 'transparent',
                  color: activeTab === 'orders' ? '#FFFFFF' : '#4B5563',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                My Orders ({buyerOrders.length})
              </button>
            </div>
          </div>
        </div>

        {!isConnected ? (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '24px',
              padding: '56px 32px',
              textAlign: 'center',
              maxWidth: '520px',
              margin: '40px auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: '#F3F4F6',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                color: '#111827',
              }}
            >
              <HiOutlineShieldCheck style={{ width: '32px', height: '32px' }} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 10px 0' }}>
              Connect Wallet to Access Buyer Portal
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 28px 0', lineHeight: 1.6 }}>
              Connect your Web3 wallet to manage shipping address, dispatch orders, and live auction bids.
            </p>
            <button
              onClick={() => open()}
              style={{
                background: '#111827',
                color: '#FFFFFF',
                padding: '14px 32px',
                borderRadius: '14px',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              }}
            >
              Connect Wallet Now
            </button>
          </div>
        ) : activeTab === 'profile' ? (
          /* PROFILE TAB CONTENT */
          <div className="profile-grid-container" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px' }}>
            <style jsx>{`
              @media (max-width: 768px) {
                .profile-grid-container {
                  grid-template-columns: 1fr !important;
                  gap: 20px !important;
                }
                .profile-inputs-grid {
                  grid-template-columns: 1fr !important;
                  gap: 16px !important;
                }
              }
            `}</style>
            {/* AVATAR SIDEBAR CARD (CLEAN WHITE, NO HIGHLIGHTS, NO ACCOUNT ROLE ROW, NO SECURITY BOX) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '24px',
                  padding: '32px 24px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {/* AVATAR WITH PHOTO UPLOAD TRIGGER */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '88px',
                      height: '88px',
                      borderRadius: '24px',
                      background: avatarUrl ? 'transparent' : '#111827',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      border: '2px solid #E5E7EB',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      name ? name.charAt(0).toUpperCase() : 'W'
                    )}
                  </div>
                  {/* Camera overlay button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#111827',
                      color: '#FFFFFF',
                      border: '2px solid #FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <HiOutlineCamera style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>
                  {name || 'Furrow Chain Buyer'}
                </h3>

                <p
                  style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    fontFamily: 'monospace',
                    margin: '0 0 16px 0',
                    wordBreak: 'break-all',
                  }}
                >
                  {address}
                </p>
              </div>
            </div>

            {/* PROFILE & SHIPPING DATA FORM (CLEAN WHITE, NO GRAY HIGHLIGHT FILL ON INPUTS) */}
            <form
              onSubmit={handleSaveProfile}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '24px',
                padding: '36px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #F3F4F6',
                  paddingBottom: '18px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>
                    Personal & Shipping Address
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                    Shipping address details used for dispatching certified agricultural lots.
                  </p>
                </div>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111827',
                  }}
                >
                  <HiOutlineCube style={{ width: '22px', height: '22px' }} />
                </div>
              </div>

              {saveSuccess && (
                <div
                  style={{
                    padding: '14px 18px',
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    color: '#065F46',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                >
                  <HiOutlineCheckCircle style={{ width: '20px', height: '20px', color: '#10B981' }} />
                  <span>Profile data & avatar saved successfully to Supabase Cloud DB!</span>
                </div>
              )}

              <div className="profile-inputs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '8px', fontWeight: 600 }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <HiOutlineUser style={{ position: 'absolute', left: '14px', top: '14px', width: '18px', height: '18px', color: '#9CA3AF' }} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      style={{
                        width: '100%',
                        height: '46px',
                        paddingLeft: '42px',
                        paddingRight: '14px',
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        color: '#111827',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontWeight: 500,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '8px', fontWeight: 600 }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <HiOutlineEnvelope style={{ position: 'absolute', left: '14px', top: '14px', width: '18px', height: '18px', color: '#9CA3AF' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      style={{
                        width: '100%',
                        height: '46px',
                        paddingLeft: '42px',
                        paddingRight: '14px',
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        color: '#111827',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontWeight: 500,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '8px', fontWeight: 600 }}>
                    Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <HiOutlinePhone style={{ position: 'absolute', left: '14px', top: '14px', width: '18px', height: '18px', color: '#9CA3AF' }} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+966 5X XXX XXXX"
                      style={{
                        width: '100%',
                        height: '46px',
                        paddingLeft: '42px',
                        paddingRight: '14px',
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        color: '#111827',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontWeight: 500,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '8px', fontWeight: 600 }}>
                    City
                  </label>
                  <div style={{ position: 'relative' }}>
                    <HiOutlineMapPin style={{ position: 'absolute', left: '14px', top: '14px', width: '18px', height: '18px', color: '#9CA3AF' }} />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Riyadh, Jeddah, Qassim..."
                      style={{
                        width: '100%',
                        height: '46px',
                        paddingLeft: '42px',
                        paddingRight: '14px',
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        color: '#111827',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontWeight: 500,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '8px', fontWeight: 600 }}>
                  Detailed Shipping Address
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  rows={3}
                  placeholder="Street name, building number, district..."
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    color: '#111827',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'none',
                    fontWeight: 500,
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: '#111827',
                    color: '#FFFFFF',
                    padding: '14px 36px',
                    borderRadius: '14px',
                    fontWeight: 600,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s',
                  }}
                >
                  {saving ? 'Saving Profile...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* BUYER ORDERS TAB CONTENT (EXACT SAME DASHBOARD DESIGN AS SELLER ORDERS VIEW) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            {/* METRIC CARDS FOR BUYER */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Total Placed Orders', val: `${buyerOrders.length}`, trend: 'Active Deals', icon: HiOutlineShoppingCart },
                { title: 'Locked in Escrow', val: '$137.8K', trend: 'Blockchain Protected', icon: HiOutlineCurrencyDollar },
                { title: 'Delivered Purchases', val: '1 Lot', trend: 'Verified Delivery', icon: HiOutlineTruck },
                { title: 'Active Bids', val: '2 Auctions', trend: 'Live Auctions', icon: HiOutlineCube },
              ].map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '20px 24px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>{m.title}</span>
                    <m.icon size={20} color="#8C7355" />
                  </div>
                  <div style={{ marginTop: '14px' }}>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                      {m.val}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8C7355', fontWeight: 500, marginTop: '2px' }}>
                      {m.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CONTROLS BAR: SEARCH & VIEW MODE SWITCHER (NO OUTER WHITE CARD WRAPPER) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '14px',
                  padding: '0 18px',
                  height: '46px',
                  flex: 1,
                  minWidth: '280px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                }}
              >
                <HiOutlineMagnifyingGlass size={18} color="#9CA3AF" />
                <input
                  type="text"
                  placeholder="Search order number (#TX-...), crop batch, or seller name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    color: '#111827',
                    width: '100%',
                  }}
                />
              </div>

              {/* CARD VS TABLE SWITCHER */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '46px',
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '4px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                }}
              >
                <button
                  onClick={() => setActiveViewMode('cards')}
                  style={{
                    height: '36px',
                    padding: '0 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: activeViewMode === 'cards' ? '#111827' : 'transparent',
                    color: activeViewMode === 'cards' ? '#FFFFFF' : '#4B5563',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Card View
                </button>
                <button
                  onClick={() => setActiveViewMode('table')}
                  style={{
                    height: '36px',
                    padding: '0 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: activeViewMode === 'table' ? '#111827' : 'transparent',
                    color: activeViewMode === 'table' ? '#FFFFFF' : '#4B5563',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Table View
                </button>
              </div>
            </div>

            {/* ORDERS CARDS OR TABLE */}
            {activeViewMode === 'cards' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                {filteredOrders.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '24px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.04)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '560px',
                    }}
                  >
                    {/* CROP PHOTO (240px HEIGHT, HD QUALITY) */}
                    <div style={{ height: '240px', width: '100%', background: '#111827' }}>
                      <img src={item.image} alt={item.cropName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* CARD DETAILS BODY (GENEROUS 24px PADDING & 18px GAPS) */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', flex: 1, justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '6px 14px',
                            borderRadius: '10px',
                            background: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            color: '#111827',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                          }}
                        >
                          {item.status}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B7280' }}>
                          {item.orderNumber}
                        </span>
                      </div>

                      {/* CROP NAME & SELLER DETAILS */}
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0', lineHeight: 1.35, letterSpacing: '-0.01em' }}>
                          {item.cropName}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
                          Seller: <strong style={{ color: '#111827', fontWeight: 600 }}>{item.sellerName}</strong> ({item.sellerLocation})
                        </p>
                      </div>

                      {/* DEAL METRICS */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', padding: '16px 0' }}>
                        <div>
                          <span style={{ fontSize: '22px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', display: 'block' }}>{item.totalPrice}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginTop: '2px', display: 'block' }}>{item.quantity}</span>
                        </div>
                      </div>

                      {/* TRACKING STEPPER */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px', color: '#4B5563', marginBottom: '8px', fontWeight: 600 }}>
                          <span style={{ fontWeight: 700, color: '#111827' }}>Step {item.trackingStep} of 4</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', height: '8px' }}>
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              style={{
                                flex: 1,
                                height: '100%',
                                borderRadius: '4px',
                                background: step <= item.trackingStep ? '#111827' : '#E5E7EB',
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(item)}
                        style={{
                          width: '100%',
                          height: '46px',
                          borderRadius: '14px',
                          background: '#111827',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          marginTop: '4px',
                          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                          transition: 'transform 0.2s ease',
                        }}
                      >
                        View Order Details
                      </button>
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
                  padding: '24px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  overflowX: 'auto',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280', textAlign: 'left' }}>
                      <th style={{ padding: '12px 16px 12px 0', fontWeight: 600 }}>ORDER ID</th>
                      <th style={{ padding: '12px 16px 12px 0', fontWeight: 600 }}>CROP BATCH</th>
                      <th style={{ padding: '12px 16px 12px 0', fontWeight: 600 }}>SELLER</th>
                      <th style={{ padding: '12px 16px 12px 0', fontWeight: 600 }}>AMOUNT</th>
                      <th style={{ padding: '12px 16px 12px 0', fontWeight: 600 }}>STATUS</th>
                      <th style={{ padding: '12px 0', fontWeight: 600, textAlign: 'right' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((row) => (
                      <tr key={row.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '16px 16px 16px 0', fontWeight: 700, color: '#111827' }}>{row.orderNumber}</td>
                        <td style={{ padding: '16px 16px 16px 0', color: '#111827', fontWeight: 600 }}>{row.cropName}</td>
                        <td style={{ padding: '16px 16px 16px 0', color: '#4B5563' }}>{row.sellerName}</td>
                        <td style={{ padding: '16px 16px 16px 0', fontWeight: 800, color: '#111827' }}>{row.totalPrice}</td>
                        <td style={{ padding: '16px 16px 16px 0' }}>
                          <span
                            style={{
                              padding: '4px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 600,
                              background: '#FFFFFF',
                              border: '1px solid #E5E7EB',
                              color: '#111827',
                            }}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 0', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedOrder(row)}
                            style={{
                              background: '#111827',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '8px 16px',
                              fontSize: '13px',
                              fontWeight: 600,
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
          </div>
        )}
      </section>

      {/* ENHANCED BUYER ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '640px',
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* CROP PHOTO HEADER */}
            <div style={{ height: '180px', width: '100%', position: 'relative', background: '#111827' }}>
              <img src={selectedOrder.image} alt={selectedOrder.cropName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <HiOutlineXMark size={20} color="#111827" />
              </button>
            </div>

            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', paddingBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>{selectedOrder.orderNumber}</span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: '2px 0 0 0' }}>
                    {selectedOrder.cropName}
                  </h3>
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    color: '#111827',
                  }}
                >
                  {selectedOrder.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#6B7280', display: 'block' }}>Seller Merchant</span>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>{selectedOrder.sellerName}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>{selectedOrder.sellerLocation}</div>
                </div>

                <div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginTop: '2px' }}>{selectedOrder.totalPrice}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{selectedOrder.quantity}</div>
                </div>
              </div>

              {/* TRACKING STEPPER */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px', color: '#6B7280', marginBottom: '8px', fontWeight: 600 }}>
                  <span style={{ fontWeight: 700, color: '#111827' }}>Step {selectedOrder.trackingStep} of 4</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', height: '8px' }}>
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      style={{
                        flex: 1,
                        height: '100%',
                        borderRadius: '4px',
                        background: step <= selectedOrder.trackingStep ? '#111827' : '#E5E7EB',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* ESCROW PROTECTION BOX (NO GRAY HIGHLIGHT BACKGROUND) */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '18px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                  Smart Contract Escrow Protected
                </div>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                  Payment funds are held securely in the onchain escrow contract and will only release to the seller upon delivery verification.
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: '#111827',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: '14px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                }}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
