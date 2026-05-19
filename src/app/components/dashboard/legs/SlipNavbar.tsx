/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, ChevronsRight, Lock, Skull } from 'lucide-react'; 
import SlipReviewOverlay from './SlipReviewOverlay'; // Adjust path if needed

const STANDARD_PHRASES = [
  'INITIALIZE CONTRACT',
  'LOCK IN SLIP',
  'EXECUTE PROTOCOL',
  'PUNCH IT',
];

const DEMON_PHRASES = [
  'INITIALIZE HAZARD',
  'ACCEPT TERMS',
  'ENGAGE DRIVE',
  'LOCK AND LOAD',
  'ENTER THE GRID',
  'EXECUTE MAYHEM',
];

interface SlipNavbarProps {
  activeSlip: any[];
  onRemoveLeg: (id: string) => void;
}

export default function SlipNavbar({
  activeSlip,
  onRemoveLeg,
}: SlipNavbarProps) {
  // 1. ALL HOOKS MUST RUN UNCONDITIONALLY AT THE VERY TOP
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePhrase, setActivePhrase] = useState('');

  const hasDemon = activeSlip.some(
    (leg) => leg.isDemon || leg.difficulty === 'demon',
  );
  const baseCredits = activeSlip.reduce(
    (sum, leg) => sum + (leg.creditReward || 0),
    0,
  );
  const multiplier = 1 + activeSlip.length * 0.1;
  const totalPayout = Math.floor(
    baseCredits * (hasDemon ? multiplier + 0.5 : multiplier),
  );

  // Safely randomizes phrases on mount and whenever the active slip updates
  useEffect(() => {
    if (activeSlip.length === 0) return; // Prevent executing if list empty
    const list = hasDemon ? DEMON_PHRASES : STANDARD_PHRASES;
    const randomPhrase = list[Math.floor(Math.random() * list.length)];
    setActivePhrase(randomPhrase);
  }, [activeSlip, hasDemon]);

  // MINIMUM REQUIREMENTS CONFIGURATION
  const MIN_REVIEWS_REQUIRED = 1;
  const isEligibleToExpand = activeSlip.length >= MIN_REVIEWS_REQUIRED;
  const legsNeeded = MIN_REVIEWS_REQUIRED - activeSlip.length;

  // 2. SAFE EARLY RETURN PLACED AFTER ALL HOOKS ARE ACCOUNTED FOR
  if (activeSlip.length === 0) return null;

  return (
    <>
      {/* 1. COMPACT DOCK (Video game style horizontal slide-in) */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ x: '-100vw', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100vw', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed bottom-[64px] left-0 w-full max-w-2xl z-[90] px-2"
          >
            <div
              onClick={() => {
                if (isEligibleToExpand) {
                  setIsExpanded(true);
                }
              }}
              className={`relative overflow-hidden border-t-2 border-x-2 p-3 flex items-center justify-between transition-all duration-300 ${
                isEligibleToExpand ? 'cursor-pointer' : 'cursor-not-allowed'
              } ${
                hasDemon 
                  ? 'bg-zinc-950 border-iron-red shadow-[0_-10px_40px_rgba(239,68,68,0.3)] ' 
                  : 'bg-iron-volt border-black shadow-[0_-10px_40px_rgba(0,0,0,0.6)]'
              }`}
            >
              {/* Dynamic glowing background lines just for the Demon state */}
              {hasDemon && (
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(45deg,#ef4444_25%,transparent_25%,transparent_50%,#ef4444_50%,#ef4444_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[bleed_2s_linear_infinite]" />
              )}

              <div className="relative z-10 flex items-center gap-3 text-left">
                {/* Icon wrapper switches colors */}
                <div className={`p-2 transition-colors ${hasDemon ? 'bg-iron-red' : 'bg-black'}`}>
                  {hasDemon ? (
                    <AlertTriangle className="w-4 h-4 text-black " />
                  ) : (
                    <Zap className="w-4 h-4 text-iron-volt" />
                  )}
                </div>
                <div>
                  <p className={`text-[9px] font-black font-mono leading-none uppercase tracking-wider ${
                    hasDemon ? 'text-iron-red/80' : 'text-black/60'
                  }`}>
                    {hasDemon ? '👹 Your demon slip' : 'Your iron slip'}
                  </p>
                  <p className={`text-sm font-black italic uppercase ${hasDemon ? 'text-white' : 'text-black'}`}>
                    {activeSlip.length} / 5 LEGS
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="text-right mr-2">
                  <p className={`text-[8px] font-black font-mono uppercase ${hasDemon ? 'text-zinc-500' : 'text-black/50'}`}>
                    win up to 1.23x
                  </p>
                  <p className={`text-xs uppercase font-black italic leading-none tracking-tight transition-colors duration-300 ${
                    hasDemon ? 'text-iron-red animate-pulse' : 'text-black'
                  }`}>
                    {hasDemon ? ` ${activePhrase}` : activePhrase}
                    <span className="text-xs not-italic font-mono opacity-70"></span>
                  </p>
                </div>  
                
                {/* ICON ONLY DYNAMIC UTILITY ACTION BUTTON */}
                <div 
                  className={`p-3 transition-all duration-300 flex items-center justify-center border-2 overflow-hidden w-11 h-11 ${
                    isEligibleToExpand 
                      ? hasDemon 
                        ? 'bg-iron-red border-black text-black shadow-[0_0_15px_rgba(239,68,68,0.6)] '
                        : 'bg-black border-black text-iron-volt ' 
                      : hasDemon
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-600'
                        : 'bg-black/10 border-black/10 text-black/30'
                  }`}
                >
                  {isEligibleToExpand ? (
                    hasDemon ? (
                    <ChevronsRight className="w-5 h-5" />
                    ) : (
                      /* Framer Motion Left-to-Right Loop */
                      <div className="w-5 h-5 relative flex items-center justify-center">
                        <motion.div
                          animate={{ 
                            x: [-6, 6, -6],
                            opacity: [0.4, 1, 0.4] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.2, 
                            ease: "easeInOut" 
                          }}
                        >
                          <ChevronsRight className="w-5 h-5" />
                        </motion.div>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center gap-0.5 relative">
                      <Lock className="w-3 h-3" />
                      <span className="text-[7px] font-mono font-black leading-none">{legsNeeded}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. VIDEO GAME REVEAL OVERLAY */}
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
          />
        )}
      </AnimatePresence>
    </>
  );
}