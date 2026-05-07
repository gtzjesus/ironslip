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
  const [hazardWarning] = useState(() => {
    const warnings = [
      '⚠️ HIGH_STAKES_DETECTED ⚠️',
      '⚡ HIGH_RISK_IMMINENT ⚡',
      '☣️ DISCIPLINE_OR_DEATH ☣️',
    ];
    return warnings[Math.floor(Math.random() * warnings.length)];
  });

  if (!leg) return null;

  // SANITY CHECK: Using your actual schema fields
  // We check the boolean 'isDemon' OR if 'difficulty' is set to 'demon'
  const isDemonMode = leg.isDemon === true || leg.difficulty === 'demon';

  // THEME MAPPING
  const theme = isDemonMode
    ? {
        modalBg: '!bg-iron-volt', // Demon = Hazardous Yellow
        titleText: 'text-black',
        watermark: 'text-black/10',
        dataCoreBg: 'bg-black',
        dataLabel: 'text-zinc-500',
        dataValue: 'text-white',
        buttonBg: 'bg-black',
        buttonText: 'text-iron-volt',
        warningText: 'text-black',
        border: 'border-black/20',
      }
    : {
        modalBg: '!bg-black', // Regular = Stealth Black
        titleText: 'text-iron-volt', // Yellow text
        watermark: 'text-white/5',
        dataCoreBg: 'bg-zinc-900/40',
        dataLabel: 'text-zinc-500',
        dataValue: 'text-white',
        buttonBg: 'bg-iron-volt', // Yellow Button
        buttonText: 'text-black',
        warningText: 'text-iron-volt',
        border: 'border-iron-volt/30',
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      {/* Dynamic Modal Border & Background */}
      <div
        className={`cl-modalContent ${theme.modalBg} w-full max-w-md p-6 relative flex flex-col gap-6 border ${theme.border} shadow-2xl`}
      >
        {/* Abort Button - Always Red for Danger */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white font-mono text-[10px] uppercase tracking-[0.3em] bg-iron-red px-3 py-2 shadow-lg active:scale-95 transition-all"
        >
          [ X ] abort
        </button>

        {/* HEADER */}
        <div className="space-y-1 relative z-10">
          <p
            className={`font-mono text-[8px] uppercase tracking-[0.3em] ${isDemonMode ? 'text-black/60' : 'text-iron-volt/60'}`}
          >
            {isDemonMode
              ? '⚠️ PRIORITY_DEMON_TASK'
              : 'SYSTEM_STABLE // LEG_DEPLOIMENT'}
          </p>
          <h2
            className={`${theme.titleText} font-black italic text-4xl uppercase tracking-tighter leading-none`}
          >
            {leg.task}
          </h2>
        </div>

        {/* WATERMARK */}
        <span
          className={`absolute -top-6 -left-6 text-9xl font-black italic ${theme.watermark} uppercase pointer-events-none select-none z-0`}
        >
          {leg.category || 'IRON'}
        </span>

        {/* DATA CORE */}
        <div
          className={`${theme.dataCoreBg} p-4 space-y-4 shadow-xl relative z-10 border-t border-white/5`}
        >
          <div
            className={`flex justify-between items-end border-b border-zinc-800/50 pb-2`}
          >
            <span
              className={`${theme.dataLabel} font-mono text-[10px] uppercase font-bold`}
            >
              Requirement
            </span>
            <span
              className={`${theme.dataValue} font-black italic text-2xl uppercase`}
            >
              {leg.requirementValue} {leg.requirementUnit}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span
              className={`${theme.dataLabel} font-mono text-[10px] uppercase font-bold`}
            >
              Reward
            </span>
            <span className="text-iron-volt font-mono text-sm uppercase font-black italic">
              +{leg.creditReward} CR
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span
              className={`${theme.dataLabel} font-mono text-[10px] uppercase font-bold`}
            >
              Penalty
            </span>
            <span className="text-iron-red font-mono text-sm uppercase font-black italic">
              -{leg.burnPenalty || 0} CR
            </span>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <button
          className={`w-full ${theme.buttonBg} py-4 ${theme.buttonText} font-black italic text-2xl uppercase active:scale-[0.98] transition-all relative z-10 shadow-[0_10px_20px_rgba(0,0,0,0.3)]`}
          onClick={() => alert('CONTRACT_LOCKED')}
        >
          {isDemonMode ? 'ENTER_HELL' : 'ACCEPT_LEG'}
        </button>

        {/* FOOTER */}
        <div className="flex flex-col items-center gap-1 opacity-60 relative z-10">
          <p
            className={`${theme.warningText} font-black font-mono text-[8px] text-center uppercase tracking-widest animate-pulse`}
          >
            {hazardWarning}
          </p>
        </div>
      </div>
    </div>
  );
}
