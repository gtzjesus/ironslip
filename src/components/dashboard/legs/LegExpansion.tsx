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
  isInSlip: boolean; // ⚡️ RECIBE TU COMPROBACIÓN INTELIGENTE DE .includes()
}

export default function LegExpansion({
  leg,
  onClose,
  onToggleSlip,
  isInSlip,
}: LegExpansionProps) {
  // Estado para la dificultad
  const [isDemonSelected, setIsDemonSelected] = useState(false);

  // 🔄 EFECTO SENSE: Si ya está en el Slip, forzamos a que si el ID de la misión actual
  // se guardó modificado, no deje romper la selección.
  // Como opcional, si queremos blindar que el REMOVE funcione idóneo, mandamos el ID estructurado
  const targetDescription = isDemonSelected ? leg.demonTarget : leg.regularTarget;
  const creditsEarned = isDemonSelected ? leg.demonReward : leg.regularReward;
  const displayCategory = (leg.category || 'IRON').toUpperCase();

  const theme = isDemonSelected
    ? {
        modalBg: 'bg-zinc-950',
        borderStyle: 'border-x-[0.5px] border-iron-red/40 shadow-[0_0_80px_rgba(239,68,68,0.15)]',
        titleText: 'text-white',
        watermark: 'text-iron-red/[0.05]',
        dataCoreBg: 'bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-iron-red/30',
        dataLabel: 'text-zinc-500',
        dataValue: 'text-iron-red font-black drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]',
        accentText: 'text-iron-red font-black',
        buttonBg: isInSlip 
          ? 'bg-zinc-900 border border-iron-red/40 text-iron-red shadow-[0_0_25px_rgba(239,68,68,0.1)] font-bold' 
          : 'bg-iron-red shadow-[0_0_25px_rgba(239,68,68,0.25)] text-black font-black',
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
    // ⚡️ RECONSTRUCCIÓN DINÁMICA:
    // Tanto para agregar como para remover, generamos el ID exacto combinado.
    // Tu función `toggleLegInSlip` en el padre va a usar el `.includes()` o un `.find()`
    // y al pasarle este objeto con el ID correspondiente sabrá exactamente qué hacer.
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden p-0">
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

        {/* HEADER */}
        <div className="p-8 pb-4 relative z-10 flex justify-end items-end border-b-4 border-black/10">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-black font-mono text-[12px] uppercase tracking-[0.4em] bg-red-600 px-2 py-1 z-[100] shadow-md active:scale-90 transition-all border border-white/10"
          >
            [ x ]
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-hide relative space-y-5 z-10 pb-24">
          
          {/* HEADER DE MISION ASIMÉTRICO */}
          <div className="flex justify-between items-start gap-4 relative z-10 mt-2">
            <h2 className={`${theme.titleText} font-black italic text-4xl sm:text-6xl uppercase tracking-tighter leading-none transition-colors duration-500 max-w-[65%]`}>
              {leg.task}
            </h2>

            {/* INTERRUPTOR DE DIFICULTAD (Se congela completamente si ya está en el Slip) */}
            <button
              onClick={() => !isInSlip && setIsDemonSelected(!isDemonSelected)}
              disabled={isInSlip}
              className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] sm:text-xs uppercase font-black tracking-wider transition-all border shrink-0 mt-1 sm:mt-2 shadow-md ${
                isInSlip ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
              } ${
                isDemonSelected 
                  ? 'bg-iron-volt text-black border-iron-volt shadow-[0_0_15px_rgba(241,194,50,0.3)]' 
                  : 'bg-iron-red text-black border-iron-red shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              }`}
            >
              {isDemonSelected ? <Skull className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
              <span>{isDemonSelected ? 'GO STANDARD' : 'GO DEMON'}</span>
            </button>
          </div>

          {/* ORACLE PROMPT BOX */}
          {(isDemonSelected ? leg.demonAiPrompt : leg.regularAiPrompt) && (
            <div className={`border p-4 font-mono transition-all duration-500 rounded-sm text-left space-y-1.5 ${isDemonSelected ? 'bg-iron-red/[0.02] border-iron-red/20' : 'bg-zinc-900/30 border-zinc-800/60'}`}>
              <div className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase opacity-60">
                <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                <span>ORACLE_AI_INSTRUCTIONS</span>
              </div>
              <p className="text-[11px] leading-relaxed font-medium italic text-zinc-400 border-l border-zinc-800 pl-3">
                "{isDemonSelected ? leg.demonAiPrompt : leg.regularAiPrompt}"
              </p>
            </div>
          )}

          {/* MOTOR 3D DINÁMICO EN TIEMPO REAL */}
          <div className="w-full h-72 border border-zinc-900 rounded-sm bg-zinc-950/60 relative overflow-hidden flex items-center justify-center group">
            <div className={`absolute inset-0 bg-gradient-to-b pointer-events-none z-10 transition-colors duration-500 ${
              isDemonSelected ? 'from-iron-red/5 to-transparent' : 'from-iron-volt/5 to-transparent'
            }`} />

            <AvatarCanvas 
              avatarUrl="/models/avatar.glb" 
              activeAnimation={leg.animationKey || 'Avatar_Idle'} 
              isDemon={isDemonSelected}
            />
          </div>

          {/* CORE DATA MODULE BOX */}
          <div className={`${theme.dataCoreBg} mt-6 space-y-4 relative z-10 p-5 transition-all duration-500`}>
            {/* TARGET */}
            <div className="flex flex-col border-b border-zinc-800/80 pb-4 gap-2">
              <span className={`${theme.dataLabel} font-mono text-[11px] uppercase tracking-wider`}>
                target
              </span>
              <div className="bg-black/40 border border-zinc-900/80 p-3 px-4 rounded-sm">
                <span className="text-white font-mono text-base md:text-lg font-bold tracking-tight block uppercase leading-snug">
                  {targetDescription}
                </span>
              </div>
            </div>

            {/* METADATA GRID */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="flex flex-col">
                <span className={`${theme.dataLabel} font-mono text-[11px] uppercase tracking-wider mb-1`}>Verification</span>
                <span className={`${theme.accentText} font-mono text-xs uppercase tracking-wider transition-colors duration-500`}>
                  {leg.verificationMethod === 'video' ? 'video clip' : 'photo'}
                </span>
              </div>
              
              <div className="flex flex-col text-right justify-end">
                <span className={`${theme.dataLabel} font-mono text-[11px] uppercase tracking-wider mb-1`}>win</span>
                <div className="relative group self-end">
                  <span className={`relative z-10 font-black text-2xl tracking-tighter block ${isDemonSelected ? 'text-iron-red animate-pulse' : 'text-iron-volt'}`}>
                    +{creditsEarned} 
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER ACTION PANEL */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-900 relative z-20">
          <button
            className={`w-full py-4 font-black italic text-2xl uppercase tracking-tighter transition-all active:scale-[0.98] flex flex-col items-center justify-center leading-none ${theme.buttonBg}`}
            onClick={handleActionClick}
          >
            <span>{isInSlip ? 'REMOVE FROM SLIP' : 'ADD TO SLIP'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}