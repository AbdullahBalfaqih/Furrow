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

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export default function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const router = useRouter();

  const handleDisconnect = () => {
    // Navigate back to Home page on Disconnect
    router.push('/');
  };

  return (
    <header
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

        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/a8346415ebb79aeba8a2105f48691cc2d71161da?width=256"
            alt="Evermind Logo"
            style={{ height: '24px', objectFit: 'contain' }}
          />
        </Link>
      </div>

      {/* RIGHT CONTROLS & DISCONNECT BUTTON (ALL SQUARE ROUNDED RECTANGLES - 10px BORDER RADIUS) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* UNIFIED QUICK ACTIONS & DISCONNECT CONTAINER (SINGLE SOLID BLACK PILL) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '40px',
            background: '#111827',
            border: 'none',
            borderRadius: '12px',
            padding: '0 6px',
            boxSizing: 'border-box',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            gap: '2px',
          }}
        >
          {/* Dark mode button */}
          <button
            title="Toggle Theme"
            style={{
              width: '34px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <HiOutlineMoon size={16} color="#FFFFFF" />
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.15)' }} />

          {/* Notification bell button */}
          <button
            title="Notifications"
            style={{
              width: '34px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <HiOutlineBell size={16} color="#FFFFFF" />
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.15)' }} />

          {/* Disconnect button merged inside container */}
          <button
            onClick={handleDisconnect}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '32px',
              padding: '0 14px 0 10px',
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
            <HiOutlinePower size={17} color="#E6E8DD" style={{ marginLeft: '-4px', marginRight: '2px' }} />
            <span>Disconnect</span>
          </button>
        </div>
      </div>
    </header>
  );
}
