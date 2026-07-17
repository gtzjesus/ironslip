/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSound } from '@/hooks/useSound';
import AvatarCanvas from '@/components/dashboard/avatar/AvatarCanvas';
import SlipNavbar from '@/components/dashboard/legs/SlipNavbar';
import BottomNav from '@/components/common/BottomNav';
import VariantItem from './VariantItem';

export default function LegExpansion({
  leg, onClose, currentSlipItems, userBalance, onRemoveLeg, clearSlipData, onToggleSlip,
}: any) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
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
      const idBase = `${leg._id}-${v.name}`;
      if (currentSlipItems.some((item: any) => item._id === idBase || item._id === `${idBase}-demon`)) {
        selected.push(index);
      }
      if (currentSlipItems.some((item: any) => item._id === `${idBase}-demon`)) {
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
    const isDemonActive = !!demonStates[index];
    const calculatedId = `${leg._id}-${v.name}${isDemonActive ? '-demon' : ''}`;

    if (isAlreadySelected) {
      playSound('remove');
      const itemInSlip = currentSlipItems.find((item: any) => item._id === calculatedId);
      if (itemInSlip) onToggleSlip(itemInSlip);
    } else {
      playSound('add');
      onToggleSlip({ ...leg, _id: calculatedId, task: `${leg.task} (${v.name})${isDemonActive ? ' 😈' : ''}`, creditReward: v.reward, isDemonMode: isDemonActive });
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md" onClick={onClose}>
      <div className="w-full h-full max-w-2xl relative bg-zinc-950  flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* WATERMARK */}
        <div className="text-iron-volt absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden rotate-[-12deg] scale-125 select-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex gap-8 text-7xl font-black italic uppercase whitespace-nowrap">
              {Array.from({ length: 6 }).map((_, j) => <span key={j}>{displayCategory}</span>)}
            </div>
          ))}
        </div>

        {/* HEADER */}
        <div className="p-5 relative z-10 flex justify-between items-center ">
          <h2 className="text-iron-volt font-black italic text-2xl uppercase tracking-tighter">{leg.task}</h2>
          <button onClick={onClose} className="text-black bg-iron-red px-3 py-1 text-[10px] font-bold  uppercase">[ x ]</button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 relative z-10 overflow-y-auto p-3 custom-scrollbar pb-48">
          <div className="w-full h-68  mb-4  flex items-center justify-center">
            {is3DReady && <AvatarCanvas avatarUrl="/models/avatar.glb" activeAnimation={leg.animationKey || 'breathingidle'} />}
          </div>

          <div className="space-y-2">
            {leg.variants?.map((v: any, i: number) => (
              <VariantItem 
                key={i} 
                v={v} 
                index={i} 
                isExpanded={expandedIndex === i}
                isSelected={selectedVariants.includes(i)}
                isDemon={!!demonStates[i]}
                onToggleAccordion={() => { setExpandedIndex(expandedIndex === i ? null : i); playSound('select'); }}
                onToggleSelection={(e: any) => toggleVariantSelection(i, e)}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-[64px] left-0 w-full z-[90]">
          <SlipNavbar activeSlip={currentSlipItems} onRemoveLeg={onRemoveLeg} clearSlipData={clearSlipData} userBalance={userBalance} />
        </div>
        <BottomNav />
      </div>
    </div>
  );
}