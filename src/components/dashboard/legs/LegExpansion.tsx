/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSound } from '@/hooks/useSound';
import AvatarCanvas from '@/components/dashboard/avatar/AvatarCanvas';
import SlipNavbar from '@/components/dashboard/legs/SlipNavbar';
import BottomNav from '@/components/common/BottomNav';

interface LegExpansionProps {
  leg: any;
  onClose: () => void;
  onToggleSlip: (leg: any) => void;
  currentSlipItems: any[];
  userBalance: number;
  onRemoveLeg: (id: string) => void;
  clearSlipData: () => void;
}

export default function LegExpansion({
  leg,
  onClose,
  onToggleSlip,
  currentSlipItems = [],
  userBalance,
  onRemoveLeg,
  clearSlipData,
}: LegExpansionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { playSound } = useSound();
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
      const idBase = `${leg._id}-${v.name}`;
      if (currentSlipItems.some(item => item._id === idBase || item._id === `${idBase}-demon`)) {
        selected.push(index);
        if (currentSlipItems.some(item => item._id === `${idBase}-demon`)) demons[index] = true;
      }
    });
    return { selectedVariants: selected, demonStates: demons };
  }, [currentSlipItems, leg]);

  const activeDemon = useMemo(() => Object.values(demonStates).some(v => v), [demonStates]);

  const toggleVariantSelection = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const v = leg?.variants?.[index];
    if (!v) return;
    const isAlreadySelected = selectedVariants.includes(index);
    const isDemonActive = !!demonStates[index];
    const calculatedId = `${leg._id}-${v.name}${isDemonActive && v.isDemonSupported ? '-demon' : ''}`;

    if (isAlreadySelected) {
      playSound('remove');
      const item = currentSlipItems.find(i => i._id === calculatedId);
      if (item) onToggleSlip(item);
    } else {
      if (currentSlipItems.length >= 5) return;
      playSound('add');
      onToggleSlip({
        ...leg,
        _id: calculatedId,
        task: `${leg.task} (${v.name})${isDemonActive ? ' 😈' : ''}`,
        creditReward: isDemonActive ? Math.round(v.reward * (v.demonMultiplier || 1.5)) : v.reward,
        requirementValue: v.target,
        isDemonMode: isDemonActive,
      });
    }
  };

  const toggleDemonMode = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const v = leg?.variants?.[index];
    if (!v || !v.isDemonSupported) return;
    const nextState = !demonStates[index];
    playSound(nextState ? 'demon' : 'select');
    
    if (selectedVariants.includes(index)) {
      const oldItem = currentSlipItems.find(i => i._id.includes(`${leg._id}-${v.name}`));
      if (oldItem) onToggleSlip(oldItem);
      onToggleSlip({
        ...leg,
        _id: `${leg._id}-${v.name}${nextState ? '-demon' : ''}`,
        task: `${leg.task} (${v.name})${nextState ? ' 😈' : ''}`,
        creditReward: nextState ? Math.round(v.reward * (v.demonMultiplier || 1.5)) : v.reward,
        requirementValue: v.target,
        isDemonMode: nextState,
      });
    } else {
      setExpandedIndex(index);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-0">
      <div className="w-full h-full max-w-2xl relative flex flex-col bg-zinc-950 border-x border-zinc-800">
        <div className="p-5 flex justify-between items-center">
          <h2 className="text-iron-volt font-black italic text-2xl uppercase">{leg.task}</h2>
          <button onClick={onClose} className="bg-iron-red px-2 py-1 text-xs font-bold">[ X ]</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="w-full h-54 bg-black/40 flex items-center justify-center">
            {is3DReady && (
              <AvatarCanvas
                avatarUrl="/models/avatar.glb"
                activeAnimation={activeDemon ? 'demonidle' : (leg.animationKey || 'breathingidle')}
                isDemon={activeDemon}
              />
            )}
          </div>

          <div className="space-y-2">
            {leg.variants?.map((v: any, i: number) => (
              <div key={i} className={`p-4 border ${selectedVariants.includes(i) ? 'border-iron-volt' : 'border-zinc-800'}`} onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}>
                <div className="flex justify-between items-center" onClick={(e) => toggleVariantSelection(i, e)}>
                  <span className="font-bold">{v.name}</span>
                  <span>{demonStates[i] ? Math.round(v.reward * (v.demonMultiplier || 1.5)) : v.reward}</span>
                </div>
                {expandedIndex === i && (
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <button onClick={(e) => toggleDemonMode(i, e)} className={`w-full p-2 ${demonStates[i] ? 'bg-red-900' : 'bg-zinc-800'}`}>
                      {demonStates[i] ? 'DEMON ACTIVE' : 'ACTIVATE DEMON'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-[64px] w-full">
          <SlipNavbar activeSlip={currentSlipItems} onRemoveLeg={onRemoveLeg} clearSlipData={clearSlipData} userBalance={userBalance} />
        </div>
        <BottomNav />
      </div>
    </div>
  );
}