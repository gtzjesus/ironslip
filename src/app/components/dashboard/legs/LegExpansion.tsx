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
  // ◄ NEW STATE: Tracks local exit execution state to allow animations to run completely before unmounting
  const [isExiting, setIsExiting] = useState(false);

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

  // ⚡ CUSTOM DISMISSAL INTERCEPTOR: Drives the lighting fast swipe before dropping the component
  const handleControlledClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 180); // Maps 1:1 with your 0.18s horizontal animation sequence
  };

  const isDemonMode = leg.isDemon === true || leg.difficulty === 'demon';
  const displayCategory = (leg.category || 'IRON').toUpperCase();

  const theme = isDemonMode
    ? {
        modalBg: 'bg-zinc-950',
        borderStyle: 'border-x-[0.5px] border-iron-red/40 shadow-[0_0_80px_rgba(239,68,68,0.15)]',
        titleText: 'text-white',
        watermark: 'text-iron-red/[0.03]',
        dataCoreBg: 'bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-iron-red/30',
        dataLabel: 'text-zinc-500',
        dataValue: 'text-white',
        accentText: 'text-iron-red font-black',
        buttonBg: 'bg-iron-red  shadow-[0_0_25px_rgba(239,68,68,0.25)] text-black',
        warningText: 'text-iron-red animate-pulse',
      }
    : {
        modalBg: 'bg-zinc-950',
        borderStyle: 'border-x-[0.5px] border-iron-volt/30 shadow-[0_0_80px_rgba(163,230,53,0.08)]',
        titleText: 'text-iron-volt',
        watermark: 'text-iron-volt/[0.03]',
        dataCoreBg: 'bg-zinc-900/60 backdrop-blur-md border-[0.5px] border-zinc-800/60',
        dataLabel: 'text-zinc-400',
        dataValue: 'text-white',
        accentText: 'text-iron-volt font-bold',
        buttonBg: 'bg-iron-volt  shadow-[0_0_25px_rgba(163,230,53,0.15)] text-black',
        warningText: 'text-iron-volt',
      };

  return (
    // 1. BACKDROP OVERLAY MASK
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }} // Syncs alpha down smoothly on dismissal
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden p-0"
    >
      {/* 2. THE FULL SCREEN HUD DRAWER CONTAINER */}
      <motion.div
        initial={{ x: '-100vw' }}
        animate={{ x: isExiting ? '100vw' : 0 }} // ◄ DRIVES EXECUTION VIEW DISMISSAL LEFT TO RIGHT RIGHT NOW
        exit={{ x: '100vw' }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.18 }}
        className={`w-full h-full max-w-2xl relative flex flex-col overflow-hidden text-white ${theme.modalBg} ${theme.borderStyle}`}
      >
        
        {/* TILED WATERMARK BACKGROUND LAYER */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex flex-col gap-2 p-4 rotate-[-12deg] scale-125 opacity-75">
          {[...Array(14)].map((_, rowIndex) => (
            <div 
              key={rowIndex} 
              className="flex whitespace-nowrap gap-6 text-6xl font-black italic tracking-tighter uppercase leading-none"
              style={{
                transform: rowIndex % 2 === 0 ? 'translateX(-20px)' : 'translateX(10px)'
              }}
            >
              {[...Array(6)].map((_, colIndex) => (
                <span key={colIndex} className={theme.watermark}>
                  {displayCategory}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Striped Zebra Industrial Overlay Accent */}
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none flex gap-4 rotate-12 scale-150 z-[1]" />

        {/* HEADER AREA */}
        <div className="p-8 pb-4 relative z-10 flex justify-end items-end border-b-4 border-black/10">
          <button
            onClick={handleControlledClose} // ◄ Routed to custom dynamic shutdown interceptor
            className="absolute top-5 right-5 text-white font-mono text-[12px] uppercase tracking-[0.4em] bg-red-600 px-2 py-1 z-[100] shadow-md active:scale-90 transition-all border border-white/10"
          >
            [ X ]
          </button>
        </div>

        {/* SCROLLABLE CONTENT AREA VIEWFIELD */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-hide relative space-y-5 z-10">
          
          {/* IDENTITY PROTOCOL TAGGING */}
          <div className="space-y-1 relative z-10 pr-16 mt-4">
            <h2
              className={`${theme.titleText} font-black italic text-6xl uppercase tracking-tighter leading-none mt-1`}
            >
              {leg.task}
            </h2>
          </div>

          {/* COHESIVE CORE DATA MODULE BOX */}
          <div className={`${theme.dataCoreBg} mt-6 space-y-6 relative z-10 p-5 rounded-xl`}>
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

            <div className="grid grid-cols-2 gap-4 pt-5">
              <div className="flex flex-col">
                <span className={`${theme.dataLabel} font-mono italic text-[11px] uppercase tracking-wider mb-1`}>
                  Verification 
                </span>
                <span className={`${theme.accentText} italic text-md uppercase`}>
                  {leg.verificationMethod === 'video' ? 'video' : leg.verificationMethod === 'photo' ? 'photo' : '⏱️ GPS_SYNC'}
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

          {/* DEMON PROTOCOL FLOODWAY */}
          {isDemonMode && (
            <div className="uppercase text-iron-red p-3.5 text-center font-mono text-[10px] font-black z-10   tracking-[0.2em]  animate-pulse">
              demon leg
            </div>
          )}
        </div>

        {/* FIXED OPERATION RUNTIME FOOTER PANEL */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-900 relative z-20">
          <button
            className={`w-full py-4 font-black italic text-2xl uppercase tracking-tighter transition-all active:scale-[0.98] flex flex-col items-center justify-center leading-none ${theme.buttonBg}`}
            onClick={() => {
              onToggleSlip(leg);
              // Also update programmatic dismissal when user hits the primary deployment buttons!
              setIsExiting(true);
              setTimeout(() => {
                onClose();
              }, 180);
            }}
          >
            <span>{isInSlip ? 'REMOVE from slip' : 'add to slip'}</span>
         
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}