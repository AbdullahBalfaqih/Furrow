'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import OverviewView from '@/components/OverviewView';
import AiAssistantView from '@/components/AiAssistantView';
import HarvestView from '@/components/HarvestView';
import CreateCropView from '@/components/CreateCropView';
import AuctionsView from '@/components/AuctionsView';
import OrdersView from '@/components/OrdersView';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setSession(address: string | null) {
  if (typeof window === 'undefined') return;
  if (address) {
    localStorage.setItem('furrow_connected_address', address.toLowerCase());
    document.cookie = `furrow_session=${address.toLowerCase()}; path=/; max-age=2592000; SameSite=Lax`;
  } else {
    localStorage.removeItem('furrow_connected_address');
    document.cookie = 'furrow_session=; path=/; max-age=0; SameSite=Lax';
  }
}

export default function DashboardPage() {
  const { address: wagmiAddress, isConnected: isWagmiConnected, status } = useAccount();
  const { address: appKitAddress, isConnected: isAppKitConnected } = useAppKitAccount();
  
  const [injectedAddress, setInjectedAddress] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('furrow_connected_address') || getCookie('furrow_session');
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('furrow_connected_address') || getCookie('furrow_session');
      if (saved) {
        setInjectedAddress(saved);
      }

      const win = window as any;
      const eth = win.phantom?.ethereum || win.ethereum;
      if (eth) {
        if (eth.selectedAddress) {
          setInjectedAddress(eth.selectedAddress);
          setSession(eth.selectedAddress);
        }
        if (typeof eth.on === 'function') {
          eth.on('accountsChanged', (accounts: string[]) => {
            if (accounts && accounts[0]) {
              setInjectedAddress(accounts[0]);
              setSession(accounts[0]);
            } else {
              setInjectedAddress(null);
              setSession(null);
            }
          });
        }
      }
    }
  }, []);

  const address = appKitAddress || wagmiAddress || injectedAddress;
  const isConnected = Boolean(isAppKitConnected || isWagmiConnected || injectedAddress);

  useEffect(() => {
    if (address) {
      setSession(address);
    }
  }, [address]);

  const { open } = useAppKit();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'merchant' | 'buyer' | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Safety timeout: Never hang in loading state for more than 1.2s
    const safetyTimer = setTimeout(() => {
      setCheckingRole(false);
    }, 1200);

    if (!isConnected || !address) {
      setCheckingRole(false);
      clearTimeout(safetyTimer);
      return;
    }

    fetch(`/api/users/profile?address=${address}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.profile && data.profile.role) {
          setUserRole(data.profile.role);
        } else {
          const savedRole = localStorage.getItem(`furrow_role_${address.toLowerCase()}`);
          if (savedRole) setUserRole(savedRole as any);
        }
      })
      .catch(() => {
        const savedRole = localStorage.getItem(`furrow_role_${address.toLowerCase()}`);
        if (savedRole) setUserRole(savedRole as any);
      })
      .finally(() => {
        clearTimeout(safetyTimer);
        setCheckingRole(false);
      });

    return () => clearTimeout(safetyTimer);
  }, [address, isConnected, mounted]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 1. Brief Loading state during initial client hydration
  if (!mounted || (checkingRole && isConnected && !userRole)) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#F5F7F8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          gap: '16px',
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid #E5E7EB',
            borderTopColor: '#111827',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>Connecting Web3 Session...</span>
      </div>
    );
  }

  // 2. If user is NOT connected -> Block access to Seller Dashboard
  if (!isConnected || !address) {
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
            maxWidth: '480px',
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
              background: '#E6E8DD',
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '24px',
            }}
          >
            🔌
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 10px 0' }}>
            Wallet Required
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 28px 0', lineHeight: 1.6 }}>
            Please connect your Web3 Wallet to access the Farmer Command Center & Marketplace Dashboard.
          </p>
          <button
            onClick={() => {
              try {
                if (open) open();
              } catch (e) {}
            }}
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
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

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
              overflow-x: hidden !important;
            }
            .dashboard-page-title {
              font-size: 22px !important;
            }
            .dashboard-action-btn {
              width: 100% !important;
              justify-content: center !important;
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
                <h1 className="dashboard-page-title" style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
                  {activeTab === 'Overview' && 'Farmer Command Center'}
                  {(activeTab === 'AiAssistant' || activeTab === 'AI Assistant') && '0G AI Crop Quality Inspector'}
                  {activeTab === 'Harvest' && 'Crop Lots Inventory'}
                  {activeTab === 'CreateCrop' && 'Register New Crop Lot'}
                  {activeTab === 'Auctions' && 'Live Marketplace Auctions'}
                  {activeTab === 'Orders' && 'Orders & Dispatch Management'}
                </h1>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0 0' }}>
                  {activeTab === 'Overview' && 'Real-time overview of certified crops, AI quality assessments, and active auctions.'}
                  {(activeTab === 'AiAssistant' || activeTab === 'AI Assistant') && 'Upload crop images to run 0G AI Computer Vision quality classification.'}
                  {activeTab === 'Harvest' && 'Manage your agricultural crop inventory and 0G Storage hashes.'}
                  {activeTab === 'CreateCrop' && 'Upload photos to 0G Storage & mint onchain Crop Certificate.'}
                  {activeTab === 'Auctions' && 'List verified crops for bidding with automated smart contract settlement.'}
                  {activeTab === 'Orders' && 'Track incoming buyer orders, escrow status, and delivery logistics.'}
                </p>
              </div>

              {activeTab !== 'CreateCrop' && (
                <button
                  className="dashboard-action-btn"
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
            {(activeTab === 'AiAssistant' || activeTab === 'AI Assistant') && <AiAssistantView />}
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
