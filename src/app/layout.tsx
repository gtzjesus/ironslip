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
          colorPrimary: '#000000',
          colorBackground: '#F1C232',
          colorText: '#000000',
          colorInputBackground: '#e5b428',
          colorInputText: '#000000',
          borderRadius: '0px',
        },
        elements: {
          card: 'bg-[#F1C232] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] animate-arcade-slide',
          modalContent: 'p-0 bg-transparent shadow-none',
          modalBackdrop: 'backdrop-blur-sm bg-yellow-500/20',
          footer: 'hidden',
          'clerk-branding': 'hidden',
          headerTitle: 'text-black font-black italic uppercase tracking-tighter text-3xl',
          headerSubtitle: 'text-zinc-900 italic font-mono text-[10px] uppercase tracking-widest font-bold',
          formButtonPrimary: 'bg-black !text-[#F1C232] font-black uppercase italic transition-all py-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1',
          formFieldLabel: 'text-black font-mono text-[10px] uppercase tracking-widest mb-1 font-black italic',
          formFieldInput: 'bg-black/10 border-2 border-black text-black placeholder:text-zinc-800 focus:bg-black/20 focus:outline-none transition-all py-3 px-4 italic font-bold [appearance:textfield]',
          footerActionLink: 'text-black font-mono text-[10px] font-black underline decoration-2 uppercase hover:opacity-70',
          footerActionText: 'text-zinc-900 font-mono text-[10px] uppercase italic font-bold',
          identityPreviewText: 'text-black font-mono font-bold uppercase italic',
          identityPreviewEditButtonIcon: 'text-black',
          socialButtonsBlockButton: 'bg-black/10 border-2 border-black text-black hover:bg-black/20 font-bold',
          dividerLine: 'bg-black',
          dividerText: 'text-black font-mono text-[10px] font-bold',
        },
      }}
    >
      <html lang="en" className="bg-[#121212]">
        <head>
          <meta name="theme-color" content="#121212" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes arcadeSlide {
              0% {
                opacity: 0;
                transform: translateX(-100vw) scale(0.9);
              }
              100% {
                opacity: 1;
                transform: translateX(0) scale(1);
              }
            }
            .animate-arcade-slide {
              animation: arcadeSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}} />
        </head>
        <body className="bg-[#121212] text-white antialiased selection:bg-iron-volt selection:text-black">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}