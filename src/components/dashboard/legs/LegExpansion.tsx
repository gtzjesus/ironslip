/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { useSound } from '@/hooks/useSound';
import AvatarCanvas from '@/components/dashboard/avatar/AvatarCanvas';

interface LegExpansionProps {
  leg: any;
  onClose: () => void;
  onToggleSlip: (leg: any) => void;
  isInSlip: boolean;
}

export default function LegExpansion({
  leg,
  onClose,
  onToggleSlip,
  isInSlip,
}: LegExpansionProps) {
  // Ahora seleccionamos el objeto completo de la variante
  const [selectedVariant, setSelectedVariant] = useState(leg.variants[0]);
  const { playSound } = useSound();

  const isDemon = selectedVariant.isDemon;
  const displayCategory = (leg.category || 'IRON').toUpperCase();

  const theme = isDemon
    ? {
        modalBg: 'bg-zinc-950',
        borderStyle: 'border-x-[0.5px] border-iron-red shadow-[0_0_80px_rgba(239,68,68,0.2)]',
        titleText: 'text-white',
        watermark: 'text-iron-red/[0.04]',
        dataCoreBg: 'bg-zinc-900/80 border-[0.5px] border-iron-red',
        dataLabel: 'text-zinc-500',
        accentText: 'text-iron-red font-black',
        buttonBg: isInSlip ? 'bg-zinc-950 border-2 border-iron-red text-iron-red' : 'bg-iron-red text-black',
      }
    : {
        modalBg: 'bg-zinc-950',
        borderStyle: 'border-x-[0.5px] border-iron-volt/30 shadow-[0_0_80px_rgba(163,230,53,0.08)]',
        titleText: 'text-iron-volt',
        watermark: 'text-iron-volt/[0.05]',
        dataCoreBg: 'bg-zinc-900/60 border-[0.5px] border-zinc-800/60',
        dataLabel: 'text-zinc-400',
        accentText: 'text-iron-volt font-bold',
        buttonBg: isInSlip ? 'bg-zinc-900 border border-iron-volt/40 text-iron-volt' : 'bg-iron-volt text-black',
      };

  const handleActionClick = () => {
    playSound(isInSlip ? 'remove' : 'add');
    const mutatedLeg = {
      ...leg,
      _id: `${leg._id}-${selectedVariant.name}`,
      task: isDemon ? `${leg.task} (${selectedVariant.name}) 👹` : `${leg.task} (${selectedVariant.name})`,
      creditReward: selectedVariant.reward,
      isDemon: isDemon,
      requirementValue: selectedVariant.target,
    };
    onToggleSlip(mutatedLeg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden p-0">
      <div className={`w-full h-full max-w-2xl relative flex flex-col overflow-hidden text-white animate-videogame-slam ${theme.modalBg} ${theme.borderStyle}`}>
        
        {/* HEADER */}
        <div className="p-5 pt-6 flex justify-between items-start">
          <h2 className={`${theme.titleText} font-black italic text-3xl uppercase tracking-tighter`}>{leg.task}</h2>
          <button onClick={() => { playSound('close'); onClose(); }} className="text-white bg-red-900 px-2 py-1 text-xs">[ X ]</button>
        </div>

        {/* SELECTOR DE VARIANTES */}
        <div className="flex gap-2 px-5 mb-4">
          {leg.variants.map((v: any, idx: number) => (
            <button
              key={idx}
              onClick={() => { playSound('select'); setSelectedVariant(v); }}
              className={`px-3 py-1 text-[10px] uppercase font-bold border transition-all ${
                selectedVariant.name === v.name ? 'border-white bg-white text-black' : 'border-zinc-700 text-zinc-500'
              }`}
            >
              {v.name} {v.isDemon ? '👹' : ''}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="w-full h-64 border border-zinc-900 bg-zinc-950/60 flex items-center justify-center">
            <AvatarCanvas avatarUrl="/models/avatar.glb" activeAnimation={leg.animationKey} isDemon={isDemon} />
          </div>

          <div className={`${theme.dataCoreBg} p-4 space-y-3`}>
            <p className="text-sm font-bold">{selectedVariant.target}</p>
            <p className="text-[10px] font-mono opacity-60">"{selectedVariant.aiPrompt}"</p>
            <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
               <span className={theme.dataLabel}>Reward</span>
               <span className={`text-2xl font-black ${isDemon ? 'text-iron-red' : 'text-iron-volt'}`}>+{selectedVariant.reward}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-900">
          <button onClick={handleActionClick} className={`w-full py-4 font-black uppercase text-xl ${theme.buttonBg}`}>
            {isInSlip ? 'REMOVE FROM SLIP' : 'ADD TO SLIP'}
          </button>
        </div>
      </div>
    </div>
  );
}