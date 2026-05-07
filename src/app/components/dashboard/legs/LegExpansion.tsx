'use client';

import { useState } from 'react';

export default function LegExpansion({
  leg,
  onClose,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leg: any;
  onClose: () => void;
}) {
  // Fixes the "Impure function" error by running random only ONCE on mount
  const [hazardWarning] = useState(() => {
    const warnings = [
      '⚠️ HIGH_STAKES_DETECTED ⚠️',
      '⚡ HIGH_RISK_IMMINENT ⚡',
      '⚠️ NO_COWARDICE_DETECTED ⚠️',
      '⚠️ LOSS_PROBABILITY_HIGH ⚠️',
      '⚡ SYSTEM_OVERLOAD_REQUIRED ⚡',
      '☣️ DISCIPLINE_OR_DEATH ☣️',
    ];
    return warnings[Math.floor(Math.random() * warnings.length)];
  });
  if (!leg) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* FORCED YELLOW BACKGROUND 
          Using !bg-iron-volt to override the global white background 
      */}
      <div className="cl-modalContent !bg-iron-volt w-full max-w-md p-6 relative flex flex-col gap-6 ">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white font-mono text-[10px] uppercase tracking-[0.3em] bg-iron-red p-1"
        >
          [ X ] abort
        </button>

        {/* HEADER SECTION */}
        <div className="space-y-1">
          <h2 className="text-black font-black italic text-4xl uppercase tracking-tighter leading-none">
            {leg.task}
          </h2>
        </div>

        {/* WATERMARK */}
        <span className="absolute -top-6 -left-6 text-9xl font-black italic text-black/10 uppercase pointer-events-none select-none z-0">
          {leg.category || 'IRON'}
        </span>

        {/* DATA CORE - Inverted to Black for contrast */}
        <div className="bg-black p-4 space-y-4  shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
            <span className="text-zinc-500 font-mono text-[10px] uppercase font-bold">
              Requirement
            </span>
            <span className="text-white font-black italic text-2xl uppercase tracking-tight">
              {leg.requirementValue} {leg.requirementUnit}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-500 font-mono text-[10px] uppercase font-bold">
              Time_Limit
            </span>
            <span className="text-iron-red font-mono text-sm uppercase font-black italic">
              {leg.timeLimit || 24} HOURS
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-500 font-mono text-[10px] uppercase font-bold">
              Verification
            </span>
            <span className="text-white font-mono text-sm uppercase">
              {leg.verificationMethod}
            </span>
          </div>
        </div>

        {/* ACTION BUTTON - Inverted to Black */}
        <button
          className="w-full bg-black py-4 text-iron-volt font-black italic text-2xl uppercase  active:translate-y-1 active:border-b-0 transition-all"
          onClick={() => alert('CONTRACT_LOCKED')}
        >
          Start Slip
        </button>

        {/* FOOTER WARNING */}
        <div className="flex flex-col items-center gap-1 opacity-60">
          <p className="text-black font-black font-mono text-[8px] text-center uppercase tracking-widest">
            {hazardWarning}
          </p>
          <div className="w-full h-[1px] bg-black/20" />
        </div>
      </div>
    </div>
  );
}
