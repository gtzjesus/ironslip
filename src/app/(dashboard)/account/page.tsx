'use client';

import { SignIn, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function AccountPage() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
        {/* 1. ANIMATED SCANLINES (The Videogame Feel) */}
        <div className="absolute inset-0 pointer-events-none opacity-10 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

        {/* 2. THE SLAM-IN CONTAINER */}
        <motion.div
          initial={{ x: '-100vw', skewX: 20, filter: 'brightness(3)' }}
          animate={{ x: 0, skewX: 0, filter: 'brightness(1)' }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 100,
            duration: 0.8,
          }}
          className="relative z-10 w-full max-w-[420px] p-1"
        >
          {/* THE BREATHING GLOW (The Pulse) */}
          <motion.div
            animate={{
              boxShadow: [
                '0px 0px 20px rgba(255, 211, 0, 0.2)',
                '0px 0px 60px rgba(255, 211, 0, 0.5)',
                '0px 0px 20px rgba(255, 211, 0, 0.2)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-[#ffd300] p-1 shadow-2xl"
          >
            <div className="bg-white p-4">
              {/* 3. CLERK COMPONENT */}
              <SignIn
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'bg-transparent shadow-none border-none w-full',
                    // (Rest of your layout.tsx styles apply automatically)
                  },
                }}
              />
            </div>
          </motion.div>

          {/* ACCESS DECORATION */}
          <div className="absolute -top-10 -left-10 text-[#ffd300] font-mono text-[10px] animate-pulse">
            [ SYSTEM_STATUS: LOADING_AVATAR... ]
          </div>
        </motion.div>

        {/* BACKGROUND DISTORTION */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffd30010_0%,_transparent_70%)]" />
        </div>
      </div>
    );
  }

  return <div>Logged in content...</div>;
}
