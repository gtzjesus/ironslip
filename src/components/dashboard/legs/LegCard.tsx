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
}

function LegCardComponent({
  leg,
  onClick,
  isSignedIn,
  isAlreadyInSlip,
}: LegProps) {
  const { playSound } = useSound();
  const isDemon = leg.isDemon === true || leg.difficulty === 'demon';

  // 🔋 OPTIMIZACIÓN DE MEMORIA: Detecta si la tarjeta está visible en la pantalla del usuario
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: '100px', // Carga el avatar 100px antes de que aparezca al scrollear para que no se note el delay
        threshold: 0.01,
      },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const displayReward = isDemon
    ? (leg.demonReward ?? leg.creditReward ?? 350)
    : (leg.regularReward ?? leg.creditReward ?? 100);

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
      className={`relative w-full text-left border-[0.5px] p-4 px-2 mb-1 overflow-hidden transition-all duration-300 ${
        isAlreadyInSlip
          ? 'border-iron-volt bg-iron-volt/[0.03] shadow-[inset_0_0_15px_rgba(163,230,53,0.08),0_0_20px_rgba(163,230,53,0.05)] cursor-pointer hover:bg-iron-volt/[0.06]'
          : isDemon
            ? 'border-iron-red bg-zinc-950/20 cursor-pointer hover:border-white/40'
            : 'bg-zinc-950 border-zinc-800 cursor-pointer hover:border-zinc-600'
      } ${!isSignedIn ? 'cursor-default opacity-40' : ''}`}
    >
      {/* 🦾 BACKGROUND AVATAR HOLOGRÁFICO CON LAZY LOADING */}
      {isSignedIn && (
        <div
          className={`absolute inset-y-0 right-20 w-24 pointer-events-none z-0 select-none overflow-hidden transition-opacity ${isAlreadyInSlip ? 'opacity-60' : 'opacity-45'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950 z-20" />
          <div className="w-40 h-40 absolute -bottom-18 -left-2 pointer-events-none z-10">
            {/* ⚡️ EL TRUCO MAESTRO: Solo renderiza el Canvas 3D si la tarjeta está visible en la pantalla */}
            {isVisible ? (
              <AvatarCanvas
                avatarUrl="/models/avatar.glb"
                activeAnimation={leg.animationKey || 'breathingidle'}
                isDemon={isDemon}
              />
            ) : (
              <div className="w-full h-full bg-transparent" /> // Placeholder vacío invisible mientras no se ve
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="flex-1 min-w-0 pr-4">
          <p
            className={`font-mono text-[8px] uppercase tracking-widest transition-colors ${
              isAlreadyInSlip
                ? 'text-iron-volt animate-pulse'
                : isDemon
                  ? 'animate-pulse text-iron-red'
                  : 'text-zinc-500'
            }`}
          >
            {isAlreadyInSlip
              ? '⚡ ACTIVE'
              : isDemon
                ? 'DEMON 👹'
                : leg.category || 'LIFTING'}
          </p>

          <h3
            className={`font-black italic text-xl uppercase tracking-tighter truncate transition-all duration-300 ${
              isAlreadyInSlip
                ? 'text-white'
                : isDemon
                  ? 'text-iron-red'
                  : 'text-white'
            } ${!isSignedIn ? 'blur-[5px] select-none opacity-50' : ''}`}
          >
            {leg.task}
          </h3>
        </div>

        <div className="text-right flex flex-col items-end justify-center shrink-0 min-w-[75px] z-30 bg-transparent">
          {isAlreadyInSlip ? (
            <div className="flex flex-col items-end leading-none">
              <p className="font-black italic text-sm text-iron-volt">
                +{displayReward}
              </p>
              <span className="text-[7px] font-mono uppercase font-black text-iron-volt tracking-wider mt-0.5 bg-iron-volt/10 px-1 py-0.5 border border-iron-volt/30 animate-pulse">
                [ in play ]
              </span>
            </div>
          ) : (
            <p
              className={`font-black italic text-sm transition-all duration-500 ${
                isDemon ? 'text-iron-red' : 'text-iron-volt'
              } ${!isSignedIn ? 'blur-[4px] select-none' : ''}`}
            >
              +{displayReward}
            </p>
          )}

          {!isSignedIn && (
            <p className="text-[6px] font-mono uppercase text-iron-red mt-1">
              [ LOCKED ]
            </p>
          )}
        </div>
      </div>

      {!isSignedIn && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent pointer-events-none" />
      )}
    </button>
  );
}

// 🔋 EVITA RENDERS REPETIDOS: React congela el componente y vuela el scroll a 60fps
export default React.memo(LegCardComponent);
