/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { Skull, Shield } from 'lucide-react';
// 🟢 MOTOR 3D EN TIEMPO REAL
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
  const [isDemonSelected, setIsDemonSelected] = useState(false);

  const targetDescription = isDemonSelected ? leg.demonTarget : leg.regularTarget;
  const creditsEarned = isDemonSelected ? leg.demonReward : leg.regularReward;
  const displayCategory = (leg.category || 'IRON').toUpperCase();

  const theme = isDemonSelected
    ? {
        modalBg: 'bg-zinc-950',
        borderStyle: 'border-x-[0.5px] border-iron-red shadow-[0_0_80px_rgba(239,68,68,0.2)]',
        titleText: 'text-white',
        watermark: 'text-iron-red/[0.04]',
        dataCoreBg: 'bg-zinc-900/80 border-[0.5px] border-iron-red',
        dataLabel: 'text-zinc-500',
        dataValue: 'text-iron-red font-black drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]',
        accentText: 'text-iron-red font-black',
        buttonBg: isInSlip 
          ? 'bg-zinc-950 border-2 border-iron-red text-iron-red shadow-[0_0_25px_rgba(239,68,68,0.15)] font-bold' 
          : 'bg-iron-red shadow-[0_0_35px_rgba(239,68,68,0.4)] text-black font-black',
      }
    : {
        modalBg: 'bg-zinc-950',
        borderStyle: 'border-x-[0.5px] border-iron-volt/30 shadow-[0_0_80px_rgba(163,230,53,0.08)]',
        titleText: 'text-iron-volt',
        watermark: 'text-iron-volt/[0.05]',
        dataCoreBg: 'bg-zinc-900/60 backdrop-blur-md border-[0.5px] border-zinc-800/60',
        dataLabel: 'text-zinc-400',
        dataValue: 'text-white',
        accentText: 'text-iron-volt font-bold',
        buttonBg: isInSlip 
          ? 'bg-zinc-900 border border-iron-volt/40 text-iron-volt shadow-[0_0_25px_rgba(163,230,53,0.1)] font-bold' 
          : 'bg-iron-volt shadow-[0_0_25px_rgba(163,230,53,0.15)] text-black font-bold',
      };

  const handleActionClick = () => {
    const mutatedLeg = {
      ...leg,
      _id: `${leg._id}-${isDemonSelected ? 'demon' : 'regular'}`, 
      originalId: leg._id,
      task: isDemonSelected ? `${leg.task} 👹` : leg.task,
      creditReward: creditsEarned,
      isDemon: isDemonSelected,
      requirementValue: targetDescription,
      requirementUnit: '', 
    };

    onToggleSlip(mutatedLeg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden p-0">
      <div className={`w-full h-full max-w-2xl relative flex flex-col overflow-hidden text-white animate-videogame-slam ${theme.modalBg} ${theme.borderStyle}`}>
        
        {/* WATERMARK BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex flex-col gap-2 p-4 rotate-[-12deg] scale-125 opacity-75">
          {[...Array(14)].map((_, rowIndex) => (
            <div 
              key={rowIndex} 
              className="flex whitespace-nowrap gap-6 text-6xl font-black italic tracking-tighter uppercase leading-none"
              style={{ transform: rowIndex % 2 === 0 ? 'translateX(-20px)' : 'translateX(10px)' }}
            >
              {[...Array(6)].map((_, colIndex) => (
                <span key={colIndex} className={theme.watermark}>{displayCategory}</span>
              ))}
            </div>
          ))}
        </div>

        {/* HEADER COMPACTADO */}
        <div className="p-5 pb-2 relative z-50 flex justify-between items-start border-b-[0.5px] border-zinc-900 bg-zinc-950/40 backdrop-blur-sm">
          <h2 className={`${theme.titleText} font-black italic text-3xl sm:text-5xl uppercase tracking-tighter leading-none transition-colors duration-500 max-w-[85%]`}>
            {leg.task}
          </h2>
          <button
            onClick={onClose}
            className="text-black font-mono text-[11px] uppercase tracking-[0.2em] bg-iron-red px-2 py-1 shadow-md active:scale-90 transition-all border border-white/10 shrink-0"
          >
            [ x ]
          </button>
        </div>

        {/* CONTENT (Padding optimizado para empujar la data hacia arriba) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 scrollbar-hide relative space-y-4 z-10 pb-6">

          {/* ORACLE PROMPT BOX */}
          {(isDemonSelected ? leg.demonAiPrompt : leg.regularAiPrompt) && (
            <div className={`border p-3 font-mono transition-all duration-500 rounded-sm text-left space-y-1 ${isDemonSelected ? 'bg-zinc-900/80 border-iron-red' : 'bg-zinc-900/30 border-zinc-800/60'}`}>
              <div className="flex items-center gap-1.5 text-[9px] tracking-widest uppercase opacity-60">
                <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                <span>ORACLE_AI_INSTRUCTIONS</span>
              </div>
              <p className="text-[11px] leading-relaxed font-medium italic text-zinc-400 border-l border-zinc-800 pl-3">
                "{isDemonSelected ? leg.demonAiPrompt : leg.regularAiPrompt}"
              </p>
            </div>
          )}

          {/* MOTOR 3D CON INTERRUPTOR DE DIFICULTAD INTEGRADO FLOTANDO */}
          <div className="w-full h-64 border border-zinc-900 rounded-sm bg-zinc-950/60 relative overflow-hidden flex items-center justify-center group">
            <div className={`absolute inset-0 bg-gradient-to-b pointer-events-none z-10 transition-colors duration-500 ${
              isDemonSelected ? 'from-[#ef4444]/10 to-transparent' : 'from-iron-volt/5 to-transparent'
            }`} />

            {/* ⚡️ BOTÓN FLOTANTE EN EL BACKGROUND DE LA ANIMACIÓN */}
            <button
              onClick={() => !isInSlip && setIsDemonSelected(!isDemonSelected)}
              disabled={isInSlip}
              className={`absolute top-3 left-3 z-30 flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase font-black tracking-wider transition-all border shadow-[0_0_20px_rgba(0,0,0,0.8)] ${
                isInSlip ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'
              } ${
                isDemonSelected 
                  ? 'bg-iron-volt text-black border-iron-volt' 
                  : 'bg-iron-red text-black border-iron-red'
              }`}
            >
              <span>{isDemonSelected ? 'GO STANDARD' : '👹 GO DEMON'}</span>
            </button>

            <AvatarCanvas 
              avatarUrl="/models/avatar.glb" 
              activeAnimation={leg.animationKey || 'Avatar_Idle'} 
              isDemon={isDemonSelected}
            />
          </div>

          {/* CORE DATA MODULE BOX */}
          <div className={`${theme.dataCoreBg} space-y-3 relative z-10 p-4 transition-all duration-500 rounded-sm`}>
            {/* TARGET */}
            <div className="flex flex-col border-b border-zinc-800/60 pb-3 gap-1.5">
              <span className={`${theme.dataLabel} font-mono text-[10px] uppercase tracking-wider`}>
                target
              </span>
              <div className="bg-black/40 border border-zinc-900/80 p-2.5 px-3 rounded-sm">
                <span className="text-white font-mono text-sm md:text-base font-bold tracking-tight block uppercase leading-snug">
                  {targetDescription}
                </span>
              </div>
            </div>

            {/* METADATA GRID */}
            <div className="grid grid-cols-2 gap-4 pt-0.5">
              <div className="flex flex-col justify-center">
                <span className={`${theme.dataLabel} font-mono text-[10px] uppercase tracking-wider mb-0.5`}>Verification</span>
                <span className={`${theme.accentText} font-mono text-xs uppercase tracking-wider transition-colors duration-500`}>
                  {leg.verificationMethod === 'video' ? 'video clip' : 'photo'}
                </span>
              </div>
              
              <div className="flex flex-col text-right justify-center">
                <span className={`${theme.dataLabel} font-mono text-[10px] uppercase tracking-wider mb-0.5`}>win</span>
                <div className="relative group self-end">
                  <span className={`relative z-10 font-black text-2xl tracking-tighter block leading-none ${isDemonSelected ? 'text-iron-red animate-pulse' : 'text-iron-volt'}`}>
                    +{creditsEarned} 
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER ACTION PANEL */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-900 relative z-20">
          <button
            className={`w-full py-3.5 font-black italic text-xl uppercase tracking-tighter transition-all active:scale-[0.98] flex flex-col items-center justify-center leading-none ${theme.buttonBg}`}
            onClick={handleActionClick}
          >
            <span>{isInSlip ? 'REMOVE FROM SLIP' : 'ADD TO SLIP'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}