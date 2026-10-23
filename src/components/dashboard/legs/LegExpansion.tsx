/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSound } from '@/hooks/useSound';
import AvatarCanvas from '@/components/dashboard/avatar/AvatarCanvas';
import SlipNavbar from '@/components/dashboard/legs/SlipNavbar';
import BottomNav from '@/components/common/BottomNav';
import VariantItem from './VariantItem';

export default function LegExpansion({
  leg,
  onClose,
  currentSlipItems,
  userBalance,
  onRemoveLeg,
  clearSlipData,
  onToggleSlip,
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
      playSound('add');
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
        className="w-full h-full max-w-2xl relative bg-zinc-950 flex flex-col overflow-hidden border border-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🕹️ HUD OVERLAY: ESQUINAS REFORZADAS Y OVERLAY SCANLINE */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-iron-volt z-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-iron-volt z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-iron-volt z-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-iron-volt z-30 pointer-events-none" />

        {/* SCANLINES retro-monitor */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02] z-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0) 50%, rgba(0,0,0,1) 50%)',
            backgroundSize: '100% 4px',
          }}
        />

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

        {/* HEADER TÁCTICO */}
        <div className="p-4 pt-5 relative z-10 flex flex-col gap-1 border-b border-zinc-900/80 bg-zinc-950/80">
          <div className="flex items-center justify-between font-mono text-[8px] tracking-widest text-zinc-500 uppercase">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-iron-volt animate-ping" />
              [SYS.EXPANSION_NODE_v2]
            </span>
            <span className="text-iron-volt font-bold">[ LINK: ONLINE ]</span>
          </div>

          <div className="flex justify-between items-center mt-1">
            <div>
              <span className="font-mono text-[8px] bg-iron-volt/10 text-iron-volt border border-iron-volt/30 px-1.5 py-0.5 uppercase tracking-widest font-bold">
                {displayCategory} EXECUTION
              </span>
              <h2 className="text-iron-volt font-black italic text-2xl uppercase tracking-tighter mt-1">
                {leg.task}
              </h2>
            </div>

            <button
              onClick={() => {
                playSound('close');
                setTimeout(() => onClose(), 100);
              }}
              className="text-black bg-iron-red hover:bg-red-500 transition-colors px-3 py-1.5 text-[10px] font-mono font-black uppercase tracking-wider active:scale-95 shadow-[0_0_10px_rgba(220,38,38,0.5)] cursor-pointer"
            >
              [ ESC_x ]
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 relative z-10 overflow-y-auto p-3 custom-scrollbar pb-48">
          
          {/* VISOR TÁCTICO DE PUNTERÍA ALREDEDOR DEL AVATAR */}
          <div className="relative w-full h-48 mb-4 border border-zinc-800/60 bg-zinc-900/20 flex items-center justify-center overflow-hidden">
            {/* Esquinas tácticas del visor */}
            <div className="absolute top-1 left-1 font-mono text-[7px] text-zinc-600 tracking-wider">
              [TARGET_ACQUIRED]
            </div>
            <div className="absolute top-1 right-1 font-mono text-[7px] text-iron-volt/60 tracking-wider">
              VIEW_360°
            </div>
            <div className="absolute bottom-1 left-1 font-mono text-[6.5px] text-zinc-600">
              ID: {leg._id?.slice(0, 12)}...
            </div>
            <div className="absolute bottom-1 right-1 font-mono text-[6.5px] text-zinc-600">
              ANIM: {leg.animationKey || 'IDLE'}
            </div>

            {/* Malla de mira de francotirador / Target overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <div className="w-32 h-32 border border-iron-volt rounded-full" />
              <div className="w-48 h-[1px] bg-iron-volt absolute" />
              <div className="h-48 w-[1px] bg-iron-volt absolute" />
            </div>

            {is3DReady && (
              <AvatarCanvas
                avatarUrl="/models/avatar.glb"
                activeAnimation={leg.animationKey || 'breathingidle'}
              />
            )}
          </div>

          {/* BARRA BANNER DE STATUS PREVIO A LAS VARIANTES */}
          <div className="flex items-center justify-between mb-2 px-1 font-mono text-[8px] text-zinc-500 uppercase tracking-widest">
            <span>VARIANTS_LOADED ({leg.variants?.length || 0})</span>
            <span>STATUS: ENCRYPTED_SLIP</span>
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
                onToggleAccordion={() => {
                  setExpandedIndex(expandedIndex === i ? null : i);
                  playSound('open-card');
                }}
                onToggleSelection={(e: any) => toggleVariantSelection(i, e)}
              />
            ))}
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