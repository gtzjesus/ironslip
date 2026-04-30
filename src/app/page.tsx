'use client';

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

export default function Home() {
  // Setup the Rive hook
  const { RiveComponent } = useRive({
    src: '/avatar-walking.riv', // Path to your file in /public
    stateMachines: 'State Machine 1', // Check the name in Rive (usually State Machine 1)
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white selection:bg-zinc-700">
      <main className="relative flex w-full flex-1 flex-col items-center justify-center px-6">
        {/* The Hook: Bold, Gritty Header */}
        <div className="z-20 flex flex-col items-center gap-2 text-center">
          <h1 className="text-6xl font-black uppercase italic tracking-tighter sm:text-8xl md:text-9xl">
            IRON <span className="text-zinc-700">SLIP</span>
          </h1>
          <p className="max-w-md text-sm font-light uppercase tracking-[0.3em] text-zinc-500 sm:text-base">
            El Paso • Established 2026
          </p>
        </div>

        {/* The Avatar Container */}
        <div className="relative h-[400px] w-full max-w-lg sm:h-[600px]">
          {/* Subtle Glow behind the character */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-900/50 to-transparent blur-3xl" />

          {/* The Actual Rive Avatar */}
          <div className="relative z-10 h-full w-full">
            <RiveComponent />
          </div>
        </div>

        {/* The CTA: Clean & Aggressive */}
        <div className="z-20 mt-8 flex flex-col gap-4 sm:flex-row">
          <button className="flex h-14 w-64 items-center justify-center bg-white text-sm font-bold uppercase tracking-widest text-black transition-transform active:scale-95 hover:bg-zinc-200">
            Accept Challenge
          </button>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 text-[10px] uppercase tracking-widest text-zinc-800">
          Built for the 915 • No shortcuts
        </div>
      </main>
    </div>
  );
}
