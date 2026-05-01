'use client';

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { cn } from '@/lib/utils';

export default function IronHero() {
  const { RiveComponent } = useRive({
    src: '/avatar/avatar-walking.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return (
    <section className="relative h-screen w-screen bg-black overflow-hidden font-sans selection:bg-iron-volt selection:text-black">
      {/* 1. CINEMATIC OVERLAYS */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />

      {/* 2. BACKGROUND LOGO */}
      <div className="top-[20%] absolute inset-0 flex  justify-center z-20 select-none">
        <h1 className="text-[12.5vw] font-black italic tracking-tighter leading-none text-white uppercase blur-[2px]">
          ironslip
        </h1>
      </div>

      {/* 3. THE AVATAR */}
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <div className="h-full w-full grayscale contrast-[1.4] brightness-[0.5] sepia-[0.2]">
          <RiveComponent />
        </div>
      </div>

      {/* 4. HUD ELEMENTS */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between z-30 pointer-events-none pt-24">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <p className="text-[9px] font-mono text-iron-gray uppercase tracking-widest">
              System_Status
            </p>
            {/* Status Dot */}
            <p className="text-[9px] font-mono text-iron-volt uppercase tracking-widest animate-pulse">
              ● Optimal_Output
            </p>
          </div>
          <p className="text-[9px] font-mono text-iron-gray uppercase tracking-widest">
            conquer
            <br />
            EST_2026
          </p>
        </div>

        {/* Bottom HUD */}
        <div className="flex flex-col items-center gap-8 pb-10">
          <div className="flex flex-col items-center text-center">
            <p className="text-[10px] font-mono text-iron-gray uppercase tracking-widest">
              Build slip. <span className="text-white">Lock in.</span> Win gear.
            </p>
            {/* Gradient Line using variable */}
            <div className="mt-4 h-[2px] w-24 bg-gradient-to-r from-transparent via-iron-volt to-transparent" />
          </div>

          <button className="pointer-events-auto h-14 w-64 bg-white text-black font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_20px_var(--iron-volt-glow)] transition-all active:scale-95">
            Start the grind
          </button>
        </div>
      </div>
    </section>
  );
}
