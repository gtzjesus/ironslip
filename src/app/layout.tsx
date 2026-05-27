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
          colorPrimary: '#ff003c', // Iron Red para focos y errores graves
          colorBackground: '#121212', // 🔄 FIXED: Fondo negro mate profundo para Clerk
          colorText: '#ededed', // Texto claro legible en modo oscuro
          colorInputBackground: '#18181b', // Inputs oscuros industriales (Zinc 900)
          colorInputText: '#F1C232', // Texto de input en Iron Volt para máximo estilo
          borderRadius: '0px', // Estilo arcade purista sin bordes redondeados
        },
        elements: {
          card: 'bg-[#121212] border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]',
          modalContent: 'p-0', 
          footer: 'hidden',
          'clerk-branding': 'hidden',
          headerTitle: 'text-iron-volt font-black italic uppercase tracking-tighter text-2xl',
          headerSubtitle: 'text-zinc-400 italic font-mono text-[10px] uppercase tracking-widest',
          // 🔄 FIXED: Botón primario negro con acento neón Iron Volt
          formButtonPrimary: 'bg-iron-volt !text-black font-black uppercase italic transition-all py-3 shadow-md hover:bg-iron-volt/90 active:scale-[0.98]',
          formFieldLabel: 'text-zinc-400 font-mono text-[10px] uppercase tracking-widest mb-1 font-bold italic',
          formFieldInput: 'bg-black border border-zinc-800 text-iron-volt focus:border-iron-volt/50 transition-all py-3 px-4 italic [appearance:textfield]',
          footerActionLink: 'text-iron-volt font-mono text-[10px] font-black underline decoration-2 uppercase hover:text-iron-volt/80',
          footerActionText: 'text-zinc-500 font-mono text-[10px] uppercase italic',
          identityPreviewText: 'text-iron-volt font-mono font-bold uppercase italic',
          identityPreviewEditButtonIcon: 'text-iron-volt',
        },
      }}
    >
      <html lang="en" className="bg-[#121212]">
        <head>
          {/* 🔄 FIXED: Asegura que la barra del navegador del celular sea completamente negra mate */}
          <meta name="theme-color" content="#121212" />
          
          {/* Evita que Safari meta overlays raros o lave los colores nativos */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </head>
        <body className="bg-[#121212] text-white antialiased selection:bg-iron-volt selection:text-black">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}