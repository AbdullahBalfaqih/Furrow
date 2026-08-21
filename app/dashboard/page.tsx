'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import OverviewView from '@/components/OverviewView';
import AiAssistantView from '@/components/AiAssistantView';
import HarvestView from '@/components/HarvestView';
import CreateCropView from '@/components/CreateCropView';
import AuctionsView from '@/components/AuctionsView';
import OrdersView from '@/components/OrdersView';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();

  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'merchant' | 'buyer' | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (!isConnected || !address) {
      setCheckingRole(false);
      return;
    }

    fetch(`/api/users/profile?address=${address}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile && data.profile.role) {
          setUserRole(data.profile.role);
        } else {
          const savedRole = localStorage.getItem(`furrow_role_${address.toLowerCase()}`);
          if (savedRole) setUserRole(savedRole as any);
        }
      })
      .catch(() => {})
      .finally(() => setCheckingRole(false));
  }, [address, isConnected]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // If user is connected as BUYER -> Block access to Seller Dashboard
  if (!checkingRole && isConnected && userRole === 'buyer') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#F5F7F8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '24px',
            padding: '48px 36px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '24px',
            }}
          >
            🔒
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 10px 0' }}>
            Access Restricted to Merchants
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 28px 0', lineHeight: 1.6 }}>
            Your account is registered as <strong>Customer / Buyer</strong>. The Seller Dashboard is reserved exclusively for verified Merchants & Farmers.
          </p>
          <Link
            href="/profile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#111827',
              color: '#FFFFFF',
              padding: '12px 28px',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            Go to Buyer Profile & Bids
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#F5F7F8',
        color: '#111827',
        fontFamily: "'Plus Jakarta Sans', 'Readex Pro', 'Outfit', sans-serif",
        position: 'relative',
      }}
    >
      {/* ANIQ DASHBOARD MAIN WRAPPER */}
      <main
        className="dashboard-main-container"
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '30px 24px 80px 24px',
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
        }}
      >
        <style jsx>{`
          @media (max-width: 768px) {
            .dashboard-main-container {
              flex-direction: column !important;
              padding: 16px 12px 60px 12px !important;
              gap: 16px !important;
            }
          }
        `}</style>
        {/* LEFT SIDEBAR */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} isCollapsed={isSidebarCollapsed} />

        {/* RIGHT MAIN CONTENT AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          {/* TOP DASHBOARD HEADER BAR */}
          <DashboardHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

          {/* BREADCRUMB & PAGE HEADER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#B3B4B5' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#B3B4B5" strokeWidth="1.33">
                <path d="M3.33 8H2L8 2L14 8H12.67" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.33 8V12.67C3.33 13.4 3.97 14 4.67 14H11.33C12.03 14 12.67 13.4 12.67 12.67V8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>/</span>
              <span>Pages</span>
              <span>/</span>
              <span style={{ color: '#111827', fontWeight: 500 }}>{activeTab}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
                  {activeTab === 'Overview' && 'Farmer Command Center'}
                  {activeTab === 'AiAssistant' && '0G AI Crop Quality Inspector'}
                  {activeTab === 'Harvest' && 'Crop Lots Inventory'}
                  {activeTab === 'CreateCrop' && 'Register New Crop Lot'}
                  {activeTab === 'Auctions' && 'Live Marketplace Auctions'}
                  {activeTab === 'Orders' && 'Orders & Dispatch Management'}
                </h1>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0 0' }}>
                  {activeTab === 'Overview' && 'Real-time overview of certified crops, AI quality assessments, and active auctions.'}
                  {activeTab === 'AiAssistant' && 'Upload crop images to run 0G AI Computer Vision quality classification.'}
                  {activeTab === 'Harvest' && 'Manage your agricultural crop inventory and 0G Storage hashes.'}
                  {activeTab === 'CreateCrop' && 'Upload photos to 0G Storage & mint onchain Crop Certificate.'}
                  {activeTab === 'Auctions' && 'List verified crops for bidding with automated smart contract settlement.'}
                  {activeTab === 'Orders' && 'Track incoming buyer orders, escrow status, and delivery logistics.'}
                </p>
              </div>

              {activeTab !== 'CreateCrop' && (
                <button
                  onClick={() => setActiveTab('CreateCrop')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#111827',
                    color: '#F4F3EA',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(17, 24, 39, 0.15)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>Register New Crop</span>
                </button>
              )}
            </div>
          </div>

          {/* DYNAMIC TAB VIEW CONTENT RENDERER */}
          <div style={{ width: '100%' }}>
            {activeTab === 'Overview' && <OverviewView showToast={showToast} />}
            {activeTab === 'AiAssistant' && <AiAssistantView />}
            {activeTab === 'Harvest' && <HarvestView />}
            {activeTab === 'CreateCrop' && <CreateCropView showToast={showToast} />}
            {activeTab === 'Auctions' && <AuctionsView showToast={showToast} />}
            {activeTab === 'Orders' && <OrdersView showToast={showToast} />}
          </div>
        </div>
      </main>

      {/* TOAST NOTIFICATION BADGE */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#111827',
            color: '#FFFFFF',
            padding: '14px 22px',
            borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
