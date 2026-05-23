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
          colorPrimary: '#ff003c', 
          colorBackground: '#FED500', // Swapped to heavy Liberty Yellow
          colorText: '#000000', 
          colorInputBackground: '#f4f4f5',
          colorInputText: '#000000',
          borderRadius: '0px',
        },
        elements: {
          card: 'bg-white border-none shadow-none',
          modalContent: 'p-0', 
          footer: 'hidden',
          'clerk-branding': 'hidden',
          headerTitle: 'text-black font-black italic uppercase tracking-tighter text-2xl',
          headerSubtitle: 'text-black italic font-mono text-[10px] uppercase tracking-widest',
          formButtonPrimary: 'bg-black !text-[#FED500] font-black uppercase italic transition-all py-3 shadow-md',
          formFieldLabel: 'text-black font-mono text-[10px] uppercase tracking-widest mb-1 font-bold italic',
          formFieldInput: 'bg-white/80 border border-black/10 text-black focus:border-black transition-all py-3 px-4 italic ',
          footerActionLink: 'text-black font-mono text-[10px] font-black underline decoration-2 uppercase',
          footerActionText: 'text-black/50 font-mono text-[10px] uppercase italic',
          identityPreviewText: 'text-black font-mono font-bold uppercase italic',
          identityPreviewEditButtonIcon: 'text-black',
        },
      }}
    >
      <html lang="en" className="bg-[#FED500]">
        <head>
          {/* Hardcodes the true Liberty Yellow into the browser UI bar */}
          <meta name="theme-color" content="#FED500" />
          
          {/* This forces Safari NOT to wash out the status bar or apply a weird translucent overlay */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        </head>
        <body className="bg-[#FED500] text-white antialiased selection:bg-black selection:text-[#FED500]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}