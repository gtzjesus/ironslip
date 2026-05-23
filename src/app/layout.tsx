'use client';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

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
            title: 'HELLO USER',
            subtitle: 'Enter the Forge.',
            actionText: 'Already an Iron?',
            actionLink: 'Authenticate',
          },
        },
        signIn: {
          start: {
            title: 'AUTHENTICATE, USER',
            subtitle:
              'Fully Access your iron dashboard. Enter your credentials.',
            actionText: 'New to the forge?',
            actionLink: 'Become Iron',
          },
        },
      }}
      appearance={{
        variables: {
          colorPrimary: '#ff003c', // Iron Red for primary actions
          colorBackground: '#F1C232', // Matched directly to your defined --iron-volt variable
          colorText: '#000000', // Bold Black Text
          colorInputBackground: '#f4f4f5',
          colorInputText: '#000000',
          borderRadius: '0px',
        },
        elements: {
          card: 'bg-white border-none shadow-none',
          modalContent: 'p-0', // Set to transparent so the background shines through
          footer: 'hidden',
          'clerk-branding': 'hidden',

          /* TITLES & SUBTITLES */
          headerTitle:
            'text-black font-black italic uppercase tracking-tighter text-2xl',
          headerSubtitle:
            'text-black italic font-mono text-[10px] uppercase tracking-widest',

          /* THE BUTTON: Yellow-themed setup with Black text */
          formButtonPrimary:
            'bg-black !text-[#F1C232] font-black uppercase italic  transition-all py-3 shadow-md',

          /* INPUT FIELDS */
          formFieldLabel:
            'text-black font-mono text-[10px] uppercase tracking-widest mb-1 font-bold italic',
          formFieldInput:
            'bg-white/80 border border-black/10 text-black focus:border-black transition-all py-3 px-4 italic ',

          /* LINKS AT BOTTOM */
          footerActionLink:
            'text-black  font-mono text-[10px] font-black underline decoration-2 uppercase',
          footerActionText:
            'text-black/50 font-mono text-[10px] uppercase italic',

          /* IDENTITY PREVIEW */
          identityPreviewText:
            'text-black font-mono font-bold uppercase italic',
          identityPreviewEditButtonIcon: 'text-black',
        },
      }}
    >
      {/* 🔄 FIXED: Swapped out bg-black for bg-iron-volt to claim ownership of phone edges */}
      <html lang="en" className="bg-iron-volt">
        <body className="bg-iron-volt text-white antialiased selection:bg-black selection:text-iron-volt">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}