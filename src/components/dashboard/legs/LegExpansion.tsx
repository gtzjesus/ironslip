/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { Skull, Shield } from 'lucide-react';

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
  // ⚡️ ESTADO CLAVE: El usuario decide si quiere desbloquear el infierno o ir normal
  const [isDemonSelected, setIsDemonSelected] = useState(false);

  if (!leg) return null;

  // Extraemos la data dinámicamente según la selección en tiempo real de la UI
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
        buttonBg: 'bg-iron-red shadow-[0_0_25px_rgba(239,68,68,0.25)] text-black font-black',
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
        buttonBg: 'bg-iron-volt shadow-[0_0_25px_rgba(163,230,53,0.15)] text-black font-bold',
      };

  const handleInjectToSlip = () => {
    // 🧠 MUTACIÓN DEL CONTRATO: Empaquetamos la pierna con los valores seleccionados
    const mutatedLeg = {
      ...leg,
      _id: `${leg._id}-${isDemonSelected ? 'demon' : 'regular'}`, // ID único compuesto
      task: isDemonSelected ? `${leg.task} 👹` : leg.task,
      creditReward: creditsEarned,
      isDemon: isDemonSelected,
      requirementValue: targetDescription,
      requirementUnit: '', // Limpiamos para usar la descripción directa de Sanity
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
            className="absolute top-5 right-5 text-white font-mono text-[12px] uppercase tracking-[0.4em] bg-red-600 px-2 py-1 z-[100] shadow-md active:scale-90 transition-all border border-white/10"
          >
            [ X ]
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-hide relative space-y-5 z-10">
          <div className="space-y-1 relative z-10 pr-16 mt-4">
            <h2 className={`${theme.titleText} font-black italic text-6xl uppercase tracking-tighter leading-none mt-1 transition-colors duration-500`}>
              {leg.task}
            </h2>
          </div>

          {/* ⚡️ INTERRUPTOR DE PROTOCOLO DEMONÍACO (THE TOGGLE BLOCK) */}
          <div className={`border p-4 relative z-10 flex items-center justify-between transition-colors duration-500 ${isDemonSelected ? 'border-iron-red/50 bg-iron-red/5' : 'border-zinc-800 bg-zinc-900/20'}`}>
            <div className="flex items-center gap-3">
              {isDemonSelected ? <Skull className="w-6 h-6 text-iron-red animate-bounce" /> : <Shield className="w-6 h-6 text-iron-volt" />}
              <div className="leading-none">
                <p className={`text-[10px] font-mono uppercase tracking-widest ${isDemonSelected ? 'text-iron-red' : 'text-zinc-400'}`}>Difficulty mode</p>
                <p className="text-sm font-black uppercase italic">{isDemonSelected ? '👹 SYSTEM DEMON PROTOCOL ACTIVE' : 'STANDARD CONTRACT'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsDemonSelected(!isDemonSelected)}
              className={`px-4 py-2 font-mono text-xs uppercase font-black tracking-wider transition-all border ${
                isDemonSelected 
                  ? 'bg-iron-red border-white text-black shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              {isDemonSelected ? 'GO REGULAR' : 'UNLEASH DEMON'}
            </button>
          </div>

          {/* CORE DATA MODULE BOX */}
          <div className={`${theme.dataCoreBg} mt-6 space-y-6 relative z-10 p-5 transition-all duration-500`}>
            <div className="flex flex-col border-b border-zinc-800/80 pb-3 gap-1">
              <span className={`${theme.dataLabel} font-mono italic text-[11px] uppercase tracking-wider`}>Target Objective</span>
              <span className={`${theme.dataValue} font-black italic text-2xl uppercase tracking-tight transition-all duration-500`}>
                {targetDescription}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex flex-col">
                <span className={`${theme.dataLabel} font-mono italic text-[11px] uppercase tracking-wider mb-1`}>Verification</span>
                <span className={`${theme.accentText} italic text-md uppercase transition-colors duration-500`}>
                  {leg.verificationMethod === 'video' ? '🎥 AI_VIDEO' : '📸 AI_PHOTO'}
                </span>
              </div>
              
              <div className="flex flex-col text-right">
                <span className={`${theme.dataLabel} font-mono italic text-[11px] uppercase tracking-wider mb-1`}>Contract Yield</span>
                <div className="relative group self-end">
                  <span className={`relative z-10 px-3 font-black italic text-2xl tracking-tighter block ${isDemonSelected ? 'text-iron-red animate-pulse' : 'text-iron-green'}`}>
                    +{creditsEarned} PTS
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
            onClick={handleInjectToSlip}
          >
            <span>{isInSlip ? 'REMOVE FROM SLIP' : 'ADD TO SLIP'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}