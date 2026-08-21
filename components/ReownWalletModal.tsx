'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineXMark,
  HiOutlineChevronRight,
  HiOutlineMagnifyingGlass,
  HiOutlineEnvelope,
  HiOutlineCheck,
} from 'react-icons/hi2';

interface ReownWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSuccess?: (address: string) => void;
}

export default function ReownWalletModal({
  isOpen,
  onClose,
  onConnectSuccess,
}: ReownWalletModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleWalletSelect = async (walletName: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      const mockAddress = '0x0388865e1daf2427De6111cf8548ed1871656180';
      setConnectedWallet(mockAddress);
      setIsConnecting(false);
      if (onConnectSuccess) {
        onConnectSuccess(mockAddress);
      }
      setTimeout(() => {
        onClose();
        router.push('/dashboard');
      }, 600);
    }, 800);
  };

  const wallets = [
    {
      name: 'WalletConnect',
      badge: 'QR CODE',
      badgeBg: 'rgba(238, 128, 56, 0.15)',
      badgeColor: '#EE8038',
      icon: (
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#3B99FC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: '12px' }}>
          W
        </div>
      ),
    },
    {
      name: 'MetaMask',
      badge: 'INSTALLED',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeColor: '#10B981',
      icon: (
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#E4761B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: '12px' }}>
          🦊
        </div>
      ),
    },
    {
      name: 'Bitget Wallet',
      badge: 'INSTALLED',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeColor: '#10B981',
      icon: (
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#00F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 700, fontSize: '12px' }}>
          B
        </div>
      ),
    },
    {
      name: 'Phantom',
      badge: 'INSTALLED',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeColor: '#10B981',
      icon: (
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#AB9FF2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: '12px' }}>
          👻
        </div>
      ),
    },
    {
      name: 'Coinbase',
      badge: null,
      icon: (
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#0052FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: '12px' }}>
          C
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '380px',
          background: '#18181A',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          color: '#FFFFFF',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeInModal 0.2s ease-out',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px 14px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <button
            onClick={() => window.open('https://reown.com', '_blank')}
            style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}
          >
            <HiOutlineQuestionMarkCircle size={20} />
          </button>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#FFFFFF' }}>Connect Wallet</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}
          >
            <HiOutlineXMark size={20} />
          </button>
        </div>

        {/* BODY CONTENT */}
        <div style={{ padding: '12px 16px 20px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {connectedWallet ? (
            <div style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                <HiOutlineCheck size={28} />
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>Wallet Connected</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>
                {connectedWallet.substring(0, 6)}...{connectedWallet.substring(connectedWallet.length - 4)}
              </div>
            </div>
          ) : (
            <>
              {/* WALLET LIST */}
              {wallets.map((w, idx) => (
                <div
                  key={idx}
                  onClick={() => handleWalletSelect(w.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  className="reown-wallet-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {w.icon}
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#F9FAFB' }}>{w.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {w.badge && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: w.badgeBg,
                          color: w.badgeColor,
                          letterSpacing: '0.3px',
                        }}
                      >
                        {w.badge}
                      </span>
                    )}
                    <HiOutlineChevronRight size={16} color="#6B7280" />
                  </div>
                </div>
              ))}

              {/* SEARCH WALLETS ROW */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  marginTop: '2px',
                }}
                className="reown-wallet-item"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HiOutlineMagnifyingGlass size={16} color="#9CA3AF" />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#F9FAFB' }}>Search Wallet</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>80+</span>
                  <HiOutlineChevronRight size={16} color="#6B7280" />
                </div>
              </div>

              {/* DIVIDER */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
              </div>

              {/* EMAIL INPUT */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '12px', color: '#6B7280' }}>
                  <HiOutlineEnvelope size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 14px 0 42px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* FOOTER UX BRANDING */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>UX by</span>
                <span style={{ fontSize: '10px', fontWeight: 600, background: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: '4px', color: '#9CA3AF' }}>
                  reown
                </span>
                <span style={{ fontSize: '10px', fontWeight: 600, background: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: '4px', color: '#9CA3AF' }}>
                  AppKit
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .reown-wallet-item:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          transform: translateY(-1px);
        }
        @keyframes fadeInModal {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
