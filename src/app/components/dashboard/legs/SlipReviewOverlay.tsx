/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Coins, Zap } from 'lucide-react';
import { slipStorage } from '@/lib/slipStorage';
import { useRouter } from 'next/navigation';

interface SlipReviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlip: any[];
  onRemoveLeg: (id: string) => void;
  hasDemon: boolean;
  minReviewsRequired: number;
  clearSlipData: () => void;
}

export default function SlipReviewOverlay({
  isOpen,
  onClose,
  activeSlip,
  onRemoveLeg,
  hasDemon,
  minReviewsRequired,
  clearSlipData,
}: SlipReviewOverlayProps) {
  const router = useRouter();
  
  // ◄ TRACKS LOCAL EXIT EXECUTION STATE
  const [isExiting, setIsExiting] = useState(false);
  const [wager, setWager] = useState<number | ''>(10); // Updated to support clean text clearing
  const [userBalance, setUserBalance] = useState<number>(750); // Mock account balance

  // 🧠 ENFORCED CORE BUSINESS LOGIC VALIDATION BOUNDARIES
  const isSlipSizeValid = activeSlip.length >= 3 && activeSlip.length <= 5;

  // ◄ MATH ENGINE: Implements 15% House Margin
  const oddsMatrix = useMemo(() => {
    if (activeSlip.length === 0) return { multiplier: 0, tier: 'NO_RISK', labelStyle: 'text-zinc-500' };
    
    const compoundDifficulty = activeSlip.reduce((acc, leg) => {
      const legWeight = 1 + ((leg.creditReward || 0) / 200);
      return acc * legWeight;
    }, 1);

    const legCountBonus = 1 + (activeSlip.length * 0.12);
    const hazardModifier = hasDemon ? 1.40 : 1.00;

    // Business Protection Margin (House Keeps 15%)
    const HOUSE_EDGE = 0.15; 
    const finalMultiplier = compoundDifficulty * legCountBonus * hazardModifier * (1 - HOUSE_EDGE);

    let tier = 'LOW RISK // SECURE';
    let labelStyle = 'text-green-400 border-green-500/20 bg-green-500/5';
    
    if (finalMultiplier > 2.0 && finalMultiplier <= 4.5) {
      tier = 'CHALLENGING // DECENT YIELD';
      labelStyle = 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5';
    } else if (finalMultiplier > 4.5 && finalMultiplier <= 7.5) {
      tier = 'HIGH VOLATILITY // HEAVY SWEAT';
      labelStyle = 'text-orange-400 border-orange-500/20 bg-orange-500/5';
    } else if (finalMultiplier > 7.5) {
      tier = 'SUICIDE MISSION // GOD SPEED';
      labelStyle = 'text-iron-red border-iron-red/20 bg-iron-red/5 animate-pulse';
    }

    return {
      multiplier: Math.max(finalMultiplier, 1.01),
      tier,
      labelStyle
    };
  }, [activeSlip, hasDemon]);

  // Safe evaluation fallback if input field is blanked out
  const dynamicPayout = Math.floor((Number(wager) || 0) * oddsMatrix.multiplier);

  if (!isOpen) return null;

  // ⚡ CUSTOM DISMISSAL INTERCEPTOR
  const handleControlledClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false); // Reset state container pool
    }, 180);
  };

  // 🔧 FIXED TYPING INTERCEPTOR ENGINE
  const handleWagerChange = (valStr: string) => {
    if (valStr === '') {
      setWager('');
      return;
    }

    const numericValue = Number(valStr);
    if (isNaN(numericValue)) return;

    if (numericValue > userBalance) {
      setWager(userBalance);
      return;
    }
    
    setWager(numericValue);
  };

  const handleExecuteContract = () => {
    const activeWagerNum = Number(wager) || 0;
    
    // 🛡️ HARD SECURITY LOCKDOWN: Stops transactions if parameters bypass standard state checks
    if (!isSlipSizeValid || activeWagerNum <= 0 || activeWagerNum > userBalance) return;

    setUserBalance(prev => prev - activeWagerNum);

    slipStorage.saveSlip({
      title: `${hasDemon ? 'DEMON' : 'IRON'} PARLAY`,
      type: hasDemon ? 'DEMON' : 'IRON',
      wagerAllocated: activeWagerNum,
      totalPayout: dynamicPayout,
      multiplier: oddsMatrix.multiplier,
      legs: activeSlip.map(leg => ({
        _id: leg._id,
        task: leg.task,
        creditReward: leg.creditReward,
        isDemon: leg.isDemon || leg.difficulty === 'demon'
      }))
    });

    clearSlipData();
    
    // Trigger synchronized exit transition on success execution
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false);
      router.push('/slips');
    }, 180);
  };

  // 🎨 PARALLEL THEME CONFIGURATION DESIGN MATRIX
  // 🔄 TRUE INVERSION: Made standard theme solid yellow with all text elements and matching borders mapped to pure black
  const theme = hasDemon
    ? {
        modalBg: 'bg-zinc-950',
        borderStyle: 'border-x-[0.5px] border-iron-red/40 shadow-[0_0_80px_rgba(239,68,68,0.15)]',
        titleText: 'text-white',
        dataCoreBg: 'bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-iron-red/30',
        labelColor: 'text-zinc-500',
        valueColor: 'text-white',
        accentText: 'text-iron-red font-black',
        inputBg: 'bg-black/60 border border-zinc-800 text-white',
        buttonBg: 'bg-iron-red text-black shadow-[0_0_25px_rgba(239,68,68,0.25)]',
      }
    : {
        modalBg: 'bg-zinc-950',
        borderStyle: 'border-x-[0.5px] border-iron-volt/30 shadow-[0_0_80px_rgba(163,230,53,0.08)]',
        titleText: 'text-iron-volt',
        dataCoreBg: 'bg-iron-volt border-t border-black/20', // Solid soft yellow deck plate
        labelColor: 'text-black/60', // Dark contrast labels
        valueColor: 'text-black font-bold', // Dark contrast values
        accentText: 'text-black font-black', // Extra bold target returns
        inputBg: 'bg-white/40 border border-black/20 text-black placeholder-black/40', // Safe, visible high-contrast input values
        buttonBg: 'bg-black text-iron-volt hover:bg-black/90 shadow-md', // Inverted button: solid black with yellow text
      };

  // Custom UI feedback for button depending on contract validation state
  const getButtonLabel = () => {
    if (activeSlip.length < 3) return `3 legs needed (${activeSlip.length}/3)`;
    if (activeSlip.length > 5) return 'MAX CAPACITY MET (MAX 5)';
    return 'initiate slip!';
  };

  return (
    // 1. BACKDROP OVERLAY MASK
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden p-0"
    >
      {/* 2. THE FULL SCREEN HUD DRAWER CONTAINER */}
      <motion.div
        initial={{ x: '-100vw' }}
        animate={{ x: isExiting ? '100vw' : 0 }}
        exit={{ x: '100vw' }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.18 }}
        className={`w-full h-full max-w-2xl relative flex flex-col overflow-hidden text-white ${theme.modalBg} ${theme.borderStyle}`}
      >
        {/* HEADER AREA */}
        <div className="p-8 pb-4 relative z-10 flex justify-between items-end border-b border-zinc-900/40">
          <div>
            <h2 className={`${theme.titleText} font-black italic text-3xl uppercase tracking-tighter leading-none`}>
              {activeSlip.length}-LEG  {hasDemon ? 'DEMON' : 'IRON'} SLIP
            </h2>
          </div>
          <button
            onClick={handleControlledClose}
            className="absolute top-5 right-5 text-white font-mono text-[12px] uppercase tracking-[0.4em] bg-red-600 px-2 py-1 z-[100] shadow-md active:scale-90 transition-all border border-white/10"
          >
            [ X ]
          </button>
        </div>

        {/* SCROLLABLE CONFIG MATRIX */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-hide space-y-5 z-10">
          
          {/* CONSTITUENT COMPONENTS MATRIX */}
          <div className="space-y-1.5 pt-1">
            {activeSlip.map((leg) => {
              const isLegDemon = leg.isDemon === true || leg.difficulty === 'demon';
              return (
                <div
                  key={leg._id}
                  className={`relative w-full text-left border-1 p-4 px-2 mb-1 overflow-hidden transition-all flex justify-between items-center ${
                    isLegDemon
                      ? 'border-iron-red'
                      : 'bg-zinc-950 border-zinc-800'
                  }`}
                >
                  <div className="relative z-10 flex justify-between items-center flex-1 pr-4">
                    <div>
                      <h3
                        className={`font-black italic text-xl uppercase tracking-tighter transition-all duration-500 ${
                          isLegDemon ? 'text-iron-red' : 'text-white'
                        }`}
                      >
                        {leg.task}
                      </h3>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-black italic text-sm transition-all duration-500 ${
                          isLegDemon ? 'text-iron-red' : 'text-iron-volt'
                        }`}
                      >
                        +{leg.creditReward}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onRemoveLeg(leg._id);
                      if (activeSlip.length - 1 < minReviewsRequired) onClose();
                    }}
                    className="p-2.5 bg-zinc-900/60 text-zinc-500 transition-colors z-20 relative"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* INTERACTIVE CHIP STACK WAGER CONTROLLER */}
        <div className={`${theme.dataCoreBg} p-5 space-y-4 brightness-[0.75]`}>
          {hasDemon && (
            <div className="flex items-center justify-center animate-pulse gap-2 text-iron-red text-[9px] font-mono font-black tracking-widest pt-1">
              <span>👹DEMON MULTIPLIER ACTIVATED👹</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${theme.labelColor}`}>
              <Coins className={`w-4 h-4 ${hasDemon ? 'text-iron-volt' : 'text-black'}`} />
              <span>Enter wager</span>
            </div>
            <div className="text-[12px] font-mono">
                <span className={`flex gap-1 items-center ${theme.valueColor}`}>  
                  <Zap className={`w-3 h-3 ${hasDemon ? 'text-iron-volt' : 'text-black'}`} />{userBalance}
                </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="number"
              disabled={!isSlipSizeValid}
              value={wager}
              onChange={(e) => handleWagerChange(e.target.value)}
              className={`w-full px-4 py-3 font-mono text-xl text-left focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${theme.inputBg}`}
              placeholder={isSlipSizeValid ? "0.00" : "LOCKDOWN: ADD LEGS"}
            />
          </div>

          {/* Live Dynamic Return Payout Indicator */}
          <div className={`flex justify-between items-center pt-2 border-t ${hasDemon ? 'border-zinc-800/50' : 'border-black/10'}`}>
            <span className={`font-mono text-[11px] uppercase tracking-wider ${theme.labelColor}`}>To Win:</span>
            <span className={`font-black italic text-2xl tracking-tight ${theme.accentText}`}>
              +{isSlipSizeValid ? dynamicPayout : 0}
            </span>
          </div>

          {/* FIXED LOCKED FOOTER PANEL */}
          <div className="relative z-20">
            <button
              disabled={
                !isSlipSizeValid || 
                (Number(wager) || 0) <= 0 || 
                (Number(wager) || 0) > userBalance
              }
              className={`w-full py-4 font-black italic text-2xl uppercase tracking-tighter transition-all active:scale-[0.98] flex flex-col items-center justify-center leading-none disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border-zinc-800 disabled:shadow-none disabled:opacity-40 disabled:cursor-not-allowed ${theme.buttonBg}`}
              onClick={handleExecuteContract}
            >
              {getButtonLabel()}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}