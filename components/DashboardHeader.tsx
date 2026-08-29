'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HiOutlineBars3,
  HiOutlineMagnifyingGlass,
  HiOutlineMoon,
  HiOutlineBell,
  HiOutlinePower,
} from 'react-icons/hi2';

import { useDisconnect } from 'wagmi';

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export default function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const router = useRouter();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    try {
      disconnect();
    } catch (e) {}
    router.push('/');
  };

  return (
    <header
      className="dashboard-header-container"
      style={{
        width: '100%',
        height: '70px',
        borderRadius: '24px',
        background: '#E6E8DD',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        border: '1px solid #D4D7C8',
        marginBottom: '24px',
        fontFamily: 'SF Pro, -apple-system, var(--font-inter), sans-serif',
      }}
    >
      {/* LEFT BRAND & MENU TOGGLE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          title="Toggle Sidebar"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            border: 'none',
            background: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s ease',
          }}
        >
          <HiOutlineBars3 size={20} color="#FFFFFF" />
        </button>

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img
            src="/logo.png"
            alt="Furrow Logo"
            style={{ height: '28px', width: '28px', objectFit: 'contain' }}
          />
          <span
            className="header-brand-title"
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#111827',
              letterSpacing: '-0.5px',
              fontFamily: 'var(--font-inter), -apple-system, sans-serif',
            }}
          >
            Furrow
          </span>
        </Link>
      </div>

      {/* RIGHT CONTROLS & DISCONNECT BUTTON */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* UNIFIED QUICK ACTIONS & DISCONNECT CONTAINER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '38px',
            background: '#111827',
            border: 'none',
            borderRadius: '12px',
            padding: '0 4px',
            boxSizing: 'border-box',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            gap: '2px',
          }}
        >
          {/* Dark mode button */}
          <button
            title="Toggle Theme"
            style={{
              width: '32px',
              height: '30px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <HiOutlineMoon size={15} color="#FFFFFF" />
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.15)' }} />

          {/* Notification bell button */}
          <button
            title="Notifications"
            style={{
              width: '32px',
              height: '30px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <HiOutlineBell size={15} color="#FFFFFF" />
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.15)' }} />

          {/* Disconnect button merged inside container */}
          <button
            onClick={handleDisconnect}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '30px',
              padding: '0 8px',
              borderRadius: '8px',
              background: 'transparent',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <HiOutlinePower size={16} color="#E6E8DD" />
            <span className="disconnect-label">Disconnect</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .dashboard-header-container {
            padding: 0 10px !important;
            height: 56px !important;
            margin-bottom: 14px !important;
            border-radius: 16px !important;
            box-sizing: border-box !important;
          }
          .header-brand-title {
            font-size: 18px !important;
          }
          .disconnect-label {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
