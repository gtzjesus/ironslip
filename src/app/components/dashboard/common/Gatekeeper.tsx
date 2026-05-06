'use client';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Lock } from 'lucide-react';

export default function Gatekeeper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn } = useUser();

  if (isSignedIn) return <>{children}</>;

  return (
    <div className="relative group">
      {/* The Blurred Content */}
      <div className="blur-[4px] grayscale pointer-events-none select-none opacity-40">
        {children}
      </div>

      {/* The "Hook" Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 z-20">
        <SignInButton mode="modal">
          <button className="flex items-center gap-2 px-4 py-2 bg-iron-red/10 border border-iron-red text-iron-red font-mono text-[10px] uppercase tracking-widest hover:bg-iron-red hover:text-black transition-all">
            <Lock className="w-3 h-3" /> Verify_to_Unlock
          </button>
        </SignInButton>
      </div>
    </div>
  );
}
