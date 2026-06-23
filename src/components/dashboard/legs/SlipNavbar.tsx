/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
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
  const { playSound } = useSound();

  // Si no hay elementos en el slip, el componente no dibuja nada y no dispara efectos innecesarios
  if (activeSlip.length === 0) return null;

  // 🔥 SOLUCIÓN AL ERROR: Derivamos de forma segura si el overlay debe mostrarse.
  // Si por alguna razón el slip se vacía externamente, evitamos mostrar el overlay de inmediato.
  const isCurrentlyExpanded = isExpanded && activeSlip.length > 0;

  const hasDemon = activeSlip.some(
    (leg) => leg.isDemonMode || leg.isDemon || leg.difficulty === 'demon',
  );

  const MIN_REVIEWS_REQUIRED = 1;
  const isEligibleToExpand = activeSlip.length >= MIN_REVIEWS_REQUIRED;
  const legsNeeded = MIN_REVIEWS_REQUIRED - activeSlip.length;
  const multiplier = 1 + activeSlip.length * 0.1;

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
              className={`relative overflow-hidden border p-3.5 flex items-center justify-between transition-all duration-300 ${
                isEligibleToExpand
                  ? 'cursor-pointer active:scale-[0.98]'
                  : 'cursor-not-allowed'
              } ${
                hasDemon
                  ? 'border-iron-red bg-iron-red shadow-lg shadow-black/80'
                  : 'bg-iron-volt border-iron-volt/40 shadow-lg shadow-black/80'
              }`}
            >
              <div className="relative z-10 flex flex-col justify-center items-start leading-none">
                <p className="text-[9px] font-mono uppercase tracking-[0.15em] mb-1 text-black">
                  {hasDemon ? 'DEMON slip' : 'IRON slip'}
                </p>
                <p className="text-sm font-black uppercase tracking-tight italic leading-none text-black">
                  {activeSlip.length} / 5 LEGS
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="flex flex-col justify-center items-end text-right leading-none">
                  <p className="text-[8px] font-mono uppercase tracking-widest text-black mb-1">
                    win up to x{multiplier.toFixed(2)}
                  </p>
                  <p className="text-sm font-black uppercase tracking-tight italic leading-none text-black">
                    {hasDemon ? 'LOCK IN demon' : 'LOCK IN SLIP'}
                  </p>
                </div>

                <div
                  className={`p-2 transition-all duration-300 flex items-center justify-center border overflow-hidden w-9 h-9 flex-shrink-0 ${
                    isEligibleToExpand
                      ? hasDemon
                        ? 'bg-zinc-900 border-iron-red/50 text-iron-red'
                        : 'bg-zinc-900 border-iron-volt text-iron-volt'
                      : hasDemon
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-600'
                        : 'bg-zinc-950 border-zinc-900 text-zinc-700'
                  }`}
                >
                  {isEligibleToExpand ? (
                    <div className="w-5 h-5 flex items-center justify-center">
                      <ChevronsRight className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-0.5 leading-none">
                      <Lock className="w-2.5 h-2.5 mb-0.5 text-zinc-600" />
                      <span className="text-[8px] font-mono font-black text-black">
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
