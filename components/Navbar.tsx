'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount, useDisconnect } from 'wagmi';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import ReownWalletModal from '@/components/ReownWalletModal';

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

export function Navbar() {
  const pathname = usePathname();
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const { address: appKitAddress, isConnected: isAppKitConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  const [injectedAddress, setInjectedAddress] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('furrow_connected_address') || getCookie('furrow_session');
    }
    return null;
  });

  // Properly detect MetaMask / injected wallet connection using eth_accounts (async)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Restore from session first
    const saved = localStorage.getItem('furrow_connected_address') || getCookie('furrow_session');
    if (saved) setInjectedAddress(saved);

    const win = window as any;
    const eth = win.phantom?.ethereum || win.ethereum;
    if (!eth) return;

    // eth_accounts returns already-connected accounts without prompting the user
    const checkAccounts = async () => {
      try {
        const accounts: string[] = await eth.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          setInjectedAddress(accounts[0]);
          setSession(accounts[0]);
        }
      } catch (e) {
        // Fallback to selectedAddress if request fails
        if (eth.selectedAddress) {
          setInjectedAddress(eth.selectedAddress);
          setSession(eth.selectedAddress);
        }
      }
    };

    checkAccounts();

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts && accounts[0]) {
        setInjectedAddress(accounts[0]);
        setSession(accounts[0]);
      } else {
        setInjectedAddress(null);
        setSession(null);
      }
    };

    // Listen for connect event
    const handleConnect = (info: any) => {
      checkAccounts();
    };

    if (typeof eth.on === 'function') {
      eth.on('accountsChanged', handleAccountsChanged);
      eth.on('connect', handleConnect);
    }

    return () => {
      if (typeof eth.removeListener === 'function') {
        eth.removeListener('accountsChanged', handleAccountsChanged);
        eth.removeListener('connect', handleConnect);
      }
    };
  }, []);

  const address = appKitAddress || wagmiAddress || injectedAddress;
  const isConnected = Boolean(isAppKitConnected || isWagmiConnected || injectedAddress);

  useEffect(() => {
    if (address) {
      setSession(address);
    }
  }, [address]);

  const [mounted, setMounted] = useState(true);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<'merchant' | 'buyer' | null>(() => {
    if (typeof window !== 'undefined') {
      const addr = localStorage.getItem('furrow_connected_address') || getCookie('furrow_session');
      if (addr) {
        const role = localStorage.getItem(`furrow_role_${addr.toLowerCase()}`);
        return (role as any) || null;
      }
    }
    return null;
  });

  let appkit: any = null;
  try {
    appkit = useAppKit();
  } catch (e) {
    appkit = null;
  }

  useEffect(() => {
    if (!isConnected || !address) return;

    const savedRole = localStorage.getItem(`furrow_role_${address.toLowerCase()}`);
    if (savedRole) setUserRole(savedRole as any);

    try {
      fetch(`/api/users/profile?address=${address}`)
        .then((res) => {
          if (!res.ok) return null;
          return res.json();
        })
        .then((data) => {
          if (data && data.success && data.profile && data.profile.role) {
            setUserRole(data.profile.role);
          }
        })
        .catch(() => {});
    } catch (e) {}
  }, [address, isConnected]);

  const handleConnectClick = async () => {
    // 1. IF ALREADY CONNECTED -> DISCONNECT WALLET IMMEDIATELY!
    if (isConnected) {
      try {
        disconnect();
      } catch (e) {}

      setInjectedAddress(null);
      setSession(null);
      setUserRole(null);
      return;
    }

    // 2. IF NOT CONNECTED -> OPEN FULL MULTI-WALLET MODAL (SHOWING ALL WALLETS)
    try {
      if (appkit && typeof appkit.open === 'function') {
        await appkit.open({ view: 'Connect' });
        return;
      }
    } catch (err) {
      console.warn('Reown open fallback:', err);
    }

    // Custom fallback modal showing all wallets (MetaMask, Phantom, Bitget, Coinbase, WalletConnect)
    setIsWalletModalOpen(true);
  };

  return (
    <>
      <nav
        className="navbar-container"
        style={{
          width: 'fit-content',
          minWidth: '580px',
          maxWidth: '920px',
          height: '56px',
          padding: '6px 8px 6px 22px',
          borderRadius: '9999px',
          background: 'rgba(230, 232, 221, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          margin: '0 auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <img
            src="/logo.png"
            alt="Furrow Logo"
            className="navbar-logo"
            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
          />
          <span
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#1A1A17',
              letterSpacing: '-0.5px',
              fontFamily: 'var(--font-inter), -apple-system, sans-serif',
            }}
          >
            Furrow
          </span>
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

          {/* Show Dashboard ONLY when Wallet is Connected and role is Merchant / Farmer */}
          {mounted && isConnected && userRole !== 'buyer' && (
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

          {/* Show Profile ONLY when Wallet is Connected as Buyer / Customer */}
          {mounted && isConnected && userRole === 'buyer' && (
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
            borderRadius: '9999px',
            background: '#1A1A17',
            color: '#F4F3EA',
            fontFamily: 'var(--font-inter)',
            fontSize: '13px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            marginRight: '2px',
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
