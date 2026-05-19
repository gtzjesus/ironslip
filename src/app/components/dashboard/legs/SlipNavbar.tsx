/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, ChevronsRight, Lock, Skull } from 'lucide-react'; 
import SlipReviewOverlay from './SlipReviewOverlay'; 

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePhrase, setActivePhrase] = useState('');

  const hasDemon = activeSlip.some(
    (leg) => leg.isDemon || leg.difficulty === 'demon',
  );

  useEffect(() => {
    const list = hasDemon ? DEMON_PHRASES : STANDARD_PHRASES;
    const randomPhrase = list[Math.floor(Math.random() * list.length)];
    setActivePhrase(randomPhrase);
  }, [hasDemon]);

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
                className={`relative overflow-hidden border-y-1 border-x-1 p-3 flex items-center justify-between transition-all duration-300 ${
                  isEligibleToExpand ? 'cursor-pointer' : 'cursor-not-allowed'
                } ${
                  hasDemon 
                    ? 'bg-iron-volt border-iron-red shadow-[0_-10px_40px_rgba(239,68,68,0.5)]' 
                    : 'brightness-[0.85] bg-black border-iron-volt  shadow-[0_-10px_40px_rgba(0,0,0,0.6)]'
                }`}
              >
                {/* HAZARD OVERLAY: Red diagonal warning stripes painted over the yellow base */}
                {hasDemon && (
                  <div className="absolute inset-0 opacity-[0.12] pointer-events-none bg-[linear-gradient(45deg,#ef4444_25%,transparent_25%,transparent_50%,#ef4444_50%,#ef4444_75%,transparent_75%,transparent)] bg-[length:30px_30px]" />
                )}

                <div className="relative z-10 flex items-center gap-3 text-left">
                  <div>
                    <p className={`text-[10px]  text-iron-volt font-mono leading-none uppercase tracking-wider ${
                      hasDemon ? 'text-iron-red flex items-center gap-1 animate-pulse' : 'text-black/60'
                    }`}>
                      {hasDemon ? (
                        <>
                           👹 demon slip
                        </>
                      ) : (
                        'iron slip'
                      )}
                    </p>
                    <p className="text-sm font-black italic uppercase  text-iron-volt">
                      {activeSlip.length} / 5 LEGS
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                  <div className="text-right mr-2">
                    <p className="text-[8px] text-iron-volt font-mono uppercase text-black/50">
                      win up to 1.23x
                    </p>
                    <p className={`text-xs uppercase  text-iron-volt italic leading-none tracking-tight ${
                      hasDemon ? 'text-iron-red font-black tracking-wide' : 'text-black'
                    }`}>
                      {activePhrase}
                    </p>
                  </div>  
                  
                  {/* BUTTON SLOT: Heavy black core with a piercing red glowing aura */}
                  <div 
                    className={`p-3 transition-all duration-300 flex items-center justify-center border-2 overflow-hidden w-11 h-11 ${
                      isEligibleToExpand 
                        ? hasDemon 
                          ? 'bg-black border-iron-red text-iron-red shadow-[0_0_20px_rgba(239,68,68,0.8)]'
                          : 'bg-black border-iron-volt text-iron-volt' 
                        : hasDemon
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-600'
                          : 'bg-black/10 border-black/10 text-black/30'
                    }`}
                  >
                    {isEligibleToExpand ? (
                      <div className="w-5 h-5 relative flex items-center justify-center">
                        <motion.div
                          animate={{ 
                            x: [-6, 6, -6],
                            opacity: [0.6, 1, 0.6] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: hasDemon ? 1.0 : 2.5, 
                            ease: "easeInOut" 
                          }}
                        >
                          <ChevronsRight className="w-5 h-5" />
                        </motion.div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-0.5 relative">
                        <Lock className="w-3 h-3" />
                        <span className="text-[7px] font-mono font-black leading-none">{legsNeeded}</span>
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
          />
        )}
      </AnimatePresence>
    </>
  );
}