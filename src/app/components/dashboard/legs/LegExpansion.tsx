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
      ' HIGH_STAKES_DETECTED ',
      ' HIGH_RISK_IMMINENT ',
      ' DISCIPLINE_OR_DEATH ',
      ' OPERATION_FATAL_ERROR ',
    ];
    return warnings[Math.floor(Math.random() * warnings.length)];
  });

  if (!leg) return null;

  const isDemonMode = leg.isDemon === true || leg.difficulty === 'demon';

  const theme = isDemonMode
    ? {
        modalBg: '!bg-iron-volt',
        titleText: 'text-black',
        watermark: 'text-black/10',
        dataCoreBg: 'bg-iron-volt',
        dataLabel: 'text-zinc-500',
        dataValue: 'text-black',
        buttonBg: 'bg-black',
        buttonText: 'text-iron-volt',
        warningText: 'text-black',
        border: 'border-black/20',
        subLabel: 'text-black/60',
      }
    : {
        modalBg: '!bg-black',
        titleText: 'text-iron-volt',
        watermark: 'text-white/5',
        dataCoreBg: 'bg-zinc-900/40',
        dataLabel: 'text-zinc-500',
        dataValue: 'text-white',
        buttonBg: 'bg-iron-volt',
        buttonText: 'text-black',
        warningText: 'text-iron-volt',
        border: 'border-iron-volt/30',
        subLabel: 'text-white/40',
      };

  return (
    /* Added overflow-hidden here to ensure the backdrop doesn't scroll either */
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md overflow-hidden">
      {/* THE MODAL CONTAINER - Added overflow-hidden to clip the watermark */}
      <div
        className={`cl-modalContent ${theme.modalBg} w-full max-w-md p-6 relative flex flex-col gap-1 border ${theme.border} shadow-2xl overflow-x-hidden overflow-y-auto max-h-[85vh]`}
      >
        {/* THE ABORT BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white font-mono text-[10px] uppercase tracking-[0.3em] bg-iron-red px-3 py-2 z-[100] shadow-lg active:scale-90 transition-all border border-white/10"
        >
          [ X ] abort
        </button>

        {/* 1. IDENTITY & HEADER */}
        <div className="space-y-1 relative z-10 pr-16">
          <h2
            className={`${theme.titleText} font-black italic text-4xl uppercase tracking-tighter leading-none`}
          >
            {leg.task}
          </h2>
        </div>

        {/* WATERMARK - Positioned absolute but clipped by the container's overflow-hidden */}
        <span
          className={`absolute top-0 -left-6 text-8xl font-black italic ${theme.watermark} uppercase pointer-events-none select-none z-0 whitespace-nowrap`}
        >
          {leg.category || 'IRON'}
        </span>

        {/* 2. CORE STATS */}
        <div className={`${theme.dataCoreBg} p-4 space-y-3 relative z-10  `}>
          <div className="flex justify-between items-end border-b border-iron-red/10 ">
            <span
              className={`${theme.dataLabel} font-mono italic text-[10px] uppercase`}
            >
              Target
            </span>
            <span
              className={`${theme.dataValue} font-black italic text-lg uppercase`}
            >
              {leg.requirementValue} {leg.requirementUnit}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-iron-red/10">
            <span
              className={`${theme.dataLabel} font-mono italic text-[10px] uppercase`}
            >
              Window
            </span>
            <span className="text-iron-red font-mono text-sm uppercase font-black italic">
              {leg.timeLimit || 24} HOURS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span
                className={`${theme.dataLabel} font-mono italic text-[10px] uppercase`}
              >
                Verification
              </span>
              <span className="text-iron-red font-black italic text-md uppercase">
                {leg.verificationMethod}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span
                className={`${theme.dataLabel} font-mono italic text-[10px] uppercase`}
              >
                Win
              </span>
              <span className="text-iron-green font-black italic text-md">
                +{leg.creditReward || 0}
              </span>
            </div>
          </div>
        </div>

        {/* 3. SYSTEM & AI CONFIG */}
        <div className="bg-iron-volt/40 p-4 space-y-2 relative z-10 border border-white/5 font-mono">
          <div className="flex justify-between items-center">
            <span className={`${theme.dataLabel} text-[8px] uppercase`}>
              Motion_Key
            </span>
            <span className="text-zinc-600 text-[11px] uppercase">
              {leg.motionKey || 'not_encrypted'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`${theme.dataLabel} text-[8px] uppercase`}>
              Avatar_Anim
            </span>
            <span className="text-zinc-600 text-[11px] uppercase">
              {leg.avatarAction || 'idle'}
            </span>
          </div>
        </div>

        {/* 4. DEMON ALERT */}
        {isDemonMode && (
          <div className="bg-iron-volt/40 text-iron-red p-2 text-center font-mono text-[9px] font-black z-10">
            👹 DEMON_PROTOCOL 👹
          </div>
        )}

        {/* 5. ACTION BUTTON */}
        <button
          className={`w-full ${theme.buttonBg} py-5 ${theme.buttonText} font-black italic text-2xl uppercase active:scale-95 transition-all relative z-10 shadow-xl`}
          onClick={() => alert('CONTRACT_LOCKED')}
        >
          {isDemonMode ? 'Start slip' : 'INITIALIZE_LEG'}
        </button>

        {/* FOOTER */}
        <div className="flex flex-col items-center gap-1 opacity-60 relative z-10 mt-2">
          <p
            className={`${theme.warningText} font-black font-mono text-[8px] text-center uppercase tracking-widest`}
          >
            {hazardWarning}
          </p>
        </div>
      </div>
    </div>
  );
}
