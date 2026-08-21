'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiArrowRight, HiChatBubbleLeftRight } from 'react-icons/hi2';

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<'general' | 'ai' | 'setup' | 'security'>('general');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: 'general', label: 'General' },
    { id: 'ai', label: 'AI & Provenance' },
    { id: 'setup', label: 'Setup & integrations' },
    { id: 'security', label: 'Security and privacy' },
  ];

  const faqData: Record<string, Array<{ question: string; answer: string }>> = {
    general: [
      {
        question: 'Does Furrow Chain support multiple currencies & tokens?',
        answer: 'Yes! Furrow Chain supports multi-currency settlement and tokenized crop assets natively, integrating real-time price feeds for seamless global trade settlements.',
      },
      {
        question: 'Can I track crop shipments and escrow status in real-time?',
        answer: 'Absolutely. Every batch of crops registered on Furrow Chain is linked to an automated smart escrow contract that tracks GPS transit and releases funds upon AI verification.',
      },
      {
        question: 'Who is Furrow Chain built for?',
        answer: 'Furrow Chain is designed for agricultural cooperatives, wholesale food exporters, AI quality inspectors, and decentralized commodity traders seeking verifiable provenance.',
      },
      {
        question: 'Do I need Web3 experience to use the platform?',
        answer: 'Not at all. We support Web2 social logins and abstract gas fees, allowing farmers and trade partners to operate without managing private keys.',
      },
      {
        question: 'How does Furrow Chain handle international trade regulations?',
        answer: 'Our smart contracts generate automated compliance certificates and phytosanitary audit trails aligned with global export and customs standards.',
      },
      {
        question: 'Can multiple stakeholders approve a single trade escrow?',
        answer: 'Yes, multi-signature approvals allow buyers, independent inspectors, and logistics carriers to co-verify shipment milestones before funds release.',
      },
      {
        question: 'What are the transaction fees on Furrow Chain?',
        answer: 'Transactions leverage 0G High-Throughput Layer-1 for sub-cent gas fees and near-instant settlement finality.',
      },
      {
        question: 'How do I get started with onboarding my agricultural cooperative?',
        answer: 'You can sign up for a workspace in under 2 minutes or request a customized onboarding session with our enterprise deployment team.',
      },
    ],
    ai: [
      {
        question: 'What insights does Furrow AI surface automatically?',
        answer: 'Our 0G Computer Vision AI scans uploaded crop imagery for defect scoring, ripeness indexing, weight estimation, and automatic grade classification.',
      },
      {
        question: 'How accurate are the crop quality forecasts?',
        answer: 'Our AI models are trained on extensive multi-spectral agricultural datasets, achieving over 98.4% precision in multi-class crop grading and spoilage prediction.',
      },
      {
        question: 'How is AI verification stored on 0G Storage Nodes?',
        answer: 'Every AI evaluation generates a cryptographic Merkle proof that is stored immutably on 0G Storage Nodes, enabling anyone to verify quality claims onchain.',
      },
      {
        question: 'Can I upload drone or satellite imagery for batch audits?',
        answer: 'Yes! We support batch uploads of multi-spectral drone and satellite imagery to verify crop health and yield estimations prior to harvest.',
      },
      {
        question: 'What pre-trained crop models are available out-of-the-box?',
        answer: 'We feature pre-trained models for grains, specialty coffee, cocoa beans, fresh fruits, vegetables, and oilseeds.',
      },
      {
        question: 'Can enterprises train custom computer vision models?',
        answer: 'Enterprise plans include dedicated AI model fine-tuning on your proprietary crop datasets hosted securely on private 0G Storage Nodes.',
      },
    ],
    setup: [
      {
        question: 'How do I integrate Furrow Chain with existing ERP systems?',
        answer: 'We provide RESTful APIs, Webhooks, and GraphQL endpoints to effortlessly sync inventory, purchase orders, and logistics state with SAP, Oracle, or custom ERPs.',
      },
      {
        question: 'Can I customize smart contract escrow conditions?',
        answer: 'Yes! Escrow triggers can be customized for IoT temperature thresholds, delivery timeframes, quality grade minimums, or multi-signature buyer approvals.',
      },
      {
        question: 'Does Furrow Chain support IoT sensor hardware integration?',
        answer: 'We integrate out-of-the-box with Bluetooth and cellular IoT telemetry devices tracking humidity, temperature, and GPS location during transit.',
      },
      {
        question: 'Is there an SDK available for mobile application developers?',
        answer: 'We offer TypeScript, Python, and React Native SDKs for easy integration into custom mobile apps for field inspectors.',
      },
      {
        question: 'How long does standard ERP onboarding take?',
        answer: 'Standard webhooks can be connected in under 30 minutes, while full custom ERP syncs typically take 1–3 business days.',
      },
      {
        question: 'Can I export batch audit reports to PDF or CSV?',
        answer: 'Yes, comprehensive provenance certificates can be exported with one click or verified directly via public QR code scanners.',
      },
    ],
    security: [
      {
        question: 'How is trade data privacy protected onchain?',
        answer: 'Private batch details and sensitive pricing terms are secured using zero-knowledge hashes on 0G Storage, proving compliance without revealing proprietary trade secrets.',
      },
      {
        question: 'Are the smart escrow contracts audited?',
        answer: 'Yes, all smart escrow and registry contracts are verified on 0G Mainnet with automated formal verification checks and continuous penetration testing.',
      },
      {
        question: 'Where is stored crop data hosted?',
        answer: 'All raw inspection files and multi-spectral images are distributed across 0G Decentralized Storage Nodes with end-to-end encryption.',
      },
      {
        question: 'What happens if a dispute arises during escrow?',
        answer: 'Our platform includes built-in decentralized dispute resolution mechanisms backed by zero-knowledge inspection evidence logs.',
      },
      {
        question: 'How does role-based access control (RBAC) work?',
        answer: 'Workspaces feature granular RBAC permissions for inspectors, buyers, suppliers, finance managers, and logistics partners.',
      },
      {
        question: 'Is Furrow Chain GDPR and data sovereignty compliant?',
        answer: 'Yes, zero-knowledge proofs ensure data sovereignty and right-to-be-forgotten compliance without breaking blockchain immutability.',
      },
    ],
  };

  const currentFaqs = faqData[activeCategory] || [];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      className="faq-section-wrapper"
      style={{
        width: '100%',
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '60px 0 80px 0',
      }}
    >
      {/* SECTION HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '40px',
            fontWeight: 600,
            color: '#181E25',
            letterSpacing: '-1.4px',
            lineHeight: '1.2',
            margin: '0 0 12px 0',
          }}
        >
          Got questions?
          <br />
          We’ve got answers.
        </h2>
      </div>

      {/* MAKRO COMPACT BORDERLESS FAQ LAYOUT */}
      <div
        className="faq-main-wrapper"
        style={{
          display: 'flex',
          gap: '0',
          width: '100%',
          alignItems: 'flex-start',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* COMPACT ATTACHED SIDEBAR BOX - NO DARK BORDER */}
        <div
          className="faq-sidebar-box"
          style={{
            width: '210px',
            background: '#F5F4F0',
            borderRadius: '24px 0 0 24px',
            padding: '20px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flexShrink: 0,
            boxSizing: 'border-box',
            height: 'fit-content',
            position: 'sticky',
            top: '120px',
            zIndex: 10,
            border: 'none',
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className="sidebar-tab"
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setOpenIndex(0);
                }}
                style={{
                  width: '100%',
                  height: '44px',
                  border: 'none',
                  background: isActive ? '#FFFFFF' : 'transparent',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  borderRadius: '12px',
                  boxShadow: isActive ? '0 4px 14px rgba(24, 30, 37, 0.04)' : 'none',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  marginRight: isActive ? '-12px' : '0',
                  zIndex: isActive ? 12 : 1,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#181E25' : 'rgba(24, 30, 37, 0.6)',
                  }}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* RIGHT GRADIENT PANEL DIRECTLY CONNECTED TO SIDEBAR - NO DARK BORDER */}
        <div
          className="faq-right-panel"
          style={{
            flex: 1,
            background: 'linear-gradient(180deg, #F5F4F0 0%, #E6E8DD 100%)',
            borderRadius: '0 24px 24px 24px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxSizing: 'border-box',
            border: 'none',
          }}
        >
          {/* ACCORDION CARDS WITH NO DARK BORDER */}
          <div
            className="faq-accordion-list"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              width: '100%',
            }}
          >
            {currentFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="faq-card-item"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.015)',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      outline: 'none',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontSize: '17px',
                        fontWeight: 500,
                        color: '#181E25',
                        letterSpacing: '-0.3px',
                        lineHeight: '1.3',
                      }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      style={{
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <HiPlus size={18} color="#181E25" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p
                          style={{
                            fontFamily: 'var(--font-inter), sans-serif',
                            fontSize: '15px',
                            lineHeight: '1.6',
                            color: 'rgba(24, 30, 37, 0.65)',
                            margin: 0,
                            padding: '0 24px 20px 24px',
                          }}
                        >
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* BRAND CONTACT BANNER CARD - NO DARK BORDER */}
          <div
            className="faq-contact-card"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 244, 240, 0.9) 100%)',
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
              padding: '36px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '32px',
              boxSizing: 'border-box',
              backdropFilter: 'blur(10px)',
              marginTop: '4px',
            }}
          >
            <div
              className="banner-left-info"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '460px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '500px',
                  background: '#E6E8DD',
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#181E25',
                  width: 'fit-content',
                }}
              >
                <HiChatBubbleLeftRight size={14} color="#181E25" />
                <span>Let&apos;s connect</span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '26px',
                  fontWeight: 600,
                  color: '#181E25',
                  letterSpacing: '-0.8px',
                  margin: 0,
                  lineHeight: '1.25',
                }}
              >
                Still have questions? We&apos;re here to help.
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.55',
                  color: 'rgba(24, 30, 37, 0.65)',
                  margin: 0,
                }}
              >
                If you manage high transaction volumes, multiple entities, or require custom integrations, our team can tailor Furrow Chain to your needs.
              </p>

              {/* BRAND EXPANDING SLIDE CONTACT BUTTON */}
              <motion.button
                type="button"
                style={{
                  height: '56px',
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
                  minWidth: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '8px',
                }}
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
              >
                {/* ACCENT BADGE SLOWLY EXPANDS RIGHT ON HOVER */}
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
                    justifyContent: 'flex-end',
                    paddingRight: '14px',
                    boxSizing: 'border-box',
                  }}
                  variants={{
                    initial: { width: '48px' },
                    hover: { width: 'calc(100% - 8px)' },
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <HiArrowRight size={18} color="#181E25" />
                </motion.div>

                {/* BUTTON TEXT OVERLAY */}
                <motion.span
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    textAlign: 'center',
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '16px',
                    fontWeight: 500,
                    padding: '0 24px 0 40px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}
                  variants={{
                    initial: { color: '#FFFFFF' },
                    hover: { color: '#181E25' },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Contact us
                </motion.span>
              </motion.button>
            </div>

            {/* RIGHT ABSTRACT AI 0G GLASS GRAPHIC CONTAINER */}
            <div
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #181E25 0%, #2A3440 100%)',
                boxShadow: '0 12px 32px rgba(24, 30, 37, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                color: '#E6E8DD',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'rgba(230, 232, 221, 0.15)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(230, 232, 221, 0.25)',
                }}
              >
                <HiChatBubbleLeftRight size={28} color="#E6E8DD" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#E6E8DD',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                24/7 AI Support
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .faq-main-wrapper {
            flex-direction: column !important;
          }
          .faq-sidebar-box {
            width: 100% !important;
            border-radius: 20px 20px 0 0 !important;
            border: none !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            position: relative !important;
            top: 0 !important;
          }
          .faq-right-panel {
            border-radius: 0 0 20px 20px !important;
          }
          .sidebar-tab {
            width: auto !important;
            white-space: nowrap !important;
            margin-right: 0 !important;
          }
          .faq-contact-card {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
}
