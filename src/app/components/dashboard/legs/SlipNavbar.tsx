/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, ChevronsRight, Lock, Skull } from 'lucide-react'; 
import SlipReviewOverlay from './SlipReviewOverlay'; 

interface SlipNavbarProps {
  activeSlip: any[];
  onRemoveLeg: (id: string) => void;
  clearSlipData: () => void;
}

export default function SlipNavbar({
  activeSlip,
  onRemoveLeg,
  clearSlipData,
}: SlipNavbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasDemon = activeSlip.some(
    (leg) => leg.isDemon || leg.difficulty === 'demon',
  );

  if (activeSlip.length === 0) return null;

  const MIN_REVIEWS_REQUIRED = 1;
  const isEligibleToExpand = activeSlip.length >= MIN_REVIEWS_REQUIRED;
  const legsNeeded = MIN_REVIEWS_REQUIRED - activeSlip.length;

  const baseCredits = activeSlip.reduce(
    (sum, leg) => sum + (leg.creditReward || 0),
    0,
  );
  const multiplier = 1 + activeSlip.length * 0.1;
  const totalPayout = Math.floor(
    baseCredits * (hasDemon ? multiplier + 0.5 : multiplier),
  );

  return (
    <>
      {/* 1. COMPACT DOCK */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ x: '-100vw', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100vw', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed bottom-[64px] left-0 w-full z-[90] px-2 flex justify-center pointer-events-none"
          >
            <div className="w-full max-w-2xl pointer-events-auto">
              <div
                onClick={() => {
                  if (isEligibleToExpand) {
                    setIsExpanded(true);
                  }
                }}
                className={`relative overflow-hidden border p-3.5 flex items-center justify-between transition-all duration-300  ${
                  isEligibleToExpand ? 'cursor-pointer' : 'cursor-not-allowed'
                } ${
                  hasDemon 
                    ? 'border-iron-red brightness-[0.75] bg-iron-red shadow-lg shadow-black/80' // ◄ CLEAN: Pure matte black, crisp red border, no background glow cards
                    : 'bg-iron-volt brightness-[0.75] border-iron-volt/40 shadow-lg  shadow-black/80'
                }`}
              >
                {/* LEFT DATA CELL: LEGS VOLUME */}
                <div className="relative z-10 flex flex-col justify-center items-start leading-none">
                  <p className="text-[9px] font-mono uppercase tracking-[0.15em] mb-1 text-zinc-500">
                    {/* ◄ CLEAN: Removed separate colored indicators, keeping text clean and readable */}
                    {hasDemon ? 'DEMON slip' : 'IRON slip'}
                  </p>
                  <p className={`text-sm font-black uppercase tracking-tight italic leading-none ${
                    hasDemon ? 'text-black' : 'text-black'
                  }`}>
                    {activeSlip.length} / 5 LEGS
                  </p>
                </div>

                {/* RIGHT HUD BLOCK: CONTROLS & TRANSACTION INDEXES */}
                <div className="relative z-10 flex items-center gap-4">
                  {/* TEXT GROUP: STACKED AND ALIGNED TO THE RIGHT */}
                  <div className="flex flex-col justify-center items-end text-right leading-none">
                    <p className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                      win up to x{multiplier.toFixed(2)}
                    </p>
                    <p className={`text-sm font-black uppercase tracking-tight italic leading-none ${
                      hasDemon ? 'text-black' : 'text-black' // ◄ CLEAN: Main typography rests on solid white in demon mode instead of eye-straining red
                    }`}>
                      {hasDemon ? 'LOCK IN demon' : 'LOCK IN SLIP'}
                    </p>
                  </div>  
                  
                  {/* TACTICAL KEY-SLOT TRIGGER BUTTON */}
                  <div 
                    className={`p-2 transition-all duration-300 flex items-center justify-center border  overflow-hidden w-9 h-9 flex-shrink-0 ${
                      isEligibleToExpand 
                        ? hasDemon 
                          ? 'bg-zinc-900 border-iron-red/50 text-iron-red' // ◄ CLEAN: Subtle red interaction box, no pulsing aura blooms
                          : 'bg-zinc-900 border-iron-volt text-iron-volt' 
                        : hasDemon
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-600'
                          : 'bg-zinc-950 border-zinc-900 text-zinc-700'
                    }`}
                  >
                    {isEligibleToExpand ? (
                      <div className="w-5 h-5 flex items-center justify-center">
                        {/* ⚡ INSTANT STATIC NAVIGATION: Stripped layout animation behaviors to stabilize screen tracking */}
                        <div className="flex items-center justify-center text-inherit">
                          <ChevronsRight className="w-5 h-5" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-0.5 leading-none">
                        <Lock className="w-2.5 h-2.5 mb-0.5 text-zinc-600" />
                        <span className="text-[8px] font-mono font-black text-zinc-500">{legsNeeded}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <SlipReviewOverlay
            isOpen={isExpanded}
            onClose={() => setIsExpanded(false)}
            activeSlip={activeSlip}
            onRemoveLeg={onRemoveLeg}
            hasDemon={hasDemon}
            minReviewsRequired={MIN_REVIEWS_REQUIRED}
            clearSlipData={clearSlipData}
          />
        )}
      </AnimatePresence>
    </>
  );
}