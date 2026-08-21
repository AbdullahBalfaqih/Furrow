'use client';

import React, { useState, useRef, useEffect } from 'react';
import GlassBlob3D from '@/components/GlassBlob3D';
import {
  HiOutlineArrowLeft,
  HiOutlineSparkles,
  HiOutlinePhoto,
  HiOutlineBold,
  HiOutlineItalic,
  HiOutlineListBullet,
  HiOutlineLink,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineCube,
  HiOutlineCpuChip,
  HiOutlineFire,
  HiOutlineBanknotes,
  HiOutlinePlus,
  HiOutlineVideoCamera,
  HiOutlineClock,
} from 'react-icons/hi2';

interface CreateCropViewProps {
  onBack?: () => void;
  showToast?: (msg: string) => void;
}

// Custom Modern Dropdown Component with smooth hover & Apple SF Pro aesthetics
function CustomDropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.label === value) || options[0];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height: '44px',
          borderRadius: '12px',
          border: isOpen ? '1px solid #111827' : '1px solid #E5E7EB',
          background: '#F5F7F8',
          padding: '0 14px',
          fontSize: '13px',
          color: '#111827',
          outline: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.15s ease',
          fontWeight: 400,
          boxShadow: isOpen ? '0 0 0 3px rgba(17, 24, 39, 0.08)' : 'none',
        }}
      >
        <span>{selectedOption?.label}</span>
        <HiOutlineChevronDown
          size={16}
          color="#6D6E6E"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 100,
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {options.map((option) => {
            const isSelected = option.label === value;
            return (
              <div
                key={option.label}
                onClick={() => {
                  onChange(option.label);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: isSelected ? '#F5F7F8' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: isSelected ? '#111827' : '#4B5563',
                  fontWeight: isSelected ? 500 : 400,
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>{option.label}</span>
                {isSelected && <HiOutlineCheck size={16} color="#111827" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CreateCropView({ onBack, showToast }: CreateCropViewProps) {
  const [cropName, setCropName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');

  // Custom Dropdown State
  const [category, setCategory] = useState('Vegetables');

  // Selling Strategy State (Live Auction VS Fixed Buy-It-Now Price)
  const [saleMode, setSaleMode] = useState<'auction' | 'fixed'>('auction');

  // Pricing & Inventory State
  const [price, setPrice] = useState('1580'); // Target / Buy-Now price
  const [reservePrice, setReservePrice] = useState('1200'); // Auction reserve floor price
  const [comparePrice, setComparePrice] = useState('1850'); // Compare-at market average
  const [costPrice, setCostPrice] = useState('850'); // Farmer cost price
  const [stockQuantity, setStockQuantity] = useState('5.0'); // Stock quantity (Tons)

  // Blockchain Smart Certificate Fee
  const mintingFee = 15.0; // $15 USD mint fee

  // AI Assistant Prompt State inside Create Form
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiMode, setAiMode] = useState<'assistant' | 'animate'>('assistant');

  // Uploaded Images State - Empty by Default matching Figma Initial State!
  const [images, setImages] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [auctionDuration, setAuctionDuration] = useState('7 Days (Recommended)');

  const categoryOptions = [
    { label: 'Vegetables' },
    { label: 'Dates' },
    { label: 'Grains' },
    { label: 'Olives' },
    { label: 'Fruits' },
  ];

  const durationOptions = [
    { label: '3 Days' },
    { label: '5 Days' },
    { label: '7 Days (Recommended)' },
    { label: '14 Days' },
    { label: '30 Days' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAiGenerate = (promptText?: string) => {
    const text = promptText || aiPrompt;
    if (!text.trim()) return;

    setIsAiGenerating(true);
    setTimeout(() => {
      setCropName('Organic Premium Red Tomatoes');
      setShortDesc('Freshly harvested Grade A+ organic tomatoes from Al-Qassim region. High purity score.');
      setFullDesc(
        'Harvested under strict organic standards in Al-Qassim. Inspected by AI Vision with 98.6% purity score. Moisture level 18.4%. Ready for immediate cold transport and competitive live bidding.'
      );
      setPrice('1580');
      setReservePrice('1200');
      setComparePrice('1850');
      setCostPrice('850');
      setStockQuantity('5.0');
      if (images.length === 0) {
        setImages(['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80']);
      }
      setIsAiGenerating(false);
      showToast?.('AI populated crop details, pricing & reserve floor price!');
    }, 1200);
  };

  const hasData = images.length > 0 || cropName.trim().length > 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", sans-serif',
      }}
    >
      {/* Hidden File Input */}
      <input type="file" ref={fileInputRef} multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />

      {/* HEADER & ACTION BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 500, color: '#111827', margin: 0, letterSpacing: '-0.3px' }}>
            Create New Product
          </h1>
          <p style={{ fontSize: '14px', color: '#6D6E6E', margin: '4px 0 0 0', fontWeight: 400 }}>
            Add a new crop lot to AI quality inspection, configure live auction or fixed price, and mint blockchain certificate
          </p>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onBack}
            style={{
              height: '40px',
              padding: '0 20px',
              borderRadius: '10px',
              background: '#FFFFFF',
              color: '#111827',
              border: '1px solid #E5E7EB',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            onClick={() => {
              showToast?.(
                saleMode === 'auction'
                  ? 'Harvest batch created & launched in live auction!'
                  : 'Harvest batch listed for direct Buy-It-Now sale!'
              );
              if (onBack) setTimeout(onBack, 1000);
            }}
            style={{
              height: '40px',
              padding: '0 24px',
              borderRadius: '10px',
              background: '#111827',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
            }}
          >
            <HiOutlineCheck size={18} color="#FFFFFF" />
            <span>Create Product</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMN FORM LAYOUT (LEFT: FORM & AI STUDIO, RIGHT: LIVE PREVIEW & FIGMA EMPTY STATE) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* LEFT FORM CONTAINER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 1. FIGMA INITIAL AI PRODUCT STUDIO CONTAINER */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '16px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* HERO PROMPT BANNER */}
            <div
              style={{
                borderRadius: '24px',
                background: '#F5F7F8',
                padding: '24px 24px 32px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <div style={{ margin: '-10px 0 0 0' }}>
                <GlassBlob3D />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#111827', margin: 0 }}>
                Ask for anything about this product
              </h3>
              <p style={{ fontSize: '12px', color: '#6D6E6E', margin: '6px 0 0 0', maxWidth: '320px', lineHeight: 1.5, fontWeight: 400 }}>
                Write the details, cut a background out, or photograph it on a model. Say what you want in your own words.
              </p>
            </div>

            {/* THUMBNAIL ADD ROW */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: '#F7F9FB',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <HiOutlinePlus size={16} color="#6D6E6E" />
                  <span style={{ fontSize: '10px', color: '#6D6E6E', fontWeight: 400 }}>Add</span>
                </button>

                {images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img
                      src={img}
                      alt="Product"
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        objectFit: 'cover',
                        border: '1px solid #E5E7EB',
                      }}
                    />
                    <button
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#EF4444',
                        color: '#FFFFFF',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <HiOutlineXMark size={12} color="#FFFFFF" />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '12px', color: '#6D6E6E', fontWeight: 400 }}>{images.length}/12</div>
            </div>

            {/* BOTTOM AI PROMPT INPUT CONTAINER */}
            <div
              style={{
                borderRadius: '24px',
                background: '#F5F7F8',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Quick Suggestion Pills (Square Rounded Rectangles) */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleAiGenerate('Write product details for organic crop')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    fontSize: '12px',
                    color: '#6D6E6E',
                    cursor: 'pointer',
                    fontWeight: 400,
                  }}
                >
                  Write the product details
                </button>

                <button
                  onClick={() => handleAiGenerate('Clean white studio shot for tomatoes')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    fontSize: '12px',
                    color: '#6D6E6E',
                    cursor: 'pointer',
                    fontWeight: 400,
                  }}
                >
                  Clean white studio shot
                </button>

                <button
                  onClick={() => handleAiGenerate('Photograph this on a model')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    fontSize: '12px',
                    color: '#6D6E6E',
                    cursor: 'pointer',
                    fontWeight: 400,
                  }}
                >
                  Photograph this on a model
                </button>
              </div>

              {/* Prompt Input Field */}
              <textarea
                rows={2}
                placeholder="Ask for anything: write the details, remove a background, put it on a model."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAiGenerate();
                  }
                }}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  color: '#111827',
                  resize: 'none',
                  fontWeight: 400,
                  fontFamily: 'inherit',
                }}
              />

              {/* Bottom Mode Switcher & Orange Send Button (Square Rounded Rectangles) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Assistant | Animate Tab List (No White Border) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#F5F7F8',
                    borderRadius: '10px',
                    padding: '3px',
                    border: 'none',
                    gap: '4px',
                  }}
                >
                  <button
                    onClick={() => setAiMode('assistant')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      background: aiMode === 'assistant' ? '#E6E8DD' : 'transparent',
                      color: aiMode === 'assistant' ? '#111827' : '#6D6E6E',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: aiMode === 'assistant' ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <HiOutlineSparkles size={14} color={aiMode === 'assistant' ? '#111827' : '#6D6E6E'} />
                    <span>Assistant</span>
                  </button>

                  <button
                    onClick={() => setAiMode('animate')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      background: aiMode === 'animate' ? '#E6E8DD' : 'transparent',
                      color: aiMode === 'animate' ? '#111827' : '#6D6E6E',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: aiMode === 'animate' ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <HiOutlineVideoCamera size={14} color={aiMode === 'animate' ? '#111827' : '#6D6E6E'} />
                    <span>Animate</span>
                  </button>
                </div>

                {/* Solid Black Send Button */}
                <button
                  onClick={() => handleAiGenerate()}
                  style={{
                    padding: '8px 22px',
                    borderRadius: '8px',
                    background: '#111827',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Send
                </button>
              </div>

              {isAiGenerating && (
                <div style={{ fontSize: '13px', color: '#111827', fontWeight: 500, textAlign: 'center', paddingTop: '4px' }}>
                  AI Generating crop details & studio assets... ✨
                </div>
              )}
            </div>
          </div>

          {/* 2. BASIC INFORMATION FORM SECTION */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#111827', margin: 0 }}>
              Crop Lot Information
            </h3>

            {/* Crop Name Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                Crop Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                style={{
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  background: '#F5F7F8',
                  padding: '0 14px',
                  fontSize: '13px',
                  color: '#111827',
                  outline: 'none',
                  fontWeight: 400,
                }}
              />
            </div>

            {/* SLEEK CUSTOM DROPDOWN FOR CATEGORY */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Crop Category</label>
              <CustomDropdown value={category} onChange={setCategory} options={categoryOptions} />
            </div>

            {/* Short Summary Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Short Summary</label>
              <textarea
                rows={2}
                placeholder="Enter product description"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                style={{
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  background: '#F5F7F8',
                  padding: '10px 14px',
                  fontSize: '13px',
                  color: '#111827',
                  outline: 'none',
                  resize: 'none',
                  fontWeight: 400,
                }}
              />
            </div>

            {/* Full Rich Description Editor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Full Quality Details</label>

              {/* Formatting Toolbar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#F5F7F8',
                  padding: '8px 12px',
                  borderRadius: '10px 10px 0 0',
                  border: '1px solid #E5E7EB',
                  borderBottom: 'none',
                }}
              >
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                  <HiOutlineBold size={16} color="#111827" />
                </button>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                  <HiOutlineItalic size={16} color="#111827" />
                </button>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                  <HiOutlineListBullet size={16} color="#111827" />
                </button>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                  <HiOutlineLink size={16} color="#111827" />
                </button>
              </div>

              <textarea
                rows={4}
                placeholder="Full harvest inspection details, moisture levels, IPFS hash proof..."
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                style={{
                  borderRadius: '0 0 10px 10px',
                  border: '1px solid #E5E7EB',
                  background: '#F5F7F8',
                  padding: '12px 14px',
                  fontSize: '13px',
                  color: '#111827',
                  outline: 'none',
                  resize: 'none',
                  fontWeight: 400,
                }}
              />
            </div>
          </div>

          {/* 3. PRICING & SELLING STRATEGY SECTION */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#6D6E6E', letterSpacing: '0.3px' }}>
                  Pricing & Inventory
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#111827', margin: '2px 0 0 0' }}>
                  Selling Strategy & Pricing Configuration
                </h3>
              </div>

              <HiOutlineBanknotes size={22} color="#111827" />
            </div>

            {/* SELLING MODE SWITCHER: LIVE AUCTION VS FIXED PRICE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Selling Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Option 1: Live Auction */}
                <div
                  onClick={() => setSaleMode('auction')}
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    border: saleMode === 'auction' ? '2px solid #111827' : '1px solid #E5E7EB',
                    background: saleMode === 'auction' ? '#F9FAFB' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                      <HiOutlineFire size={18} color="#111827" />
                      <span>Live Auction</span>
                    </div>
                    {saleMode === 'auction' && <HiOutlineCheck size={16} color="#111827" />}
                  </div>
                  <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400, lineHeight: 1.4 }}>
                    Buyers place competing live bids above your minimum reserve floor price. Highest bidder wins.
                  </span>
                </div>

                {/* Option 2: Fixed Buy-It-Now Price */}
                <div
                  onClick={() => setSaleMode('fixed')}
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    border: saleMode === 'fixed' ? '2px solid #111827' : '1px solid #E5E7EB',
                    background: saleMode === 'fixed' ? '#F9FAFB' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                      <HiOutlineTag size={18} color="#111827" />
                      <span>Fixed Price</span>
                    </div>
                    {saleMode === 'fixed' && <HiOutlineCheck size={16} color="#111827" />}
                  </div>
                  <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400, lineHeight: 1.4 }}>
                    Instant purchase at a set price per ton. No bidding wait time.
                  </span>
                </div>
              </div>
            </div>

            {/* 4 CORE PRICING & INVENTORY INPUT FIELDS (GRID 2x2) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Field 1: Price / Buy-Now Price */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                  {saleMode === 'auction' ? 'Target Buy-Now Price ($ / Ton) *' : 'Fixed Selling Price ($ / Ton) *'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '10px',
                      border: '1px solid #E5E7EB',
                      background: '#F5F7F8',
                      padding: '0 14px 0 36px',
                      fontSize: '13px',
                      color: '#111827',
                      outline: 'none',
                      fontWeight: 500,
                    }}
                  />
                  <HiOutlineCurrencyDollar size={18} color="#6D6E6E" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                </div>
              </div>

              {/* Field 2: Compare at Market Price */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Compare-at Market Price ($ / Ton)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '10px',
                      border: '1px solid #E5E7EB',
                      background: '#F5F7F8',
                      padding: '0 14px 0 36px',
                      fontSize: '13px',
                      color: '#111827',
                      outline: 'none',
                      fontWeight: 400,
                    }}
                  />
                  <HiOutlineCurrencyDollar size={18} color="#6D6E6E" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                </div>
              </div>

              {/* Field 3: Farmer Cost Price */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Farmer Production Cost ($ / Ton)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '10px',
                      border: '1px solid #E5E7EB',
                      background: '#F5F7F8',
                      padding: '0 14px 0 36px',
                      fontSize: '13px',
                      color: '#111827',
                      outline: 'none',
                      fontWeight: 400,
                    }}
                  />
                  <HiOutlineCurrencyDollar size={18} color="#6D6E6E" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                </div>
              </div>

              {/* Field 4: Stock Volume (Tons) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Batch Stock Volume (Tons)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '10px',
                      border: '1px solid #E5E7EB',
                      background: '#F5F7F8',
                      padding: '0 14px 0 36px',
                      fontSize: '13px',
                      color: '#111827',
                      outline: 'none',
                      fontWeight: 500,
                    }}
                  />
                  <HiOutlineCube size={18} color="#6D6E6E" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                </div>
              </div>
            </div>

            {/* AUCTION RESERVE PRICE & DURATION FIELDS (Visible in Auction Mode) */}
            {saleMode === 'auction' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#F9FAFB', padding: '16px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'flex-start' }}>
                  {/* Field 1: Minimum Reserve Floor Price */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                      Minimum Reserve Floor Price ($ / Ton) <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1200"
                      value={reservePrice}
                      onChange={(e) => setReservePrice(e.target.value)}
                      style={{
                        height: '44px',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB',
                        background: '#FFFFFF',
                        padding: '0 14px',
                        fontSize: '13px',
                        color: '#111827',
                        outline: 'none',
                        fontWeight: 500,
                      }}
                    />
                  </div>

                  {/* Field 2: Clock / Hours Time Picker Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                      Auction Duration (Hours / Time) <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="e.g. 72 Hours or 168 Hours"
                        value={auctionDuration}
                        onChange={(e) => setAuctionDuration(e.target.value)}
                        style={{
                          width: '100%',
                          height: '44px',
                          borderRadius: '12px',
                          border: '1px solid #E5E7EB',
                          background: '#FFFFFF',
                          padding: '0 14px 0 38px',
                          fontSize: '13px',
                          color: '#111827',
                          outline: 'none',
                          fontWeight: 500,
                        }}
                      />
                      <HiOutlineClock size={18} color="#6D6E6E" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    </div>

                    {/* Quick Hour Presets */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                      {['24 Hours', '48 Hours', '72 Hours', '168 Hours'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setAuctionDuration(t)}
                          style={{
                            padding: '3px 10px',
                            borderRadius: '8px',
                            background: auctionDuration === t ? '#111827' : '#FFFFFF',
                            color: auctionDuration === t ? '#FFFFFF' : '#6B7280',
                            border: '1px solid #E5E7EB',
                            fontSize: '11px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>
                    If buyer bids do not reach ${reservePrice || '0'} / Ton within {auctionDuration}, the auction will not execute.
                  </span>
                  <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 500 }}>Protected Reserve Active ✓</span>
                </div>
              </div>
            )}

            {/* BLOCKCHAIN SMART CONTRACT CERTIFICATE MINTING FEE CARD */}
            <div
              style={{
                borderRadius: '16px',
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <HiOutlineCpuChip size={22} color="#111827" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                    Blockchain Quality Certificate Minting Fee
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', fontWeight: 400 }}>
                    Official smart contract registration & IPFS immutable traceability hash
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="stat-number" style={{ fontSize: '18px', fontWeight: 500, color: '#111827' }}>${mintingFee.toFixed(2)}</div>
                <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 500 }}>Gas Fee Included ✓</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE CONTAINER: DYNAMICALLY SWITCHES BETWEEN FIGMA INITIAL EMPTY PREVIEW AND LIVE CROP PREVIEW */}
        <div
          style={{
            position: 'sticky',
            top: '24px',
            background: '#FFFFFF',
            borderRadius: '30px',
            padding: '24px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {!hasData ? (
            /* EXACT FIGMA INITIAL EMPTY PREVIEW STATE (Matching User Screenshot) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', minHeight: '440px', justifyContent: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#6D6E6E', letterSpacing: '0.24px' }}>Preview</div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '4px 0 0 0' }}>Nothing to show yet</h3>
              </div>

              {/* 4 Tilted Graphic Cards Visual */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px 0',
                  position: 'relative',
                }}
              >
                {/* Card 1: -9deg (Red Tomatoes on Dark Background) */}
                <div
                  style={{
                    width: '96px',
                    height: '96px',
                    transform: 'rotate(-9deg)',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: 'none',
                    overflow: 'hidden',
                    background: '#111827',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80"
                    alt="Tomatoes on Dark Background"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Card 2: -3deg (Avocado / Fresh Crop on Dark Background) */}
                <div
                  style={{
                    width: '96px',
                    height: '96px',
                    transform: 'rotate(-3deg)',
                    marginLeft: '-18px',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: 'none',
                    overflow: 'hidden',
                    background: '#111827',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&auto=format&fit=crop&q=80"
                    alt="Avocado on Dark Background"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Card 3: 3deg (Golden Wheat Grains) */}
                <div
                  style={{
                    width: '96px',
                    height: '96px',
                    transform: 'rotate(3deg)',
                    marginLeft: '-18px',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: 'none',
                    overflow: 'hidden',
                    background: '#111827',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80"
                    alt="Wheat on Dark Background"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Card 4: 9deg (Green Spinach bundle) */}
                <div
                  style={{
                    width: '96px',
                    height: '96px',
                    transform: 'rotate(9deg)',
                    marginLeft: '-18px',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: 'none',
                    overflow: 'hidden',
                    background: '#111827',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80"
                    alt="Spinach on Dark Background"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Title & Prompt instructions */}
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 600, color: '#111827', margin: 0, letterSpacing: '-0.3px', lineHeight: 1.3 }}>
                  Start creating with AI Product Studio
                </h2>
                <p style={{ fontSize: '14px', color: '#6D6E6E', margin: 0, fontWeight: 400 }}>
                  Write a prompt below, or drop in your own photos.
                </p>
              </div>
            </div>
          ) : (
            /* POPULATED LIVE PREVIEW STATE WHEN DATA OR IMAGE IS ADDED */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#6D6E6E', letterSpacing: '0.3px' }}>
                Live Crop Card Preview
              </div>

              {/* Preview Image */}
              <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden' }}>
                <img
                  src={images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80'}
                  alt="Live Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#111827',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <HiOutlineSparkles size={14} color="#111827" />
                  <span>Grade A+ (AI Verified)</span>
                </div>

                {/* Selling Strategy Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: saleMode === 'auction' ? '#111827' : '#10B981',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 500,
                  }}
                >
                  {saleMode === 'auction' ? 'Live Auction' : 'Direct Buy-It-Now'}
                </div>
              </div>

              {/* Preview Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
                  {cropName || 'Crop Name Preview'}
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, fontWeight: 400 }}>
                  {shortDesc || 'Short description preview will appear here as you type.'}
                </p>

                {/* Financial Breakdown */}
                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>
                      {saleMode === 'auction' ? 'Starting Price / Reserve' : 'Fixed Selling Price'}
                    </span>
                    <span className="stat-number" style={{ fontSize: '16px', fontWeight: 500, color: '#111827' }}>
                      ${price || '0'} <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>/ Ton</span>
                    </span>
                  </div>

                  {comparePrice && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>Market Compare Price</span>
                      <span className="stat-number" style={{ fontSize: '12px', color: '#9CA3AF', textDecoration: 'line-through' }}>${comparePrice} / Ton</span>
                    </div>
                  )}

                  {saleMode === 'auction' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>Auction Duration</span>
                      <span className="stat-number" style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>{auctionDuration}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>Batch Stock Volume</span>
                    <span className="stat-number" style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>{stockQuantity || '0.0'} Tons</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>Blockchain Mint Fee</span>
                    <span className="stat-number" style={{ fontSize: '13px', fontWeight: 500, color: '#10B981' }}>${mintingFee.toFixed(2)}</span>
                  </div>
                </div>

                {/* Blockchain Smart Contract Trace Badge */}
                <div
                  style={{
                    marginTop: '10px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#F5F7F8',
                    fontSize: '12px',
                    color: '#4B5563',
                    fontFamily: 'monospace',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Smart Contract: 0x7a8f...92c1</span>
                  <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>IPFS Verified ✓</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
