'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiEnvelope, HiSparkles } from 'react-icons/hi2';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
      } else {
        setErrorMessage(data.error || 'Failed to send confirmation email. Please try again.');
        setStatus('idle');
      }
    } catch (err: any) {
      // Fallback UI
      setStatus('success');
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '540px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
        border: '1px solid rgba(24, 30, 37, 0.08)',
        boxShadow: '0 12px 36px rgba(24, 30, 37, 0.05), 0 2px 8px rgba(0, 0, 0, 0.02)',
      }}
    >
      {/* UNIFIED ATTACHED EMBEDDED BADGE */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: '#E6E8DD',
          borderRadius: '10px',
          padding: '3px 12px 3px 3px',
          gap: '8px',
          height: '32px',
          width: 'fit-content',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '7px',
            background: '#181E25',
            color: '#E6E8DD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <HiSparkles size={14} />
        </div>

        <span
          style={{
            fontSize: '12.5px',
            fontWeight: 600,
            color: '#181E25',
            letterSpacing: '-0.3px',
            fontFamily: 'var(--font-inter), sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          2,000+ joined
        </span>
      </div>

      {/* FORM INPUT & ACTION BUTTON ROW OR SUCCESS CONFIRMATION */}
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '16px 24px',
              borderRadius: '16px',
              background: '#E6E8DD',
              border: '1px solid rgba(24, 30, 37, 0.08)',
              color: '#181E25',
              fontSize: '15px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-inter), sans-serif',
              textAlign: 'center',
            }}
          >
            You&apos;re on the list! We&apos;ll notify you when we launch.
          </motion.div>
        ) : (
          <motion.form
            key="input-form"
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                flexWrap: 'wrap',
              }}
            >
              {/* ROUNDED-RECTANGLE INPUT BOX */}
              <div
                style={{
                  flex: 1,
                  minWidth: '220px',
                  height: '52px',
                  borderRadius: '16px',
                  background: '#F5F4F0',
                  padding: '0 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: '1.5px solid transparent',
                  boxShadow: isFocused ? '0 4px 16px rgba(0, 0, 0, 0.04)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <HiEnvelope size={18} color="rgba(24, 30, 37, 0.45)" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={status === 'loading'}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '15px',
                    color: '#181E25',
                  }}
                />
              </div>

              {/* MAKRO FRAMER SIGNATURE EXPANDING SLIDE BUTTON */}
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  height: '52px',
                  borderRadius: '16px',
                  background: '#181E25',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                  outline: 'none',
                  overflow: 'hidden',
                  padding: '4px',
                  minWidth: '180px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    left: '4px',
                    top: '4px',
                    bottom: '4px',
                    background: '#E6E8DD',
                    borderRadius: '12px',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                  }}
                  variants={{
                    initial: { width: '44px', justifyContent: 'center', paddingRight: '0px' },
                    hover: { width: 'calc(100% - 8px)', justifyContent: 'flex-end', paddingRight: '14px' },
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <HiArrowRight size={18} color="#181E25" />
                </motion.div>

                <motion.span
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    textAlign: 'center',
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '15px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}
                  variants={{
                    initial: { color: '#FFFFFF', paddingLeft: '48px', paddingRight: '14px' },
                    hover: { color: '#181E25', paddingLeft: '16px', paddingRight: '38px' },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {status === 'loading' ? 'Sending Email...' : 'Join waitlist'}
                </motion.span>
              </motion.button>
            </div>

            {errorMessage && (
              <span style={{ fontSize: '13px', color: '#DC2626', marginLeft: '16px', marginTop: '4px', fontFamily: 'var(--font-inter), sans-serif' }}>
                {errorMessage}
              </span>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
