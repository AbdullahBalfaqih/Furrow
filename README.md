# Furrow Chain Platform

Enterprise-Grade Decentralized Agricultural AI Provenance and Smart Escrow Settlement Protocol on 0G Aristotle Network.

Repository: [https://github.com/AbdullahBalfaqih/Furrow](https://github.com/AbdullahBalfaqih/Furrow)

---

## Executive Summary

Furrow Chain is a decentralized agriculture protocol designed to eliminate opacity, grading fraud, and payment delays in global commodity trading. Powered by the 0G Aristotle Network, Furrow Chain combines 0G Computer Vision AI for automated crop quality inspection, 0G Storage for immutable harvest provenance, and smart contract escrows for trustless payment settlements.

---

## Problem Statement

Traditional agricultural supply chains suffer from systemic inefficiencies, fraud, and payment friction that hurt producers and enterprise buyers globally:

| Vulnerability Area | Core Industry Challenge | Root Cause & Systemic Impact |
| :--- | :--- | :--- |
| **Supply Chain Opacity** | Fraudulent origins and unverified certification labels | Intermediaries alter provenance data; buyers lack cryptographic proof of harvest origin and soil audit history |
| **Crop Quality Discrepancies** | Inconsistent grading and subjective inspection bias | Manual visual inspection leads to dispute delays, rejected shipments, and financial losses for food exporters |
| **Escrow & Settlement Delays** | 2 to 4 week international payment clearances | Traditional banking wire transfers and paper bills of lading delay liquidity and working capital for producers |
| **Intermediary Exploitation** | Excessive broker markups and commission fees | Multi-layered brokers reduce smallholder farmer margins to under 40% of final retail commodity value |

---

## Core Platform Capabilities

| Capability | Architecture Layer | Functional Benefit |
| :--- | :--- | :--- |
| **0G AI Quality Inspector** | 0G Compute & CV Models | Instant defect detection, shelf-life calculation, and grading scorecards |
| **On-Chain Provenance** | 0G Storage Protocol | Immutable harvest certificates, farm GPS coordinates, and soil audit trails |
| **Smart Escrow Settlements** | Solidity (`CropRegistry.sol`) | Cryptographic fund locking with automated delivery milestone payouts |
| **Direct Wholesale Market** | Next.js 16 & Wagmi v3 | Direct order book between producers and enterprise buyers with zero middleman fees |
| **Verifiable Logistics** | Web3 Event Oracles | Real-time transit milestone updates with cryptographic proof of delivery |

---

## Stakeholder Use Cases

| Stakeholder Role | Primary Workflow | Key Advantage |
| :--- | :--- | :--- |
| **Smallholder Farmers & Co-ops** | Mint batch provenance, list crops, set reserve prices | Immediate payment liquidity and direct global market reach |
| **Wholesale Importers & Exporters** | Review AI quality scorecards, verify provenance, lock escrow | Complete protection against fraud and guaranteed quality delivery |
| **Quality Inspectors & Logistics** | Upload digital inspection proofs to 0G Storage | Tamper-proof inspection trails and automated milestone triggers |

---

## Technology Stack

| Architecture Layer | Technology | Primary Role |
| :--- | :--- | :--- |
| **Blockchain L1** | 0G Aristotle Network | Smart contract execution and escrow settlement engine |
| **Decentralized Storage** | 0G Storage SDK | Storage of harvest provenance certificates and AI inspection data |
| **Frontend Engine** | Next.js 16 (App Router) | High-performance server rendering with Turbopack execution |
| **User Interface & Motion** | Vanilla CSS, GSAP, Lenis | Hardware-accelerated entrance animations and MacBook-style smooth scroll |
| **Web3 Connector** | Wagmi v3, Viem v2, Reown AppKit | Multi-wallet integration supporting MetaMask, Coinbase, and WalletConnect |
| **Database & Analytics** | Supabase Cloud Postgres | Secure storage of user profiles, active auction logs, and audit trails |

---

## Repository Structure

```
Furrow/
├── app/
│   ├── api/
│   │   ├── auth/verify/route.ts      # Wallet authentication verification
│   │   ├── marketplace/listings/     # Active auction & listing endpoint
│   │   ├── users/profile/route.ts    # User profile management route
│   │   └── waitlist/route.ts         # Waitlist & confirmation email route
│   ├── dashboard/page.tsx            # Farmer analytics & inventory dashboard
│   ├── marketplace/page.tsx          # Crop marketplace, filters & bidding UI
│   ├── profile/page.tsx              # Merchant credentials & transaction ledger
│   ├── globals.css                   # Design tokens, layout rules, & media queries
│   ├── layout.tsx                    # Root layout, Web3 providers, & Lenis wrapper
│   └── page.tsx                      # Landing page with interactive hero
├── components/
│   ├── Aurora.tsx                    # WebGL shader canvas component
│   ├── CountdownTimer.tsx            # Launch countdown clock
│   ├── FaqSection.tsx                # Interactive FAQ accordion
│   ├── FeaturesSection.tsx           # GSAP-animated 3-column feature grid
│   ├── Footer.tsx                    # Docked enterprise footer
│   ├── Navbar.tsx                    # Floating glassmorphism navigation bar
│   ├── PricingSection.tsx            # Interactive pricing tier calculator
│   ├── ReownWalletModal.tsx          # Multi-wallet modal interface
│   ├── RoleSelectionModal.tsx        # Merchant/buyer onboarding role modal
│   ├── Sidebar.tsx                   # Fixed aurora banner panel
│   ├── SmoothScroll.tsx              # Lenis smooth scroll provider
│   └── WaitlistForm.tsx              # Waitlist input component
├── contracts/
│   └── CropRegistry.sol              # Smart contract for crop registration & escrow
├── lib/
│   ├── supabase.ts                   # Supabase client initializer
│   └── security/sanitize.ts          # XSS and payload sanitization helper
├── public/
│   ├── hero.png                      # Pixel-art cloud hero backdrop asset
│   └── market.png                    # Pixel-art marketplace background asset
├── scripts/
│   ├── execute-0g-activity.js        # 0G testnet transaction script
│   ├── test-cybersecurity.js         # Automated security penetration suite
│   └── verify-supabase-cloud.js      # Supabase DDL integrity verification
├── hardhat.config.js                 # Hardhat network & compiler configuration
├── next.config.ts                    # Next.js configuration settings
├── package.json                      # Dependency manifest and scripts
├── tsconfig.json                     # TypeScript compiler configuration
└── README.md                         # Protocol documentation and technical specs
```

---

## Smart Contract Architecture

The primary smart contract, `CropRegistry.sol`, enforces automated batch registration and escrow rules:

| Function Name | Input Parameters | Access Control | Functional Purpose |
| :--- | :--- | :--- | :--- |
| `registerCropBatch` | `batchId`, `cropType`, `quantity`, `storageHash` | Registered Farmer | Registers crop lot with 0G provenance hash |
| `lockEscrowFunds` | `batchHash` (Payable ETH/Native) | Buyer | Locks transaction payment in smart escrow |
| `releaseEscrow` | `batchHash` | Buyer / Oracle | Releases escrow funds to seller upon verified delivery |

---

## Installation & Deployment Guide

| Command Step | Action | Execution Syntax |
| :--- | :--- | :--- |
| **1. Clone Repository** | Download source code | `git clone https://github.com/AbdullahBalfaqih/Furrow.git` |
| **2. Navigate Directory** | Change working path | `cd Furrow` |
| **3. Install Dependencies** | Install core packages | `npm install --legacy-peer-deps` |
| **4. Environment Setup** | Configure API keys | `cp .env.example .env.local` |
| **5. Run Dev Server** | Launch local instance | `npm run dev` |
| **6. Production Build** | Compile bundle | `npm run build && npm run start` |

---

## Security & Compliance Architecture

| Audit Area | Implementation Details | Security Status |
| :--- | :--- | :--- |
| **Input Sanitization** | `lib/security/sanitize.ts` sanitizes all input strings against XSS & SQLi | Passed |
| **Penetration Testing** | Automated test suite in `scripts/test-cybersecurity.js` scans API endpoints | Passed |
| **Smart Contract Auditing** | OpenZeppelin `ReentrancyGuard` and strict role modifiers | Verified |

---

## License & Contact

Copyright 2026 Furrow Chain LLC. All Rights Reserved.  
Distributed under the Enterprise Commercial License. For protocol inquiries, visit [https://github.com/AbdullahBalfaqih/Furrow](https://github.com/AbdullahBalfaqih/Furrow).
