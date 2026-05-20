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
                className={`relative overflow-hidden border p-3.5 flex items-center justify-between transition-all duration-300 ${
                  isEligibleToExpand ? 'cursor-pointer' : 'cursor-not-allowed'
                } ${
                  hasDemon 
                    ? 'border-iron-red bg-zinc-950 shadow-[0_-10px_40px_rgba(239,68,68,0.3)]' 
                    : 'bg-black border-iron-volt/40 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]'
                }`}
              >
                {/* HAZARD OVERLAY */}
                {hasDemon && (
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[linear-gradient(45deg,#ef4444_25%,transparent_25%,transparent_50%,#ef4444_50%,#ef4444_75%,transparent_75%,transparent)] bg-[length:24px_24px]" />
                )}

                {/* LEFT DATA CELL: LEGS VOLUME */}
                <div className="relative z-10 flex flex-col justify-center items-start leading-none">
                  <p className={`text-[9px] font-mono uppercase tracking-[0.15em] mb-1 ${
                    hasDemon ? 'text-iron-red/80 animate-pulse font-black' : 'text-zinc-500'
                  }`}>
                    {hasDemon ? '👹 demon slip' : 'iron slip'}
                  </p>
                  <p className={`text-sm font-black uppercase tracking-tight italic leading-none ${
                    hasDemon ? 'text-white' : 'text-iron-volt'
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
                      hasDemon ? 'text-iron-red' : 'text-iron-volt'
                    }`}>
                      {hasDemon ? 'INITIALIZE HAZARD' : 'LOCK IN SLIP'}
                    </p>
                  </div>  
                  
                  {/* TACTICAL KEY-SLOT TRIGGER BUTTON */}
                  <div 
                    className={`p-3 transition-all duration-300 flex items-center justify-center border rounded-lg overflow-hidden w-11 h-11 flex-shrink-0 ${
                      isEligibleToExpand 
                        ? hasDemon 
                          ? 'bg-black border-iron-red text-iron-red shadow-[0_0_15px_rgba(239,68,68,0.6)]'
                          : 'bg-zinc-900 border-iron-volt text-iron-volt' 
                        : hasDemon
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-600'
                          : 'bg-zinc-950 border-zinc-900 text-zinc-700'
                    }`}
                  >
                    {isEligibleToExpand ? (
                      <div className="w-5 h-5 flex items-center justify-center">
                        <motion.div
                          animate={{ 
                            x: [-2, 2, -2],
                            opacity: [0.7, 1, 0.7] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: hasDemon ? 1.2 : 2.0, 
                            ease: "easeInOut" 
                          }}
                          className="flex items-center justify-center"
                        >
                          <ChevronsRight className="w-5 h-5" />
                        </motion.div>
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
            totalPayout={totalPayout}
            multiplier={multiplier}
            hasDemon={hasDemon}
            minReviewsRequired={MIN_REVIEWS_REQUIRED}
            clearSlipData={clearSlipData}
          />
        )}
      </AnimatePresence>
    </>
  );
}