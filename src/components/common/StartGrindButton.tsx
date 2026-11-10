'use client';

import { useClerk } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

interface StartGrindButtonProps {
  className?: string;
  text?: string;
}

export default function StartGrindButton({ 
  className = '', 
  text = 'Start the grind' 
}: StartGrindButtonProps) {
  const { openSignUp } = useClerk();
  const pathname = usePathname();

  const handleAuthClick = () => {
    openSignUp({
      fallbackRedirectUrl: pathname,
      forceRedirectUrl: pathname,
    });
  };

  return (
    <button
      onClick={handleAuthClick}
      className={`group relative p-4 bg-[#B89223] border-4 border-black text-black text-[12px] font-mono uppercase tracking-[0.2em] transition-all hover:bg-black hover:text-[#B89223] active:translate-x-0.5 active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center cursor-pointer overflow-hidden ${className}`}
    >
      <span className="text-lg font-black uppercase italic tracking-tighter transition-colors z-10">
        {text}
      </span>
    </button>
  );
}