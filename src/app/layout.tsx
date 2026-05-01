import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Iron Slip | Forge Your Legacy ',
    template: '%s | Iron Slip | Forge Your Legacy',
  },
  description:
    'Forge the slip. Lock in your output. Evolve your avatar and extract premium physical and digital gear.',
  authors: [
    { name: 'Iron Slip | Forge Your Legacy', url: 'https://ironslip.com' },
  ], // Update once you have your domain
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
        url: '/og-preview.png', // Create this image later for social shares
        width: 1200,
        height: 630,
        alt: 'Iron Slip | Forge Your Legacy Interface',
      },
    ],
    type: 'website',
  },
};

// This handles your Chrome/Safari mobile height bugs properly
export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents accidental zooming on mobile
  viewportFit: 'cover', // Ensures content fills the screen around notches
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-black text-white flex flex-col selection:bg-iron-volt selection:text-black">
        {children}
      </body>
    </html>
  );
}
