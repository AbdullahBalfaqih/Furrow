'use client';

import { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import Navbar from '@/components/Navbar';
import {
  HiOutlineFunnel,
  HiOutlineXMark,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineClock,
  HiOutlineCheck,
  HiOutlineSparkles,
  HiOutlineShoppingCart,
  HiOutlineShieldCheck,
  HiOutlineHashtag,
  HiOutlineHeart,
  HiOutlineShare,
  HiOutlineEllipsisHorizontal,
  HiOutlineChatBubbleLeftRight,
  HiOutlinePaperAirplane,
} from 'react-icons/hi2';

interface MarketplaceItem {
  id: string;
  title: string;
  category: string;
  cropType: string;
  location: string;
  quantity: string;
  grade: string;
  priceNum: number;
  price: string;
  reservePrice: string;
  bidsCount: number;
  saleMode: string;
  author: string;
  description: string;
  image: string;
  isEndingSoon: boolean;
}

export default function MarketplacePage() {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);

  // 6 Custom Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCrop, setFilterCrop] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterQuantity, setFilterQuantity] = useState('All');
  const [filterGrade, setFilterGrade] = useState('All');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterEndingSoon, setFilterEndingSoon] = useState(false);

  // Modal & Toast State
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [bidAmountInput, setBidAmountInput] = useState('');

  // Direct Chat & Negotiation State
  const [activeChatSeller, setActiveChatSeller] = useState<{
    sellerName: string;
    itemTitle: string;
    itemPrice: string;
    itemImage: string;
  } | null>(null);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'seller', text: 'Greetings! Thank you for reaching out regarding our harvest batch.', time: '2:15 PM' },
    { id: 2, sender: 'seller', text: 'All lots are inspected with AI Grade verification and ready for refrigerated dispatch.', time: '2:16 PM' },
    { id: 3, sender: 'buyer', text: 'Hello! We are interested in ordering 5.0 Tons. Is refrigerated delivery to Riyadh included?', time: '2:20 PM' },
    { id: 4, sender: 'seller', text: 'Official Deal Offer: $6,100 / Ton (Included refrigerated transport).', isOffer: true, offerPrice: '$6,100 / Ton', time: '2:22 PM' },
  ]);
  const [chatInputText, setChatInputText] = useState('');

  const [commentList, setCommentList] = useState([
    { id: 1, user: '@dammam_distributors', text: 'We offer $1,650 / Ton for full batch dispatch.', time: '10m ago' },
    { id: 2, user: '@saudi_catering', text: 'Grade A+ quality looks great! Delivery available Thursday?', time: '25m ago' },
    { id: 3, user: '@alnahda_market', text: 'Submitted bid at $1,580 / Ton.', time: '1h ago' },
  ]);
  const [newCommentInput, setNewCommentInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Agricultural Crop Categories
  const categories = ['All', 'Vegetables', 'Dates', 'Grains', 'Olives', 'Fruits'];

  const items: MarketplaceItem[] = [
    {
      id: 'LOT-9042',
      title: 'Organic Premium Tomatoes Batch #9042',
      category: 'Vegetables',
      cropType: 'Tomatoes',
      location: 'Riyadh, KSA',
      quantity: '5.0 Tons',
      grade: 'Grade A+ (98.6%)',
      priceNum: 1580,
      price: '$1,580 / Ton',
      reservePrice: '$1,200 / Ton',
      bidsCount: 14,
      saleMode: 'Live Auction',
      author: '@alrasheed_farm',
      description: 'Fresh organic hydroponic greenhouse tomatoes certified with Grade A+ quality blockchain certificate.',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      isEndingSoon: true,
    },
    {
      id: 'LOT-8812',
      title: 'Sukari Dates Premium Batch #8812',
      category: 'Dates',
      cropType: 'Dates',
      location: 'Al-Qassim, KSA',
      quantity: '8.5 Tons',
      grade: 'Grade A+ (99.2%)',
      priceNum: 6200,
      price: '$6,200 / Ton',
      reservePrice: '$4,500 / Ton',
      bidsCount: 22,
      saleMode: 'Live Auction',
      author: '@qassim_dates_co',
      description: 'First grade Sukari dates sourced directly from Al-Qassim palm orchards with 99.2% AI score.',
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&auto=format&fit=crop&q=80',
      isEndingSoon: false,
    },
    {
      id: 'LOT-7734',
      title: 'Pure Golden Wheat Batch #7734',
      category: 'Grains',
      cropType: 'Wheat',
      location: 'Dammam, KSA',
      quantity: '12.0 Tons',
      grade: 'Grade A (95.4%)',
      priceNum: 4100,
      price: '$4,100 / Ton',
      reservePrice: '$3,200 / Ton',
      bidsCount: 9,
      saleMode: 'Live Auction',
      author: '@golden_grains_sa',
      description: 'High-protein durum golden wheat harvested with automated moisture control and smart contract tracing.',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
      isEndingSoon: false,
    },
    {
      id: 'LOT-6621',
      title: 'Jolani Green Olives Batch #6621',
      category: 'Olives',
      cropType: 'Olives',
      location: 'Jeddah, KSA',
      quantity: '3.2 Tons',
      grade: 'Grade A+ (97.8%)',
      priceNum: 3450,
      price: '$3,450 / Ton',
      reservePrice: '$2,800 / Ton',
      bidsCount: 18,
      saleMode: 'Live Auction',
      author: '@tabuk_harvest',
      description: 'Cold-pressed extra virgin green olives packed in stainless food-grade drums.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      isEndingSoon: true,
    },
    {
      id: 'LOT-5510',
      title: 'Fresh Honeycrisp Apples Batch #5510',
      category: 'Fruits',
      cropType: 'Apples',
      location: 'Riyadh, KSA',
      quantity: '4.0 Tons',
      grade: 'Grade A (94.1%)',
      priceNum: 2250,
      price: '$2,250 / Ton',
      reservePrice: '$1,800 / Ton',
      bidsCount: 11,
      saleMode: 'Direct Buy-Now',
      author: '@najd_orchards',
      description: 'Crisp, juicy red apples sorted using computer vision AI grading systems.',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80',
      isEndingSoon: false,
    },
  ];

  // Voice Search Handler
  const handleVoiceSearch = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
        (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        const demoTerm = prompt('Enter text for Voice Search simulation:');
        if (demoTerm) {
          setSearchQuery(demoTerm);
        }
      }
    }
  };

  // Image Upload Search Handler
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageName(file.name);
      const cleanKeyword = file.name.split('.')[0].replace(/[-_]/g, ' ');
      setSearchQuery(cleanKeyword);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddComment = () => {
    if (!newCommentInput.trim()) return;
    setCommentList([
      ...commentList,
      { id: Date.now(), user: '@buyer_me', text: newCommentInput.trim(), time: 'Just now' },
    ]);
    setNewCommentInput('');
    showToast('Comment submitted!');
  };

  const resetFilters = () => {
    setFilterCrop('All');
    setFilterLocation('All');
    setFilterQuantity('All');
    setFilterGrade('All');
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterEndingSoon(false);
    showToast('Reset search filters');
  };

  const activeFilterCount =
    (filterCrop !== 'All' ? 1 : 0) +
    (filterLocation !== 'All' ? 1 : 0) +
    (filterQuantity !== 'All' ? 1 : 0) +
    (filterGrade !== 'All' ? 1 : 0) +
    (filterMinPrice !== '' ? 1 : 0) +
    (filterMaxPrice !== '' ? 1 : 0) +
    (filterEndingSoon ? 1 : 0);

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = filterCrop === 'All' || item.cropType === filterCrop;
    const matchesLocation = filterLocation === 'All' || item.location.includes(filterLocation);
    const matchesGrade = filterGrade === 'All' || item.grade.includes(filterGrade);
    const matchesEndingSoon = !filterEndingSoon || item.isEndingSoon;
    const minP = filterMinPrice ? parseFloat(filterMinPrice) : 0;
    const maxP = filterMaxPrice ? parseFloat(filterMaxPrice) : Infinity;
    const matchesPrice = item.priceNum >= minP && item.priceNum <= maxP;

    return matchesCategory && matchesSearch && matchesCrop && matchesLocation && matchesGrade && matchesEndingSoon && matchesPrice;
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#F8F9FA',
        color: '#121212',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
      }}
    >
      {/* FULL BLEED DOCKED MARKETPLACE HERO BACKGROUND IMAGE (/market.png) */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          left: 0,
          right: 0,
          height: '700px',
          backgroundImage: "url('/market.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          opacity: 0.9,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* LIGHT FROSTED OVERLAY FOR TEXT LEGIBILITY & SMOOTH FADE TO #F8F9FA */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          left: 0,
          right: 0,
          height: '700px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 249, 250, 0.75) 70%, #F8F9FA 100%)',
          backdropFilter: 'blur(4px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* FLOATING STICKY NAVBAR */}
      <header
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          width: '100%',
          maxWidth: '600px',
          padding: '0 16px',
        }}
      >
        <Navbar />
      </header>

      {/* HERO TITLE SECTION */}
      <section
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '140px 20px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 500,
            letterSpacing: '-2px',
            lineHeight: '1.1',
            margin: 0,
          }}
        >
          Explore the Marketplace
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '18px',
            color: 'rgba(18, 18, 18, 0.6)',
            maxWidth: '520px',
            margin: 0,
          }}
        >
          Discover verified crop lots, AI quality scores, live auctions, and direct wholesale prices.
        </p>

        {/* Hidden File Input for Image Search */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {/* WIDE SEARCH INPUT BAR WITH INTEGRATED 6-OPTION FILTER BUTTON */}
        <div
          ref={filterRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1240px',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '54px',
              borderRadius: '18px',
              background: isListening ? '#FEE2E2' : '#E8E7DF',
              padding: '0 14px 0 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              marginTop: '16px',
              transition: 'background-color 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555550" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder={isListening ? 'Listening for voice...' : 'Search crop name, batch ID, or location...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '16px',
                  color: isListening ? '#DC2626' : '#1A1A17',
                }}
              />

              {(searchQuery || selectedImageName) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedImageName(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#888',
                    padding: '4px 8px',
                  }}
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {/* RIGHT SIDE ICONS (CAMERA, MIC & CLEAN ICON-ONLY SLIM FILTER BUTTON) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              {/* IMAGE SEARCH BUTTON */}
              <button
                onClick={handleImageButtonClick}
                title="Search by Image"
                aria-label="Search by Image"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                }}
                className="icon-hover-btn"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>

              {/* VOICE SEARCH BUTTON */}
              <button
                onClick={handleVoiceSearch}
                title="Search by Voice"
                aria-label="Search by Voice"
                style={{
                  background: isListening ? '#EF4444' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                }}
                className="icon-hover-btn"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isListening ? '#FFFFFF' : '#1A1A17'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>

              {/* REFINED SLIM ICON-ONLY FILTER BUTTON */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                title="Search Filters (Crop, Location, Quantity, Grade, Price, Ending Soon)"
                aria-label="Search Filters"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  position: 'relative',
                }}
                className="icon-hover-btn"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                {activeFilterCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#10B981',
                    }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* SLIM NARROW COLUMN FILTER POPUP PANEL */}
          {isFilterOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                right: 0,
                width: '340px',
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                padding: '20px',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                textAlign: 'left',
                boxSizing: 'border-box',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Filters</h4>
                </div>
                <button
                  onClick={resetFilters}
                  style={{ fontSize: '11px', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                >
                  Reset All
                </button>
              </div>

              {/* 1. Crop Filter */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>Crop Type</label>
                <select
                  value={filterCrop}
                  onChange={(e) => setFilterCrop(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#111827',
                    background: '#F9FAFB',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="All">All Crops</option>
                  <option value="Tomatoes">Organic Premium Tomatoes</option>
                  <option value="Dates">Sukari Dates Premium</option>
                  <option value="Wheat">Pure Golden Wheat</option>
                  <option value="Olives">Jolani Green Olives</option>
                  <option value="Apples">Fresh Honeycrisp Apples</option>
                </select>
              </div>

              {/* 2. Location Filter */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>Origin Location</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#111827',
                    background: '#F9FAFB',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="All">All Locations</option>
                  <option value="Riyadh">Riyadh, KSA</option>
                  <option value="Jeddah">Jeddah, KSA</option>
                  <option value="Al-Qassim">Al-Qassim, KSA</option>
                  <option value="Dammam">Dammam, KSA</option>
                </select>
              </div>

              {/* 3. Quantity & 4. Grade Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>Quantity</label>
                  <select
                    value={filterQuantity}
                    onChange={(e) => setFilterQuantity(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '10px',
                      border: '1px solid #E5E7EB',
                      padding: '0 8px',
                      fontSize: '12px',
                      color: '#111827',
                      background: '#F9FAFB',
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="All">All Tons</option>
                    <option value="1-5">1 - 5 Tons</option>
                    <option value="5-10">5 - 10 Tons</option>
                    <option value="10+">10+ Tons</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>AI Grade</label>
                  <select
                    value={filterGrade}
                    onChange={(e) => setFilterGrade(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '10px',
                      border: '1px solid #E5E7EB',
                      padding: '0 8px',
                      fontSize: '12px',
                      color: '#111827',
                      background: '#F9FAFB',
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="All">All Grades</option>
                    <option value="Grade A+">Grade A+ (98%+)</option>
                    <option value="Grade A">Grade A (95%+)</option>
                  </select>
                </div>
              </div>

              {/* 5. Price Range ($ / Ton) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>Price Range ($ / Ton)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    placeholder="Min $"
                    value={filterMinPrice}
                    onChange={(e) => setFilterMinPrice(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '10px',
                      border: '1px solid #E5E7EB',
                      padding: '0 10px',
                      fontSize: '12px',
                      color: '#111827',
                      background: '#F9FAFB',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>to</span>
                  <input
                    type="number"
                    placeholder="Max $"
                    value={filterMaxPrice}
                    onChange={(e) => setFilterMaxPrice(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '10px',
                      border: '1px solid #E5E7EB',
                      padding: '0 10px',
                      fontSize: '12px',
                      color: '#111827',
                      background: '#F9FAFB',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* 6. Auction Ending Soon Checkbox */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  background: '#F9FAFB',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  boxSizing: 'border-box',
                }}
              >
                <input
                  type="checkbox"
                  checked={filterEndingSoon}
                  onChange={(e) => setFilterEndingSoon(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#111827', cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{ fontSize: '12px', color: '#111827', fontWeight: 500, lineHeight: 1.3 }}>
                  Auction ending soon (within 24h)
                </span>
              </label>

              {/* Apply Filters Button */}
              <button
                onClick={() => {
                  setIsFilterOpen(false);
                  showToast(`Applied ${activeFilterCount} search filter(s)`);
                }}
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
                  boxSizing: 'border-box',
                }}
              >
                Apply Filters ({filteredItems.length} results)
              </button>
            </div>
          )}
        </div>

        {/* SQUARE ROUNDED RECTANGLE CATEGORY FILTER BUTTONS ROW */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginTop: '24px',
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  height: '38px',
                  padding: '0 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? '#111827' : '#E8E7DF',
                  color: isActive ? '#FFFFFF' : '#111827',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.12)' : 'none',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* MARKETPLACE CROP PRODUCT CARDS GRID */}
      <section
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1240px',
          margin: '0 auto 80px auto',
          padding: '0 20px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '0',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'transform 0.15s ease, boxShadow 0.15s ease',
              }}
            >
              {/* Product Image - FULL-BLEED EDGE-TO-EDGE SQUARE PHOTO */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                  background: '#F5F7F8',
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Product Details Content Box */}
              <div style={{ padding: '16px 18px 18px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>
                    {item.location} • {item.quantity}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#111827', margin: 0, lineHeight: 1.3 }}>
                    {item.title}
                  </h3>
                </div>

                {/* Price & Action Row */}
                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>
                      {item.saleMode === 'Live Auction' ? 'Current Top Bid' : 'Fixed Price'}
                    </div>
                    <div className="stat-number" style={{ fontSize: '16px', fontWeight: 500, color: '#111827' }}>
                      {item.price}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                    style={{
                      height: '36px',
                      padding: '0 16px',
                      borderRadius: '10px',
                      background: '#111827',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {item.saleMode === 'Live Auction' ? 'Place Bid' : 'Buy Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HORIZONTAL WIDE PINTEREST-STYLE DETAIL MODAL (OPENED ON CLICK) */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '940px',
              height: '520px',
              maxHeight: '90vh',
              background: '#FFFFFF',
              borderRadius: '28px',
              boxShadow: '0 32px 80px rgba(0, 0, 0, 0.25)',
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 1fr) 1.2fr',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* LEFT COLUMN: HD FULL-HEIGHT CLEAN PHOTO */}
            <div style={{ width: '100%', height: '520px', background: '#111827' }}>
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* RIGHT COLUMN: ACTION HEADER, DETAILS & COMMENTS FEED */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '520px',
                overflowY: 'auto',
                padding: '24px',
                boxSizing: 'border-box',
                gap: '14px',
              }}
            >
              {/* TOP HEADER: SELLER PROFILE & DIRECT CHAT BUTTON */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', paddingBottom: '14px' }}>
                {/* Seller Profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: '#111827',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    AR
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                    Al Rasheed Farm
                  </div>
                </div>

                {/* Actions: Direct Chat Seller, Share & Close (UNIFIED HEIGHT & ALIGNMENT) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* DIRECT CHAT BUTTON */}
                  <button
                    onClick={() => {
                      if (selectedItem) {
                        setActiveChatSeller({
                          sellerName: selectedItem.author || 'Al Rasheed Farm',
                          itemTitle: selectedItem.title,
                          itemPrice: selectedItem.price,
                          itemImage: selectedItem.image,
                        });
                        setSelectedItem(null);
                      }
                    }}
                    style={{
                      height: '34px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      background: '#111827',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span>Chat</span>
                  </button>

                  <button
                    onClick={() => {
                      if (typeof navigator !== 'undefined') {
                        navigator.clipboard.writeText(window.location.href);
                        showToast('Link copied to clipboard!');
                      }
                    }}
                    style={{
                      width: '34px',
                      height: '34px',
                      background: '#F5F7F8',
                      border: 'none',
                      borderRadius: '10px',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    <HiOutlineShare size={15} color="#111827" />
                  </button>

                  <button
                    onClick={() => setSelectedItem(null)}
                    style={{
                      width: '34px',
                      height: '34px',
                      background: '#F3F4F6',
                      border: 'none',
                      borderRadius: '10px',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    <HiOutlineXMark size={18} color="#111827" />
                  </button>
                </div>
              </div>

              {/* BATCH TITLE & LOCATION */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>
                    {selectedItem.location} • {selectedItem.quantity}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#111827',
                      background: '#F3F4F6',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {selectedItem.saleMode}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#111827',
                      background: '#F3F4F6',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    AI Score: {selectedItem.grade}
                  </span>
                </div>

                <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#111827', margin: '4px 0 0 0', lineHeight: 1.3, letterSpacing: '-0.3px' }}>
                  {selectedItem.title}
                </h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0', lineHeight: 1.45, fontWeight: 400 }}>
                  {selectedItem.description}
                </p>
              </div>

              {/* CLEAN PRICE & AUCTION STATS ROW (NO INNER BACKGROUND CARDS) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  padding: '10px 0',
                  borderTop: '1px solid #F3F4F6',
                  borderBottom: '1px solid #F3F4F6',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>
                    {selectedItem.saleMode === 'Live Auction' ? 'Current Highest Bid' : 'Fixed Wholesale Price'}
                  </div>
                  <div className="stat-number" style={{ fontSize: '20px', fontWeight: 500, color: '#111827', marginTop: '2px' }}>
                    {selectedItem.price}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>
                    {selectedItem.saleMode === 'Live Auction' ? 'Reserve Floor Price' : 'Available Supply'}
                  </div>
                  <div className="stat-number" style={{ fontSize: '20px', fontWeight: 500, color: '#6B7280', marginTop: '2px' }}>
                    {selectedItem.saleMode === 'Live Auction' ? selectedItem.reservePrice : selectedItem.quantity}
                  </div>
                </div>
              </div>

              {/* AUCTION PURE NUMERIC $ BIDS STREAM (NO INNER CARDS) */}
              {selectedItem.saleMode === 'Live Auction' ? (
                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 500, color: '#111827', margin: 0, letterSpacing: '-0.2px' }}>
                    Live Auction Price Bids History ($ / Ton)
                  </h4>

                  {/* PURE NUMERIC BIDS LIST (CLEAN ROWS, NO INNER CARDS) */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      maxHeight: '140px',
                      overflowY: 'auto',
                      paddingRight: '4px',
                    }}
                  >
                    {[
                      { id: 1, buyer: 'Buyer #904', amount: '$1,650 / Ton', time: '10m ago' },
                      { id: 2, buyer: 'Buyer #812', amount: '$1,600 / Ton', time: '25m ago' },
                      { id: 3, buyer: 'Buyer #734', amount: '$1,580 / Ton', time: '1h ago' },
                    ].map((c) => (
                      <div
                        key={c.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 0',
                          borderBottom: '1px solid #F9FAFB',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>{c.buyer}</span>
                          <span style={{ fontSize: '10px', color: '#9CA3AF' }}>• {c.time}</span>
                        </div>
                        <div className="stat-number" style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                          {c.amount}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PURE NUMERIC PRICE BID INPUT BAR (PINNED AT THE VERY BOTTOM WITH MINIMUM BID VALIDATION) */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      paddingTop: '12px',
                      marginTop: 'auto',
                      borderTop: '1px solid #F3F4F6',
                    }}
                  >
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>$</span>
                      <input
                        type="number"
                        placeholder={`Min bid higher than ${selectedItem.price}...`}
                        value={bidAmountInput}
                        onChange={(e) => setBidAmountInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (!isConnected || !address) {
                              open();
                              showToast('Please connect your Web3 wallet first to submit bids!');
                              return;
                            }
                            const val = Number(bidAmountInput);
                            if (!bidAmountInput || isNaN(val)) {
                              showToast(`Please enter a valid price bid!`);
                              return;
                            }
                            if (val <= selectedItem.priceNum) {
                              showToast(`Bid must be higher than current highest bid (${selectedItem.price})!`);
                              return;
                            }

                            // Save bid to Supabase Cloud DB via API
                            fetch('/api/marketplace/offers', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                listingId: 1,
                                offerAmount: `$${val.toLocaleString()} / Ton`,
                                buyerAddress: address,
                              }),
                            }).then(() => {
                              showToast(`Bid of $${val.toLocaleString()} / Ton recorded on Supabase Cloud DB for ${address.substring(0, 6)}...`);
                            });

                            setSelectedItem({
                              ...selectedItem,
                              price: `$${val.toLocaleString()} / Ton`,
                              priceNum: val,
                            });
                            setBidAmountInput('');
                          }
                        }}
                        style={{
                          width: '100%',
                          height: '40px',
                          borderRadius: '10px',
                          background: '#F5F7F8',
                          border: '1px solid #E5E7EB',
                          padding: '0 12px 0 26px',
                          fontSize: '13px',
                          outline: 'none',
                          color: '#111827',
                          fontWeight: 500,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!isConnected || !address) {
                          open();
                          showToast('Please connect your Web3 wallet first to submit bids!');
                          return;
                        }
                        const val = Number(bidAmountInput);
                        if (!bidAmountInput || isNaN(val)) {
                          showToast(`Please enter a valid price bid higher than ${selectedItem.price}!`);
                          return;
                        }
                        if (val <= selectedItem.priceNum) {
                          showToast(`Bid must be higher than current highest bid (${selectedItem.price})!`);
                          return;
                        }

                        // Save bid to Supabase Cloud DB via API
                        fetch('/api/marketplace/offers', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            listingId: 1,
                            offerAmount: `$${val.toLocaleString()} / Ton`,
                            buyerAddress: address,
                          }),
                        }).then(() => {
                          showToast(`Bid of $${val.toLocaleString()} / Ton recorded on Supabase Cloud DB for ${address.substring(0, 6)}...`);
                        });

                        setSelectedItem({
                          ...selectedItem,
                          price: `$${val.toLocaleString()} / Ton`,
                          priceNum: val,
                        });
                        setBidAmountInput('');
                      }}
                      style={{
                        height: '40px',
                        padding: '0 16px',
                        borderRadius: '10px',
                        background: '#111827',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>Submit Bid</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* DIRECT BUY-NOW PURCHASE ACTION SECTION (BLACK BUTTON, NO GREEN CARDS) */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto', paddingTop: '10px' }}>
                  <button
                    onClick={() => {
                      showToast(`Order confirmed for ${selectedItem.title} at ${selectedItem.price}!`);
                      setSelectedItem(null);
                    }}
                    style={{
                      width: '100%',
                      height: '44px',
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
                      gap: '8px',
                      boxShadow: 'none',
                    }}
                  >
                    <HiOutlineShoppingCart size={16} color="#FFFFFF" />
                    <span>Buy Now ({selectedItem.price})</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DIRECT CHAT & NEGOTIATION MODAL */}
      {activeChatSeller && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(8px)',
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setActiveChatSeller(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '860px',
              height: '580px',
              maxHeight: '90vh',
              background: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0 32px 80px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* CHAT HEADER: SELLER & LOT CONTEXT */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#FFFFFF',
              }}
            >
              {/* Seller Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: '#111827',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                >
                  AR
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                      Al Rasheed Farm
                    </span>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>
                    Direct Farmer Negotiation • Active Now
                  </div>
                </div>
              </div>

              {/* Lot Context Pill & Close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#F9FAFB',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <img
                    src={activeChatSeller.itemImage}
                    alt="Lot"
                    style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <div style={{ fontSize: '12px', color: '#374151', fontWeight: 500, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {activeChatSeller.itemTitle}
                  </div>
                  <div className="stat-number" style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                    {activeChatSeller.itemPrice}
                  </div>
                </div>

                <button
                  onClick={() => setActiveChatSeller(null)}
                  style={{
                    background: '#F3F4F6',
                    border: 'none',
                    borderRadius: '10px',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <HiOutlineXMark size={18} color="#111827" />
                </button>
              </div>
            </div>

            {/* CHAT MESSAGES STREAM */}
            <div
              style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                background: '#FAFAFA',
              }}
            >
              <div style={{ textAlign: 'center', margin: '4px 0' }}>
                <span style={{ fontSize: '10px', color: '#9CA3AF', background: '#FFFFFF', padding: '4px 12px', borderRadius: '12px', border: '1px solid #F3F4F6' }}>
                  🔒 Direct Blockchain Escrow Protected Deal
                </span>
              </div>

              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === 'buyer' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '12px 16px',
                      borderRadius: msg.sender === 'buyer' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      background: msg.sender === 'buyer' ? '#111827' : '#FFFFFF',
                      color: msg.sender === 'buyer' ? '#FFFFFF' : '#111827',
                      fontSize: '13px',
                      lineHeight: 1.45,
                      fontWeight: 400,
                      boxShadow: msg.sender === 'buyer' ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
                      border: msg.sender === 'buyer' ? 'none' : '1px solid #E5E7EB',
                    }}
                  >
                    {msg.isOffer ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6B7280', fontWeight: 500 }}>
                          Formal Deal Counter-Offer
                        </div>
                        <div style={{ fontSize: '13px', color: '#111827' }}>{msg.text}</div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                          <button
                            onClick={() => {
                              showToast(`Offer accepted! Creating escrow deal contract...`);
                              setActiveChatSeller(null);
                            }}
                            style={{
                              background: '#111827',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                          >
                            Accept Deal ({msg.offerPrice})
                          </button>
                          <button
                            onClick={() => setChatInputText('We propose $6,000 / Ton as final counter offer.')}
                            style={{
                              background: '#F3F4F6',
                              color: '#374151',
                              border: '1px solid #D1D5DB',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                          >
                            Counter Offer
                          </button>
                        </div>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                  <span style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px', padding: '0 4px' }}>
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* QUICK NEGOTIATION SUGGESTION CHIPS */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                padding: '8px 20px',
                background: '#FFFFFF',
                borderTop: '1px solid #F3F4F6',
                overflowX: 'auto',
              }}
            >
              {[
                '💰 Offer $6,000 / Ton',
                '🚚 Confirm Thursday Dispatch',
                '📋 Request AI Lab Report',
                '🤝 Finalize Escrow Contract',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setChatInputText(chip.replace(/^[^\s]+\s/, ''))}
                  style={{
                    background: '#F5F7F8',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    color: '#374151',
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* BOTTOM MESSAGE INPUT BAR */}
            <div
              style={{
                padding: '12px 20px 16px 20px',
                background: '#FFFFFF',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                borderTop: '1px solid #F3F4F6',
              }}
            >
              <input
                type="text"
                placeholder="Type message or custom price offer ($ / Ton)..."
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatInputText.trim()) {
                    setChatMessages([
                      ...chatMessages,
                      {
                        id: Date.now(),
                        sender: 'buyer',
                        text: chatInputText,
                        time: 'Just now',
                      },
                    ]);
                    setChatInputText('');
                  }
                }}
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: '10px',
                  background: '#F5F7F8',
                  border: '1px solid #E5E7EB',
                  padding: '0 14px',
                  fontSize: '13px',
                  outline: 'none',
                  color: '#111827',
                  fontWeight: 400,
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={() => {
                  if (chatInputText.trim()) {
                    setChatMessages([
                      ...chatMessages,
                      {
                        id: Date.now(),
                        sender: 'buyer',
                        text: chatInputText,
                        time: 'Just now',
                      },
                    ]);
                    setChatInputText('');
                  }
                }}
                style={{
                  height: '42px',
                  padding: '0 18px',
                  borderRadius: '10px',
                  background: '#111827',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Send</span>
                <HiOutlinePaperAirplane size={13} color="#FFFFFF" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            background: '#1A1A17',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '20px',
            fontSize: '14px',
            fontFamily: 'var(--font-apple)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
