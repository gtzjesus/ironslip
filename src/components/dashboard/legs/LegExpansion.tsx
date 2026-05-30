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
            [ escape ]
          </button>
        </div>

{/* CONTENT */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-hide relative space-y-5 z-10 pb-24">
          
          {/* HEADER DE MISION */}
          <div className="space-y-1 relative z-10 mt-2">
            <div className="flex items-center gap-1.5 opacity-80">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDemonSelected ? 'bg-iron-red' : 'bg-iron-volt'}`} />
              <span className="text-[9px] font-mono tracking-[0.3em] text-zinc-400 uppercase">{displayCategory} TASK DIRECTIVE</span>
            </div>
            {/* Responsivo (text-4xl a text-6xl) para que nombres largos de tareas se ajusten limpiamente */}
            <h2 className={`${theme.titleText} font-black italic text-4xl sm:text-6xl uppercase tracking-tighter leading-none mt-1 transition-colors duration-500`}>
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
          <div className={`${theme.dataCoreBg} mt-6 space-y-4 relative z-10 p-5 transition-all duration-500`}>
            
            {/* CONTENEDOR CONTRA CHOQUES DE TEXTO LARGO */}
            <div className="flex flex-col border-b border-zinc-800/80 pb-4 gap-2">
              <span className={`${theme.dataLabel} font-mono italic text-[11px] uppercase tracking-wider`}>
                ⚡️ TARGET_OBJECTIVE
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
                <span className={`${theme.dataLabel} font-mono italic text-[11px] uppercase tracking-wider mb-1`}>Verification</span>
                <span className={`${theme.accentText} font-mono text-xs uppercase tracking-wider transition-colors duration-500`}>
                  {leg.verificationMethod === 'video' ? '🎥 SYSTEM_AI_VIDEO' : '📸 SNAPSHOT_AI_PHOTO'}
                </span>
              </div>
              
              <div className="flex flex-col text-right justify-end">
                <span className={`${theme.dataLabel} font-mono italic text-[11px] uppercase tracking-wider mb-1`}>Contract Yield</span>
                <div className="relative group self-end">
                  <span className={`relative z-10 font-black italic text-2xl tracking-tighter block ${isDemonSelected ? 'text-iron-red animate-pulse' : 'text-iron-green'}`}>
                    +{creditsEarned} PTS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 🧠 REGLAS DE EVALUACIÓN DE LA IA (ORACLE PROMPT BOX) */}
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

          {/* SLOT TEMPORAL PARA EL AVATAR DEL FIN DE SEMANA */}
          <div className="w-full border border-dashed border-zinc-900 p-4 py-6 flex items-center justify-center rounded-sm bg-zinc-950/40">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-700 animate-pulse">
              [ SLOT_AVATAR_INTEGRATION_ZONE ]
            </span>
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