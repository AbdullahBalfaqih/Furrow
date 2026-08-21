'use client';

import { useState, useEffect } from 'react';
import {
  HiOutlineXMark,
  HiOutlineKey,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineSparkles,
} from 'react-icons/hi2';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [geminiKey, setGeminiKey] = useState('');
  const [showGemini, setShowGemini] = useState(false);
  const [geminiSaved, setGeminiSaved] = useState(false);

  const [openRouterKey, setOpenRouterKey] = useState('');
  const [showOpenRouter, setShowOpenRouter] = useState(false);
  const [openRouterSaved, setOpenRouterSaved] = useState(false);

  const [higgsfieldId, setHiggsfieldId] = useState('');
  const [showHiggsfieldId, setShowHiggsfieldId] = useState(false);

  const [higgsfieldSecret, setHiggsfieldSecret] = useState('');
  const [showHiggsfieldSecret, setShowHiggsfieldSecret] = useState(false);
  const [higgsfieldSaved, setHiggsfieldSaved] = useState(false);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      setGeminiKey(localStorage.getItem('GEMINI_API_KEY') || '');
      setOpenRouterKey(localStorage.getItem('OPENROUTER_API_KEY') || '');
      setHiggsfieldId(localStorage.getItem('HIGGSFIELD_KEY_ID') || '');
      setHiggsfieldSecret(localStorage.getItem('HIGGSFIELD_KEY_SECRET') || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveGemini = () => {
    if (geminiKey.trim()) {
      localStorage.setItem('GEMINI_API_KEY', geminiKey.trim());
      setGeminiSaved(true);
      setTimeout(() => setGeminiSaved(false), 2000);
    }
  };

  const handleSaveOpenRouter = () => {
    if (openRouterKey.trim()) {
      localStorage.setItem('OPENROUTER_API_KEY', openRouterKey.trim());
      setOpenRouterSaved(true);
      setTimeout(() => setOpenRouterSaved(false), 2000);
    }
  };

  const handleSaveHiggsfield = () => {
    if (higgsfieldId.trim() || higgsfieldSecret.trim()) {
      localStorage.setItem('HIGGSFIELD_KEY_ID', higgsfieldId.trim());
      localStorage.setItem('HIGGSFIELD_KEY_SECRET', higgsfieldSecret.trim());
      setHiggsfieldSaved(true);
      setTimeout(() => setHiggsfieldSaved(false), 2000);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 4000,
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, var(--font-inter), sans-serif',
      }}
      onClick={onClose}
    >
      {/* OUTER ROUNDED CARD WITH OVERFLOW HIDDEN */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '88vh',
          background: '#FFFFFF',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.18)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* INNER SCROLLABLE CONTAINER */}
        <div
          className="modal-scroll-container"
          style={{
            width: '100%',
            overflowY: 'auto',
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* MODAL HEADER */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 600, color: '#111827', margin: 0 }}>
              Use your own API keys
            </h2>
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280',
                padding: '4px',
              }}
            >
              <HiOutlineXMark size={20} color="#6B7280" />
            </button>
          </div>

          {/* INTRO DESCRIPTION */}
          <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.45', margin: 0 }}>
            The AI tools are not connected in this shared demo. Add your own keys and they work fully: the
            assistants can create and edit products, and you will see them on your storefront. Keys stay in your
            browser and are only used for your own requests.
          </p>

          {/* CARD 1: GOOGLE GEMINI */}
          <div
            style={{
              background: '#F9FAFB',
              borderRadius: '20px',
              border: '1px solid #F3F4F6',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>
                Google Gemini
              </h3>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0', lineHeight: '1.35' }}>
                Powers the dashboard assistant, the product assistant, the listing writer, and enhancing a photo. Free keys work.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                Google Gemini API key
              </label>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <HiOutlineKey size={16} color="#6B7280" />
                <input
                  type={showGemini ? 'text' : 'password'}
                  placeholder="AIza..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '13px',
                    color: '#111827',
                    background: 'transparent',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowGemini(!showGemini)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                >
                  {showGemini ? <HiOutlineEyeSlash size={16} color="#6B7280" /> : <HiOutlineEye size={16} color="#6B7280" />}
                </button>
              </div>
            </div>

            {/* CARD FOOTER */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#111827',
                  textDecoration: 'none',
                }}
              >
                <HiOutlineArrowTopRightOnSquare size={15} color="#111827" />
                <span>Get a key</span>
              </a>

              <button
                onClick={handleSaveGemini}
                style={{
                  padding: '8px 22px',
                  borderRadius: '10px',
                  background: geminiSaved ? '#10B981' : '#E6E8DD',
                  color: '#111827',
                  border: geminiSaved ? 'none' : '1px solid #D4D7C8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {geminiSaved ? 'Saved ✓' : 'Save'}
              </button>
            </div>
          </div>

          {/* CARD 2: OPENROUTER API */}
          <div
            style={{
              background: '#F9FAFB',
              borderRadius: '16px',
              border: '1px solid #F3F4F6',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HiOutlineSparkles size={16} color="#111827" />
                <span>OpenRouter API</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0', lineHeight: '1.35' }}>
                Connect Claude 3.5 Sonnet, GPT-4o, DeepSeek V3, Llama 3, and 100+ LLMs via OpenRouter.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                OpenRouter API key
              </label>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <HiOutlineKey size={16} color="#6B7280" />
                <input
                  type={showOpenRouter ? 'text' : 'password'}
                  placeholder="sk-or-v1-..."
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '13px',
                    color: '#111827',
                    background: 'transparent',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowOpenRouter(!showOpenRouter)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                >
                  {showOpenRouter ? <HiOutlineEyeSlash size={16} color="#6B7280" /> : <HiOutlineEye size={16} color="#6B7280" />}
                </button>
              </div>
            </div>

            {/* CARD FOOTER */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#111827',
                  textDecoration: 'none',
                }}
              >
                <HiOutlineArrowTopRightOnSquare size={15} color="#111827" />
                <span>Get a key</span>
              </a>

              <button
                onClick={handleSaveOpenRouter}
                style={{
                  padding: '8px 22px',
                  borderRadius: '10px',
                  background: openRouterSaved ? '#10B981' : '#E6E8DD',
                  color: '#111827',
                  border: openRouterSaved ? 'none' : '1px solid #D4D7C8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {openRouterSaved ? 'Saved ✓' : 'Save'}
              </button>
            </div>
          </div>

          {/* CARD 3: HIGGSFIELD */}
          <div
            style={{
              background: '#F9FAFB',
              borderRadius: '16px',
              border: '1px solid #F3F4F6',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HiOutlineSparkles size={16} color="#111827" />
                <span>Higgsfield</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0', lineHeight: '1.35' }}>
                Powers generating product images and video clips. This is a separate paid account.
              </p>
            </div>

            {/* FIELD 1: KEY ID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                Higgsfield key id
              </label>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <HiOutlineKey size={16} color="#6B7280" />
                <input
                  type={showHiggsfieldId ? 'text' : 'password'}
                  placeholder="Key id"
                  value={higgsfieldId}
                  onChange={(e) => setHiggsfieldId(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '13px',
                    color: '#111827',
                    background: 'transparent',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowHiggsfieldId(!showHiggsfieldId)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                >
                  {showHiggsfieldId ? <HiOutlineEyeSlash size={16} color="#6B7280" /> : <HiOutlineEye size={16} color="#6B7280" />}
                </button>
              </div>
            </div>

            {/* FIELD 2: KEY SECRET */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                Higgsfield key secret
              </label>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <HiOutlineLockClosed size={16} color="#6B7280" />
                <input
                  type={showHiggsfieldSecret ? 'text' : 'password'}
                  placeholder="Key secret"
                  value={higgsfieldSecret}
                  onChange={(e) => setHiggsfieldSecret(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '13px',
                    color: '#111827',
                    background: 'transparent',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowHiggsfieldSecret(!showHiggsfieldSecret)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                >
                  {showHiggsfieldSecret ? <HiOutlineEyeSlash size={16} color="#6B7280" /> : <HiOutlineEye size={16} color="#6B7280" />}
                </button>
              </div>
            </div>

            {/* CARD FOOTER */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
              <a
                href="https://higgsfield.ai"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#111827',
                  textDecoration: 'none',
                }}
              >
                <HiOutlineArrowTopRightOnSquare size={15} color="#111827" />
                <span>Get a key</span>
              </a>

              <button
                onClick={handleSaveHiggsfield}
                style={{
                  padding: '8px 22px',
                  borderRadius: '10px',
                  background: higgsfieldSaved ? '#10B981' : '#E6E8DD',
                  color: '#111827',
                  border: higgsfieldSaved ? 'none' : '1px solid #D4D7C8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {higgsfieldSaved ? 'Saved ✓' : 'Save'}
              </button>
            </div>
          </div>

          {/* BOTTOM WARNINGS AND DISCLAIMERS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>
              Stored in this browser only. Never saved on the server.
            </span>
            <span style={{ fontSize: '11px', color: '#EF4444', lineHeight: '1.4' }}>
              Gemini & OpenRouter keys connect your live AI models directly. Higgsfield bills per generation.
            </span>
          </div>

          {/* BOTTOM CLOSE BUTTON */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 22px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                color: '#111827',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-scroll-container::-webkit-scrollbar {
          width: 5px;
        }
        .modal-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .modal-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.12);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
