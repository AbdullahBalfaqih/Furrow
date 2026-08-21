import type { Metadata } from 'next';
import './globals.css';
import { ReownContextProvider } from '@/context/reown';
import { RoleSelectionModal } from '@/components/RoleSelectionModal';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: 'Furrow Chain - AI-Powered Agriculture Marketplace on 0G Chain',
  description: 'Get early access, verifiable crop provenance, and AI quality assessment.',
  openGraph: {
    title: 'Furrow Chain - AI-Powered Agriculture Marketplace on 0G Chain',
    description: 'Get early access, verifiable crop provenance, and AI quality assessment.',
    images: ['https://api.builder.io/api/v1/image/assets/TEMP/63a5b1ea2b5202f65fb6af8191cb77fa423282e9?width=72'],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
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
