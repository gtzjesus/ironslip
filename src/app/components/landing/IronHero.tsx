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
      <div className="top-[20%] absolute inset-0 flex justify-center z-20 select-none md:justify-start md:pl-20 md:top-[15%]">
        <h1 className="text-[12.5vw] font-black italic tracking-tighter leading-none text-white uppercase blur-[2px] md:text-[8vw]">
          ironslip
        </h1>
      </div>

      {/* NEW WRAPPER: Forces side-by-side only on Desktop */}
      <div className="relative flex flex-col md:flex-row h-full w-full">
        {/* 3. THE AVATAR (Moved left on Desktop) */}
        <div className="relative z-10 h-full w-full flex items-center justify-center md:w-1/2 md:translate-x-[-10%]">
          <div className="h-full w-full grayscale contrast-[1.4] brightness-[0.5] sepia-[0.2]">
            <RiveComponent />
          </div>
        </div>

        {/* 4. HUD ELEMENTS (Shifted right on Desktop) */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between z-30 pointer-events-none pt-24 md:relative md:w-1/2 md:inset-auto md:pt-32 md:pr-20 md:items-end">
          {/* Top HUD */}
          <div className="flex justify-between items-start w-full md:flex-col md:items-end md:gap-4">
            <div className="flex flex-col gap-1 md:items-end">
              <p className="text-[8px] font-mono text-iron-gray uppercase tracking-widest md:text-[10px]">
                Forge your legacy
              </p>
              <p className="text-[8px] font-mono text-iron-volt uppercase tracking-widest animate-pulse md:text-[10px]">
                ● Optimal_Output
              </p>
            </div>
            <p className="text-[8px] font-mono text-iron-gray uppercase tracking-widest md:text-[10px] md:text-right">
              evolve with
              <br />
              your avatar
            </p>
          </div>

          {/* Bottom HUD */}
          <div className="flex flex-col items-center gap-8 pb-10 md:items-end md:pb-24">
            <div className="flex flex-col items-center text-center md:items-end md:text-right">
              <p className="text-[12px] font-mono text-iron-gray uppercase tracking-widest md:text-[14px]">
                <span className="bg-iron-volt text-iron-red p-1 m-1">
                  Build slip.
                </span>
                <span className="bg-iron-volt text-iron-red p-1">Lock in.</span>
                <span className="bg-iron-volt text-iron-red p-1 m-1">
                  Win gear.
                </span>
              </p>

              {/* Gradient Line - Aligned right on desktop */}
              <div className="mt-4 h-[2px] w-24 bg-gradient-to-r from-transparent via-iron-volt to-transparent md:from-iron-volt md:to-transparent" />
            </div>

            <button className="group relative p-4 bg-white text-iron-black text-[13px] font-mono uppercase tracking-widest transition-all pointer-events-auto md:w-64">
              <div className="absolute inset-0 -z-10 bg-iron-volt blur-xl opacity-60 animate-pulse group-hover:opacity-70" />
              <span className="relative z-10">Start the grind</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
