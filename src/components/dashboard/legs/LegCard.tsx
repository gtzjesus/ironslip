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
      className={`relative w-full text-left border-[0.5px] p-2 px-2 mb-1 overflow-hidden transition-all duration-300 ${
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
          {/* CATEGORY BADGE */}
          <div className={`inline-block mb-1.5 px-1.5 py-0.25  font-mono text-[7px] uppercase tracking-widest font-bold shadow-[0_0_8px_rgba(250,204,21,0.3)] ${
            isAlreadyInSlip 
              ? 'bg-iron-volt text-black' 
              : isDemonActive 
                ? 'bg-iron-red text-white' 
                : 'bg-yellow-400 text-black'
          }`}>
            {isAlreadyInSlip ? 'ACTIVE' : isDemonActive ? 'DEMON' : leg.category || 'EXECUTION'}
          </div>

          <h3 className={`font-black italic text-xl uppercase tracking-tighter truncate ${
            isAlreadyInSlip ? 'text-white' : isDemonActive ? 'text-iron-red' : 'text-white'
          } ${!isSignedIn ? 'blur-[5px]' : ''}`}>
            {leg.task}
          </h3>
        </div>

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