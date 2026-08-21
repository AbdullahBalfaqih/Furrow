'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import {
  HiOutlineBuildingStorefront,
  HiOutlineShoppingBag,
  HiOutlineArrowRight,
} from 'react-icons/hi2';

export function RoleSelectionModal() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'merchant' | 'buyer' | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setIsOpen(false);
      return;
    }

    // Check if user has already assigned a role in Supabase / Local storage
    fetch(`/api/users/profile?address=${address}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile && data.profile.role) {
          // Role already exists
          setIsOpen(false);
        } else {
          // First-time wallet connection -> Open modal
          setIsOpen(true);
        }
      })
      .catch(() => {
        // Fallback: check localStorage
        const savedRole = localStorage.getItem(`furrow_role_${address.toLowerCase()}`);
        if (!savedRole) {
          setIsOpen(true);
        }
      });
  }, [address, isConnected]);

  if (!isOpen || !isConnected || !address) return null;

  const handleSelectRole = async (role: 'merchant' | 'buyer') => {
    setSelectedRole(role);
    setLoading(true);

    try {
      // Save role to Supabase Cloud DB via API
      const res = await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          role: role,
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem(`furrow_role_${address.toLowerCase()}`, role);
        setIsOpen(false);

        if (role === 'merchant') {
          router.push('/dashboard');
        } else {
          router.push('/profile');
        }
      }
    } catch (err) {
      console.error('Failed to save user role:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#181916',
          border: '1px solid #2D2F2A',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          color: '#E6E8DD',
        }}
      >
        {/* Glow Effects - Beige Tone */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '180px',
            height: '180px',
            background: 'rgba(230, 232, 221, 0.15)',
            borderRadius: '50%',
            filter: 'blur(45px)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Official Evermind Brand Logo Header */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
            }}
          >
            <div
              style={{
                padding: '10px 22px',
                borderRadius: '20px',
                background: 'rgba(230, 232, 221, 0.96)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/a8346415ebb79aeba8a2105f48691cc2d71161da?width=256"
                alt="Evermind Logo"
                style={{ width: '140px', height: '32px', objectFit: 'contain' }}
              />
            </div>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#E6E8DD', margin: '0 0 8px 0' }}>
            Welcome to Furrow Chain
          </h2>

          <p style={{ fontSize: '13px', color: '#9E9E94', margin: '0 0 24px 0', lineHeight: 1.6 }}>
            Wallet connected ({address.substring(0, 6)}...{address.substring(address.length - 4)}).
            <br />
            Please select your account role to customize your platform experience:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {/* Merchant / Farmer Option */}
            <button
              onClick={() => handleSelectRole('merchant')}
              disabled={loading}
              style={{
                padding: '20px',
                borderRadius: '16px',
                border: selectedRole === 'merchant' ? '1px solid #E6E8DD' : '1px solid #2D2F2A',
                background: selectedRole === 'merchant' ? 'rgba(230, 232, 221, 0.08)' : '#1E201B',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(230, 232, 221, 0.12)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    color: '#E6E8DD',
                    border: '1px solid rgba(230, 232, 221, 0.2)',
                  }}
                >
                  <HiOutlineBuildingStorefront style={{ width: '20px', height: '20px' }} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#E6E8DD', margin: '0 0 4px 0' }}>
                  Merchant / Farmer
                </h3>
                <p style={{ fontSize: '12px', color: '#88887F', margin: 0, lineHeight: 1.5 }}>
                  Register crops, run AI quality vision, and manage live auctions.
                </p>
              </div>
              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#E6E8DD',
                  gap: '4px',
                }}
              >
                <span>Access Dashboard</span>
                <HiOutlineArrowRight style={{ width: '14px', height: '14px' }} />
              </div>
            </button>

            {/* Buyer / Customer Option */}
            <button
              onClick={() => handleSelectRole('buyer')}
              disabled={loading}
              style={{
                padding: '20px',
                borderRadius: '16px',
                border: selectedRole === 'buyer' ? '1px solid #E6E8DD' : '1px solid #2D2F2A',
                background: selectedRole === 'buyer' ? 'rgba(230, 232, 221, 0.08)' : '#1E201B',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(230, 232, 221, 0.12)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    color: '#E6E8DD',
                    border: '1px solid rgba(230, 232, 221, 0.2)',
                  }}
                >
                  <HiOutlineShoppingBag style={{ width: '20px', height: '20px' }} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#E6E8DD', margin: '0 0 4px 0' }}>
                  Customer / Buyer
                </h3>
                <p style={{ fontSize: '12px', color: '#88887F', margin: 0, lineHeight: 1.5 }}>
                  Browse auctions, submit price bids, and track shipping address & orders.
                </p>
              </div>
              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#E6E8DD',
                  gap: '4px',
                }}
              >
                <span>Access Buyer Profile</span>
                <HiOutlineArrowRight style={{ width: '14px', height: '14px' }} />
              </div>
            </button>
          </div>

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', color: '#E6E8DD' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E6E8DD' }} />
              <span>Saving account role to Supabase Cloud DB...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
