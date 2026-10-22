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
  isGridView?: boolean;
}

function LegCardComponent({
  leg,
  onClick,
  isSignedIn,
  isAlreadyInSlip,
  hasDemon = false,
  isGridView = false,
}: LegProps) {
  const { playSound } = useSound();
  
  const isDemonActive = hasDemon && leg.variants?.some((v: any) => v.isDemonSupported);

  const [isVisible, setIsVisible] = useState(false);
  const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setIsVisible(entry.isIntersecting); },
      { rootMargin: '100px', threshold: 0.01 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsCanvasLoaded(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

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
      className={`relative w-full text-left border-[0.5px] overflow-hidden transition-all duration-300 flex flex-col justify-between ${
        isGridView ? 'p-2.5 h-32 mb-0' : 'p-3 mb-1'
      } ${
        isAlreadyInSlip
          ? 'border-iron-volt bg-iron-volt/[0.03] shadow-[inset_0_0_15px_rgba(163,230,53,0.08),0_0_20px_rgba(163,230,53,0.05)]'
          : isDemonActive
            ? 'border-iron-red bg-zinc-950/20'
            : 'bg-zinc-950 border-zinc-800'
      } ${!isSignedIn ? 'cursor-default opacity-40' : 'cursor-pointer'}`}
    >
      {/* 🦾 BACKGROUND AVATAR */}
      {isSignedIn && (
        <div className={`pointer-events-none z-0 transition-opacity duration-300 ${
          isCanvasLoaded ? 'opacity-45' : 'opacity-0'
        } ${
          isGridView 
            ? 'absolute inset-0 flex items-center justify-end overflow-hidden pr-[-10px]' 
            : 'absolute inset-y-0 right-0 w-full'
        }`}>
          <div className={`${
            isGridView 
              ? 'w-40 h-40 absolute -bottom-6 -right-2 z-10' 
              : 'w-26 h-26 absolute -bottom-6 -right-0 z-10'
          }`}>
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
      <div className="relative z-10 flex justify-between items-start w-full">
        <div className="flex-1 min-w-0">
          {/* CATEGORY BADGE */}
          <div className={`inline-block mb-1 px-1.5 py-0.5 font-mono text-[6.5px] uppercase tracking-widest font-bold ${
            isAlreadyInSlip 
              ? 'bg-zinc-700 text-white border-zinc-600' 
              : isDemonActive 
                ? 'bg-iron-red text-white border-red-900' 
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
          }`}>
            {isAlreadyInSlip ? 'ACTIVE' : isDemonActive ? 'DEMON' : leg.category || 'EXECUTION'}
          </div>

          <h3 className={`font-black italic uppercase tracking-tighter truncate ${
            isGridView ? 'text-sm leading-tight pr-6' : 'text-xl'
          } ${
            isAlreadyInSlip ? 'text-white' : isDemonActive ? 'text-iron-red' : 'text-white'
          } ${!isSignedIn ? 'blur-[5px]' : ''}`}>
            {leg.task}
          </h3>
        </div>

        {!isSignedIn && (
          <div className="text-right flex-shrink-0">
            <p className="text-[6px] font-mono uppercase text-iron-red">[ LOCKED ]</p>
          </div>
        )}
      </div>

      {isGridView && isSignedIn && (
        <div className="relative z-10 flex items-center justify-between text-[7px] font-mono text-zinc-500 uppercase tracking-wider">
        </div>
      )}
    </button>
  );
}

export default React.memo(LegCardComponent);