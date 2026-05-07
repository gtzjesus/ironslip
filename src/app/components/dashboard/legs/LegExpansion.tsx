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
      '💀 OPERATION_FATAL_ERROR 💀',
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
        dataCoreBg: 'bg-black',
        dataLabel: 'text-zinc-500',
        dataValue: 'text-white',
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      {/* THE MODAL CONTAINER */}
      <div
        className={`cl-modalContent ${theme.modalBg} w-full max-w-md p-6 relative flex flex-col gap-4 border ${theme.border} shadow-2xl overflow-y-auto max-h-[85vh]`}
      >
        {/* THE ABORT BUTTON (MANDATORY) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white font-mono text-[10px] uppercase tracking-[0.3em] bg-iron-red px-3 py-2 z-[100] shadow-lg active:scale-90 transition-all border border-white/10"
        >
          [ X ] ABORT_MODULE
        </button>

        {/* 1. IDENTITY & HEADER */}
        <div className="space-y-1 relative z-10 pr-16">
          {' '}
          {/* pr-16 keeps text clear of the close button */}
          <p
            className={`font-mono text-[8px] uppercase tracking-[0.4em] ${theme.subLabel}`}
          >
            {leg.category} {leg.difficulty || 'standard'}
          </p>
          <h2
            className={`${theme.titleText} font-black italic text-4xl uppercase tracking-tighter leading-none`}
          >
            {leg.task}
          </h2>
          <p
            className={`text-[9px] font-mono leading-tight mt-2 ${theme.subLabel}`}
          >
            UID: {leg.slug?.current || 'ANONYMOUS_SIG'}
          </p>
        </div>

        {/* WATERMARK */}
        <span
          className={`absolute top-20 -left-6 text-9xl font-black italic ${theme.watermark} uppercase pointer-events-none select-none z-0`}
        >
          {leg.category || 'IRON'}
        </span>

        {/* 2. CORE STATS */}
        <div
          className={`${theme.dataCoreBg} p-4 space-y-3 relative z-10 border border-white/5 shadow-inner`}
        >
          <div className="flex justify-between items-end border-b border-zinc-800/50 pb-1">
            <span
              className={`${theme.dataLabel} font-mono text-[9px] uppercase`}
            >
              Target
            </span>
            <span
              className={`${theme.dataValue} font-black italic text-xl uppercase`}
            >
              {leg.requirementValue} {leg.requirementUnit}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span
              className={`${theme.dataLabel} font-mono text-[9px] uppercase`}
            >
              Window
            </span>
            <span className="text-iron-red font-mono text-xs uppercase font-black italic">
              {leg.timeLimit || 24} HOURS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-800/50">
            <div className="flex flex-col">
              <span
                className={`${theme.dataLabel} font-mono text-[9px] uppercase`}
              >
                Yield
              </span>
              <span className="text-iron-volt font-black italic text-lg">
                +{leg.creditReward} CR
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span
                className={`${theme.dataLabel} font-mono text-[9px] uppercase`}
              >
                Penalty
              </span>
              <span className="text-iron-red font-black italic text-lg">
                -{leg.burnPenalty || 0} CR
              </span>
            </div>
          </div>
        </div>

        {/* 3. SYSTEM & AI CONFIG */}
        <div className="bg-black/40 p-4 space-y-2 relative z-10 border border-white/5 font-mono">
          <div className="flex justify-between items-center">
            <span className={`${theme.dataLabel} text-[8px] uppercase`}>
              Verification
            </span>
            <span className={`${theme.dataValue} text-[9px] uppercase`}>
              {leg.verificationMethod || 'manual_review'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`${theme.dataLabel} text-[8px] uppercase`}>
              Motion_Key
            </span>
            <span className="text-zinc-600 text-[9px] uppercase">
              {leg.motionKey || 'not_encrypted'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`${theme.dataLabel} text-[8px] uppercase`}>
              Avatar_Anim
            </span>
            <span className="text-zinc-600 text-[9px] uppercase">
              {leg.avatarAction || 'idle'}
            </span>
          </div>
        </div>

        {/* 4. DEMON ALERT */}
        {isDemonMode && (
          <div className="bg-black text-iron-red p-2 text-center font-mono text-[9px] font-black border-2 border-iron-red animate-pulse z-10">
            👹 WARNING: DEMON_PROTOCOL_ENGAGED
          </div>
        )}

        {/* 5. ACTION BUTTON */}
        <button
          className={`w-full ${theme.buttonBg} py-5 ${theme.buttonText} font-black italic text-2xl uppercase active:scale-95 transition-all relative z-10 shadow-xl`}
          onClick={() => alert('CONTRACT_LOCKED')}
        >
          {isDemonMode ? 'ACCEPT_DEATH' : 'INITIALIZE_LEG'}
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
