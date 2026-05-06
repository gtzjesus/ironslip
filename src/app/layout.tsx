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
            subtitle: 'Join the iron community and being your grind.',
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
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
