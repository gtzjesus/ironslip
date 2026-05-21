/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ShieldAlert, Coins, Flame } from 'lucide-react';
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
  // ⚡ ADD THESE TWO LINES BELOW:
  totalPayout?: number; 
  multiplier?: number;
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
  
  // ◄ NEW STATE: Tracks local exit execution state to match your expansion dismissals 
  const [isExiting, setIsExiting] = useState(false);
  const [wager, setWager] = useState<number>(10);
  const [userBalance, setUserBalance] = useState<number>(750); // Mock account balance

  // ◄ MATH ENGINE: Implements 15% House Margin
  const oddsMatrix = useMemo(() => {
    if (activeSlip.length === 0) return { multiplier: 0, tier: 'NO_RISK', labelStyle: 'text-zinc-500' };
    
    const compoundDifficulty = activeSlip.reduce((acc, leg) => {
      const legWeight = 1 + ((leg.creditReward || 0) / 200);
      return acc * legWeight;
    }, 1);

    const legCountBonus = 1 + (activeSlip.length * 0.12);
    const hazardModifier = hasDemon ? 1.40 : 1.00;

    // 🧠 Business Protection Margin (House Keeps 15%)
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

  const dynamicPayout = Math.floor(wager * oddsMatrix.multiplier);

  if (!isOpen) return null;

  // ⚡ CUSTOM DISMISSAL INTERCEPTOR: Maps 1:1 with expansion speed
  const handleControlledClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false); // Reset state container pool
    }, 180);
  };

  const handleWagerChange = (amount: number) => {
    if (amount < 1) return;
    if (amount > userBalance) {
      setWager(userBalance);
      return;
    }
    setWager(amount);
  };

  const handleExecuteContract = () => {
    if (activeSlip.length === 0 || wager <= 0 || wager > userBalance) return;

    setUserBalance(prev => prev - wager);

    slipStorage.saveSlip({
      title: `${hasDemon ? 'DEMON' : 'IRON'} PARLAY`,
      type: hasDemon ? 'DEMON' : 'IRON',
      wagerAllocated: wager,
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
  const theme = hasDemon
    ? {
        modalBg: 'bg-zinc-950',
        borderStyle: 'border-x-[0.5px] border-iron-red/40 shadow-[0_0_80px_rgba(239,68,68,0.15)]',
        titleText: 'text-white',
        dataCoreBg: 'bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-iron-red/30',
        dataLabel: 'text-zinc-500',
        dataValue: 'text-white',
        accentText: 'text-iron-red font-black',
        buttonBg: 'bg-iron-red shadow-[0_0_25px_rgba(239,68,68,0.25)] text-black',
      }
    : {
        modalBg: 'bg-zinc-950',
        borderStyle: 'border-x-[0.5px] border-iron-volt/30 shadow-[0_0_80px_rgba(163,230,53,0.08)]',
        titleText: 'text-iron-volt',
        dataCoreBg: 'bg-zinc-900/60 backdrop-blur-md border-[0.5px] border-zinc-800/60',
        dataLabel: 'text-zinc-400',
        dataValue: 'text-white',
        accentText: 'text-iron-volt font-bold',
        buttonBg: 'bg-iron-volt shadow-[0_0_25px_rgba(163,230,53,0.15)] text-black',
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
               Lock in your <br /> {hasDemon ? 'DEMON' : 'IRON'} slip
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
                  className={`bg-black/30 p-4 flex justify-between items-center border ${
                    isLegDemon ? 'border-iron-red/20' : 'border-zinc-900'
                  }`}
                >
                  <div className="flex gap-4 items-center text-left leading-none">
                    <div className={`w-1 h-8  ${isLegDemon ? 'bg-iron-red' : 'bg-iron-volt'}`} />
                    <div className="flex flex-col justify-center leading-none">
                      <h4 className="font-black italic uppercase text-lg tracking-tight text-white mb-1">
                        {leg.task}
                      </h4>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                        INDEX VALUE: <span className={isLegDemon ? 'text-iron-red font-bold' : 'text-iron-volt'}>+{leg.creditReward} CR</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onRemoveLeg(leg._id);
                      if (activeSlip.length - 1 < minReviewsRequired) onClose();
                    }}
                    className="p-2.5  bg-zinc-900/60 text-zinc-500  transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* INTERACTIVE CHIP STACK WAGER CONTROLLER */}
        <div className={`${theme.dataCoreBg} p-5 space-y-4`}>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
              <Coins className="w-4 h-4 text-iron-volt" />
              <span>Enter Your Wager Amount</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              BANKROLL: <span className="text-white font-bold">{userBalance} CR</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="number"
              value={wager === 0 ? '' : wager}
              onChange={(e) => handleWagerChange(Number(e.target.value))}
              className="w-full bg-black/60 border border-zinc-800 text-white px-4 py-3 font-mono text-xl text-left focus:outline-none focus:border-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0.00"
            />
          </div>

          {/* Live Dynamic Return Payout Indicator */}
          <div className="flex justify-between items-center pt-2 border-t border-zinc-800/50">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">To Win Payout:</span>
            <span className={`font-black italic text-2xl tracking-tight ${theme.accentText}`}>
              +{dynamicPayout} <span className="text-xs font-mono font-bold text-zinc-500">CR</span>
            </span>
          </div>

          {hasDemon && (
            <div className="flex items-center gap-2 text-iron-red text-[9px] font-mono font-black tracking-widest pt-1">
              <ShieldAlert className="w-4 h-4 text-iron-red animate-pulse" /> 
              <span>HAZARD MULTIPLIER ACTIVATED</span>
            </div>
          )}
        </div>

        {/* FIXED LOCKED FOOTER PANEL */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-900 relative z-20">
          <button
            disabled={wager <= 0 || wager > userBalance || activeSlip.length === 0}
            className={`w-full py-4 font-black italic text-2xl uppercase tracking-tighter transition-all active:scale-[0.98] flex flex-col items-center justify-center leading-none disabled:opacity-20 disabled:cursor-not-allowed ${theme.buttonBg}`}
            onClick={handleExecuteContract}
          >
            <span>initiate slip!</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}