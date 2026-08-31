'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  HiOutlinePlus,
  HiOutlineSparkles,
  HiOutlineLink,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineArrowPath,
  HiOutlineCube,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCheck,
  HiOutlineStar,
  HiOutlinePencilSquare,
  HiOutlineChevronDown,
  HiOutlinePhoto,
  HiOutlineArrowUpTray,
  HiOutlineXMark,
} from 'react-icons/hi2';

interface HarvestViewProps {
  onAddNewBatch?: () => void;
  showToast?: (msg: string) => void;
}

// Custom Modern Dropdown Filter Component
function CustomFilterDropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
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

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height: '42px',
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
          size={14}
          color="#6D6E6E"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
            marginLeft: '8px',
          }}
        />
      </button>

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
            minWidth: '160px',
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: isSelected ? '#F5F7F8' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: isSelected ? '#111827' : '#4B5563',
                  fontWeight: isSelected ? 500 : 400,
                  transition: 'background 0.1s ease',
                }}
              >
                <span>{option.label}</span>
                {isSelected && <HiOutlineCheck size={14} color="#111827" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Initial Crop Batches Data
const INITIAL_CROP_LOTS = [
  {
    id: 'LOT-9042',
    name: 'Organic Premium Tomatoes',
    category: 'Vegetables',
    quantity: '5.0 Tons',
    aiGrade: 'Grade A+ (98.6%)',
    reservePrice: '$1,200',
    currentBid: '$1,580',
    bidsCount: 14,
    status: 'Active Auction',
    txHash: '0x7a8f...92c1',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'LOT-8812',
    name: 'Sukari Dates Premium',
    category: 'Dates',
    quantity: '8.5 Tons',
    aiGrade: 'Grade A+ (99.2%)',
    reservePrice: '$4,500',
    currentBid: '$6,200',
    bidsCount: 22,
    status: 'Active Auction',
    txHash: '0x92f8...41a8',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'LOT-7734',
    name: 'Pure Golden Wheat',
    category: 'Grains',
    quantity: '12.0 Tons',
    aiGrade: 'Grade A (95.4%)',
    reservePrice: '$3,200',
    currentBid: '$4,100',
    bidsCount: 9,
    status: 'Active Auction',
    txHash: '0x3c11...88b2',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'LOT-6621',
    name: 'Jolani Green Olives',
    category: 'Olives',
    quantity: '3.2 Tons',
    aiGrade: 'Grade A+ (97.8%)',
    reservePrice: '$2,800',
    currentBid: '$3,450',
    bidsCount: 18,
    status: 'Active Auction',
    txHash: '0x5e90...11a4',
    image: 'https://images.unsplash.com/photo-1541256942802-7b29531f0df8?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'LOT-5510',
    name: 'Fresh Honeycrisp Apples',
    category: 'Fruits',
    quantity: '4.0 Tons',
    aiGrade: 'Grade A (94.1%)',
    reservePrice: '$1,800',
    currentBid: '$2,250',
    bidsCount: 11,
    status: 'Active Auction',
    txHash: '0x88d4...33c9',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80',
  },
];

// High-Res Crop Photo Presets for Easy 1-Click Changing
const PRESET_CROP_IMAGES = [
  { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80' },
  { label: 'Sukari Dates', url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Golden Wheat', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80' },
  { label: 'Green Olives', url: 'https://images.unsplash.com/photo-1541256942802-7b29531f0df8?w=500&auto=format&fit=crop&q=80' },
  { label: 'Honeycrisp Apples', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80' },
  { label: 'Fresh Strawberries', url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=80' },
  { label: 'Fresh Oranges', url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&auto=format&fit=crop&q=80' },
  { label: 'Pomegranates', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80' },
  { label: 'Green Figs', url: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500&auto=format&fit=crop&q=80' },
  { label: 'Coffee Beans', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=80' },
];

export default function HarvestView({ onAddNewBatch, showToast }: HarvestViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Dynamic Crop Lots State with Supabase Cloud DB & LocalStorage Persistence
  const [myCropLots, setMyCropLots] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('furrow_my_crops');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length > 0) return parsed;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });

  // Sync directly with Supabase Database via /api/crops
  useEffect(() => {
    async function syncSupabaseCrops() {
      try {
        const res = await fetch('/api/crops');
        const json = await res.json();
        if (json && json.data && Array.isArray(json.data) && json.data.length > 0) {
          const dbLots = json.data.map((c: any) => {
            const name = c.crop_type || c.cropType || 'Organic Crop Batch';
            const isDates = name.toLowerCase().includes('date') || name.toLowerCase().includes('sukari');
            const isTomatoes = name.toLowerCase().includes('tomato');
            const isWheat = name.toLowerCase().includes('wheat');
            const isOlives = name.toLowerCase().includes('olive');

            let defaultImg = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80';
            if (isDates) defaultImg = 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80';
            if (isWheat) defaultImg = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80';
            if (isOlives) defaultImg = 'https://images.unsplash.com/photo-1541256942802-7b29531f0df8?w=800&auto=format&fit=crop&q=80';

            return {
              id: `LOT-${c.id || Math.floor(1000 + Math.random() * 9000)}`,
              dbId: c.id,
              name: name,
              category: isDates ? 'Dates' : isTomatoes ? 'Vegetables' : isWheat ? 'Grains' : isOlives ? 'Olives' : 'Vegetables',
              quantity: c.quantity || '5.0 Tons',
              aiGrade: c.aiGrade || (c.status === 'Registered' ? 'Grade A+ (98.6%)' : 'Grade A+ (99.2%)'),
              reservePrice: c.reservePrice || (isDates ? '$4,500' : '$1,200'),
              currentBid: c.currentBid || (isDates ? '$6,200' : '$1,580'),
              bidsCount: c.bidsCount || (isDates ? 22 : 14),
              status: c.status || 'Active Auction',
              txHash: c.metadata_hash ? `${c.metadata_hash.substring(0, 6)}...${c.metadata_hash.substring(c.metadata_hash.length - 4)}` : '0x7a8f...92c1',
              image: c.image || defaultImg,
            };
          });

          setMyCropLots((prev) => {
            // Keep user created crops that might be in local state and merge with DB lots
            const userOnly = prev.filter((p) => !dbLots.some((d: any) => d.id === p.id || d.name === p.name));
            const merged = [...userOnly, ...dbLots];
            if (typeof window !== 'undefined') {
              localStorage.setItem('furrow_my_crops', JSON.stringify(merged));
            }
            return merged;
          });
        }
      } catch (err) {
        console.error('Error syncing Supabase crops:', err);
      }
    }
    syncSupabaseCrops();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('furrow_my_crops', JSON.stringify(myCropLots));
    }
  }, [myCropLots]);

  // Single Row Selection State
  const [selectedCropId, setSelectedCropId] = useState<string>('LOT-8812');

  // Edit Crop Product Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<any | null>(null);

  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const categoryOptions = [
    { label: 'All Categories', value: 'All' },
    { label: 'Vegetables', value: 'Vegetables' },
    { label: 'Dates', value: 'Dates' },
    { label: 'Grains', value: 'Grains' },
    { label: 'Olives', value: 'Olives' },
    { label: 'Fruits', value: 'Fruits' },
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Active Auction', value: 'Active Auction' },
    { label: 'Pending Inspection', value: 'Pending Inspection' },
    { label: 'Completed Sale', value: 'Completed Sale' },
  ];

  // Farmer Stats Overview Data
  const farmerStats = [
    { label: 'Total batches', title: 'My Batches', count: myCropLots.length.toString(), trend: '↑ 12% vs last month', icon: HiOutlineCube },
    { label: 'Active auctions', title: 'Live Auctions', count: myCropLots.filter((c) => c.status === 'Active Auction').length.toString(), trend: '↑ 8% vs last month', icon: HiOutlineCheckCircle },
    { label: 'Inspection status', title: 'Pending Inspection', count: myCropLots.filter((c) => c.status === 'Pending Inspection').length.toString(), trend: 'Processing', icon: HiOutlineClock },
    { label: 'Completed orders', title: 'Completed Sales', count: '6', trend: '↑ 15% vs last month', icon: HiOutlineCheck },
    { label: 'Auction margin', title: 'Avg. Premium', count: '+31.4%', trend: 'High Demand', icon: HiOutlineStar },
  ];

  const filteredCrops = myCropLots.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const selectedCrop = myCropLots.find((c) => c.id === selectedCropId);

  const openEditModal = (crop: any) => {
    setEditingCrop({ ...crop });
    setIsEditModalOpen(true);
  };

  const handleSaveCrop = async () => {
    if (!editingCrop) return;
    const updated = myCropLots.map((c) => (c.id === editingCrop.id ? editingCrop : c));
    setMyCropLots(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('furrow_my_crops', JSON.stringify(updated));
      localStorage.setItem('furrow_user_crops', JSON.stringify(updated));
    }

    const cropName = editingCrop.name || 'Product';
    const cropId = editingCrop.id || '';
    const dbId = editingCrop.dbId;
    const category = editingCrop.category || 'Vegetables';

    setIsEditModalOpen(false);
    showToast?.(`✔ Saved product updates for ${cropName} (${cropId})`);

    // Non-blocking background API update
    try {
      fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dbId: dbId,
          id: cropId,
          cropType: cropName,
          category: category,
          farmerAddress: '0x0388865e1daf2427De6111cf8548ed1871656180',
          harvestDate: new Date().toISOString().split('T')[0],
        }),
      }).catch((err) => console.warn('Background crop sync notice:', err));
    } catch (e) {}
  };

  const handleDeleteCrop = (id: string) => {
    const updated = myCropLots.filter((c) => c.id !== id);
    setMyCropLots(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('furrow_my_crops', JSON.stringify(updated));
      localStorage.setItem('furrow_user_crops', JSON.stringify(updated));
    }
    setIsEditModalOpen(false);
    showToast?.(`🗑️ Product ${id} removed successfully`);
  };

  const handleClearSampleCrops = () => {
    setMyCropLots([]);
    if (typeof window !== 'undefined') {
      localStorage.setItem('furrow_my_crops', JSON.stringify([]));
      localStorage.setItem('furrow_user_crops', JSON.stringify([]));
    }
    showToast?.('🧹 Cleared all default products! You now have a clean slate to add your own.');
  };

  const handleFileUploadInModal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingCrop) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setEditingCrop((prev: any) => ({ ...prev, image: result }));
          showToast?.('✔ Custom crop photo uploaded successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
      {/* FARMER HEADER BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 500, color: '#111827', margin: 0, letterSpacing: '-0.3px' }}>
            My Harvest & Crops
          </h1>
          <p style={{ fontSize: '14px', color: '#6D6E6E', margin: '4px 0 0 0', fontWeight: 400 }}>
            Manage your registered crop lots, AI quality scores, minimum reserve prices, and live buyer bids
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleClearSampleCrops}
            style={{
              height: '42px',
              padding: '0 16px',
              borderRadius: '10px',
              background: '#F3F4F6',
              color: '#4B5563',
              border: '1px solid #E5E7EB',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <span>Clear Sample Products</span>
          </button>

          {/* ADD NEW CROP LOT BUTTON */}
          <button
            onClick={() => {
              if (onAddNewBatch) onAddNewBatch();
              showToast?.('Opening Create New Harvest Batch view...');
            }}
            style={{
              height: '42px',
              padding: '0 22px',
              borderRadius: '10px',
              background: '#111827',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'none',
            }}
          >
            <HiOutlinePlus size={18} color="#FFFFFF" />
            <span>New Harvest Batch</span>
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {farmerStats.map((st, i) => {
          const IconComp = st.icon;
          return (
            <div
              key={i}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '20px 22px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '132px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 400, color: '#6B7280' }}>{st.label}</div>
                  <div style={{ fontSize: '15px', fontWeight: 500, color: '#111827', marginTop: '2px' }}>{st.title}</div>
                </div>

                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: '#E6E8DD',
                    border: '1px solid #D4D7C8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconComp size={18} color="#111827" />
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <div className="stat-number" style={{ fontSize: '28px', fontWeight: 500, color: '#111827', lineHeight: 1 }}>
                  {st.count}
                </div>
                <div className="stat-number" style={{ fontSize: '11px', fontWeight: 400, color: '#6B7280', marginTop: '6px' }}>
                  {st.trend}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '18px 24px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
          display: 'grid',
          gridTemplateColumns: '2fr 1.2fr 1.2fr 1fr 1fr',
          gap: '14px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#F5F7F8',
            borderRadius: '12px',
            padding: '0 14px',
            height: '42px',
            border: '1px solid #E5E7EB',
          }}
        >
          <HiOutlineMagnifyingGlass size={18} color="#6D6E6E" />
          <input
            type="text"
            placeholder="Search crop name or batch ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              color: '#111827',
              width: '100%',
              fontWeight: 400,
            }}
          />
        </div>

        <CustomFilterDropdown
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categoryOptions}
        />

        <CustomFilterDropdown
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={statusOptions}
        />

        <button
          onClick={() => showToast?.(`Filtered ${filteredCrops.length} crop lots`)}
          style={{
            height: '42px',
            borderRadius: '12px',
            background: '#F5F7F8',
            color: '#111827',
            border: '1px solid #E5E7EB',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <HiOutlineFunnel size={16} color="#111827" />
          <span>Filter</span>
        </button>

        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setSelectedStatus('All');
            showToast?.('Reset filters');
          }}
          style={{
            height: '42px',
            borderRadius: '10px',
            background: '#111827',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
            transition: 'all 0.2s ease',
          }}
        >
          <HiOutlineArrowPath size={16} color="#FFFFFF" />
          <span>Reset</span>
        </button>
      </div>

      {/* FARMER'S CROP MANAGEMENT TABLE */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)',
          overflowX: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#E6E8DD', borderBottom: 'none' }}>
              <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 600, color: '#111827', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>My Crop Lot</th>
              <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>AI Quality Certificate</th>
              <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>My Reserve Price</th>
              <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>Top Buyer Bid</th>
              <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>Blockchain Trace</th>
              <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 600, color: '#111827', textAlign: 'right', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCrops.map((crop: any) => {
              const isSelected = selectedCropId === crop.id;
              return (
                <tr
                  key={crop.id}
                  onClick={() => setSelectedCropId(crop.id)}
                  style={{
                    borderBottom: '1px solid #F9FAFB',
                    background: isSelected ? '#F5F7F8' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {/* Crop Name & Image */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ position: 'relative' }}>
                        <img
                          src={crop.image}
                          alt={crop.name}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                            border: '1px solid rgba(0,0,0,0.08)',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: isSelected ? 500 : 400, color: '#111827' }}>
                          {crop.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>
                          ID: {crop.id} • {crop.quantity}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* AI Certificate */}
                  <td style={{ padding: '16px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        background: isSelected ? '#FFFFFF' : '#F3F4F6',
                        border: '1px solid #E5E7EB',
                        color: '#374151',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      <HiOutlineSparkles size={14} color="#4B5563" />
                      <span>{crop.aiGrade}</span>
                    </div>
                  </td>

                  {/* Reserve Price */}
                  <td style={{ padding: '16px' }}>
                    <div className="stat-number" style={{ fontSize: '13px', color: '#111827', fontWeight: 500 }}>
                      {crop.reservePrice}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>Your floor price</div>
                  </td>

                  {/* Top Buyer Bid */}
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div className="stat-number" style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{crop.currentBid}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>{crop.bidsCount} buyer bids</div>
                    </div>
                  </td>

                  {/* Tx Proof */}
                  <td style={{ padding: '16px' }}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        showToast?.(`Viewing smart contract ${crop.txHash}`);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        color: '#4B5563',
                        textDecoration: 'none',
                        fontFamily: 'monospace',
                        fontWeight: 400,
                      }}
                    >
                      <HiOutlineLink size={14} color="#6B7280" />
                      <span>{crop.txHash}</span>
                    </a>
                  </td>

                  {/* Direct Row Edit Button */}
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(crop);
                      }}
                      style={{
                        height: '34px',
                        padding: '0 14px',
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        color: '#111827',
                        border: '1px solid #D1D5DB',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <HiOutlinePencilSquare size={14} color="#111827" />
                      <span>Edit Product</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* BOTTOM ACTION BAR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: '#F9FAFB',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '13px', color: '#111827', fontWeight: 500 }}>
              Selected Crop: <span style={{ color: '#111827', fontWeight: 500 }}>{selectedCrop ? selectedCrop.name : 'None'}</span>
            </div>
            {selectedCrop && (
              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>
                ({selectedCrop.id} • {selectedCrop.quantity})
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              disabled={!selectedCrop}
              onClick={() => {
                if (selectedCrop) openEditModal(selectedCrop);
              }}
              style={{
                height: '38px',
                padding: '0 24px',
                borderRadius: '10px',
                background: selectedCrop ? '#111827' : '#E5E7EB',
                color: selectedCrop ? '#FFFFFF' : '#9CA3AF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 500,
                cursor: selectedCrop ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              <HiOutlinePencilSquare size={16} color={selectedCrop ? '#FFFFFF' : '#9CA3AF'} />
              <span>Manage Selected Crop</span>
            </button>
          </div>
        </div>
      </div>

      {/* EDIT CROP PRODUCT MODAL */}
      {isEditModalOpen && editingCrop && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
                    Edit Product Details & Photo
                  </h3>
                  <span style={{ fontSize: '12px', background: '#F3F4F6', color: '#4B5563', padding: '2px 8px', borderRadius: '6px', fontWeight: 500 }}>
                    {editingCrop.id}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
                  Change product image, title, category, quantity, and pricing floor
                </p>
              </div>

              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}
              >
                <HiOutlineXMark size={20} color="#6B7280" />
              </button>
            </div>

            {/* PRODUCT IMAGE EDITOR SECTION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#F9FAFB', padding: '18px', borderRadius: '18px', border: '1px solid #E5E7EB' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HiOutlinePhoto size={16} color="#111827" />
                <span>Product Image</span>
              </label>

              {/* Current Image Preview & Upload Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={editingCrop.image}
                  alt={editingCrop.name}
                  style={{
                    width: '94px',
                    height: '94px',
                    borderRadius: '14px',
                    objectFit: 'cover',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    flexShrink: 0,
                  }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  {/* File Upload Input */}
                  <input
                    type="file"
                    ref={modalFileInputRef}
                    accept="image/*"
                    onChange={handleFileUploadInModal}
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    style={{
                      height: '38px',
                      padding: '0 16px',
                      borderRadius: '10px',
                      background: '#111827',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: 'fit-content',
                    }}
                  >
                    <HiOutlineArrowUpTray size={15} color="#FFFFFF" />
                    <span>Upload Custom Photo</span>
                  </button>

                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Select an image file from your computer or paste a URL below:</div>
                </div>
              </div>

              {/* Image Web URL Input */}
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={editingCrop.image}
                onChange={(e) => setEditingCrop({ ...editingCrop, image: e.target.value })}
                style={{
                  width: '100%',
                  height: '38px',
                  borderRadius: '10px',
                  border: '1px solid #D1D5DB',
                  padding: '0 12px',
                  fontSize: '12px',
                  color: '#111827',
                  background: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              {/* 1-Click High-Res Crop Photo Presets */}
              <div style={{ marginTop: '4px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>
                  Or select a high-res crop photo preset:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {PRESET_CROP_IMAGES.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setEditingCrop({ ...editingCrop, image: preset.url })}
                      style={{
                        position: 'relative',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: editingCrop.image === preset.url ? '2px solid #111827' : '1px solid #E5E7EB',
                        height: '56px',
                        transition: 'transform 0.15s ease',
                      }}
                      title={preset.label}
                    >
                      <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'rgba(0,0,0,0.65)',
                          color: '#FFF',
                          fontSize: '9px',
                          textAlign: 'center',
                          padding: '2px 0',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {preset.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FORM INPUT FIELDS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {/* Product Name */}
              <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>Crop Name / Title</label>
                <input
                  type="text"
                  value={editingCrop.name}
                  onChange={(e) => setEditingCrop({ ...editingCrop, name: e.target.value })}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid #D1D5DB',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#111827',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Category */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>Category</label>
                <select
                  value={editingCrop.category}
                  onChange={(e) => setEditingCrop({ ...editingCrop, category: e.target.value })}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid #D1D5DB',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#111827',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Dates">Dates</option>
                  <option value="Grains">Grains</option>
                  <option value="Olives">Olives</option>
                  <option value="Fruits">Fruits</option>
                </select>
              </div>

              {/* Quantity */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>Quantity</label>
                <input
                  type="text"
                  value={editingCrop.quantity}
                  onChange={(e) => setEditingCrop({ ...editingCrop, quantity: e.target.value })}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid #D1D5DB',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#111827',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Reserve Price */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>Reserve Floor Price</label>
                <input
                  type="text"
                  value={editingCrop.reservePrice}
                  onChange={(e) => setEditingCrop({ ...editingCrop, reservePrice: e.target.value })}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid #D1D5DB',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#111827',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Current Top Bid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>Top Buyer Bid</label>
                <input
                  type="text"
                  value={editingCrop.currentBid}
                  onChange={(e) => setEditingCrop({ ...editingCrop, currentBid: e.target.value })}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid #D1D5DB',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#111827',
                    outline: 'none',
                  }}
                />
              </div>

              {/* AI Grade */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>AI Quality Score</label>
                <input
                  type="text"
                  value={editingCrop.aiGrade}
                  onChange={(e) => setEditingCrop({ ...editingCrop, aiGrade: e.target.value })}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid #D1D5DB',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#111827',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>Status</label>
                <select
                  value={editingCrop.status}
                  onChange={(e) => setEditingCrop({ ...editingCrop, status: e.target.value })}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid #D1D5DB',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#111827',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                >
                  <option value="Active Auction">Active Auction</option>
                  <option value="Pending Inspection">Pending Inspection</option>
                  <option value="Completed Sale">Completed Sale</option>
                </select>
              </div>
            </div>

            {/* MODAL FOOTER BUTTONS */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => handleDeleteCrop(editingCrop.id)}
                style={{
                  height: '40px',
                  padding: '0 16px',
                  borderRadius: '10px',
                  background: '#FEF2F2',
                  color: '#EF4444',
                  border: '1px solid #FCA5A5',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Delete Product
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    height: '40px',
                    padding: '0 18px',
                    borderRadius: '10px',
                    background: '#F3F4F6',
                    color: '#374151',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveCrop}
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
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  }}
                >
                  Save Product Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
