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
            subtitle: 'Your avatar is waiting. Enter the Forge.',
            actionText: 'Already an Iron?',
            actionLink: 'Authenticate',
          },
        },
        signIn: {
          start: {
            title: 'AUTHENTICATE, USER',
            subtitle:
              'Access your iron dashboard. Enter your iron credentials.',
            actionText: 'New to the forge?',
            actionLink: 'Become Iron',
          },
        },
      }}
      appearance={{
        /* 1. We remove 'baseTheme: dark' to get the clean light version */
        variables: {
          colorPrimary: '#ff003c', // Iron Volt (Yellow)
          colorBackground: '#ffd300', // Clean White
          colorText: '#000000', // Bold Black Text
          colorInputBackground: '#f4f4f5', // Zinc 100 (Light Grey)
          colorInputText: '#000000',
          borderRadius: '0px',
        },
        elements: {
          card: 'border-none shadow-none bg-white',
          footer: 'hidden',
          'clerk-branding': 'hidden',

          /* TITLES & SUBTITLES */
          headerTitle:
            ' text-black font-black italic  tracking-tighter text-2xl',
          headerSubtitle:
            'uppercase text-black italic font-black text-zinc-500 font-mono text-[10px]  tracking-widest',

          /* THE BUTTON: Yellow with Black text (This always looks fire) */
          formButtonPrimary:
            'bg-[#ffd300] !text-black font-black  italic hover:bg-black hover:text-white transition-all py-3 shadow-md',

          /* INPUT FIELDS */
          formFieldLabel:
            'uppercase text-black italic text-black italic text-black font-mono text-[10px]  tracking-widest mb-1 font-bold',
          formFieldInput:
            'uppercase text-black italic bg-zinc-100 border border-zinc-200 text-black focus:border-[#ffd300] transition-all py-3',

          /* LINKS AT BOTTOM */
          footerActionLink:
            'text-black hover:text-[#ffd300] font-mono text-[10px]  font-black underline decoration-2',
          footerActionText:
            'uppercase text-black italic text-zinc-400 font-mono text-[10px] ',

          /* IDENTITY PREVIEW */
          identityPreviewText:
            'uppercase text-black italictext-black font-mono font-bold',
          identityPreviewEditButtonIcon: 'text-black',
        },
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
