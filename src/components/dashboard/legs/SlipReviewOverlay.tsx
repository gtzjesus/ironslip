/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Trash2, Coins, Zap } from 'lucide-react';
import { slipStorage } from '@/lib/slipStorage';
import { useRouter } from 'next/navigation';
// 🔥 INTEGRACIÓN REAL CON SUPABASE
import { executeSlipContract } from '@/actions/supabase/slips';
// 🔊 INTEGRACIÓN DE SONIDO
import { useSound } from '@/hooks/useSound';

interface SlipReviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlip: any[];
  onRemoveLeg: (id: string) => void;
  hasDemon: boolean;
  minReviewsRequired: number;
  clearSlipData: () => void;
  userBalance: number;
}

export default function SlipReviewOverlay({
  isOpen,
  onClose,
  activeSlip,
  onRemoveLeg,
  hasDemon,
  minReviewsRequired,
  clearSlipData,
  userBalance,
}: SlipReviewOverlayProps) {
  const router = useRouter();
  const { playSound } = useSound(); // 🔊 Hook inicializado
  const [wager, setWager] = useState<number | ''>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔊 Handler para cerrar con sonido
  const handleClose = () => {
    playSound('close');
    onClose();
  };

  const isSlipSizeValid = activeSlip.length >= 3 && activeSlip.length <= 5;

  const oddsMatrix = useMemo(() => {
    if (activeSlip.length === 0) return { multiplier: 0, tier: 'NO_RISK', labelStyle: 'text-zinc-500' };
    
    const compoundDifficulty = activeSlip.reduce((acc, leg) => {
      const legWeight = 1 + ((leg.creditReward || 0) / 200);
      return acc * legWeight;
    }, 1);

    const legCountBonus = 1 + (activeSlip.length * 0.12);
    const hazardModifier = hasDemon ? 1.40 : 1.00;

    const HOUSE_EDGE = 0.15; 
    const finalMultiplier = compoundDifficulty * legCountBonus * hazardModifier * (1 - HOUSE_EDGE);

    let tier = 'LOW RISK // SECURE';
    let labelStyle = 'text-green-400 border-green-500/20 bg-green-500/5';
    
    if (finalMultiplier > 2.0 && finalMultiplier <= 4.5) {
      tier = 'CHALLENGING // DECENT YIELD';
      labelStyle = 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5';
    } else if (finalMultiplier > 4.5 && finalMultiplier <= 7.5) {
      tier = 'HIGH VOLATILITY // HEAVY SWEAT';
      labelStyle = 'text-orange-400 border-yellow-500/20 bg-yellow-500/5';
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

  const dynamicPayout = Math.floor((Number(wager) || 0) * oddsMatrix.multiplier);

  useEffect(() => {
    if (Number(wager) > userBalance) {
      setWager(userBalance);
    }
  }, [userBalance, wager]);

  if (!isOpen) return null;

  const handleWagerChange = (valStr: string) => {
    if (valStr === '') { setWager(''); return; }
    const numericValue = Number(valStr);
    if (isNaN(numericValue)) return;
    if (numericValue > userBalance) { setWager(userBalance); return; }
    setWager(numericValue);
  };

  const handleRemove = (legId: string) => {
    playSound('remove'); 
    onRemoveLeg(legId);
    if (activeSlip.length - 1 < minReviewsRequired) handleClose();
  };

  const handleExecuteContract = async () => {
    const activeWagerNum = Number(wager) || 0;
    if (!isSlipSizeValid || activeWagerNum <= 0 || activeWagerNum > userBalance || isSubmitting) return;

    setIsSubmitting(true);
    const contractPayload = {
      title: `${hasDemon ? 'DEMON' : 'IRON'} PARLAY`,
      type: (hasDemon ? 'DEMON' : 'IRON') as 'DEMON' | 'IRON',
      wagerAllocated: activeWagerNum,
      totalPayout: dynamicPayout,
      multiplier: oddsMatrix.multiplier,
      legs: activeSlip.map(leg => ({
        _id: leg._id,
        task: leg.task,
        creditReward: leg.creditReward,
        isDemon: leg.isDemon || leg.difficulty === 'demon'
      }))
    };

    try {
      const result = await executeSlipContract(contractPayload);
      if (result.success) {
        slipStorage.saveSlip(contractPayload);
        clearSlipData();
        handleClose();
        router.push('/slips');
      } else {
        alert(`CONTRACT_REJECTED: ${result.error}`);
      }
    } catch (error) {
      console.error("Transmission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const theme = hasDemon
    ? { modalBg: 'bg-zinc-950', borderStyle: 'border-x-[0.5px] border-iron-red/40 shadow-[0_0_80px_rgba(239,68,68,0.15)]', titleText: 'text-white', dataCoreBg: 'bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-iron-red/30', labelColor: 'text-zinc-500', valueColor: 'text-white', accentText: 'text-iron-green font-black', inputBg: 'bg-black/60 border border-zinc-800 text-white placeholder-zinc-600', buttonBg: 'bg-iron-red text-black shadow-[0_0_25px_rgba(239,68,68,0.25)]' }
    : { modalBg: 'bg-zinc-950', borderStyle: 'border-x-[0.5px] border-iron-volt/30 shadow-[0_0_80px_rgba(163,230,53,0.08)]', titleText: 'text-iron-volt', dataCoreBg: 'bg-zinc-950 border-t border-iron-volt/20 p-5 space-y-4', labelColor: 'text-zinc-400 font-mono text-[10px] uppercase tracking-wider', valueColor: 'text-iron-volt font-mono font-bold', accentText: 'text-iron-green font-black italic text-2xl tracking-tight', inputBg: 'bg-black border border-iron-volt/30 text-iron-volt placeholder-iron-volt/30 focus:border-iron-volt/60 transition-colors', buttonBg: 'bg-iron-volt text-black font-black hover:bg-iron-volt/90 shadow-[0_0_20px_rgba(163,230,53,0.1)]' };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden p-0">
      <div className={`w-full h-full max-w-2xl relative flex flex-col overflow-hidden text-white animate-videogame-slam ${theme.modalBg} ${theme.borderStyle}`}>
        <div className="p-8 pb-4 relative z-10 flex justify-between items-end border-b border-zinc-900/40">
          <h2 className={`${theme.titleText} font-black italic text-3xl uppercase tracking-tighter leading-none`}>
            {activeSlip.length}-LEG {hasDemon ? 'DEMON' : 'IRON'} SLIP
          </h2>
          {/* 🔊 BOTÓN CON SONIDO DE CIERRE */}
          <button onClick={handleClose} className="absolute top-5 right-5 text-white font-mono text-[12px] uppercase tracking-[0.4em] bg-red-600 px-2 py-1 z-[100] shadow-md active:scale-90 transition-all border border-white/10">
            [ X ]
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-hide space-y-5 z-10">
          <div className="space-y-1.5 pt-1">
            {activeSlip.map((leg) => {
              const isLegDemon = leg.isDemon === true || leg.difficulty === 'demon';
              return (
                <div key={leg._id} className={`relative w-full text-left border p-4 px-2 mb-1 overflow-hidden transition-all flex justify-between items-center ${isLegDemon ? 'border-iron-red bg-zinc-950' : 'bg-zinc-950 border-zinc-800'}`}>
                  <div className="relative z-10 flex justify-between items-center flex-1 pr-4">
                    <h3 className={`font-black italic text-xl uppercase tracking-tighter ${isLegDemon ? 'text-iron-red' : 'text-white'}`}>{leg.task}</h3>
                    <p className={`font-black italic text-sm ${isLegDemon ? 'text-iron-red' : 'text-iron-volt'}`}>+{leg.creditReward}</p>
                  </div>
                  <button onClick={() => handleRemove(leg._id)} className="p-2.5 bg-zinc-900/60 text-zinc-500 hover:text-zinc-400 transition-colors z-20 relative">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className={theme.dataCoreBg}>
          {hasDemon && (
            <div className="flex items-center justify-center animate-pulse gap-2 text-iron-red text-[9px] font-mono font-black tracking-widest pt-1">
              <span>👹DEMON MULTIPLIER ACTIVATED👹</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${theme.labelColor}`}>
              <Coins className="w-4 h-4 text-iron-volt" /> <span>Enter wager</span>
            </div>
            <div className="text-[12px] font-mono">
              <span className={`flex gap-1 items-center ${theme.valueColor}`}> <Zap className="w-3 h-3 text-iron-volt" />{userBalance}</span>
            </div>
          </div>
          <input
            type="number"
            disabled={!isSlipSizeValid || isSubmitting}
            value={wager}
            onChange={(e) => handleWagerChange(e.target.value)}
            className={`w-full px-4 py-3 font-mono text-xl text-left focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed ${theme.inputBg}`}
            placeholder={isSlipSizeValid ? "0.00" : "LOCKDOWN: ADD LEGS"}
          />
          <div className={`flex justify-between items-center pt-2 border-t ${hasDemon ? 'border-zinc-800/50' : 'border-black/10'}`}>
            <span className={`font-mono text-[11px] uppercase tracking-wider ${theme.labelColor}`}>To Win:</span>
            <span className={`font-black italic text-2xl tracking-tight ${theme.accentText}`}>+{isSlipSizeValid ? dynamicPayout : 0}</span>
          </div>
          <div className="relative z-20 mt-2">
            <button
              disabled={!isSlipSizeValid || (Number(wager) || 0) <= 0 || (Number(wager) || 0) > userBalance || isSubmitting}
              className={`w-full py-4 font-black italic text-2xl uppercase tracking-tighter transition-all active:scale-[0.98] ${theme.buttonBg}`}
              onClick={handleExecuteContract}
            >
              {isSubmitting ? 'TRANSMITTING...' : 'INITIATE SLIP!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}