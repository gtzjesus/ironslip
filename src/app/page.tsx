'use client';

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

export default function Home() {
  const { RiveComponent } = useRive({
    src: '/avatar-walking.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover, // Changed to Cover to fill more space effectively
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black overflow-hidden">
      <main className="relative h-full w-full flex items-center justify-center">
        {/* BACKGROUND EFFECT: The "Vibe" Glow */}
        <div className="absolute h-[600px] w-[600px] rounded-full bg-zinc-900/20 blur-[120px] z-0" />

        {/* THE AVATAR: 100vh setup */}
        <div className="relative z-10 h-full w-full flex items-center justify-center">
          {/* CSS FILTER TRICKERY */}
          {/* grayscale(1) -> Makes it B&W
              contrast(1.5) -> Makes the blacks deeper
              brightness(0.8) -> Gritty look
          */}
          <div className="h-full w-full transition-all grayscale contrast-[1.4] brightness-[0.7]">
            <RiveComponent />
          </div>

          {/* THE FLOOR: Adds "Weight" so he's not floating */}
          <div className="absolute bottom-[20%] h-[20px] w-64 bg-white/5 blur-xl rounded-[100%] z-0" />
        </div>

        {/* OVERLAY: Gritty Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-between py-10 pointer-events-none z-20">
          <h1 className="text-[10vw] font-black italic tracking-tighter leading-none opacity-w0">
            IRONSLIP
          </h1>

          <div className="flex flex-col items-center gap-4">
            <p className="text-zinc-500 tracking-[0.25em] text-xs uppercase animate-pulse">
              Build slip. Lock in. Win gear.
            </p>
            {/* Example of a Volt Yellow highlight in UI */}
            <div className="h-1 w-12 bg-[#ff0000]" />
          </div>
        </div>
      </main>
    </div>
  );
}
