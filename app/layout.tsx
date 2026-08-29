import type { Metadata } from 'next';
import './globals.css';
import { ReownContextProvider } from '@/context/reown';
import { RoleSelectionModal } from '@/components/RoleSelectionModal';
import SmoothScroll from '@/components/SmoothScroll';
import AnalyticsErrorInterceptor from '@/components/AnalyticsErrorInterceptor';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Furrow Chain - Decentralized AI Agricultural Provenance on 0G Chain',
  description: 'Enterprise-grade decentralized agricultural marketplace. Verifiable crop provenance, AI-powered quality inspection, and smart contract escrow settlement on 0G Aristotle Network.',
  keywords: ['Agriculture', 'Blockchain', '0G Chain', 'AI Crop Grading', 'Smart Escrow', 'Supply Chain', 'DePIN'],
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Furrow Chain - AI-Powered Agriculture Marketplace on 0G Chain',
    description: 'Enterprise-grade decentralized agricultural marketplace. Verifiable crop provenance, AI-powered quality inspection, and smart contract escrow settlement on 0G Aristotle Network.',
    siteName: 'Furrow Chain',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'Furrow Chain Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Furrow Chain - AI-Powered Agriculture Marketplace on 0G Chain',
    description: 'Enterprise-grade decentralized agricultural marketplace. Verifiable crop provenance, AI-powered quality inspection, and smart contract escrow settlement on 0G Aristotle Network.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body suppressHydrationWarning>
        <AnalyticsErrorInterceptor />
        <ReownContextProvider>
          <SmoothScroll>
            <div className="ambient-bg">
              <div className="ambient-glow-1" />
              <div className="ambient-glow-2" />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <RoleSelectionModal />
              {children}
            </div>
          </SmoothScroll>
        </ReownContextProvider>
      </body>
    </html>
  );
}
