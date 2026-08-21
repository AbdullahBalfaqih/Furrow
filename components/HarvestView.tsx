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
} from 'react-icons/hi2';

interface HarvestViewProps {
  onAddNewBatch?: () => void;
  showToast?: (msg: string) => void;
}

// Custom Modern Dropdown Filter Component with smooth hover & right-aligned arrow
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
      {/* Dropdown Trigger Button */}
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
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
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

export default function HarvestView({ onAddNewBatch, showToast }: HarvestViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Single Row Selection State (No Checkboxes - Click Row to Select Exactly 1 Crop)
  const [selectedCropId, setSelectedCropId] = useState<string>('LOT-9042');

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
    { label: 'Total batches', title: 'My Batches', count: '12', trend: '↑ 12% vs last month', icon: HiOutlineCube },
    { label: 'Active auctions', title: 'Live Auctions', count: '5', trend: '↑ 8% vs last month', icon: HiOutlineCheckCircle },
    { label: 'Inspection status', title: 'Pending Inspection', count: '1', trend: 'Processing', icon: HiOutlineClock },
    { label: 'Completed orders', title: 'Completed Sales', count: '6', trend: '↑ 15% vs last month', icon: HiOutlineCheck },
    { label: 'Auction margin', title: 'Avg. Premium', count: '+31.4%', trend: 'High Demand', icon: HiOutlineStar },
  ];

  // Farmer My Crops Data Table
  const myCropLots = [
    {
      id: 'LOT-9042',
      name: 'Organic Premium Tomatoes',
      category: 'Vegetables',
      quantity: '5.0 Tons',
      aiGrade: 'Grade A+ (98.6%)',
      reservePrice: '$1,200 / Ton',
      currentBid: '$1,580 / Ton',
      bidsCount: 14,
      status: 'Active Auction',
      txHash: '0x7a8f...92c1',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'LOT-8812',
      name: 'Sukari Dates Premium',
      category: 'Dates',
      quantity: '8.5 Tons',
      aiGrade: 'Grade A+ (99.2%)',
      reservePrice: '$4,500 / Ton',
      currentBid: '$6,200 / Ton',
      bidsCount: 22,
      status: 'Active Auction',
      txHash: '0x92f8...41a8',
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'LOT-7734',
      name: 'Pure Golden Wheat',
      category: 'Grains',
      quantity: '12.0 Tons',
      aiGrade: 'Grade A (95.4%)',
      reservePrice: '$3,200 / Ton',
      currentBid: '$4,100 / Ton',
      bidsCount: 9,
      status: 'Active Auction',
      txHash: '0x3c11...88b2',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'LOT-6621',
      name: 'Jolani Green Olives',
      category: 'Olives',
      quantity: '3.2 Tons',
      aiGrade: 'Grade A+ (97.8%)',
      reservePrice: '$2,800 / Ton',
      currentBid: '$3,450 / Ton',
      bidsCount: 18,
      status: 'Active Auction',
      txHash: '0x5e90...11a4',
      image: 'https://images.unsplash.com/photo-1541256942802-7b29531f0df8?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'LOT-5510',
      name: 'Fresh Honeycrisp Apples',
      category: 'Fruits',
      quantity: '4.0 Tons',
      aiGrade: 'Grade A (94.1%)',
      reservePrice: '$1,800 / Ton',
      currentBid: '$2,250 / Ton',
      bidsCount: 11,
      status: 'Active Auction',
      txHash: '0x88d4...33c9',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=150&auto=format&fit=crop&q=80',
    },
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

      {/* CLEAN STAT CARDS WITH NATURAL SF PRO WEIGHT */}
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
              {/* Top Header Row */}
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

              {/* Metric Value & Clean Trend Line with Outfit Numeric Font */}
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

      {/* SEARCH AND FILTER CONTROL BAR */}
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
        {/* Search Field */}
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

        {/* Sleek Custom Category Dropdown */}
        <CustomFilterDropdown
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categoryOptions}
        />

        {/* Sleek Custom Status Dropdown */}
        <CustomFilterDropdown
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={statusOptions}
        />

        {/* Filter Trigger Button */}
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

        {/* Reset Button (Solid Black Button) */}
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

      {/* FARMER'S CROP MANAGEMENT TABLE (CLICK ANY ROW TO SELECT SINGLE ROW - NO CHECKBOXES) */}
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
              <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 600, color: '#111827', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>Blockchain Trace</th>
            </tr>
          </thead>
          <tbody>
            {filteredCrops.map((crop) => {
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
                  {/* Crop Name, Batch ID & Quantity */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={crop.image}
                        alt={crop.name}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '10px',
                          objectFit: 'cover',
                        }}
                      />
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

                  {/* AI Quality Certificate */}
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

                  {/* Farmer Minimum Reserve Price */}
                  <td style={{ padding: '16px' }}>
                    <div className="stat-number" style={{ fontSize: '13px', color: '#111827', fontWeight: 500 }}>
                      {crop.reservePrice}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>Your floor price</div>
                  </td>

                  {/* Highest Current Buyer Bid */}
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div className="stat-number" style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{crop.currentBid}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>{crop.bidsCount} buyer bids</div>
                    </div>
                  </td>

                  {/* Blockchain Smart Contract Tx Proof */}
                  <td style={{ padding: '16px 20px' }}>
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
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* SINGLE BOTTOM MANAGEMENT ACTION BAR (Clean Single Selection Control) */}
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
                if (selectedCrop) {
                  showToast?.(`Managing batch: ${selectedCrop.name}`);
                }
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
    </div>
  );
}
