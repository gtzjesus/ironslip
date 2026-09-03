/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { ChevronsRight, Lock } from 'lucide-react';
import SlipReviewOverlay from './SlipReviewOverlay';
import { useSound } from '@/hooks/useSound';

interface SlipNavbarProps {
  activeSlip: any[];
  onRemoveLeg: (id: string) => void;
  clearSlipData: () => void;
  userBalance: number;
}

export default function SlipNavbar({
  activeSlip,
  onRemoveLeg,
  clearSlipData,
  userBalance,
}: SlipNavbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { playSound } = useSound();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || activeSlip.length === 0) return null;

  const isCurrentlyExpanded = isExpanded && activeSlip.length > 0;

  const hasDemon = activeSlip.some(
    (leg) => leg.isDemonMode || leg.isDemon || leg.difficulty === 'demon' || leg._id?.includes('-demon') || leg.isDemonSupported === true,
  );

  const totalOdds = activeSlip.reduce((acc, item) => {
    const baseWeight = item.probabilityWeight || 1.5;
    const isItemDemon = item.isDemonMode || item.isDemon || item._id?.includes('-demon') || item.isDemonSupported === true;
    const demonMult = item.demonMultiplier || 1.5;
    
    const legOdd = isItemDemon ? baseWeight * demonMult : baseWeight;
    return acc * legOdd;
  }, 1.0);

  const dynamicMultiplier = totalOdds < 1 ? 1.0 : totalOdds;

  const MIN_REVIEWS_REQUIRED = 1;
  const isEligibleToExpand = activeSlip.length >= MIN_REVIEWS_REQUIRED;
  const legsNeeded = MIN_REVIEWS_REQUIRED - activeSlip.length;

  const handleExpand = () => {
    if (isEligibleToExpand) {
      playSound('open-card');
      setIsExpanded(true);
    }
  };

  return (
    <>
      {!isCurrentlyExpanded && (
        <div className="fixed bottom-[64px] left-0 w-full z-[90] px-2 flex justify-center pointer-events-none animate-videogame-slam">
          <div className="w-full max-w-2xl pointer-events-auto">
            <div
              onClick={handleExpand}
              className={`relative overflow-hidden p-3.5 flex items-center justify-between transition-all duration-300 bg-zinc-950 border-[0.5px] ${
                isEligibleToExpand
                  ? 'cursor-pointer active:scale-[0.98]'
                  : 'cursor-not-allowed'
              } ${
                hasDemon
                  ? 'border-red-600/40 shadow-[0_0_25px_rgba(220,38,38,0.35)]'
                  : 'border-iron-volt/30 shadow-[0_0_20px_rgba(255,211,0,0.12)]'
              }`}
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
                `,
                backgroundSize: '64px 64px',
              }}
            >
              {/* PATRÓN DE RAYAS DIAGONALES SUTILES */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #fff, #fff 2px, transparent 2px, transparent 8px)'
                }}
              />

              {/* LÍNEA DE ACENTO SUPERIOR */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${hasDemon ? 'bg-red-600' : 'bg-iron-volt'}`} />

              <div className="relative z-10 flex flex-col justify-center items-start leading-none">
                <p className={`text-[9px] font-mono uppercase tracking-[0.15em] mb-1.5 ${hasDemon ? 'text-red-500 font-bold' : 'text-iron-volt'}`}>
                  {hasDemon ? ' DEMON SLIP 😈' : 'IRON SLIP'}
                </p>
                <p className="text-sm font-black uppercase tracking-tight italic leading-none text-zinc-100">
                  {activeSlip.length} / 5 LEGS
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="flex flex-col justify-center items-end text-right leading-none">
                  <p className="text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5">
                    WIN UP TO <span className={hasDemon ? 'text-red-500 font-bold' : 'text-iron-volt font-bold'}>x{dynamicMultiplier.toFixed(2)}</span>
                  </p>
                  <p className="text-sm font-black uppercase tracking-tight italic leading-none text-zinc-100">
                    {hasDemon ? 'start DEMON slip' : 'LOCK IN SLIP'}
                  </p>
                </div>

                <div
                  className={`p-2 transition-all duration-300 flex items-center justify-center overflow-hidden w-9 h-9 flex-shrink-0 border-[0.5px] ${
                    isEligibleToExpand
                      ? hasDemon
                        ? 'bg-red-950/60 border-red-600/50 text-red-500'
                        : 'bg-zinc-900 border-iron-volt/40 text-iron-volt'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                  }`}
                >
                  {isEligibleToExpand ? (
                    <div className="w-5 h-5 flex items-center justify-center">
                      <ChevronsRight className="w-5 h-5 animate-[bounce_1s_infinite] translate-x-[2px]" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-0.5 leading-none">
                      <Lock className="w-2.5 h-2.5 mb-0.5 text-zinc-600" />
                      <span className="text-[8px] font-mono font-black text-zinc-500">
                        {legsNeeded}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCurrentlyExpanded && (
        <SlipReviewOverlay
          isOpen={isCurrentlyExpanded}
          onClose={() => setIsExpanded(false)}
          activeSlip={activeSlip}
          onRemoveLeg={onRemoveLeg}
          hasDemon={hasDemon}
          minReviewsRequired={MIN_REVIEWS_REQUIRED}
          clearSlipData={clearSlipData}
          userBalance={userBalance}
        />
      )}
    </>
  );
}