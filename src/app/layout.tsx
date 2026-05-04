import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export const metadata: Metadata = {
  title: {
    default: 'Iron Slip | Forge Your Legacy ',
    template: '%s | Iron Slip | Forge Your Legacy',
  },
  description:
    'Forge the slip. Lock in your output. Evolve your avatar and extract premium physical and digital gear.',
  authors: [
    { name: 'Iron Slip | Forge Your Legacy', url: 'https://ironslip.com' },
  ],
  metadataBase: new URL('https://ironslip.com'),
  keywords: [
    'Iron Slip',
    'Performance Tracking',
    'Fitness Rewards',
    'Digital Operator',
    'Avatar Evolution',
    'Athletic Gear',
    'Staking Performance',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Iron Slip | Forge Your Legacy | Evolve You. Evolve Avatar.',
    description:
      'The ultimate performance forge. Build your slip, back your output, and win exclusive gear.',
    url: 'https://ironslip.com',
    siteName: 'Iron Slip | Forge Your Legacy',
    images: [
      {
        url: '/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'Iron Slip | Forge Your Legacy Interface',
      },
    ],
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#FFD300', // Iron Volt
          colorBackground: '#000000',
          colorInputBackground: '#09090b', // Zinc 950
          colorInputText: '#ffffff',
          colorTextOnPrimaryBackground: '#000000',
          borderRadius: '0px', // Forces that sharp tactical look
        },
        elements: {
          card: 'border border-white/10 shadow-none bg-black',
          navbar: 'hidden', // Simplifies the profile settings modal
          footer: 'hidden', // Removes "Powered by Clerk"
          scrollBox: 'scrollbar-hide',
          userButtonPopoverCard: 'border border-white/10 bg-black shadow-none',
          actionConfirmerPrimaryAction__confirm:
            'bg-iron-volt text-black font-bold uppercase italic',
        },
      }}
    >
      <html lang="en" className="bg-black scrollbar-hide">
        <body className="antialiased selection:bg-iron-volt selection:text-black overflow-hidden">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
