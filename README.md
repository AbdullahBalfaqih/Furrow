# Furrow Chain Platform

Decentralized Agricultural AI Provenance and Smart Contract Escrow Platform on 0G Aristotle Network.

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Problem Statement](#problem-statement)
- [Value Proposition](#value-proposition)
- [Primary Use Cases](#primary-use-cases)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Smart Contract Specifications](#smart-contract-specifications)
- [Installation and Setup](#installation-and-setup)
- [Security and Compliance](#security-and-compliance)
- [License and Governance](#license-and-governance)

---

## Executive Summary

Furrow Chain is an enterprise-grade decentralized agriculture platform designed to bring cryptographic transparency, AI quality verification, and automated escrow settlements to global food supply chains. Built on the 0G Aristotle Network, Furrow Chain eliminates supply chain opacity by storing immutable harvest provenance records, automating crop grading via 0G Computer Vision models, and securing buyer-seller transactions through trustless smart contract escrows.

---

## Problem Statement

Traditional agricultural supply chains face systemic inefficiencies that cost producers and enterprise buyers billions of dollars annually:

1. **Supply Chain Opacity**: Buyers lack reliable methods to verify harvest origin, GPS farm location, organic certifications, and storage history.
2. **Quality Discrepancies**: Manual crop inspection leads to inconsistent grading, dispute delays, and pricing fraud.
3. **Escrow and Payment Delays**: International commodity payments take weeks due to intermediary banking clearance, currency conversions, and manual bill-of-lading processing.
4. **Middleman Exploitation**: Smallholder farmers receive a fraction of final retail values due to multi-layered brokers and commission fees.

---

## Value Proposition

Furrow Chain addresses supply chain friction through a unified decentralized protocol:

- **Cryptographic Provenance**: Every crop batch is assigned an immutable 0G Storage hash containing farm origin metadata, harvest timestamp, and soil inspection certificates.
- **Automated AI Quality Inspection**: Integrated 0G AI models evaluate high-resolution crop imagery to calculate defect rates, grade classification (e.g., Grade A+), and shelf-life estimations.
- **Smart Contract Escrows**: Payment funds are locked in 0G Chain smart escrows and released automatically upon verified logistics delivery and buyer confirmation.
- **Zero Intermediary Fees**: Farmers connect directly with global buyers, maximizing net margins and reducing procurement costs.
- **Verifiable Logistics**: Real-time tracking bridges physical transport with on-chain milestone updates.

---

## Primary Use Cases

### 1. Smallholder Farmers and Agricultural Cooperatives
Farmers publish harvest listings directly to the global marketplace, set minimum reserve prices, and receive immediate escrow payouts upon verified freight dispatch.

### 2. Wholesale Buyers and Food Exporters
Enterprise importers browse verified crop batches, inspect AI quality scorecards, review immutable farm origin hashes, and lock payments in safe on-chain escrows.

### 3. Quality Inspectors and Logistics Operators
Authorized inspectors upload batch evaluation reports to 0G Storage, while logistics providers trigger automated escrow milestones via cryptographic proof of delivery.

---

## System Architecture

```
                                +---------------------------+
                                |      Web Client App       |
                                |  (Next.js 16 / React 19)  |
                                +-------------+-------------+
                                              |
                     +------------------------+------------------------+
                     |                                                 |
        +------------v------------+                       +------------v------------+
        |   0G Aristotle Network  |                       |       0G AI & Storage   |
        |  Smart Contract Escrow  |                       |  Storage Hashes & CV AI |
        +------------+------------+                       +------------+------------+
                     |                                                 |
                     +------------------------+------------------------+
                                              |
                                +-------------v-------------+
                                |  Supabase Cloud Database  |
                                |   Postgres DDL & Storage  |
                                +---------------------------+
```

---

## Technology Stack

### Core Frameworks & Runtime
- **Next.js 16**: App Router architecture with Turbopack build engine.
- **React 19**: Server Component architecture and client-side hooks.
- **TypeScript 5**: Strict type safety across contracts, API routes, and UI components.

### Blockchain & Decentralized Storage
- **0G Aristotle Network**: Primary EVM-compatible layer 1 blockchain.
- **0G Storage SDK**: Decentralized storage protocol for immutable harvest provenance data.
- **Wagmi v3 & Viem v2**: Type-safe Ethereum interface and contract interaction logic.
- **Reown AppKit (Web3Modal)**: Multi-wallet integration support (MetaMask, Coinbase, WalletConnect).
- **Solidity 0.8.28**: Smart contract logic compiled with Hardhat.

### Design System & Animation Engine
- **Vanilla CSS Tokens**: Scalable design token architecture without third-party utility clutter.
- **GSAP & ScrollTrigger**: Hardware-accelerated entrance animations and card reveal physics.
- **Lenis Smooth Scroll**: Inertial physics scrolling mimicking native macOS desktop software.
- **Framer Motion**: State transitions, modal animations, and dynamic text rotators.
- **WebGL Shaders (React Bits Aurora)**: Custom WebGL shader canvases for ambient dynamic backgrounds.

### Database & Communication
- **Supabase Postgres**: Cloud database storing user profiles, active auctions, and audit logs.
- **Nodemailer**: Transactional email dispatch service configured with DKIM and anti-spam compliance.

---

## Directory Structure

```
furrowchain-platform/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── verify/
│   │   │       └── route.ts         # Wallet authentication verification
│   │   ├── marketplace/
│   │   │   └── listings/
│   │   │       └── route.ts         # Active auction & crop listings endpoint
│   │   ├── users/
│   │   │   └── profile/
│   │   │       └── route.ts         # Merchant & buyer profile management
│   │   └── waitlist/
│   │       └── route.ts             # Email waitlist & card generator route
│   ├── dashboard/
│   │   └── page.tsx                 # Analytics & farmer management dashboard
│   ├── marketplace/
│   │   └── page.tsx                 # Crop marketplace, filters & bidding UI
│   ├── profile/
│   │   └── page.tsx                 # Merchant credentials & activity ledger
│   ├── favicon.ico
│   ├── globals.css                  # Core CSS variables, layout, & media queries
│   ├── layout.tsx                   # Root layout, providers, & Lenis wrapper
│   └── page.tsx                     # Landing page with interactive hero
├── components/
│   ├── Aurora.tsx                   # WebGL shader canvas component
│   ├── CountdownTimer.tsx           # Platform launch countdown clock
│   ├── FaqSection.tsx               # Interactive FAQ accordion
│   ├── FeaturesSection.tsx          # GSAP-animated 3-column feature grid
│   ├── Footer.tsx                   # Responsive enterprise footer
│   ├── Navbar.tsx                   # Floating glassmorphism navigation bar
│   ├── PricingSection.tsx           # Interactive pricing tier calculator
│   ├── ReownWalletModal.tsx         # Multi-wallet connection modal
│   ├── RoleSelectionModal.tsx       # Onboarding merchant/buyer role prompt
│   ├── Sidebar.tsx                  # Fixed left aurora banner panel
│   ├── SmoothScroll.tsx             # Lenis smooth scroll wrapper
│   └── WaitlistForm.tsx             # Interactive email waitlist input
├── context/
│   └── reown.tsx                    # Wagmi and React Query context provider
├── contracts/
│   └── CropRegistry.sol             # Smart contract for crop batch registration & escrow
├── lib/
│   ├── supabase.ts                  # Supabase client initializer
│   └── security/
│       └── sanitize.ts              # XSS and input sanitization utilities
├── public/
│   ├── hero.png                     # Pixel-art cloud hero backdrop asset
│   └── market.png                   # Pixel-art marketplace header asset
├── scripts/
│   ├── execute-0g-activity.js       # 0G testnet activity execution script
│   ├── test-cybersecurity.js        # Automated penetration testing suite
│   └── verify-supabase-cloud.js     # Supabase DDL integrity checker
├── hardhat.config.js                # Hardhat network & compiler setup
├── next.config.ts                   # Next.js configuration settings
├── package.json                     # Dependency manifests and scripts
├── tsconfig.json                    # TypeScript compiler configuration
└── README.md                        # Technical documentation and specifications
```

---

## Smart Contract Specifications

The primary smart contract, `CropRegistry.sol`, governs batch registration and escrow settlement logic:

```solidity
// Key functions defined in CropRegistry.sol
function registerCropBatch(
    string memory _batchId,
    string memory _cropType,
    uint256 _quantity,
    string memory _storageHash
) external returns (bytes32);

function lockEscrowFunds(bytes32 _batchHash) external payable;

function releaseEscrow(bytes32 _batchHash) external;
```

---

## Installation and Setup

### Prerequisites

- **Node.js**: Version 20.0.0 or higher
- **npm**: Version 10.0.0 or higher
- **Git**: Installed locally

### Step 1: Clone Repository

```bash
git clone https://github.com/AbdullahBalfaqih/Furrow.git
cd Furrow
```

### Step 2: Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory and define the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key
GMAIL_USER=733537683a@gmail.com
GMAIL_APP_PASS=your-gmail-app-password
```

### Step 4: Run Development Server

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Step 5: Production Build

```bash
npm run build
npm run start
```

---

## Security and Compliance

Furrow Chain adheres to security standards across all layers:

1. **Input Sanitization**: Client and server routes utilize `lib/security/sanitize.ts` to neutralize XSS, SQL injection, and payload manipulation attacks.
2. **Automated Penetration Testing**: Executing `scripts/test-cybersecurity.js` runs automated vulnerability scans against API routes, CORS rules, and rate limits.
3. **Smart Contract Safety**: Contracts follow OpenZeppelin standards with `ReentrancyGuard` and strict access control modifiers (`onlyOwner`, `onlyBuyer`).

---

## License and Governance

Repository: [https://github.com/AbdullahBalfaqih/Furrow](https://github.com/AbdullahBalfaqih/Furrow)

Copyright 2026 Furrow Chain LLC. All Rights Reserved.  
Distributed under the Enterprise Commercial License. For inquiry regarding protocol integration, contact `support@furrowchain.com`.
