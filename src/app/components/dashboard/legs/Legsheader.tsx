'use client';
import { Lock } from 'lucide-react';
import { SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function QuickSlip({ isSignedIn }: { isSignedIn: boolean }) {
  // We keep it as a standard div—no motion, no initial Y offset.
  const ButtonContent = (
    <div
      className={`${
        isSignedIn ? 'bg-iron-volt' : 'bg-iron-red'
      } p-3 rounded-sm flex flex-col justify-between group cursor-pointer transition-colors duration-300 min-h-[100px] brightness-[0.6] hover:brightness-[0.8] active:scale-[0.98] shadow-lg shadow-black/40`}
    >
      <h3 className="text-black font-black italic text-xl uppercase leading-none">
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
      <div className="flex justify-end text-black">
        {isSignedIn ? (
          <span className="text-xl font-black italic">→</span>
        ) : (
          <Lock className="w-4 h-4 opacity-70" />
        )}
      </div>
    </div>
  );

  if (isSignedIn) {
    return (
      <Link href="/legs" className="block no-underline">
        {ButtonContent}
      </Link>
    );
  }

  return (
    <SignUpButton mode="modal">
      <div className="w-full">{ButtonContent}</div>
    </SignUpButton>
  );
}
