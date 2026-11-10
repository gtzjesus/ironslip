/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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
  const [is3DReady, setIs3DReady] = useState(false);
  const [avatarSkin, setAvatarSkin] = useState<string>('/models/avatar.glb');
  const [manualCloseTip] = useState(false);

  // 1️⃣ Calcular variantes seleccionadas y auto-expandir la activa al abrir
  const { selectedVariants, demonStates, initialExpandedIndex } = useMemo(() => {
    if (!leg?.variants) return { selectedVariants: [], demonStates: {}, initialExpandedIndex: null };
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

    const firstSelectedIndex = selected.length > 0 ? selected[0] : null;

    return { 
      selectedVariants: selected, 
      demonStates: demons, 
      initialExpandedIndex: firstSelectedIndex 
    };
  }, [currentSlipItems, leg]);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(initialExpandedIndex);

  // 🤏 Estados para el arrastre táctil omnidireccional (Abajo, Izquierda y Derecha)
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });

  // Cargar skin dinámica desde Supabase
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

  const showTip = selectedVariants.length === 0 && !manualCloseTip;

  const handleCardClick = (index: number) => {
    const isSelected = selectedVariants.includes(index);
    const isExpanded = expandedIndex === index;

    if (!isExpanded) {
      playSound('open-card');
      setExpandedIndex(index);
    } else {
      const v = leg?.variants?.[index];
      if (!v) return;

      const isDemonLeg = v.isDemonSupported === true || !!demonStates[index];
      const calculatedId = `${leg._id}-${v.name}${isDemonLeg ? '-demon' : ''}`;

      if (isSelected) {
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
    }
  };

  // 🤏 Gestos táctiles omnidireccionales (Abajo + Izquierda + Derecha)
  const handleTouchStart = (e: React.TouchEvent) => {
    startPosRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentPosRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };

    const deltaX = currentPosRef.current.x - startPosRef.current.x;
    const deltaY = currentPosRef.current.y - startPosRef.current.y;

    setTranslate({
      x: deltaX,
      y: deltaY > 0 ? deltaY : 0,
    });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const isSwipeDown = translate.y > 120;
    const isSwipeLeft = translate.x < -100;
    const isSwipeRight = translate.x > 100;

    if (isSwipeDown || isSwipeLeft || isSwipeRight) {
      playSound('close');
      onClose();
    } else {
      setTranslate({ x: 0, y: 0 });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden"
      onClick={onClose}
    >
      {/* AVATAR 3D */}
      <div className="absolute inset-0 z-0 pointer-events-auto flex items-center justify-center opacity-30 scale-110">
        {is3DReady && (
          <AvatarCanvas
            avatarUrl={avatarSkin}
            activeAnimation={leg.animationKey || 'breathingidle'}
          />
        )}
      </div>

      {/* CONTENEDOR DE LA INTERFAZ CON GESTOS OMNIDIRECCIONALES */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full max-w-2xl relative z-10 bg-[#0d0b09]/75 backdrop-blur-[1px] flex flex-col overflow-hidden border-[0.5px] border-zinc-800 pointer-events-none transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px)`,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scanlines Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] z-[2]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0) 50%, rgba(0,0,0,1) 50%)',
            backgroundSize: '100% 4px',
          }}
        />

        {/* HEADER TÁCTICO */}
        <div className="p-3.5 pt-4 relative z-20 flex justify-between items-center border-b border-zinc-900/80 bg-[#0d0b09]/90 backdrop-blur-sm pointer-events-auto">
          <div className="flex flex-col">
            <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-2 opacity-50" />
            <h2 className="text-[#B89223] font-black italic text-3xl uppercase tracking-tighter leading-none">
              {leg.task}
            </h2>
          </div>
          <button
            onClick={() => {
              playSound('close');
              setTimeout(() => onClose(), 100);
            }}
            className="text-white bg-[#6E1717] hover:bg-[#801B1B] transition-colors px-2.5 py-1 text-[9px] font-mono font-bold uppercase active:scale-95 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] border border-black"
          >
            [ x ]
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 relative z-20 overflow-y-auto p-2 pt-2 flex flex-col justify-start pointer-events-auto">
          
          {/* TIP TÁCTICO */}
          {showTip && (
            <div className="flex items-center justify-between mb-2 px-2 py-1.5 font-mono text-[8.5px] uppercase tracking-widest bg-[#B89223]/5 border border-[#B89223]/20 backdrop-blur-xs text-zinc-300">
              <span className="flex items-center gap-1.5 truncate pr-2">
                <span className="text-[#B89223] font-bold truncate">Tap to reveal, tap again to add to slip</span> 
              </span>
            </div>
          )}

          {/* LISTA DE VARIANTES */}
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
                        ? 'border-[#6E1717] bg-[#6E1717]/25 text-[#E5B2B2] shadow-[0_0_15px_rgba(110,23,23,0.3)]'
                        : 'border-[#B89223] bg-[#B89223]/20 text-zinc-950 shadow-[0_0_15px_rgba(184,146,35,0.25)]'
                      : isExpanded
                      ? 'border-zinc-500 bg-[#0d0b09]/95 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                      : 'bg-[#0d0b09]/85 border-zinc-800/90 text-white hover:border-zinc-700 hover:bg-[#0d0b09]/95'
                  }`}
                >
                  {/* VISTA MÍNIMA */}
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4
                        className={`font-black italic uppercase tracking-tighter truncate text-lg leading-none ${
                          isSelected
                            ? isDemonSupported
                              ? 'text-[#E5B2B2] font-bold'
                              : 'text-zinc-950 font-bold'
                            : 'text-white'
                        }`}
                      >
                        {v.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 font-mono text-[12.5px]">
                      <span className={isSelected ? (isDemonSupported ? 'text-[#E5B2B2] font-bold' : 'text-zinc-950 font-bold') : 'text-zinc-400'}>
                        +{v.reward || 50} 
                      </span>
                      <span className="text-[9px] text-zinc-500">
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* DETALLES REVELADOS */}
                  {isExpanded && (
                    <div className="mt-3 pt-2 border-t border-zinc-800/80 flex flex-col gap-2 animate-fadeIn font-mono">
                      <p className="uppercase text-[11px] text-zinc-300 leading-relaxed">
                        {v.target || 'Execute optimal training parameters for maximum output.'}
                      </p>
                    </div>
                  )}

                  {!isExpanded && isSelected && (
                    <div className="mt-1 pt-1 border-t border-zinc-800/40 flex justify-between items-center font-mono text-[8px] uppercase">
                      <span className={isDemonSupported ? 'text-[#E5B2B2]' : 'text-zinc-950 font-bold'}>
                        {v.target || 'TARGET'}
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