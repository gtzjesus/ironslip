'use client';

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

export default function Home() {
  const { RiveComponent } = useRive({
    src: '/avatar-walking.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black overflow-hidden font-sans selection:bg-[#D4FF00] selection:text-black">
      {/* 1. CINEMATIC OVERLAY (Grain & Vignette) */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]" />

      <main className="relative h-full w-full flex items-center justify-center">
        {/* 2. BACKGROUND LOGO: Large, outlined, and aggressive */}
        <div className="absolute inset-0 flex items-center justify-center z-0 select-none">
          <h1 className="text-[25vw] font-black italic tracking-tighter leading-none text-white/[0.03] uppercase">
            IRON
          </h1>
        </div>

        {/* 3. THE AVATAR */}
        <div className="relative z-10 h-full w-full flex items-center justify-center">
          <div className="h-full w-full grayscale contrast-[1.4] brightness-[0.6] sepia-[0.2]">
            <RiveComponent />
          </div>
          {/* Enhanced Floor Shadow */}
          <div className="absolute bottom-[22%] h-[15px] w-80 bg-[#D4FF00]/10 blur-2xl rounded-[100%] z-0" />
        </div>

        {/* 4. HUD ELEMENTS: Technical corner data */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between z-30 pointer-events-none">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                System_Status
              </p>
              <p className="text-[10px] font-mono text-[#D4FF00] uppercase tracking-widest animate-pulse">
                ● Optimal_Output
              </p>
            </div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-right">
              915_EL_PASO
              <br />
              EST_2026
            </p>
          </div>

          {/* BOTTOM SECTION: Hook & CTA */}
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-2">
                <span className="text-zinc-600 text-[10px] font-bold tracking-widest uppercase">
                  01
                </span>
                <p className="text-zinc-400 tracking-[0.3em] text-[11px] font-black uppercase">
                  Build slip. <span className="text-white">Lock in.</span> Win
                  gear.
                </p>
              </div>
              <div className="mt-4 h-[2px] w-24 bg-gradient-to-r from-transparent via-[#D4FF00] to-transparent" />
            </div>

            <button className="pointer-events-auto h-14 w-64 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-[#D4FF00] transition-all hover:tracking-[0.3em] active:scale-95">
              Enter The Forge
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
