'use client';

import React, { useState } from 'react';
import {
  HiOutlineFire,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlinePaperAirplane,
  HiOutlineShieldCheck,
  HiOutlineBanknotes,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlinePencilSquare,
  HiOutlineChevronRight,
  HiOutlineStar,
} from 'react-icons/hi2';

interface AuctionsViewProps {
  showToast?: (msg: string) => void;
}

export default function AuctionsView({ showToast }: AuctionsViewProps) {
  const [activeAuctionId, setActiveAuctionId] = useState<string>('LOT-9042');
  const [counterPrice, setCounterPrice] = useState<string>('');
  const [showCounterModal, setShowCounterModal] = useState<boolean>(false);
  const [counterTargetCrop, setCounterTargetCrop] = useState<string>('');

  // Overview Stats for Live Auctions
  const auctionMetrics = [
    { label: 'Active Live Auctions', value: '5 Lots', subtext: 'All protected by reserve floor', icon: HiOutlineFire },
    { label: 'Highest Live Buyer Bid', value: '$6,200 / Ton', subtext: 'Sukari Dates Premium', icon: HiOutlineCurrencyDollar },
    { label: 'Total Bids Received', value: '74 Bids', subtext: 'From verified wholesale buyers', icon: HiOutlineUserGroup },
    { label: 'Avg. Auction Margin', value: '+31.4%', subtext: 'Above farmer reserve price', icon: HiOutlineStar },
  ];

  // Live Auctions Data
  const liveAuctions = [
    {
      id: 'LOT-9042',
      name: 'Organic Premium Tomatoes',
      quantity: '5.0 Tons',
      aiGrade: 'Grade A+ (98.6%)',
      reservePrice: '$1,200 / Ton',
      currentBid: '$1,580 / Ton',
      topBidder: 'Al-Jazeera Fresh Wholesalers',
      location: 'Riyadh, Saudi Arabia',
      bidsCount: 14,
      timeLeft: '04h 12m 35s',
      isExpiringSoon: true,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
      bidsHistory: [
        { bidder: 'Al-Jazeera Fresh Wholesalers', amount: '$1,580 / Ton', time: '2 mins ago', status: 'Highest Bidder' },
        { bidder: 'Modern Supermarkets Ltd.', amount: '$1,520 / Ton', time: '45 mins ago', status: 'Outbid' },
        { bidder: 'Al-Madina Food Hub', amount: '$1,450 / Ton', time: '2 hours ago', status: 'Outbid' },
        { bidder: 'Panda Retail Chain', amount: '$1,380 / Ton', time: '4 hours ago', status: 'Outbid' },
      ],
    },
    {
      id: 'LOT-8812',
      name: 'Sukari Dates Premium',
      quantity: '8.5 Tons',
      aiGrade: 'Grade A+ (99.2%)',
      reservePrice: '$4,500 / Ton',
      currentBid: '$6,200 / Ton',
      topBidder: 'Saudi Gulf Supermarkets Co.',
      location: 'Jeddah, Saudi Arabia',
      bidsCount: 22,
      timeLeft: '18h 45m 10s',
      isExpiringSoon: false,
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&auto=format&fit=crop&q=80',
      bidsHistory: [
        { bidder: 'Saudi Gulf Supermarkets Co.', amount: '$6,200 / Ton', time: '14 mins ago', status: 'Highest Bidder' },
        { bidder: 'Al-Othaim Produce Procurement', amount: '$5,950 / Ton', time: '1 hour ago', status: 'Outbid' },
        { bidder: 'Arabian Dates Import Corp.', amount: '$5,600 / Ton', time: '3 hours ago', status: 'Outbid' },
      ],
    },
    {
      id: 'LOT-7734',
      name: 'Pure Golden Wheat',
      quantity: '12.0 Tons',
      aiGrade: 'Grade A (95.4%)',
      reservePrice: '$3,200 / Ton',
      currentBid: '$4,100 / Ton',
      topBidder: 'National Grain Millers',
      location: 'Dammam, Saudi Arabia',
      bidsCount: 9,
      timeLeft: '2 Days remaining',
      isExpiringSoon: false,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80',
      bidsHistory: [
        { bidder: 'National Grain Millers', amount: '$4,100 / Ton', time: '3 hours ago', status: 'Highest Bidder' },
        { bidder: 'Middle East Flour Mills', amount: '$3,850 / Ton', time: '6 hours ago', status: 'Outbid' },
      ],
    },
    {
      id: 'LOT-6621',
      name: 'Jolani Green Olives',
      quantity: '3.2 Tons',
      aiGrade: 'Grade A+ (97.8%)',
      reservePrice: '$2,800 / Ton',
      currentBid: '$3,450 / Ton',
      topBidder: 'Levant Oil & Produce Co.',
      location: 'Khobar, Saudi Arabia',
      bidsCount: 18,
      timeLeft: '3 Days remaining',
      isExpiringSoon: false,
      image: 'https://images.unsplash.com/photo-1541256942802-7b29531f0df8?w=500&auto=format&fit=crop&q=80',
      bidsHistory: [
        { bidder: 'Levant Oil & Produce Co.', amount: '$3,450 / Ton', time: '5 hours ago', status: 'Highest Bidder' },
        { bidder: 'Mediterranean Harvest LLC', amount: '$3,200 / Ton', time: '8 hours ago', status: 'Outbid' },
      ],
    },
  ];

  const selectedAuction = liveAuctions.find((a) => a.id === activeAuctionId) || liveAuctions[0];

  const handleOpenCounterModal = (cropName: string, currentBidPrice: string) => {
    setCounterTargetCrop(cropName);
    setCounterPrice(currentBidPrice.replace(/[^0-9]/g, ''));
    setShowCounterModal(true);
  };

  const handleSendCounterOffer = () => {
    if (!counterPrice) return;
    showToast?.(`Counter-offer of $${counterPrice} / Ton sent for ${counterTargetCrop}!`);
    setShowCounterModal(false);
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
      {/* HEADER BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 500, color: '#111827', margin: 0, letterSpacing: '-0.3px' }}>
              Live Auctions & Bidding Negotiations
            </h1>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#6B7280',
                fontSize: '12px',
                fontWeight: 400,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }} />
              Live Bidding Active
            </span>
          </div>
          <p style={{ fontSize: '14px', color: '#6D6E6E', margin: '4px 0 0 0', fontWeight: 400 }}>
            Monitor real-time buyer bids, send instant price counter-offers, and accept highest wholesale offers
          </p>
        </div>

        {/* QUICK ACTION BUTTON */}
        <button
          onClick={() => showToast?.('Refreshing live auction stream...')}
          style={{
            height: '42px',
            padding: '0 20px',
            borderRadius: '10px',
            background: '#FFFFFF',
            color: '#111827',
            border: '1px solid #E5E7EB',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
          }}
        >
          <span>Refresh Live Feed</span>
        </button>
      </div>

      {/* TOP 4 METRICS OVERVIEW CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {auctionMetrics.map((m, i) => {
          const IconComp = m.icon;
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
                minHeight: '128px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 400, color: '#6B7280' }}>{m.label}</span>
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
                <div className="stat-number" style={{ fontSize: '26px', fontWeight: 500, color: '#111827', lineHeight: 1 }}>
                  {m.value}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 400, color: '#6B7280', marginTop: '6px' }}>{m.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT: 2-COLUMN LAYOUT (LEFT: LIVE AUCTIONS LIST | RIGHT: LIVE BIDS & NEGOTIATION PANEL) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* LEFT COLUMN: ACTIVE LIVE AUCTION CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#111827', margin: 0 }}>Active Crop Lots on Auction</h2>
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>Click card to manage negotiations</span>
          </div>

          {liveAuctions.map((auc) => {
            const isSelected = auc.id === activeAuctionId;
            return (
              <div
                key={auc.id}
                onClick={() => setActiveAuctionId(auc.id)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '20px',
                  border: isSelected ? '1px solid rgba(17, 24, 39, 0.35)' : '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: isSelected ? '0 4px 16px rgba(0, 0, 0, 0.04)' : '0 2px 10px rgba(0, 0, 0, 0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Top Card Row */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img
                    src={auc.image}
                    alt={auc.name}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '14px',
                      objectFit: 'cover',
                    }}
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#111827', margin: 0 }}>{auc.name}</h3>

                      {/* Time Left Text (No Background Highlight Pill) */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          color: '#6B7280',
                          fontSize: '12px',
                          fontWeight: 400,
                        }}
                      >
                        <HiOutlineClock size={14} color="#6D6E6E" />
                        <span className="stat-number">{auc.timeLeft}</span>
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>
                      ID: {auc.id} • Quantity: {auc.quantity}
                    </div>

                    {/* AI Certificate Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          color: '#4B5563',
                          background: '#F5F7F8',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          border: '1px solid #E5E7EB',
                        }}
                      >
                        <HiOutlineSparkles size={12} color="#4B5563" />
                        {auc.aiGrade}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Bidding Progress Row */}
                <div
                  style={{
                    background: '#F9FAFB',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1.2fr',
                    gap: '12px',
                    alignItems: 'center',
                    border: '1px solid #F3F4F6',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>Reserve Floor</div>
                    <div className="stat-number" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginTop: '2px' }}>
                      {auc.reservePrice}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>Current High Bid</div>
                    <div className="stat-number" style={{ fontSize: '16px', fontWeight: 500, color: '#111827', marginTop: '2px' }}>
                      {auc.currentBid}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>Top Buyer</div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: '#111827', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {auc.topBidder}
                    </div>
                  </div>
                </div>

                {/* Card Bottom Action Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>
                    <strong style={{ color: '#111827', fontWeight: 500 }}>{auc.bidsCount}</strong> bids placed
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCounterModal(auc.name, auc.currentBid);
                      }}
                      style={{
                        height: '34px',
                        padding: '0 14px',
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        color: '#111827',
                        border: '1px solid #E5E7EB',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span>Counter-Offer</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast?.(`Accepted bid of ${auc.currentBid} for ${auc.name}! Smart contract executing...`);
                      }}
                      style={{
                        height: '34px',
                        padding: '0 16px',
                        borderRadius: '8px',
                        background: '#111827',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span>Accept {auc.currentBid}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: LIVE NEGOTIATION STREAM & BIDS LADDER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            {/* Selected Crop Auction Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>
                  Live Bids Ladder
                </span>
                <span style={{ fontSize: '11px', color: '#7A8068', fontWeight: 500 }}>● Real-Time Feed</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#111827', margin: '4px 0 0 0' }}>
                {selectedAuction.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0 0', fontWeight: 400 }}>
                Reserve Floor: <strong style={{ color: '#111827' }}>{selectedAuction.reservePrice}</strong> • Current High: <strong style={{ color: '#111827' }}>{selectedAuction.currentBid}</strong>
              </p>
            </div>

            {/* Bids Ladder List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedAuction.bidsHistory.map((bid, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: index === 0 ? '#F9FAFB' : '#FFFFFF',
                    border: index === 0 ? '1px solid #E5E7EB' : '1px solid #F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>{bid.bidder}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>{bid.time}</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="stat-number" style={{ fontSize: '14px', fontWeight: 500, color: index === 0 ? '#111827' : '#6B7280' }}>
                      {bid.amount}
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        color: index === 0 ? '#7A8068' : '#9CA3AF',
                        marginTop: '2px',
                      }}
                    >
                      {bid.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Farmer Action Buttons (Text-Only) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
              <button
                onClick={() => handleOpenCounterModal(selectedAuction.name, selectedAuction.currentBid)}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#F5F7F8',
                  color: '#111827',
                  border: '1px solid #E5E7EB',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span>Send Counter-Offer to Top Bidder</span>
              </button>

              <button
                onClick={() => showToast?.(`Accepted top bid of ${selectedAuction.currentBid} for ${selectedAuction.name}!`)}
                style={{
                  width: '100%',
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
                }}
              >
                <span>Accept Winning Bid ({selectedAuction.currentBid})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* COUNTER-OFFER POPUP MODAL */}
      {showCounterModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              width: '100%',
              maxWidth: '420px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#111827', margin: 0 }}>
                Send Counter-Offer
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0', fontWeight: 400 }}>
                Propose your target counter price to the top bidder for <strong>{counterTargetCrop}</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                Your Counter Price ($ / Ton)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  placeholder="e.g. 1650"
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    background: '#F5F7F8',
                    padding: '0 14px 0 36px',
                    fontSize: '14px',
                    color: '#111827',
                    outline: 'none',
                    fontWeight: 500,
                  }}
                />
                <HiOutlineCurrencyDollar size={18} color="#6D6E6E" style={{ position: 'absolute', left: '10px', top: '12px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                onClick={() => setShowCounterModal(false)}
                style={{
                  height: '40px',
                  padding: '0 18px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  color: '#374151',
                  border: '1px solid #E5E7EB',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSendCounterOffer}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  borderRadius: '10px',
                  background: '#111827',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span>Submit Counter-Offer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
