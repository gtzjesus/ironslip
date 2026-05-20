'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

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

  // ◄ DYNAMIC THEME ENGINE: Completely separates Neon Volt from Pure Hazard Red
  const theme = isDemonMode
    ? {
        modalBg: '!bg-zinc-950',
        borderStyle: 'border-[0.5px] border-iron-red shadow-[0_0_40px_rgba(239,68,68,0.15)]',
        titleText: 'text-white',
        watermark: 'text-iron-red/10',
        dataCoreBg: 'bg-zinc-900/30 border-[0.5px] border-iron-red/30',
        dataLabel: 'text-zinc-500',
        dataValue: 'text-white',
        accentText: 'text-iron-red font-black', // ◄ Replaces iron-volt with red on Demon
        buttonBg: 'bg-black',
        buttonBorder: 'border-iron-red text-iron-red ',
        warningText: 'text-iron-red animate-pulse',
      }
    : {
        modalBg: '!bg-black',
        borderStyle: 'border-[0.5px] border-zinc-800/80 shadow-[0_0_30px_rgba(0,0,0,0.8)]',
        titleText: 'text-iron-volt',
        watermark: 'text-iron-volt/10',
        dataCoreBg: 'bg-zinc-900/70 border-[0.5px] border-zinc-800/60',
        dataLabel: 'text-zinc-400',
        dataValue: 'text-white',
        accentText: 'text-iron-volt font-bold', // ◄ Uses iron-volt for Standard
        buttonBg: 'bg-black',
        buttonBorder: 'border-iron-volt text-iron-volt ',
        warningText: 'text-iron-volt',
      };

  return (
    // Backdrop Fade
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/90 backdrop-blur-xs overflow-hidden"
    >
      {/* THE MODAL CONTAINER */}
      <motion.div
        initial={{ x: '-100vw' }}
        animate={{ x: 0 }}
        exit={{ x: '100vw' }}
        transition={{ type: 'spring', damping: 28, stiffness: 150 }}
        className={`cl-modalContent ${theme.modalBg} ${theme.borderStyle} w-full max-w-lg h-[85vh] relative flex flex-col overflow-hidden rounded-2xl`}
      >
        {/* THE ABORT BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white font-mono text-[12px] uppercase tracking-[0.4em] bg-iron-red px-2 py-1 z-[100] shadow-md active:scale-90 transition-all border border-white/10"
        >
          [ X ]
        </button>

        {/* 1. SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pt-24 scrollbar-hide relative">
          {/* WATERMARK */}
          <span
            className={`absolute top-4 -left-2 text-9xl font-black italic ${theme.watermark} uppercase pointer-events-none select-none z-0 whitespace-nowrap`}
          >
            {leg.category || 'IRON'}
          </span>

          {/* IDENTITY & HEADER */}
          <div className="space-y-1 relative z-10 pr-16 mb-4">
            <h2
              className={`${theme.titleText} font-black italic text-5xl uppercase tracking-tighter leading-none mt-1`}
            >
              {leg.task}
            </h2>
          </div>

          {/* CORE STATS CARD */}
          <div className={` ${theme.dataCoreBg} mt-10 space-y-7 relative z-10 p-3`}>
            <div className="flex justify-between items-end border-b border-zinc-800/80 pb-3">
              <span className={`${theme.dataLabel} font-mono italic text-[11px] uppercase tracking-wider`}>
                Target 
              </span>
              <span className={`${theme.dataValue} font-black italic text-lg uppercase tracking-tight`}>
                {leg.requirementValue} {leg.requirementUnit}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
              <span className={`${theme.dataLabel} font-mono italic text-[11px] uppercase tracking-wider`}>
                complete in
              </span>
              <span className={`${isDemonMode ? 'text-iron-red' : 'text-white'} font-mono text-sm uppercase font-black italic`}>
                {leg.timeLimit || 24} HOURS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="flex flex-col">
                <span className={`${theme.dataLabel} font-mono italic text-[11px] uppercase tracking-wider mb-1`}>
                  Verification
                </span>
                {/* ◄ FIXED: Swapped out hardcoded text-iron-volt for dynamic theme.accentText */}
                <span className={`${theme.accentText} italic text-md uppercase`}>
                  {leg.verificationMethod === 'video' ? 'video' : leg.verificationMethod === 'photo' ? '📸 PHOTO' : '⏱️ GPS_SYNC'}
                </span>
              </div>
              
              <div className="flex flex-col text-right">
                <span className={`${theme.dataLabel} font-mono italic text-[11px] uppercase tracking-wider mb-1`}>
                  win
                </span>
                <div className="relative group self-end">
                  <div className="absolute inset-0 bg-black -skew-x-12 transform border-r-2 border-iron-green/30" />
                  <span className="relative z-10 px-3 text-iron-green font-black italic text-xl animate-pulse block">
                    +{leg.creditReward || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DEMON ALERT FLOODWAY */}
          {isDemonMode && (
            <div className=" text-iron-red p-3 text-center font-mono text-[10px] font-black z-10  tracking-[0.2em]  animate-pulse">
            DEMON LEG
            </div>
          )}
        </div>

        {/* 2. FIXED BUTTON CONTAINER */}
        <div className="p-6 bg-inherit border-t border-zinc-900 relative z-20">
          <button
            className={`w-full py-4 font-black italic text-lg uppercase transition-all active:scale-[0.97] border-1  transition-all duration-200
              ${isInSlip 
                ? 'bg-iron-red border-iron-red text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                : `${theme.buttonBg} ${theme.buttonBorder}`
              }`}
            onClick={() => {
              onToggleSlip(leg);
              onClose();
            }}
          >
            {isInSlip ? ' remove FROM SLIP' : ' Add to  slip'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}