'use client';

import React, { ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { AppKitNetwork, mainnet, arbitrum, sepolia, polygon, base } from '@reown/appkit/networks';

// 1. Setup QueryClient with retry options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// 2. Official Project ID
export const projectId = '67f34381083587b27e807ef27b042a51';

// 3. Define Official 0G Mainnet (Aristotle) Chain
export const zeroGMainnet: AppKitNetwork = {
  id: 16661,
  name: '0G Mainnet',
  nativeCurrency: {
    name: '0G',
    symbol: '0G',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://evmrpc.0g.ai'] },
  },
  blockExplorers: {
    default: { name: '0G ChainScan', url: 'https://chainscan.0g.ai' },
  },
};

// 4. Define 0G Galileo Testnet Chain
export const zeroGGalileo: AppKitNetwork = {
  id: 16602,
  name: '0G Galileo Testnet',
  nativeCurrency: {
    name: '0G',
    symbol: '0G',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://evmrpc-testnet.0g.ai'] },
  },
  blockExplorers: {
    default: { name: '0G ChainScan', url: 'https://chainscan-galileo.0g.ai' },
  },
};

// Supported Networks (0G Mainnet FIRST as primary production network)
export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  zeroGMainnet,
  zeroGGalileo,
  mainnet,
  sepolia,
  arbitrum,
  polygon,
  base,
];

// 5. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 6. Metadata Configuration
const metadata = {
  name: 'Furrow Chain',
  description: 'AI-Powered Blockchain Marketplace for Smallholder Farmers on 0G Mainnet',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

// 7. Initialize Official Reown AppKit (0G Mainnet as Default Network)
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: zeroGMainnet,
  projectId,
  metadata,
  features: {
    analytics: false,
    email: false,
    socials: [],
    emailShowWallets: false,
  },
  allWallets: 'SHOW',
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#1A1A17',
    '--w3m-border-radius-master': '8px',
  },
});

export function ReownContextProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
