'use client';
import { useState } from 'react';

interface LegExpansionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leg: any;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onToggleSlip: (leg: any) => void;
  isInSlip: boolean;
}

export default function LegExpansion({
  leg,
  onClose,
  onToggleSlip,
  isInSlip,
}: LegExpansionProps) {
  const [hazardWarning] = useState(() => {
    const warnings = [
      ' PROTOCOL_READY ',
      ' HIGH_RISK_DETECTED ',
      ' DISCIPLINE_OR_BUST ',
      ' OPERATION_PENDING',
      ' BUST_OR_GLORY',
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
      };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 bg-black/65 backdrop-blur-md overflow-hidden">
      {/* THE MODAL CONTAINER */}
      <div
        className={`cl-modalContent ${theme.modalBg} w-full max-w-md h-[70vh] relative flex flex-col border shadow-2xl overflow-hidden`}
      >
        {/* THE ABORT BUTTON - Stay Fixed Top */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white font-mono text-[10px] uppercase tracking-[0.3em] bg-iron-red px-3 py-2 z-[100] shadow-lg active:scale-90 transition-all border border-white/10"
        >
          [ X ]
        </button>

        {/* 1. SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 pt-10 scrollbar-hide relative">
          {/* WATERMARK (Inside scroll so it moves with content) */}
          <span
            className={`absolute top-0 -left-4 text-8xl font-black italic ${theme.watermark} uppercase pointer-events-none select-none z-0 whitespace-nowrap`}
          >
            {leg.category || 'IRON'}
          </span>

          {/* IDENTITY & HEADER */}
          <div className="space-y-1 relative z-10 pr-16 mb-4">
            <h2
              className={`${theme.titleText} font-black italic text-4xl uppercase tracking-tighter leading-none`}
            >
              {leg.task}
            </h2>
          </div>

          {/* CORE STATS */}
          <div
            className={`${theme.dataCoreBg} p-4 space-y-3 relative z-10 border border-black/10`}
          >
            <div className="flex justify-between items-end border-b border-iron-red/20 pb-1">
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

            <div className="flex justify-between items-center border-b border-iron-red/20 pb-1">
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
                <div className="relative group self-end">
                  <div className="absolute inset-0 bg-black -skew-x-12 transform border-r-2 border-iron-green/30" />
                  <span className="relative z-10 px-3 text-iron-green font-black italic text-lg animate-pulse block">
                    +{leg.creditReward || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DEMON ALERT */}
          {isDemonMode && (
            <div className="bg-iron-volt/40 text-iron-red p-2 text-center font-mono text-[9px] font-black z-10 mt-4 border border-iron-red/20">
              👹 DEMON_PROTOCOL_ACTIVE 👹
            </div>
          )}

          {/* FOOTER WARNING */}
          <div className="mt-8 flex flex-col items-center opacity-40">
            <p
              className={`${theme.warningText} font-black font-mono text-[8px] text-center uppercase tracking-[0.3em]`}
            >
              {hazardWarning}
            </p>
          </div>
        </div>

        {/* 2. FIXED BUTTON CONTAINER - Pinned to bottom */}
        <div className="p-6 bg-inherit border-t border-black/5 relative z-20">
          <button
            className={`w-full py-5 font-black italic text-2xl uppercase transition-all active:scale-95 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]
              ${isInSlip ? 'bg-iron-red text-white' : `${theme.buttonBg} ${theme.buttonText}`}`}
            onClick={() => {
              onToggleSlip(leg);
              onClose();
            }}
          >
            {isInSlip ? 'REMOVE_FROM_SLIP' : 'ADD_TO_SLIP'}
          </button>
        </div>
      </div>
    </div>
  );
}
