/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';

export default function IronHero() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [isReady, setIsReady] = useState(false);

  // FAIL-SAFE: If Rive takes too long, open the curtain anyway after 3.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const { RiveComponent } = useRive({
    src: '/avatar/avatar-walking.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
    onLoad: () => setIsReady(true),
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  const handleSignInClick = () => {
    openSignIn({
      fallbackRedirectUrl: '/home',
      forceRedirectUrl: '/home',
    });
  };

  return (
    <section className="relative h-screen w-screen bg-black overflow-hidden font-sans selection:bg-iron-volt selection:text-black">
      {/* 1. LOADING CURTAIN */}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-[2px] w-48 bg-zinc-900 overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear',
                  }}
                  className="h-full w-full bg-iron-volt shadow-[0_0_15px_#FFD300]"
                />
              </div>
              <p className="text-[10px] font-mono text-iron-volt uppercase tracking-[0.3em] animate-pulse">
                Loading_System
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CINEMATIC OVERLAYS */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.7)_100%)]" />

      {/* 3. MAIN CONTENT */}
      <div
        className={`h-full w-full transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* BACKGROUND LOGO */}
        <div className="top-[27%] absolute inset-0 flex justify-center z-20 select-none md:justify-start md:pl-20 md:top-[15%]">
          <h1 className="text-[12.5vw] font-black italic tracking-tighter leading-none text-white/90 uppercase blur-[0.5px] md:text-[8vw] drop-shadow-[0_0_35px_rgba(255,211,0,0.15)]">
            ironslip
          </h1>
        </div>

        {/* DESKTOP/MOBILE FLEX WRAPPER */}
        <div className="relative flex flex-col md:flex-row h-full w-full">
          {/* THE AVATAR CONTAINER */}
          <div className="relative z-10 h-full w-full flex items-center justify-center md:w-1/2 md:translate-x-[-10%]">
            <div className="h-full w-full grayscale contrast-[1.4] sepia-[0.2]">
              <RiveComponent />
            </div>
          </div>

          {/* HUD ELEMENTS */}
          <div className="absolute inset-0 px-8 flex flex-col justify-between z-30 pointer-events-none md:relative md:w-1/2 md:inset-auto md:pt-32 md:pr-20 md:items-end">
            {/* Top HUD Row */}
            <div className="flex justify-between items-start w-full md:flex-col md:items-end md:gap-6">
              <div className="flex flex-col gap-1 md:items-end">
                <p className="pt-18 text-[9px] font-mono text-zinc-400 uppercase tracking-widest md:text-[10px]">
                  Forge your legacy
                </p>
                <p className="text-[7px] font-mono text-iron-volt uppercase tracking-widest animate-pulse md:text-[10px]">
                  ● Optimal_Output
                </p>
              </div>
              <p className="pt-32 text-[9px] font-mono text-zinc-400 uppercase tracking-widest md:text-[10px] md:text-right">
                evolve with
                <br />
                your avatar
              </p>
            </div>

            {/* Bottom HUD Section */}
            <div className="flex flex-col pt-[50%] justify-center gap-6 flex-grow md:items-end md:pb-0 md:justify-center">
              <div className="flex flex-col items-center text-center md:items-end md:text-right">
                <p className="text-[17px] text-lg font-black uppercase italic tracking-tighter transition-colors">
                  <span className="bg-iron-volt text-black px-2 py-1 m-1 inline-block shadow-[0_0_10px_rgba(255,211,0,0.3)]">
                    Build slip.
                  </span>
                  <span className="bg-iron-volt text-black px-2 py-1 inline-block shadow-[0_0_10px_rgba(255,211,0,0.3)]">
                    Lock in.
                  </span>
                  <span className="bg-iron-volt text-black px-2 py-1 m-1 inline-block shadow-[0_0_10px_rgba(255,211,0,0.3)]">
                    Win gear.
                  </span>
                </p>
              </div>

              {/* ACTION BUTTON (CYBERPUNK NEON GLOW) */}
              {isSignedIn ? (
                <Link
                  href="/home"
                  className="group relative p-4 bg-zinc-950 border border-iron-volt/50 text-iron-volt text-[12px] font-mono uppercase tracking-[0.2em] transition-all pointer-events-auto md:w-72 hover:bg-iron-volt hover:text-black active:scale-95 shadow-[0_0_20px_rgba(255,211,0,0.2)] flex items-center justify-center no-underline"
                >
                  <div className="absolute inset-0 -z-10 bg-iron-volt blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="text-lg font-black uppercase italic tracking-tighter transition-colors">
                    Start the grind
                  </span>
                </Link>
              ) : (
                <button
                  onClick={handleSignInClick}
                  className="group relative p-4 bg-zinc-950 border border-iron-volt/50 text-iron-volt text-[12px] font-mono uppercase tracking-[0.2em] transition-all pointer-events-auto md:w-72 hover:bg-iron-volt hover:text-black active:scale-95 shadow-[0_0_20px_rgba(255,211,0,0.2)] flex items-center justify-center cursor-pointer w-full"
                >
                  <div className="absolute inset-0 -z-10 bg-iron-volt blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="text-lg font-black uppercase italic tracking-tighter transition-colors">
                    Start the grind
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}