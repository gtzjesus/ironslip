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
  onConfirmSuccess?: (result: any) => void;
}

export default function SlipNavbar({
  activeSlip,
  onRemoveLeg,
  clearSlipData,
  userBalance,
  onConfirmSuccess,
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

  const MIN_LEGS_REQUIRED = 3;
  const isEligibleToExpand = activeSlip.length >= MIN_LEGS_REQUIRED;
  const legsNeeded = MIN_LEGS_REQUIRED - activeSlip.length;

  const handleExpand = () => {
    if (isEligibleToExpand) {
      playSound('select');
      setIsExpanded(true);
    } else {
      playSound('remove'); 
    }
  };

  return (
    <>
      {!isCurrentlyExpanded && (
        <div className="fixed bottom-[62.5px] left-0 w-full z-[120] px-3 flex justify-center pointer-events-none animate-videogame-slam">
          <div className="w-full max-w-2xl pointer-events-auto">
            <div
              onClick={handleExpand}
              className={`group relative overflow-hidden p-4 flex items-center justify-between transition-all duration-200 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
                hasDemon
                  ? 'bg-zinc-950 !border-red-600 text-white shadow-[6px_6px_0px_0px_rgba(220,38,38,0.8)]'
                  : 'bg-[#F1C232] text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer'
              }`}
            >
              <div className="relative z-10 flex flex-col justify-center items-start leading-none">
                <p className={`text-[10px] font-mono uppercase tracking-[0.15em] mb-1.5 font-black italic ${
                  hasDemon ? 'text-red-500' : 'text-black'
                }`}>
                  {hasDemon ? 'DEMON SLIP 😈' : 'IRON SLIP'}
                </p>
                <p className={`text-base font-black uppercase tracking-tight italic leading-none ${
                  hasDemon ? 'text-white' : 'text-black'
                }`}>
                  {activeSlip.length} / 5 LEGS
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="flex flex-col justify-center items-end text-right leading-none">
                  {isEligibleToExpand ? (
                    <>
                      <p className={`text-[9px] font-mono uppercase tracking-widest mb-1.5 font-bold italic ${
                        hasDemon ? 'text-zinc-400' : 'text-black/80'
                      }`}>
                        WIN UP TO <span className={hasDemon ? 'text-red-500 font-bold' : 'text-black font-black underline decoration-2'}>x{dynamicMultiplier.toFixed(2)}</span>
                      </p>
                      <p className={`text-sm font-black uppercase tracking-tight italic leading-none ${
                        hasDemon ? 'text-white' : 'text-black'
                      }`}>
                        {hasDemon ? 'START DEMON SLIP' : 'LOCK IN SLIP'}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={`text-[9px] font-mono uppercase tracking-widest mb-1.5 font-bold italic ${
                        hasDemon ? 'text-zinc-400' : 'text-black/80'
                      }`}>
                        ADD {legsNeeded} MORE LEG{legsNeeded > 1 ? 'S' : ''}
                      </p>
                      <p className={`text-xs font-black uppercase tracking-tight italic leading-none ${
                        hasDemon ? 'text-zinc-400' : 'text-black/70'
                      }`}>
                        LOCKED (MIN 3)
                      </p>
                    </>
                  )}
                </div>

                <div
                  className={`p-2 transition-all duration-200 flex items-center justify-center overflow-hidden w-10 h-10 flex-shrink-0 border-2 border-black ${
                    hasDemon
                      ? 'bg-red-950/80 !border-red-600 text-red-500'
                      : 'bg-black text-[#F1C232] shadow-[2px_2px_0px_0px_rgba(255,255,255,0.6)]'
                  }`}
                >
                  {isEligibleToExpand ? (
                    <div className="w-5 h-5 flex items-center justify-center">
                      <ChevronsRight className="w-5 h-5 animate-pulse translate-x-[1px]" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-0.5 leading-none">
                      <Lock className="w-4 h-4 text-[#F1C232] animate-pulse" />
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
          userBalance={userBalance}
          onConfirmSuccess={onConfirmSuccess}
        />
      )}
    </>
  );
}