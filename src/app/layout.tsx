'use client';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#ffd300',
          colorBackground: '#ff003c',
          borderRadius: '0px',
        },
        elements: {
          footer: 'hidden',
          'clerk-branding': 'hidden',
        },
      }}
    >
      <html lang="en" className="bg-black">
        {/* 'touch-none': Stops the browser from accidental zooming/scrolling
            'h-full': Necessary for the layout to fill the screen
        */}
        <body className="h-full bg-black text-white antialiased touch-none overflow-hidden">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
