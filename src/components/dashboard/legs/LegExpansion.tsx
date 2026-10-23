/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSound } from '@/hooks/useSound';
import AvatarCanvas from '@/components/dashboard/avatar/AvatarCanvas';
import SlipNavbar from '@/components/dashboard/legs/SlipNavbar';
import BottomNav from '@/components/common/BottomNav';

export default function LegExpansion({
  leg,
  onClose,
  currentSlipItems,
  userBalance,
  onRemoveLeg,
  clearSlipData,
  onToggleSlip,
}: any) {
  const { playSound } = useSound();
  const displayCategory = (leg?.category || 'IRON').toUpperCase();
  const [is3DReady, setIs3DReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIs3DReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const { selectedVariants, demonStates } = useMemo(() => {
    if (!leg?.variants) return { selectedVariants: [], demonStates: {} };
    const selected: number[] = [];
    const demons: Record<number, boolean> = {};

    leg.variants.forEach((v: any, index: number) => {
      const isDemonVariant = v.isDemonSupported === true;
      const idBase = `${leg._id}-${v.name}`;
      const targetId = isDemonVariant ? `${idBase}-demon` : idBase;

      if (
        currentSlipItems.some(
          (item: any) =>
            item._id === idBase ||
            item._id === `${idBase}-demon` ||
            item._id === targetId
        )
      ) {
        selected.push(index);
      }
      if (
        isDemonVariant ||
        currentSlipItems.some((item: any) => item._id === `${idBase}-demon`)
      ) {
        demons[index] = true;
      }
    });
    return { selectedVariants: selected, demonStates: demons };
  }, [currentSlipItems, leg]);

  const toggleVariantSelection = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const v = leg?.variants?.[index];
    if (!v) return;

    const isAlreadySelected = selectedVariants.includes(index);
    const isDemonLeg = v.isDemonSupported === true || !!demonStates[index];
    const calculatedId = `${leg._id}-${v.name}${isDemonLeg ? '-demon' : ''}`;

    if (isAlreadySelected) {
      playSound('remove');
      const itemInSlip = currentSlipItems.find(
        (item: any) =>
          item._id === calculatedId || item._id === `${leg._id}-${v.name}`
      );
      if (itemInSlip) onToggleSlip(itemInSlip);
    } else {
      playSound('add');
      onToggleSlip({
        ...leg,
        _id: calculatedId,
        parentLegId: leg._id,
        selectedVariantName: v.name,
        target: v.target,
        verificationMethod: v.verificationMethod,
        task: `${leg.task} (${v.name})${isDemonLeg ? ' 😈' : ''}`,
        creditReward: v.reward,
        probabilityWeight: v.probabilityWeight || 1.5,
        demonMultiplier: v.demonMultiplier || 2.0,
        isDemonSupported: isDemonLeg,
        isDemonMode: isDemonLeg,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full h-full max-w-2xl relative bg-zinc-950 flex flex-col overflow-hidden border-[0.5px] border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* WATERMARK */}
        <div className="text-iron-volt absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden rotate-[-12deg] scale-125 select-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-8 text-7xl font-black italic uppercase whitespace-nowrap"
            >
              {Array.from({ length: 6 }).map((_, j) => (
                <span key={j}>{displayCategory}</span>
              ))}
            </div>
          ))}
        </div>

        {/* HEADER */}
        <div className="p-4 relative z-10 flex justify-between items-center border-b border-zinc-900 bg-zinc-950/80">
          <div>
            <div className="inline-block px-1.5 py-0.5 font-mono text-[6.5px] uppercase tracking-widest font-bold bg-iron-volt/10 text-iron-volt border border-iron-volt/30 mb-1">
              {displayCategory} EXECUTION
            </div>
            <h2 className="text-iron-volt font-black italic text-2xl uppercase tracking-tighter">
              {leg.task}
            </h2>
          </div>
          <button
            onClick={() => {
              playSound('close');
              setTimeout(() => onClose(), 100);
            }}
            className="text-black bg-iron-red hover:bg-red-500 transition-colors px-3 py-1.5 text-[10px] font-mono font-bold uppercase active:scale-95 cursor-pointer"
          >
            [ ESC_x ]
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 relative z-10 overflow-y-auto p-3 custom-scrollbar pb-48">
          {/* AVATAR CANVAS VISOR */}
          <div className="w-full h-44 mb-3 relative flex items-center justify-center border border-zinc-900 bg-zinc-950/40">
            {is3DReady && (
              <AvatarCanvas
                avatarUrl="/models/avatar.glb"
                activeAnimation={leg.animationKey || 'breathingidle'}
              />
            )}
          </div>

          <div className="flex items-center justify-between mb-2 px-0.5 font-mono text-[8px] text-zinc-500 uppercase tracking-widest">
            <span>VARIANTS_LIST ({leg.variants?.length || 0})</span>
            <span className="text-iron-volt font-bold">SELECT_OPTION</span>
          </div>

          {/* 🎴 VISTA SINGULAR EN COLUMNA CON EL DISEÑO DE LEGCARD */}
          <div className="flex flex-col gap-1.5">
            {leg.variants?.map((v: any, i: number) => {
              const isSelected = selectedVariants.includes(i);
              const isDemonActive = !!demonStates[i];

              return (
                <button
                  key={i}
                  onClick={(e) => toggleVariantSelection(i, e)}
                  className={`relative w-full text-left border-[0.5px] overflow-hidden transition-all duration-300 flex flex-col justify-between p-3 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'border-iron-volt bg-iron-volt/[0.03] shadow-[inset_0_0_15px_rgba(163,230,53,0.08),0_0_20px_rgba(163,230,53,0.05)]'
                      : isDemonActive
                      ? 'border-iron-red bg-zinc-950/20'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between w-full mb-2">
                    <div className="flex-1 min-w-0 pr-2">
                      {/* CATEGORY / STATUS BADGE */}
                      <div
                        className={`inline-block mb-1 px-1.5 py-0.5 font-mono text-[6.5px] uppercase tracking-widest font-bold ${
                          isSelected
                            ? 'bg-zinc-700 text-white border-zinc-600'
                            : isDemonActive
                            ? 'bg-iron-red text-white border-red-900'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {isSelected
                          ? 'ACTIVE'
                          : isDemonActive
                          ? 'DEMON'
                          : `VARIANT 0${i + 1}`}
                      </div>

                      {/* TASK NAME */}
                      <h3
                        className={`font-black italic uppercase tracking-tighter truncate text-lg leading-tight ${
                          isSelected
                            ? 'text-white'
                            : isDemonActive
                            ? 'text-iron-red'
                            : 'text-white'
                        }`}
                      >
                        {v.name}
                      </h3>
                    </div>

                    <div className="text-right flex-shrink-0 font-mono text-[8px]">
                      <span className={isSelected ? 'text-iron-volt font-bold' : 'text-zinc-400'}>
                        +{v.reward || 50} CR
                      </span>
                    </div>
                  </div>

                  {/* TARGET BOTTOM BAR */}
                  <div className="flex items-center justify-between text-[7.5px] font-mono uppercase tracking-wider text-zinc-500 pt-1.5 border-t border-zinc-900/80">
                    <span className="truncate">{v.target || 'TARGET'}</span>
                    <span className={isSelected ? 'text-iron-volt font-bold' : 'text-zinc-600'}>
                      {isSelected ? '[ IN SLIP ]' : '[ ADD ]'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SLIP NAVBAR OVERLAY */}
        <div className="absolute bottom-[64px] left-0 w-full z-[90]">
          <SlipNavbar
            activeSlip={currentSlipItems}
            onRemoveLeg={onRemoveLeg}
            clearSlipData={clearSlipData}
            userBalance={userBalance}
          />
        </div>
        <BottomNav />
      </div>
    </div>
  );
}