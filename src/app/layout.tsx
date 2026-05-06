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
      // 1. ADD THIS SECTION TO OVERWRITE TEXT
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
      // 2. KEEP YOUR EXISTING APPEARANCE SETTINGS
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#ffd300', // Iron Volt (Button Color)
          colorBackground: '#ff003c', // Your Red Background
          colorText: '#ffffff', // Main Titles/Text
          colorTextOnPrimaryBackground: '#000000', // THIS MAKES BUTTON TEXT BLACK
          colorInputBackground: '#000000', // Black inputs look better on Red
          colorInputText: '#ffffff',
          borderRadius: '0px',
        },
        elements: {
          card: 'border-none shadow-2xl rounded-none',
          footer: 'hidden',
          // 1. THE TRIPLE-THREAT BRANDING KILLER
          'clerk-branding': 'hidden',
          clerkBranding: 'hidden',
          clerkBrandingAnchor: 'hidden',
          /**
           * FORCE OVERRIDE FOR THE BUTTON
           * !text-black: The '!' makes it !important in Tailwind
           * to crush any default Clerk styles.
           */
          formButtonPrimary:
            'bg-[#ffd300] !text-black font-black uppercase italic hover:bg-white transition-all',

          // Styling the "switch" links at the bottom
          footerActionLink:
            'text-black hover:text-white font-mono text-[10px] uppercase font-bold',
          footerActionText: 'text-black/60 font-mono text-[10px] uppercase',

          // Ensuring header text doesn't get lost
          headerTitle:
            'text-black font-black italic uppercase tracking-tighter',
          headerSubtitle: 'text-black/70 font-mono',
        },
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
