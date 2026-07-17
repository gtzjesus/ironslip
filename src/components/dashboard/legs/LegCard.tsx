/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import AvatarCanvas from '@/components/dashboard/avatar/AvatarCanvas';
import { useSound } from '@/hooks/useSound';

interface LegProps {
  leg: any;
  onClick: (leg: any) => void;
  isSignedIn: boolean;
  isAlreadyInSlip: boolean;
  hasDemon?: boolean;
}

function LegCardComponent({
  leg,
  onClick,
  isSignedIn,
  isAlreadyInSlip,
  hasDemon = false,
}: LegProps) {
  const { playSound } = useSound();
  
  // Determinamos el modo Demon basándonos en la configuración global y el soporte del leg
  const isDemonActive = hasDemon && leg.variants?.some((v: any) => v.isDemonSupported);

  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setIsVisible(entry.isIntersecting); },
      { rootMargin: '100px', threshold: 0.01 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const isDisabled = !isSignedIn;

  const handleCardClick = () => {
    if (!isDisabled) {
      playSound('open-card' as any);
      onClick(leg);
    }
  };

  return (
    <button
      ref={cardRef}
      onClick={handleCardClick}
      disabled={isDisabled}
      className={`relative w-full text-left border-[0.5px] p-4 px-3 mb-1 overflow-hidden transition-all duration-300 ${
        isAlreadyInSlip
          ? 'border-iron-volt bg-iron-volt/[0.03] shadow-[inset_0_0_15px_rgba(163,230,53,0.08),0_0_20px_rgba(163,230,53,0.05)]'
          : isDemonActive
            ? 'border-iron-red bg-zinc-950/20'
            : 'bg-zinc-950 border-zinc-800'
      } ${!isSignedIn ? 'cursor-default opacity-40' : 'cursor-pointer'}`}
    >
{/* 🦾 BACKGROUND AVATAR */}
      {isSignedIn && (
        <div className="absolute inset-y-0 right-0 w-full pointer-events-none z-0 opacity-45">
          {/* Quitamos el div del gradiente z-20 que creaba la línea */}
          
          <div className="w-40 h-40 absolute -bottom-16 -right-5 z-10">
            {isVisible && (
              <AvatarCanvas
                avatarUrl="/models/avatar.glb"
                activeAnimation={leg.animationKey || 'breathingidle'}
                isDemon={isDemonActive}
              />
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="flex-1 min-w-0 ">
          <p className={`font-mono text-[8px] uppercase tracking-widest ${
            isAlreadyInSlip ? 'text-iron-volt' : isDemonActive ? 'text-iron-red' : 'text-zinc-500'
          }`}>
            {isAlreadyInSlip ? '⚡ ACTIVE' : isDemonActive ? 'DEMON 👹' : leg.category || 'EXECUTION'}
          </p>

          <h3 className={`font-black italic text-xl uppercase tracking-tighter truncate ${
            isAlreadyInSlip ? 'text-white' : isDemonActive ? 'text-iron-red' : 'text-white'
          } ${!isSignedIn ? 'blur-[5px]' : ''}`}>
            {leg.task}
          </h3>
        </div>

        {/* Espacio reservado para acciones o estados adicionales */}
        {!isSignedIn && (
          <div className="text-right">
            <p className="text-[6px] font-mono uppercase text-iron-red">[ LOCKED ]</p>
          </div>
        )}
      </div>
    </button>
  );
}

export default React.memo(LegCardComponent);