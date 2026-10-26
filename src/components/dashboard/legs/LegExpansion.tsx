/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSound } from '@/hooks/useSound';
import AvatarCanvas from '@/components/dashboard/avatar/AvatarCanvas';
import SlipNavbar from '@/components/dashboard/legs/SlipNavbar';
import BottomNav from '@/components/common/BottomNav';
import { getUserAvatarSkin } from '@/actions/supabase/avatar';

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
  const [avatarSkin, setAvatarSkin] = useState<string>('/models/avatar.glb');
  const [manualCloseTip, setManualCloseTip] = useState(false);

  // 🟢 Estado para saber qué tarjeta está revelada/inspeccionada
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // 1️⃣ Cargar la skin dinámica del usuario desde Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadSkin() {
      try {
        const res = await getUserAvatarSkin();
        if (isMounted && res?.avatarSkin) {
          setAvatarSkin(res.avatarSkin);
        }
      } catch (err) {
        console.error('Failed fetching dynamic skin for modal:', err);
      } finally {
        if (isMounted) {
          setIs3DReady(true);
        }
      }
    }
    loadSkin();
    return () => {
      isMounted = false;
    };
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

  const showTip = selectedVariants.length === 0 && !manualCloseTip;

  // 🟢 LÓGICA DE INTERACCIÓN POR FASES (REVELAR -> AÑADIR -> REMOVER)
  const handleCardClick = (index: number) => {
    const isSelected = selectedVariants.includes(index);
    const isExpanded = expandedIndex === index;

    if (!isExpanded) {
      // FASE 1: Si no estaba expandida, solo la revelamos
      playSound('open-card');
      setExpandedIndex(index);
    } else {
      // Si ya estaba expandida, el siguiente tap decide si añade o remueve
      const v = leg?.variants?.[index];
      if (!v) return;

      const isDemonLeg = v.isDemonSupported === true || !!demonStates[index];
      const calculatedId = `${leg._id}-${v.name}${isDemonLeg ? '-demon' : ''}`;

      if (isSelected) {
        // FASE 3: Si ya estaba seleccionada, la removemos del slip
        playSound('remove');
        const itemInSlip = currentSlipItems.find(
          (item: any) =>
            item._id === calculatedId || item._id === `${leg._id}-${v.name}`
        );
        if (itemInSlip) onToggleSlip(itemInSlip);
      } else {
        // FASE 2: Si estaba revelada pero no seleccionada, la añadimos al slip
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
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full h-full max-w-2xl relative bg-[#0d0b09] flex flex-col overflow-hidden border-[0.5px] border-zinc-800"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🦾 AVATAR 3D DINÁMICO DE FONDO */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-20 scale-110">
          {is3DReady && (
            <AvatarCanvas
              avatarUrl={avatarSkin}
              activeAnimation={leg.animationKey || 'breathingidle'}
            />
          )}
        </div>

        {/* Scanlines Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] z-[1]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0) 50%, rgba(0,0,0,1) 50%)',
            backgroundSize: '100% 4px',
          }}
        />

        {/* HEADER TÁCTICO FLOTANTE */}
        <div className="p-3.5 pt-4 relative z-20 flex justify-between items-center border-b border-zinc-900/80 bg-[#0d0b09]/80 backdrop-blur-sm">
          <div>
            <h2 className="text-iron-volt font-black italic text-3xl uppercase tracking-tighter leading-none">
              {leg.task}
            </h2>
          </div>
          <button
            onClick={() => {
              playSound('close');
              setTimeout(() => onClose(), 100);
            }}
            className="text-black bg-iron-red hover:bg-red-500 transition-colors px-2.5 py-1 text-[9px] font-mono font-bold uppercase active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(220,38,38,0.5)]"
          >
            [ x ]
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 relative z-20 overflow-hidden p-2 pt-2 flex flex-col justify-start">
          
          {/* 💡 TIP TÁCTICO */}
          {showTip && (
            <div className="flex items-center justify-between mb-2 px-2 py-1.5 font-mono text-[8.5px] uppercase tracking-widest bg-iron-volt/5 border border-iron-volt/20 backdrop-blur-xs text-zinc-300">
              <span className="flex items-center gap-1.5 truncate pr-2">
                <span className="text-iron-volt font-bold truncate">Tap variant to reveal, tap again to add or remove</span> 
              </span>
            </div>
          )}

          {/* 🎴 LISTA DE VARIANTES (SOLO TÍTULO Y RECOMPENSA POR DEFECTO) */}
          <div className="flex flex-col gap-2">
            {leg.variants?.map((v: any, i: number) => {
              const isSelected = selectedVariants.includes(i);
              const isDemonSupported = v.isDemonSupported === true || !!demonStates[i];
              const isExpanded = expandedIndex === i;

              return (
                <div
                  key={i}
                  onClick={() => handleCardClick(i)}
                  className={`relative w-full text-left border-[0.5px] overflow-hidden transition-all duration-300 flex flex-col p-3 cursor-pointer backdrop-blur-md active:scale-98 ${
                    isSelected
                      ? isDemonSupported
                        ? 'border-iron-red bg-iron-red/15 text-iron-red shadow-[0_0_20px_rgba(220,38,38,0.25)]'
                        : 'border-iron-volt bg-iron-volt/15 text-iron-volt shadow-[0_0_20px_rgba(255,211,0,0.2)]'
                      : isExpanded
                      ? 'border-zinc-500 bg-[#0d0b09]/90 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                      : 'bg-[#0d0b09]/75 border-zinc-800/90 text-white hover:border-zinc-700 hover:bg-[#0d0b09]/90'
                  }`}
                >
                  {/* VISTA MÍNIMA (TÍTULO Y RECOMPENSA) */}
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4
                        className={`font-black italic uppercase tracking-tighter truncate text-lg leading-none ${
                          isSelected
                            ? isDemonSupported
                              ? 'text-iron-red'
                              : 'text-iron-volt'
                            : 'text-white'
                        }`}
                      >
                        {v.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 font-mono text-[12.5px]">
                      <span className={isSelected ? (isDemonSupported ? 'text-iron-red font-bold' : 'text-iron-volt font-bold') : 'text-zinc-400'}>
                        +{v.reward || 50} CR
                      </span>
                      <span className="text-[9px] text-zinc-500">
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* 🔍 DETALLES REVELADOS AL HACER EL PRIMER TAP */}
                  {isExpanded && (
                    <div className="mt-3 pt-2 border-t border-zinc-800/80 flex flex-col gap-2 animate-fadeIn font-mono">
                      <span className="text-[7.5px] uppercase tracking-widest text-zinc-500">
                        TARGET_SPEC:
                      </span>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        {v.target || 'Execute optimal training parameters for maximum output.'}
                      </p>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/50 mt-1">
                        <span className="text-[8.5px] text-zinc-400 uppercase">
                          {isSelected ? '[ STATUS: IN_SLIP ]' : '[ TAP AGAIN TO ADD ]'}
                        </span>
                        <span className={`text-[8.5px] font-bold tracking-widest uppercase ${isSelected ? (isDemonSupported ? 'text-iron-red' : 'text-iron-volt') : 'text-zinc-500'}`}>
                          {isSelected ? '[ REMOVE ]' : '[ ADD ]'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ETIQUETA RÁPIDA CUANDO ESTÁ SELECCIONADA PERO COLAPSADA */}
                  {!isExpanded && isSelected && (
                    <div className="mt-1 pt-1 border-t border-zinc-800/40 flex justify-between items-center font-mono text-[8px] uppercase">
                      <span className={isDemonSupported ? 'text-iron-red' : 'text-iron-volt'}>
                        {v.target || 'TARGET'}
                      </span>
                      <span className={isDemonSupported ? 'text-iron-red font-bold tracking-widest' : 'text-iron-volt font-bold tracking-widest'}>
                        [ picked ]
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER OVERLAYS */}
        <div className="absolute bottom-[64px] left-0 w-full z-[90] pointer-events-auto">
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