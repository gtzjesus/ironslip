'use client';

import { useClerk } from '@clerk/nextjs';

interface StartGrindButtonProps {
  className?: string;
  text?: string;
}

export default function StartGrindButton({ 
  className = '', 
  text = 'Start the grind' 
}: StartGrindButtonProps) {
  const { openSignUp } = useClerk();

  const handleAuthClick = () => {
    openSignUp({
      fallbackRedirectUrl: '/',
      forceRedirectUrl: '/',
    });
  };

  return (
    <button
      onClick={handleAuthClick}
      className={`group relative p-4 bg-iron-volt border-2 border-iron-volt text-black text-[12px] font-mono uppercase tracking-[0.2em] transition-all hover:bg-zinc-950 hover:text-iron-volt hover:border-iron-volt/80 active:scale-95 shadow-[0_0_35px_rgba(255,211,0,0.45)] flex items-center justify-center cursor-pointer overflow-hidden animate-pulse ${className}`}
    >
      {/* ⚡ Halo de luz dinámico de fondo más intenso */}
      <div className="absolute inset-0 -z-10 bg-iron-volt blur-xl opacity-60 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500" />

      <span className="text-lg font-black uppercase italic tracking-tighter transition-colors z-10">
        {text}
      </span>
    </button>
  );
}