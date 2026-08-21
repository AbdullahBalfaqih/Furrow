'use client';

import { useState, useRef, useEffect } from 'react';
import GlassBlob3D from '@/components/GlassBlob3D';
import ApiKeyModal from '@/components/ApiKeyModal';
import {
  HiOutlinePaperClip,
  HiOutlineClock,
  HiOutlinePlus,
  HiOutlineKey,
  HiOutlineChevronDown,
  HiOutlineCpuChip,
  HiOutlineCheck,
  HiOutlineMicrophone,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { FaTelegramPlane } from 'react-icons/fa';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  image?: string;
}

export default function AiAssistantView() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('Gemini 1.5 Flash');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyModal, setApiKeyModal] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  // File Upload & Voice Recording State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const availableModels = [
    { name: 'Gemini 1.5 Flash', provider: 'Google AI' },
    { name: 'Claude 3.5 Sonnet (OpenRouter)', provider: 'Anthropic' },
    { name: 'GPT-4o Mini (OpenRouter)', provider: 'OpenAI' },
    { name: 'DeepSeek V3 (OpenRouter)', provider: 'DeepSeek' },
    { name: 'Gemini 2.0 Flash (OpenRouter)', provider: 'Google' },
  ];

  // Live Typewriter Effect for Greetings in English
  const typewriterPhrases = [
    'Welcome to AI & Blockchain Agricultural Marketplace.',
    'AI proves crop quality, grade & purity score.',
    'Farmer sets minimum reserve price.',
    'Buyers compete in live open auctions.',
    'Blockchain verifies transactions & tracks supply chain on-chain.',
  ];

  const [displayedText, setDisplayedText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = typewriterPhrases[phraseIdx];

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
          if (displayedText.length + 1 === currentPhrase.length) {
            setTimeout(() => setIsDeleting(true), 2400);
          }
        } else {
          setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
          if (displayedText.length - 1 === 0) {
            setIsDeleting(false);
            setPhraseIdx((prev) => (prev + 1) % typewriterPhrases.length);
          }
        }
      },
      isDeleting ? 30 : 65
    );

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIdx]);

  // Clean Text-Only Suggestion Pills (NO ICONS, NO ARABIC)
  const suggestionPills = [
    { text: 'How is my store doing?' },
    { text: 'What is running out?' },
    { text: 'Orders to ship' },
    { text: 'Best sellers' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const gKey = localStorage.getItem('GEMINI_API_KEY');
      const oKey = localStorage.getItem('OPENROUTER_API_KEY');
      setHasKey(!!(gKey || oKey));
    }
  }, [apiKeyModal]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceRecord = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      // Fallback voice recording simulation
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        handleSend('Analyze current crop quality score and live bids.');
      }, 2500);
    }
  };

  const fetchOpenRouterAPI = async (apiKey: string, modelSlug: string, query: string) => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://evermind.ai',
        'X-Title': 'Agricultural Marketplace AI',
      },
      body: JSON.stringify({
        model: modelSlug,
        messages: [
          {
            role: 'system',
            content:
              'You are an AI assistant for a smart Agricultural Marketplace powered by AI & Blockchain. The platform enables farmers to verify crop quality with AI, set minimum reserve prices, list crops in competitive live auctions for buyers, and track transactions on-chain from farm to sale. Answer strictly in English, concisely, professionally, and formatted with Markdown.',
          },
          ...messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
          { role: 'user', content: query },
        ],
      }),
    });
    return await res.json();
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || prompt;
    const currentImg = selectedImage;

    if (!query.trim() && !currentImg) return;

    const userMsg: Message = {
      sender: 'user',
      text: query || 'Analyze attached crop image',
      image: currentImg || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setPrompt('');
    setSelectedImage(null);
    setIsLoading(true);

    const openRouterKey = typeof window !== 'undefined' ? localStorage.getItem('OPENROUTER_API_KEY') : null;
    const geminiKey = typeof window !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY') : null;

    let aiText = '';

    try {
      // 1. Direct Gemini API if selected
      if (geminiKey && model === 'Gemini 1.5 Flash') {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `System: You are an AI assistant for an AI & Blockchain Agricultural Marketplace. Answer strictly in English. User query: ${query}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await res.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiText = data.candidates[0].content.parts[0].text;
        }
      }

      // 2. OpenRouter API for all OpenRouter models
      if (!aiText && openRouterKey) {
        let modelSlug = 'openai/gpt-4o-mini';
        if (model.includes('Claude')) modelSlug = 'anthropic/claude-3.5-sonnet';
        else if (model.includes('GPT')) modelSlug = 'openai/gpt-4o-mini';
        else if (model.includes('DeepSeek')) modelSlug = 'deepseek/deepseek-chat';
        else if (model.includes('Gemini')) modelSlug = 'google/gemini-2.0-flash-exp:free';

        let data = await fetchOpenRouterAPI(openRouterKey, modelSlug, query);

        if (data.choices?.[0]?.message?.content) {
          aiText = data.choices[0].message.content;
        } else {
          // Retry with GPT-4o Mini if model endpoint busy
          data = await fetchOpenRouterAPI(openRouterKey, 'openai/gpt-4o-mini', query);
          if (data.choices?.[0]?.message?.content) {
            aiText = data.choices[0].message.content;
          }
        }
      }
    } catch (err: any) {
      console.error('Live API Call Error:', err);
    }

    // 3. Fallback English Intelligence if no API key or API call returned empty
    if (!aiText) {
      if (currentImg) {
        aiText = `📸 **AI Crop Vision Analysis**:\n- **Crop Type**: Premium Organic Tomatoes\n- **Quality Assessment**: Grade A+ (Purity Score: 98.6%)\n- **Health Status**: Optimal moisture (18.4%), zero disease detected.\n- **Recommended Farmer Reserve Price**: $1,250 / Ton\n- **Smart Contract Hash**: \`0x7a8f...92c1\` ready for live auction listing!`;
      } else if (query.toLowerCase().includes('how is my store doing')) {
        aiText = `📊 **Store Health Summary**: Your total revenue reached **$84.3K** (+18.2% vs last month). You have processed **1,284 orders** with an average order value of **$66**. Conversion rate is high at **4.9%**.`;
      } else if (query.toLowerCase().includes('running out')) {
        aiText = `⚠️ **Low Stock Alert**: 2 items require restock soon:\n- *Texture Keywords Pack Vol. 2* (4 units left)\n- *Spider-Man Presets & Artwork* (2 units left).`;
      } else if (query.toLowerCase().includes('orders to ship')) {
        aiText = `🚚 **Pending Shipments**: You have **6 pending digital fulfillment orders** ready for dispatch, including order #ORD-2026-1000 ($1,095.15) for James Garcia.`;
      } else if (query.toLowerCase().includes('best sellers')) {
        aiText = `⭐ **Top Performing Assets**:\n1. *AI Prompt Engineering Guide* ($19.00 - 412 sales)\n2. *AI Automation Workflow Kit* ($49.00 - 289 sales)\n3. *Figma Glass Toggle Kit* ($15.00 - 198 sales).`;
      } else if (query.toLowerCase().includes('crop') || query.toLowerCase().includes('quality')) {
        aiText = `🌾 **AI Crop Verification Report**:\n- **Batch**: Organic Premium Tomatoes (#CR-9042)\n- **AI Quality Grade**: Grade A+ (98.6% Purity Score)\n- **Farmer Reserve Price**: $1,200 / Ton\n- **Highest Auction Bid**: $1,580 / Ton (+31.6% above reserve)\n- **Blockchain Hash**: \`0x7a8f...92c1\` (Verified On-Chain).`;
      } else if (query.toLowerCase().includes('auction') || query.toLowerCase().includes('bid')) {
        aiText = `🔨 **Active Live Crop Auctions**:\n1. **Sukari Dates Premium** (5 Tons) - Reserve: $4,500 | Top Bid: **$6,200** | Time Left: 45m\n2. **Pure Wheat Lot** (12 Tons) - Reserve: $3,200 | Top Bid: **$4,100** | Time Left: 2h\n3. **Jolani Olives** (3 Tons) - Reserve: $2,800 | Top Bid: **$3,450** | Time Left: 3h`;
      } else if (query.toLowerCase().includes('blockchain') || query.toLowerCase().includes('track')) {
        aiText = `🔗 **On-Chain Blockchain Traceability**:\n- **Tx Hash**: \`0x92f8...41a8\`\n- **Source Farm**: Palm Valley Farm - Al Kharj\n- **Quality Hash**: IPFS Permanent Hash Verified\n- **Transfer Date**: Aug 16, 2026\n- **Shipment Status**: Cold storage transport in transit with real-time GPS.`;
      } else {
        aiText = `I have analyzed your query regarding "${query}" using **${model}**.\nTotal revenue is up +18.2% this month with 1,284 completed orders. All systems are running smoothly!`;
      }
    }

    const aiMsg: Message = {
      sender: 'ai',
      text: aiText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '620px',
        background: '#F5F7F8',
        borderRadius: '30px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.02)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", sans-serif',
      }}
    >
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageSelect}
      />

      {/* TOP AI HEADER BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '16px',
        }}
      >
        {/* Model Selector Box with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '10px',
              background: '#FFFFFF',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
            }}
          >
            <HiOutlineCpuChip size={18} color="#111827" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{model}</span>
            <HiOutlineChevronDown size={14} color="#6D6E6E" />
          </button>

          {showModelDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '44px',
                left: 0,
                zIndex: 300,
                width: '240px',
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                border: '1px solid #E5E7EB',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {availableModels.map((m) => (
                <button
                  key={m.name}
                  onClick={() => {
                    setModel(m.name);
                    setShowModelDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: model === m.name ? '#F9FAFB' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#111827',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: '10px', color: '#6B7280' }}>{m.provider}</div>
                  </div>
                  {model === m.name && <HiOutlineCheck size={16} color="#111827" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls: API Key, History, New Chat */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setApiKeyModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '36px',
              padding: '0 14px',
              borderRadius: '10px',
              background: '#E6E8DD',
              color: '#111827',
              border: '1px solid #D4D7C8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            }}
          >
            <HiOutlineKey size={14} color="#111827" />
            <span>{hasKey ? 'API Key Active ✓' : 'Add your API key for the demo'}</span>
          </button>

          <button
            title="Chat History"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <HiOutlineClock size={16} color="#111827" />
          </button>

          <button
            onClick={() => setMessages([])}
            title="New Chat"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <HiOutlinePlus size={16} color="#111827" />
          </button>
        </div>
      </div>

      {/* CENTER CHAT DISPLAY / HERO AVATAR SECTION */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: messages.length === 0 ? 'center' : 'flex-start',
          padding: '20px 0',
          overflowY: 'auto',
          maxHeight: '440px',
          gap: '16px',
        }}
      >
        {messages.length === 0 ? (
          /* Landing Hero AI State */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <GlassBlob3D />

            {/* LIVE TYPEWRITER ANIMATED GREETING TEXT IN ENGLISH */}
            <div style={{ minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h2
                style={{
                  fontSize: '26px',
                  fontWeight: 600,
                  color: '#111827',
                  margin: 0,
                  letterSpacing: '-0.3px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span>{displayedText}</span>
                <span className="typewriter-cursor">|</span>
              </h2>
            </div>
          </div>
        ) : (
          /* Live Chat Conversation Thread */
          <div style={{ width: '100%', maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '14px 18px',
                    borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    background: msg.sender === 'user' ? '#111827' : '#FFFFFF',
                    color: msg.sender === 'user' ? '#FFFFFF' : '#111827',
                    boxShadow: msg.sender === 'ai' ? '0 2px 12px rgba(0,0,0,0.03)' : 'none',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Crop Attachment"
                      style={{
                        maxWidth: '220px',
                        maxHeight: '160px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                      }}
                    />
                  )}

                  <div>{msg.text}</div>

                  <div
                    style={{
                      fontSize: '11px',
                      opacity: 0.6,
                      marginTop: '2px',
                      textAlign: 'right',
                    }}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                <div
                  style={{
                    padding: '12px 18px',
                    borderRadius: '20px 20px 20px 4px',
                    background: '#FFFFFF',
                    color: '#111827',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Thinking... ✨
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* BOTTOM PROMPT INPUT & CONTROLS */}
      <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Selected Image Thumbnail Preview */}
        {selectedImage && (
          <div
            style={{
              alignSelf: 'flex-start',
              position: 'relative',
              display: 'inline-block',
            }}
          >
            <img
              src={selectedImage}
              alt="Selected Preview"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '2px solid #E6E8DD',
              }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '20px',
                height: '20px',
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
              <HiOutlineXMark size={14} color="#FFFFFF" />
            </button>
          </div>
        )}

        {/* Live Voice Recording Indicator */}
        {isRecording && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#EF4444',
              paddingLeft: '12px',
            }}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} className="pulse-dot" />
            <span>Listening to voice recording... Speak now</span>
          </div>
        )}

        {/* Square Rounded Input Bar */}
        <div
          style={{
            width: '100%',
            minHeight: '56px',
            borderRadius: '16px',
            background: '#FFFFFF',
            padding: '4px 8px 4px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Image Upload Paperclip Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload Crop Image"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
          >
            <HiOutlinePaperClip size={20} color="#6D6E6E" />
          </button>

          {/* Voice Recording Microphone Button */}
          <button
            onClick={handleVoiceRecord}
            title="Record Voice Prompt"
            style={{
              border: 'none',
              background: isRecording ? '#FEE2E2' : 'transparent',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s',
            }}
          >
            <HiOutlineMicrophone size={20} color={isRecording ? '#EF4444' : '#6D6E6E'} />
          </button>

          <input
            type="text"
            placeholder="Ask me anything or record voice..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: '#111827',
              background: 'transparent',
            }}
          />

          {/* SQUARE SOLID BLACK SEND BUTTON */}
          <button
            onClick={() => handleSend()}
            title="Send Message"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              border: 'none',
              background: '#111827',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(17, 24, 39, 0.25)',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            <FaTelegramPlane size={18} color="#FFFFFF" style={{ marginLeft: '-2px' }} />
          </button>
        </div>

        {/* CLEAN TEXT-ONLY SUGGESTION PILLS ROW (NO ICONS) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          {suggestionPills.map((pill, i) => (
            <button
              key={i}
              onClick={() => handleSend(pill.text)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 18px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.04)',
                fontSize: '13px',
                fontWeight: 500,
                color: '#6D6E6E',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                transition: 'all 0.2s',
              }}
              className="suggestion-pill"
            >
              <span>{pill.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* API Key Modal matching exact design */}
      <ApiKeyModal isOpen={apiKeyModal} onClose={() => setApiKeyModal(false)} />

      <style jsx>{`
        @keyframes floatGlass {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-12px) rotate(2.5deg) scale(1.04);
          }
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
        }
        .glass-blob-anim {
          animation: floatGlass 4.5s ease-in-out infinite;
          filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.08));
          transition: all 0.3s ease;
        }

        @keyframes pulseDot {
          0% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.4; transform: scale(0.9); }
        }
        .pulse-dot {
          animation: pulseDot 2s infinite ease-in-out;
        }

        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .typewriter-cursor {
          display: inline-block;
          margin-left: 4px;
          color: #111827;
          font-weight: 400;
          animation: blinkCursor 0.8s infinite;
        }

        .suggestion-pill:hover {
          background-color: #E6E8DD !important;
          color: #111827 !important;
          border-color: #D4D7C8 !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
