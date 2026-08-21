'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineFire,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineBuildingStorefront,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineChevronRight,
} from 'react-icons/hi2';

interface SidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  isCollapsed?: boolean;
}

// Custom Premium AI Sparkle Icon
const AiSparkleIcon = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z"
      fill={color}
    />
    <path
      d="M19 2C19 4.209 17.209 6 15 6C17.209 6 19 7.791 19 10C19 7.791 20.791 6 23 6C20.791 6 19 4.209 19 2Z"
      fill={color}
      opacity="0.75"
    />
  </svg>
);

export default function Sidebar({
  activeTab = 'Overview',
  onSelectTab,
  isCollapsed = false,
}: SidebarProps) {
  const [selected, setSelected] = useState(activeTab);

  const handleSelect = (item: string) => {
    setSelected(item);
    if (onSelectTab) onSelectTab(item);
  };

  const navGroups = [
    {
      group: 'Main',
      items: [
        { name: 'Overview', icon: HiOutlineHome, hasChevron: false, href: '/dashboard' },
        { name: 'AI Assistant', isCustomAi: true, hasChevron: false, href: '#' },
      ],
    },
    {
      group: 'Catalogue',
      items: [
        { name: 'Harvest', icon: HiOutlineCube, hasChevron: true, href: '#' },
        { name: 'Auctions', icon: HiOutlineFire, hasChevron: true, href: '#' },
      ],
    },
    {
      group: 'Sales',
      items: [
        { name: 'Orders', icon: HiOutlineShoppingCart, hasChevron: false, href: '#' },
        { name: 'Users', icon: HiOutlineUsers, hasChevron: true, href: '#' },
      ],
    },
    {
      group: 'Storefront',
      items: [
        { name: 'Home Page', icon: HiOutlineBuildingStorefront, hasChevron: true, href: '/' },
      ],
    },
  ];

  return (
    <aside
      className="dashboard-sidebar"
      style={{
        width: isCollapsed ? '76px' : '240px',
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: isCollapsed ? '24px 10px' : '24px 16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'fit-content',
        minHeight: '740px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', 'Readex Pro', 'Outfit', sans-serif",
      }}
    >
      <div className="sidebar-items-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {navGroups.map((g) => (
          <div key={g.group} className="sidebar-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {!isCollapsed && (
              <span
                className="group-label"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#9CA3AF',
                  letterSpacing: '0.2px',
                  paddingLeft: '12px',
                  whiteSpace: 'nowrap',
                }}
              >
                {g.group}
              </span>
            )}

            <div className="group-items-row" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {g.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = selected === item.name;
                const iconColor = isActive ? '#111827' : '#6B7280';

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={isCollapsed ? item.name : undefined}
                    onClick={(e) => {
                      if (item.href === '#' || onSelectTab) {
                        e.preventDefault();
                      }
                      handleSelect(item.name);
                    }}
                    className={`sidebar-link ${isActive ? 'active-link' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isCollapsed ? 'center' : 'space-between',
                      padding: isCollapsed ? '12px 0' : '10px 14px',
                      borderRadius: '16px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#111827' : '#4B5563',
                      background: isActive ? '#E6E8DD' : 'transparent',
                      border: 'none',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.isCustomAi ? (
                        <AiSparkleIcon color={iconColor} />
                      ) : IconComponent ? (
                        <IconComponent size={20} color={iconColor} />
                      ) : null}
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>

                    {!isCollapsed && item.hasChevron && (
                      <HiOutlineChevronRight size={16} color="#9CA3AF" className="chevron-icon" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ADMINISTRATION & LOGOUT */}
      <div className="admin-logout-section" style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px', marginTop: '16px' }}>
        {!isCollapsed && (
          <span
            className="group-label"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#9CA3AF',
              letterSpacing: '0.2px',
              paddingLeft: '12px',
              display: 'block',
              marginBottom: '8px',
              whiteSpace: 'nowrap',
            }}
          >
            Administration
          </span>
        )}

        <Link
          href="/"
          title={isCollapsed ? 'Logout' : undefined}
          className="sidebar-link"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '12px',
            padding: isCollapsed ? '12px 0' : '10px 14px',
            borderRadius: '16px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            color: '#4B5563',
            transition: 'all 0.2s ease',
          }}
        >
          <HiOutlineArrowLeftOnRectangle size={20} color="#6B7280" />
          {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Logout</span>}
        </Link>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .dashboard-sidebar {
            width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            padding: 12px !important;
            flex-direction: row !important;
            align-items: center !important;
            overflow-x: auto !important;
            white-space: nowrap !important;
            border-radius: 18px !important;
          }
          .sidebar-items-container {
            flex-direction: row !important;
            gap: 12px !important;
            align-items: center !important;
            width: 100% !important;
            overflow-x: auto !important;
          }
          .sidebar-group {
            flex-direction: row !important;
            gap: 6px !important;
          }
          .group-items-row {
            flex-direction: row !important;
            gap: 6px !important;
          }
          .group-label {
            display: none !important;
          }
          .chevron-icon {
            display: none !important;
          }
          .admin-logout-section {
            display: none !important;
          }
          .sidebar-link {
            padding: 8px 14px !important;
            font-size: 13px !important;
          }
        }
      `}</style>
    </aside>
  );
}
