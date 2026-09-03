/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSound } from '@/hooks/useSound';
import { Zap } from 'lucide-react';
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
      const isDemonVariant = v.isDemonSupported === true;
      const idBase = `${leg._id}-${v.name}`;
      const targetId = isDemonVariant ? `${idBase}-demon` : idBase;

      if (currentSlipItems.some((item: any) => item._id === idBase || item._id === `${idBase}-demon` || item._id === targetId)) {
        selected.push(index);
      }
      if (isDemonVariant || currentSlipItems.some((item: any) => item._id === `${idBase}-demon`)) {
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
      const itemInSlip = currentSlipItems.find((item: any) => item._id === calculatedId || item._id === `${leg._id}-${v.name}`);
      if (itemInSlip) onToggleSlip(itemInSlip);
    } else {
      playSound('add');
      onToggleSlip({ 
        ...leg, 
        _id: calculatedId, 
        task: `${leg.task} (${v.name})${isDemonLeg ? ' 😈' : ''}`, 
        creditReward: v.reward, 
        probabilityWeight: v.probabilityWeight || 1.5,
        demonMultiplier: v.demonMultiplier || 1.5,
        isDemonSupported: isDemonLeg,
        isDemonMode: isDemonLeg 
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md" onClick={onClose}>
      <div className="w-full h-full max-w-2xl relative bg-zinc-950 flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        
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
          <h2 className="text-iron-volt font-black italic text-2xl uppercase tracking-tighter truncate">
            {leg.task}
          </h2>
          <button 
            onClick={() => { 
              playSound('close'); 
              setTimeout(() => onClose(), 100); 
            }} 
            className="text-black bg-iron-red px-3 py-1 text-[10px] font-bold uppercase flex-shrink-0"
          >
            [ x ]
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 relative z-10 overflow-y-auto p-3 custom-scrollbar pb-48">
          <div className="w-full h-58 mb-4 flex items-center justify-center">
            {is3DReady && <AvatarCanvas avatarUrl="/models/avatar.glb" activeAnimation={leg.animationKey || 'breathingidle'} />}
          </div>

          <div className="space-y-2">
            {leg.variants?.map((v: any, i: number) => {
              const isDemon = !!demonStates[i];
              return (
                <div key={i} className="relative">
                  <VariantItem 
                    v={v} 
                    index={i} 
                    isExpanded={expandedIndex === i}
                    isSelected={selectedVariants.includes(i)}
                    isDemon={isDemon}
                    onToggleAccordion={() => { setExpandedIndex(expandedIndex === i ? null : i); playSound('select'); }}
                    onToggleSelection={(e: any) => toggleVariantSelection(i, e)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center">
                    {isDemon ? (
                      <span className="text-[14px] animate-bounce select-none">😈</span>
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-[#c4a000] fill-[#c4a000] select-none" />
                    )}
                  </div>
                </div>
              );
            })}
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