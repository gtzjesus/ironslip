/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { useSound } from '@/hooks/useSound';
import AvatarCanvas from '@/components/dashboard/avatar/AvatarCanvas';

interface LegExpansionProps {
  leg: any;
  onClose: () => void;
  onToggleSlip: (leg: any) => void;
  isInSlip: boolean;
  currentSlipItems: any[];
}

export default function LegExpansion({
  leg,
  onClose,
  onToggleSlip,
  currentSlipItems = [],
}: LegExpansionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { playSound } = useSound();
  const displayCategory = (leg?.category || 'IRON').toUpperCase();

  // 🔋 OPTIMIZACIÓN DE RENDIMIENTO: Espera a que termine la animación para WebGL
  const [is3DReady, setIs3DReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIs3DReady(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // ⚡ HIDRATACIÓN SÚPER INTERACTIVA DE VARIANTES EN BASE AL SLIP GLOBAL
  const [selectedVariants, setSelectedVariants] = useState<number[]>(() => {
    if (!leg?.variants) return [];
    return leg.variants
      .map((v: any, index: number) => {
        const idBase = `${leg._id}-${v.name}`;
        const matchBase = currentSlipItems.some((item) => item._id === idBase);
        const matchDemon = currentSlipItems.some(
          (item) => item._id === `${idBase}-demon`,
        );
        return matchBase || matchDemon ? index : -1;
      })
      .filter((index: number) => index !== -1);
  });

  // ⚡ HIDRATACIÓN SÚPER INTERACTIVA DEL ESTADO DEMON
  const [demonStates, setDemonStates] = useState<Record<number, boolean>>(
    () => {
      if (!leg?.variants) return {};
      const initialDemons: Record<number, boolean> = {};
      leg.variants.forEach((v: any, index: number) => {
        const matchDemon = currentSlipItems.some(
          (item) => item._id === `${leg._id}-${v.name}-demon`,
        );
        if (matchDemon) {
          initialDemons[index] = true;
        }
      });
      return initialDemons;
    },
  );

  const theme = {
    modalBg: 'bg-zinc-950',
    borderStyle:
      'border-x-[0.5px] border-iron-volt/30 shadow-[0_0_80px_rgba(163,230,53,0.08)]',
    titleText: 'text-iron-volt',
    watermark:
      'text-iron-volt/[0.015] font-black italic text-4xl tracking-tighter select-none uppercase font-mono',
    dataCoreBg:
      'bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-800/40',
    dataLabel: 'text-zinc-500 text-xs tracking-wider uppercase',
    accentText: 'text-iron-volt font-bold',
    buttonBg: 'bg-iron-volt text-black font-bold hover:bg-white',
  };

  const handleVariantAccordionClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    playSound('select');
  };

  // 🔥 CONFIGURACIÓN ULTRA-UX: Agrega o remueve del Slip global en tiempo real al hacer clic
  const toggleVariantSelection = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();

    const isAlreadySelected = selectedVariants.includes(index);
    const v = leg?.variants?.[index];
    if (!v) return;

    const isDemonActive = !!demonStates[index];
    const calculatedId = `${leg._id}-${v.name}${isDemonActive && v.isDemonSupported ? '-demon' : ''}`;

    if (isAlreadySelected) {
      setSelectedVariants((prev) => prev.filter((i) => i !== index));
      playSound('remove');

      const itemInSlip = currentSlipItems.find(
        (item) => item._id === calculatedId,
      );
      if (itemInSlip) {
        onToggleSlip(itemInSlip);
      } else {
        const alternativeId = `${leg._id}-${v.name}${!isDemonActive && v.isDemonSupported ? '-demon' : ''}`;
        const altItem = currentSlipItems.find(
          (item) => item._id === alternativeId,
        );
        if (altItem) onToggleSlip(altItem);
      }
    } else {
      if (currentSlipItems.length >= 5) {
        alert('MAX_CAPACITY: 5_LEGS');
        return;
      }

      setSelectedVariants((prev) => [...prev, index]);
      playSound('add');

      const baseReward = v.reward || 0;
      const finalReward =
        isDemonActive && v.isDemonSupported
          ? Math.round(baseReward * (v.demonMultiplier || 1.5))
          : baseReward;

      const mutatedLeg = {
        ...leg,
        _id: calculatedId,
        task: `${leg.task} (${v.name})${isDemonActive && v.isDemonSupported ? ' 😈' : ''}`,
        creditReward: finalReward,
        requirementValue: v.target,
        isDemonMode: isDemonActive && v.isDemonSupported,
      };

      onToggleSlip(mutatedLeg);
    }
  };

  const toggleDemonMode = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const v = leg?.variants?.[index];
    if (!v) return;

    const oldDemonState = !!demonStates[index];
    const newDemonState = !oldDemonState;
    setDemonStates((prev) => ({ ...prev, [index]: newDemonState }));

    if (newDemonState) {
      playSound('demon');
    } else {
      playSound('select');
    }

    if (selectedVariants.includes(index)) {
      const oldId = `${leg._id}-${v.name}${oldDemonState && v.isDemonSupported ? '-demon' : ''}`;
      const oldItem = currentSlipItems.find((item) => item._id === oldId);
      if (oldItem) onToggleSlip(oldItem);

      const baseReward = v.reward || 0;
      const finalReward =
        newDemonState && v.isDemonSupported
          ? Math.round(baseReward * (v.demonMultiplier || 1.5))
          : baseReward;

      const updatedLeg = {
        ...leg,
        _id: `${leg._id}-${v.name}${newDemonState && v.isDemonSupported ? '-demon' : ''}`,
        task: `${leg.task} (${v.name})${newDemonState && v.isDemonSupported ? ' 😈' : ''}`,
        creditReward: finalReward,
        requirementValue: v.target,
        isDemonMode: newDemonState && v.isDemonSupported,
      };
      onToggleSlip(updatedLeg);
    }
  };

  // 🔥 MANEJADOR DE CIERRE SEGURO: Frena en seco cualquier propagación al layout de atrás
  const handleSafeClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playSound('close');
    onClose();
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-0"
    >
      <div
        className={`w-full h-full max-w-2xl relative flex flex-col overflow-hidden text-white animate-videogame-slam ${theme.modalBg} ${theme.borderStyle}`}
      >
        {/* WATERMARK BACKGROUND */}
        <div className="text-iron-volt absolute inset-0 pointer-events-none overflow-hidden z-0 select-none flex flex-col justify-between p-4 rotate-[-12deg] scale-105">
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-between gap-8 whitespace-nowrap"
              style={{
                transform: `translateX(${rowIndex % 2 === 0 ? '20px' : '-20px'})`,
              }}
            >
              {Array.from({ length: 4 }).map((_, colIndex) => (
                <span key={colIndex} className={theme.watermark}>
                  {displayCategory}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* HEADER */}
        <div className="p-5 pt-6 relative z-10 flex justify-between items-start bg-gradient-to-b from-zinc-950 to-transparent">
          <div>
            <h2
              className={`${theme.titleText} font-black italic text-3xl uppercase tracking-tighter`}
            >
              {leg.task}
            </h2>
          </div>
          <button
            onClick={handleSafeClose}
            className="text-black bg-iron-red hover:bg-white px-2 py-1 text-xs font-bold transition-all duration-150 relative z-20"
          >
            [ X ]
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 relative z-10 custom-scrollbar">
          {/* AVATAR CANVAS PREVIEW */}
          <div className="w-full h-54 border-zinc-900 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center relative overflow-hidden shadow-inner">
            {is3DReady ? (
              <AvatarCanvas
                avatarUrl="/models/avatar.glb"
                activeAnimation={leg.animationKey || 'breathingidle'}
              />
            ) : (
              <div className="w-full h-full bg-transparent" />
            )}
            <div className="absolute bottom-2 right-2 px-2 py-1 text-[9px] text-zinc-500 font-mono uppercase tracking-widest border-zinc-800">
              demo
            </div>
          </div>

          {/* ACCORDION VARIANTS */}
          <div className="space-y-2">
            {leg.variants?.map((v: any, i: number) => {
              const isExpanded = expandedIndex === i;
              const isDemonActive = !!demonStates[i];
              const isVariantSelected = selectedVariants.includes(i);

              return (
                <div
                  key={i}
                  className={`transition-all duration-200 cursor-pointer overflow-hidden backdrop-blur-xs ${
                    isVariantSelected
                      ? 'border-iron-volt bg-zinc-900/90 shadow-[0_0_15px_rgba(163,230,53,0.05)]'
                      : isExpanded
                        ? 'bg-zinc-900/60 border-zinc-700'
                        : 'bg-zinc-900/30 border-zinc-900/80 hover:border-zinc-800 hover:bg-zinc-900/60'
                  }`}
                  onClick={() => handleVariantAccordionClick(i)}
                >
                  {/* ACCORDION HEADER */}
                  <div className="p-4 flex justify-between items-center select-none">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={(e) => toggleVariantSelection(i, e)}
                        className={`w-4 h-4 border flex items-center justify-center font-mono text-[10px] transition-all ${
                          isVariantSelected
                            ? 'bg-iron-volt text-black border-iron-volt font-black shadow-[0_0_8px_#a3e635]'
                            : 'border-zinc-700 bg-black/40 text-transparent hover:border-zinc-500'
                        }`}
                      >
                        ✓
                      </div>
                      <span
                        className={`font-black uppercase tracking-tight text-sm transition-colors ${isExpanded || isVariantSelected ? 'text-iron-volt' : 'text-zinc-300'}`}
                      >
                        {v.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs font-mono font-bold transition-colors ${isExpanded || isVariantSelected ? 'text-iron-green' : 'text-zinc-500'}`}
                      >
                        +
                        {isDemonActive && v.isDemonSupported
                          ? Math.round(v.reward * (v.demonMultiplier || 1.5))
                          : v.reward}
                      </span>
                      <span
                        className={`text-[10px] transition-transform duration-200 ${isExpanded ? 'rotate-180 text-iron-volt' : 'text-zinc-600'}`}
                      >
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* ACCORDION DROP DOWN BODY */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? 'max-h-[340px] border-t border-zinc-800/50 p-4 bg-black/50'
                        : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className={theme.dataLabel}>Target </span>
                        <p className="text-zinc-200 font-bold uppercase mt-0.5 tracking-wide text-sm">
                          {v.target}
                        </p>
                      </div>

                      {v.isDemonSupported && (
                        <div
                          onClick={(e) => toggleDemonMode(i, e)}
                          className={`mt-3 p-3 flex justify-between items-center border transition-all  ${
                            isDemonActive
                              ? 'bg-red-950/40 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                              : 'bg-zinc-950 border-zinc-800/80 text-zinc-500 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`font-black italic text-[11px] tracking-wider flex items-center gap-1 ${isDemonActive ? 'text-red-500 animate-pulse' : ''}`}
                            >
                              😈 DEMON MODE ({v.demonMultiplier || 1.5}x)
                            </span>
                            <span className="text-[9px] opacity-70">
                              Boost execution difficulty for extreme payouts
                            </span>
                          </div>
                          <div
                            className={`w-8 h-4 p-0.5 transition-colors duration-200 ${isDemonActive ? 'bg-red-600' : 'bg-zinc-800'}`}
                          >
                            <div
                              className={`bg-white w-3 h-3 transition-transform duration-200 ${isDemonActive ? 'translate-x-4' : 'translate-x-0'}`}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => toggleVariantSelection(i, e)}
                        className={`w-full py-2.5 mt-2 font-mono tracking-wider border text-[11px] font-black uppercase transition-all duration-150 ${
                          isVariantSelected
                            ? 'bg-red-950/20 border-red-900/60 text-red-400 hover:bg-red-900/30'
                            : 'bg-zinc-900 border-zinc-800 text-iron-volt hover:border-iron-volt'
                        }`}
                      >
                        {isVariantSelected ? 'Remove' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
