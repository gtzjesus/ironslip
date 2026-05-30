/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { Skull, Shield, Cpu, Terminal, Eye, X } from 'lucide-react';

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

  if (!leg) return null;

  // 📋 Extracción dinámica según el Protocolo Seleccionado
  const targetDescription = isDemonSelected ? leg.demonTarget : leg.regularTarget;
  const creditsEarned = isDemonSelected ? leg.demonReward : leg.regularReward;
  const aiInstructions = isDemonSelected ? leg.demonAiPrompt : leg.regularAiPrompt;
  const displayCategory = (leg.category || 'IRON').toUpperCase();

  const theme = isDemonSelected
    ? {
        modalBg: 'bg-zinc-950',
        titleText: 'text-iron-red drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]',
        watermark: 'text-iron-red/[0.03]',
        dataCoreBg: 'bg-zinc-900/30 backdrop-blur-md border border-iron-red/20',
        dataLabel: 'text-iron-red/60 font-mono',
        dataValue: 'text-white font-mono uppercase tracking-wide',
        aiBoxBg: 'bg-iron-red/[0.02] border-iron-red/20 text-zinc-300',
        accentText: 'text-iron-red font-black',
        buttonBg: 'bg-iron-red shadow-[0_0_25px_rgba(239,68,68,0.25)] text-black font-black',
         zebra: 'opacity-10'
      }
    : {
        modalBg: 'bg-zinc-950',
        titleText: 'text-white',
        watermark: 'text-iron-volt/[0.03]',
        dataCoreBg: 'bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80',
        dataLabel: 'text-zinc-500 font-mono',
        dataValue: 'text-zinc-100 font-mono uppercase tracking-wide',
        aiBoxBg: 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400',
        accentText: 'text-iron-volt font-bold',
        buttonBg: 'bg-iron-volt shadow-[0_0_25px_rgba(163,230,53,0.15)] text-black font-bold',
        zebra: 'opacity-0'
      };

  const handleInjectToSlip = () => {
    const mutatedLeg = {
      ...leg,
      _id: `${leg._id}-${isDemonSelected ? 'demon' : 'regular'}`,
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
    // FULL SCREEN CONTAINER
    <div className="fixed inset-0 z-[9999] h-screen w-screen bg-black overflow-hidden animate-videogame-slam flex flex-col rounded-none border-none">
      
      {/* GLOBAL ZEBRA STRIPE OVERLAY ACCENT */}
      <div className={`absolute inset-0 pointer-events-none ${theme.zebra} bg-zebra-stripes z-10 transition-opacity duration-500`} />

      {/* WATERMARK BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex flex-col gap-2 p-4 rotate-[-12deg] scale-125 opacity-40">
        {[...Array(20)].map((_, rowIndex) => (
          <div 
            key={rowIndex} 
            className="flex whitespace-nowrap gap-6 text-7xl md:text-8xl font-black italic tracking-tighter uppercase leading-none"
            style={{ transform: rowIndex % 2 === 0 ? 'translateX(-20px)' : 'translateX(10px)' }}
          >
            {[...Array(10)].map((_, colIndex) => (
              <span key={colIndex} className={theme.watermark}>{displayCategory}</span>
            ))}
          </div>
        ))}
      </div>

      {/* HEADER PANEL - Full Width, No Rounding */}
      <div className="p-4 pt-6 px-6 md:px-10 relative z-20 flex justify-between items-center border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-zinc-600" />
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-600 uppercase leading-none">SYSTEM_INTERFACE</span>
            <span className="font-mono text-[12px] uppercase tracking-widest text-zinc-400 font-bold">CONTRACT_SPECIFICATIONS_LIVE</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-iron-red font-mono text-[11px] uppercase tracking-widest bg-zinc-900 border border-zinc-800 p-3 hover:border-iron-red transition-all flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          [ ESCAPE_INTERFACE ]
        </button>
      </div>

      {/* MAIN BODY (SCROLLABLE) - Maximize space usage */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 relative space-y-6 z-20 custom-scrollbar pb-32">
        
        {/* TITLE & CATEGORY */}
        <div className="space-y-1 mt-2">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full animate-pulse ${isDemonSelected ? 'bg-iron-red' : 'bg-iron-volt'}`} />
            <span className="text-[10px] font-mono tracking-[0.4em] text-zinc-400 uppercase">{displayCategory} DIRECTIVE</span>
          </div>
          <h2 className={`${theme.titleText} font-black italic text-5xl md:text-7xl uppercase tracking-tighter leading-none transition-all duration-500`}>
            {leg.task}
          </h2>
        </div>

        {/* ⚡️ PROTOCOLO TOGGLE - WIDER PANELS */}
        <div className={`border p-5 relative z-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between transition-all duration-500 ${isDemonSelected ? 'border-iron-red/40 bg-iron-red/[0.03]' : 'border-zinc-800 bg-zinc-900/20'}`}>
          <div className="flex items-center gap-4">
            {isDemonSelected ? <Skull className="w-8 h-8 text-iron-red animate-pulse" /> : <Shield className="w-8 h-8 text-iron-volt" />}
            <div className="leading-none">
              <p className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isDemonSelected ? 'text-iron-red' : 'text-zinc-500'}`}>RISK ASSESSMENT LEVEL</p>
              <p className="text-xl font-black uppercase italic tracking-tight">{isDemonSelected ? '👹 SYSTEM DEMON PROTOCOL ACTIVE' : 'STANDARD ISSUE CONTRACT'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsDemonSelected(!isDemonSelected)}
            className={`px-5 py-3 font-mono text-[11px] uppercase font-black tracking-wider transition-all border w-full md:w-auto ${
              isDemonSelected 
                ? 'bg-iron-red border-white text-black shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                : 'bg-zinc-950 border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500'
            }`}
          >
            {isDemonSelected ? 'REVERT TO REGULAR' : 'UNLEASH DEMON MODE'}
          </button>
        </div>

        {/* PURE DATA GRID - Optimized Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* MAIN TARGET OBJECTIVE - Now 2/3 width on large screens */}
          <div className={`${theme.dataCoreBg} p-6 space-y-4 transition-all duration-500 border xl:col-span-2 flex flex-col`}>
            <span className={`${theme.dataLabel} text-[10px] uppercase tracking-widest flex items-center gap-1.5`}>
              <Eye className="w-3.5 h-3.5" /> REQUIRED_TARGET_OBJECTIVE
            </span>
            <div className="bg-black/60 border border-zinc-900 p-4 px-5 rounded-sm flex-1 flex items-center">
              <span className={`${theme.dataValue} text-2xl md:text-3xl font-bold tracking-tight text-white block leading-tight`}>
                {targetDescription}
              </span>
            </div>
          </div>

          {/* META DATA PANEL - 1/3 width */}
          <div className={`${theme.dataCoreBg} p-6 grid grid-rows-2 gap-4 transition-all duration-500 border`}>
            <div className="flex flex-col border-b border-zinc-900 pb-4">
              <span className={`${theme.dataLabel} text-[10px] uppercase tracking-widest`}>VERIFICATION_METHOD</span>
              <span className={`${theme.accentText} font-mono text-sm uppercase tracking-wider mt-2 flex items-center gap-2`}>
                {leg.verificationMethod === 'video' ? '🎥 [ LIVE_SYSTEM_VIDEO_FEED ]' : '📸 [ SNAPSHOT_VERIFICATION ]'}
              </span>
            </div>
            <div className="flex flex-col text-left pt-2 justify-end">
              <span className={`${theme.dataLabel} text-[10px] uppercase tracking-widest`}>NET_CONTRACT_YIELD</span>
              <span className={`font-black italic text-4xl tracking-tighter mt-1 block ${isDemonSelected ? 'text-iron-red animate-pulse' : 'text-iron-volt'}`}>
                +{creditsEarned} <span className="text-2xl not-italic font-mono opacity-70">PTS</span>
              </span>
            </div>
          </div>
        </div>

        {/* 🧠 EL CEREBRO DE LA IA (AI PROMPT INJECTION DISPLAY) - More prominent */}
        {aiInstructions && (
          <div className={`border p-6 rounded-sm transition-all duration-500 font-mono text-left space-y-3 ${theme.aiBoxBg}`}>
            <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase opacity-80 font-bold">
              <Cpu className="w-4 h-4" />
              <span>ORACLE_EVALUATION_LOGIC (AI_READ)</span>
            </div>
            <div className="border-l-2 border-dashed border-zinc-700 pl-5 py-1">
              <p className="text-[12px] md:text-13px] leading-relaxed font-medium italic opacity-95 text-zinc-100">
                "{aiInstructions}"
              </p>
            </div>
          </div>
        )}

        {/* RESERVED SPACE FOR AVATAR CONTAINER */}
        <div className="w-full h-24 border border-dashed border-zinc-800 p-4 flex items-center justify-center rounded-sm bg-zinc-950/20">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-700 animate-pulse">[ FUTURE_AVATAR_INTEGRATION_SLOT ]</span>
        </div>

      </div>

      {/* FOOTER ACTION PANEL - Fixed to bottom, full width */}
      <div className="fixed bottom-0 left-0 right-0 p-6 px-6 md:px-10 bg-zinc-950 border-t border-zinc-900 z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <button
          className={`w-full py-5 font-black italic text-2xl uppercase tracking-tighter transition-all active:scale-[0.99] flex items-center justify-center gap-3 leading-none rounded-none border border-black/20 ${theme.buttonBg}`}
          onClick={handleInjectToSlip}
        >
          {isInSlip ? (
            <>
              <X className="w-7 h-7" />
              <span>VOID CURRENT CONTRACT</span>
            </>
          ) : (
            <>
              <Terminal className="w-7 h-7" />
              <span>add to slip</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}