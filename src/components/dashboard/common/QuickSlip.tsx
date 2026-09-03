'use client';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function QuickSlip({ isSignedIn }: { isSignedIn: boolean }) {
  const ButtonContent = (
    <motion.div

      whileTap={{ scale: 0.99 }}
      className={`relative p-3 flex flex-col justify-between group cursor-pointer transition-all duration-200 min-h-[100px] overflow-hidden ${
        isSignedIn 
          ? 'bg-zinc-950 border-2 border-iron-volt shadow-[0_0_25px_rgba(241,194,50,0.35)] hover:shadow-[0_0_35px_rgba(241,194,50,0.5)]' 
          : 'bg-zinc-950 border-2 border-iron-red shadow-[0_0_25px_rgba(255,0,60,0.35)]'
      }`}
      style={{
        clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0% 100%)',
      }}
    >
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff, #fff 2px, transparent 2px, transparent 8px)'
        }}
      />

      <div className={`absolute top-0 left-0 right-0 h-[2px] ${isSignedIn ? 'bg-iron-volt' : 'bg-iron-red'}`} />

      <h3 className={`font-black italic text-xl uppercase leading-none relative z-10 ${isSignedIn ? 'text-iron-volt' : 'text-iron-red'}`}>
        {isSignedIn ? (
          <>
            build new <br /> iron Slip
          </>
        ) : (
          <>
            log in to <br /> Build slip
          </>
        )}
      </h3>
      <div className={` flex justify-end relative z-10 ${isSignedIn ? 'text-iron-volt' : 'text-iron-red'}`}>
        {isSignedIn ? (
          <span className="text-xl font-black italic pr-4">→</span>
        ) : (
          <Lock className="w-4 h-4 opacity-70 animate-pulse" />
        )}
      </div>
    </motion.div>
  );

  if (isSignedIn) {
    return (
      <Link href="/legs" className="block no-underline">
        {ButtonContent}
      </Link>
    );
  }

  return (
    <SignUpButton 
      mode="modal" 
      forceRedirectUrl={typeof window !== 'undefined' ? `${window.location.origin}/home` : '/home'}
    >
      {ButtonContent}
    </SignUpButton>
  );
}