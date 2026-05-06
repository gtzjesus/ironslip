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
      localization={{
        signUp: {
          start: {
            title: 'Hello User',
            subtitle: 'Join the IRON COMMUNITY and begin your grind.',
            actionText: 'Already an Iron?',
            actionLink: 'Authenticate',
          },
        },
        signIn: {
          start: {
            title: 'Authenticate, User',
            subtitle: 'Access your iron dashboard. Enter credentials.',
            actionText: 'New to the forge?',
            actionLink: 'Become Iron',
          },
        },
      }}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#ffd300', // Iron Volt (Yellow Button)
          colorBackground: '#000000', // Black Background
          colorText: '#ff003c', // Global Red Text
          colorInputBackground: '#000000',
          colorInputText: '#ff003c',
          borderRadius: '0px',
        },
        elements: {
          card: 'border-none shadow-none bg-black',
          footer: 'hidden',
          'clerk-branding': 'hidden',

          // FORCING THE HEADER TEXT TO RED
          headerTitle:
            'text-[#ff003c] font-black italic uppercase tracking-tighter',
          headerSubtitle: 'text-[#ff003c]/70 font-mono',

          // INPUT FIELDS: Red text, black bg, red border
          formFieldInput:
            'bg-black border border-[#ff003c]/30 text-[#ff003c] focus:border-[#ff003c] transition-all',
          formFieldLabel: 'text-[#ff003c] uppercase font-mono text-[10px]',

          // THE BUTTON: Keeping it yellow with black text for that high-contrast look
          formButtonPrimary:
            'bg-[#ffd300] !text-black font-black uppercase italic hover:bg-white transition-all',

          // FOOTER LINKS (Authenticate / Become Iron)
          footerActionLink:
            'text-[#ff003c] hover:text-white font-mono text-[10px] uppercase font-bold',
          footerActionText: 'text-[#ff003c]/50 font-mono text-[10px] uppercase',

          // Identity Preview (The "You are signed in as..." text)
          identityPreviewText: 'text-[#ff003c]',
          identityPreviewEditButtonIcon: 'text-[#ff003c]',
        },
      }}
    >
      <html lang="en" className="bg-black">
        <body className="bg-black text-white selection:bg-[#ff003c] selection:text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
