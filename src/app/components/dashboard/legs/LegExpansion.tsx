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
      ' DISCIPLINE_OR_BUST ',
      ' OPERATION_PENDING',
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
        subLabel: 'text-black/60',
      }
    : {
        modalBg: '!bg-black',
        titleText: 'text-iron-volt',
        watermark: 'text-iron-volt/20',
        dataCoreBg: 'bg-zinc-900/40',
        dataLabel: 'text-zinc-200',
        dataValue: 'text-white',
        buttonBg: 'bg-iron-volt',
        buttonText: 'text-black',
        warningText: 'text-iron-volt',
        subLabel: 'text-white/40',
      };

  return (
    /* Added overflow-hidden here to ensure the backdrop doesn't scroll either */
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md overflow-hidden">
      {/* THE MODAL CONTAINER - Added overflow-hidden to clip the watermark */}
      <div
        className={`cl-modalContent ${theme.modalBg} w-full max-w-md p-6 relative flex flex-col gap-1 border  shadow-2xl overflow-x-hidden overflow-y-auto max-h-[85vh]`}
      >
        {/* THE ABORT BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white font-mono text-[10px] uppercase tracking-[0.3em] bg-iron-red px-3 py-2 z-[100] shadow-lg active:scale-90 transition-all border border-white/10"
        >
          [ X ]
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
          className={` absolute top-0 -left-4 text-8xl font-black italic ${theme.watermark} uppercase pointer-events-none select-none z-0 whitespace-nowrap`}
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
              <div className="relative group">
                {/* The Background Layer */}
                <div className="absolute inset-0 bg-black -skew-x-12 transform border-r-2 border-iron-green/30" />

                {/* The Text Layer */}
                <span className="relative z-10 px-3 text-iron-green font-black italic text-lg animate-pulse block">
                  +{leg.creditReward || 0}{' '}
                  <span className="text-[10px] ml-0.5"></span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. AVATAR SOON HERE*/}

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
          {isDemonMode ? 'Start slip' : 'Start slip'}
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
