'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import ReownWalletModal from '@/components/ReownWalletModal';

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<'merchant' | 'buyer' | null>(null);

  let appkit: any = null;
  try {
    appkit = useAppKit();
  } catch (e) {
    appkit = null;
  }

  useEffect(() => {
    if (!isConnected || !address) {
      setUserRole(null);
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
      .catch(() => { });
  }, [address, isConnected]);

  const handleConnectClick = () => {
    try {
      if (appkit && typeof appkit.open === 'function') {
        appkit.open().catch(() => {
          setIsWalletModalOpen(true);
        });
      } else {
        setIsWalletModalOpen(true);
      }
    } catch (err) {
      setIsWalletModalOpen(true);
    }
  };

  return (
    <>
      <nav
        className="navbar-container"
        style={{
          width: '100%',
          maxWidth: '720px',
          height: '56px',
          padding: '6px 12px',
          borderRadius: '16px',
          background: 'rgba(230, 232, 221, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          margin: '0 auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          boxSizing: 'border-box',
        }}
      >
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/a8346415ebb79aeba8a2105f48691cc2d71161da?width=256"
            alt="Evermind Logo"
            className="navbar-logo"
            style={{ width: '124px', height: '26px', objectFit: 'contain' }}
          />
        </Link>

        {/* Dynamic Navigation Links based on Role */}
        <div
          className="nav-links-wrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Link
            href="/"
            className="nav-link nav-link-item"
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              fontWeight: pathname === '/' ? 600 : 400,
              color: '#1A1A17',
              textDecoration: 'none',
              transition: 'background-color 0.2s',
            }}
          >
            Home
          </Link>

          <Link
            href="/marketplace"
            className="nav-link nav-link-item"
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              fontWeight: pathname === '/marketplace' ? 600 : 400,
              color: '#1A1A17',
              textDecoration: 'none',
              transition: 'background-color 0.2s',
            }}
          >
            Marketplace
          </Link>

          {/* Show Dashboard ONLY for Merchants / Farmers */}
          {(!userRole || userRole === 'merchant') && (
            <Link
              href="/dashboard"
              className="nav-link nav-link-item"
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                fontFamily: 'var(--font-inter)',
                fontSize: '14px',
                fontWeight: pathname === '/dashboard' ? 600 : 400,
                color: '#1A1A17',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
            >
              Dashboard
            </Link>
          )}

          {/* Show Profile ONLY for Buyers / Customers */}
          {userRole === 'buyer' && (
            <Link
              href="/profile"
              className="nav-link nav-link-item"
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                fontFamily: 'var(--font-inter)',
                fontSize: '14px',
                fontWeight: pathname === '/profile' ? 600 : 400,
                color: '#1A1A17',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
            >
              Profile & Bids
            </Link>
          )}
        </div>

        {/* Action Button: Connect / Address Badge */}
        <button
          onClick={handleConnectClick}
          className="connect-btn"
          style={{
            padding: '8px 18px',
            borderRadius: '12px',
            background: '#1A1A17',
            color: '#F4F3EA',
            fontFamily: 'var(--font-inter)',
            fontSize: '13px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxShadow: '0 -1px 0 0 rgba(26, 26, 23, 0.08) inset, 0 1px 0 0 rgba(26, 26, 23, 0.04) inset',
            transition: 'transform 0.2s, background-color 0.2s',
          }}
        >
          {isConnected && address
            ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
            : 'Connect'}
        </button>

        <style jsx>{`
          .nav-link:hover {
            background-color: rgba(26, 26, 23, 0.08);
          }
          .connect-btn:hover {
            transform: scale(1.02);
            background-color: #000000;
          }

          @media (max-width: 768px) {
            .navbar-container {
              width: calc(100% - 24px) !important;
              min-width: 0 !important;
              padding: 6px 10px !important;
              height: 52px !important;
              gap: 8px !important;
            }
            .navbar-logo {
              width: 90px !important;
              height: 22px !important;
            }
            .nav-links-wrapper {
              gap: 2px !important;
            }
            .nav-link-item {
              padding: 4px 8px !important;
              font-size: 12px !important;
            }
            .connect-btn {
              padding: 6px 12px !important;
              font-size: 11px !important;
            }
          }
        `}</style>
      </nav>

      {/* Reown AppKit Web3 Modal Fallback */}
      <ReownWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
}

export default Navbar;
