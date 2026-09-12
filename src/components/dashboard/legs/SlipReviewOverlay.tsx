/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { executeSlipContract } from '@/actions/supabase/slips';
import { useSound } from '@/hooks/useSound';
import { X, Trash2, ShieldAlert, CheckCircle2, Zap, Flame, ShieldCheck } from 'lucide-react';

interface SlipReviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlip: any[];
  onRemoveLeg: (id: string) => void;
  hasDemon: boolean;
  userBalance: number;
  onConfirmSuccess?: (result: any) => void;
}

export default function SlipReviewOverlay({
  isOpen,
  onClose,
  activeSlip,
  onRemoveLeg,
  hasDemon,
  userBalance,
  onConfirmSuccess,
}: SlipReviewOverlayProps) {
  const [wagerInput, setWagerInput] = useState<string>('100');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { playSound } = useSound();

  if (!isOpen) return null;

  const numericWager = Math.max(0, parseInt(wagerInput, 10) || 0);

  // Cálculo de Multiplicador Dinámico global
  const totalOdds = activeSlip.reduce((acc, item) => {
    const baseWeight = item.probabilityWeight || 1.5;
    const isItemDemon =
      item.isDemonMode ||
      item.isDemon ||
      item._id?.includes('-demon') ||
      item.isDemonSupported === true;
    const demonMult = item.demonMultiplier || 1.5;

    const legOdd = isItemDemon ? baseWeight * demonMult : baseWeight;
    return acc * legOdd;
  }, 1.0);

  const dynamicMultiplier = totalOdds < 1 ? 1.0 : totalOdds;
  const potentialPayout = Math.floor(numericWager * dynamicMultiplier);
  const hasInsufficientFunds = numericWager > userBalance;

  // 🚀 PROCESO DE CONFIRMACIÓN Y NAVEGACIÓN DURA A /slips
  const handleConfirm = async () => {
    if (isSubmitting || numericWager <= 0 || hasInsufficientFunds) return;

    try {
      setIsSubmitting(true);
     

      const slipPayload = {
        title: hasDemon ? 'DEMON SLIP CONTRACT' : 'IRON SLIP CONTRACT',
        type: hasDemon ? 'DEMON' : 'STANDARD',
        wagerAllocated: numericWager,
        totalPayout: potentialPayout,
        multiplier: parseFloat(dynamicMultiplier.toFixed(2)),
        legs: activeSlip.map((leg) => ({
          _id: leg._id,
          task: leg.task || leg.title,
          category: leg.category,
          selectedVariantName: leg.selectedVariantName || null,
          target: leg.target || leg.task,
          verificationMethod: leg.verificationMethod || 'video',
          aiPrompt: leg.aiPrompt || null,
          creditReward: leg.creditReward || 0,
          probabilityWeight: leg.probabilityWeight || 1.5,
          demonMultiplier: leg.demonMultiplier || 1.5,
          isDemonSupported:
            leg.isDemonMode ||
            leg.isDemon ||
            leg._id?.includes('-demon') ||
            leg.isDemonSupported === true,
        })),
      };

      const result = await executeSlipContract(slipPayload);

      if (!result.success) {
        alert(`❌ TRANSACTION FAILED: ${result.error}`);
        setIsSubmitting(false);
        return;
      }

      // 1. Destruir borrador local
      if (typeof window !== 'undefined') {
        localStorage.removeItem('iron_slip_draft');
      }

      // 2. Ejecutar callback opcional
      if (onConfirmSuccess) {
        onConfirmSuccess(result);
      }

      // 3. 🎯 REDIRECCIÓN COMPLETA A /slips
      window.location.href = '/slips';
    } catch (err) {
      console.error('💥 Error launching slip:', err);
      alert('Network error while processing slip transaction.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-fadeIn">
      <div
        className={`w-full max-w-2xl bg-zinc-950 border-t sm:border-[0.5px] ${
          hasDemon ? 'border-red-600/50 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'border-iron-volt/40 shadow-[0_0_30px_rgba(255,211,0,0.15)]'
        } flex flex-col max-h-[90vh] shadow-2xl overflow-hidden relative`}
      >
        {/* ENCABEZADO */}
        <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 ${
                hasDemon ? 'bg-red-600 animate-pulse' : 'bg-iron-volt'
              }`}
            />
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-100 flex items-center gap-2">
              {hasDemon ? (
                <>
                  <Flame className="w-4 h-4 text-red-500 animate-bounce" /> REVIEW DEMON SLIP
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-iron-volt" /> REVIEW IRON SLIP
                </>
              )}
              <span className="text-zinc-500">({activeSlip.length}/5 LEGS)</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LISTA COMPLETA DE LEGS CON TODA LA INFORMACIÓN */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          {activeSlip.map((leg) => {
            const isItemDemon =
              leg.isDemonMode ||
              leg.isDemon ||
              leg._id?.includes('-demon') ||
              leg.isDemonSupported === true;

            const baseWeight = leg.probabilityWeight || 1.5;
            const demonMult = leg.demonMultiplier || 1.5;
            const itemOdd = isItemDemon ? baseWeight * demonMult : baseWeight;

            return (
              <div
                key={leg._id}
                className={`p-3.5 bg-zinc-900/70 border ${
                  isItemDemon ? 'border-red-900/40 bg-red-950/10' : 'border-zinc-800/80'
                } flex flex-col gap-2 relative group`}
              >
                {/* FILA SUPERIOR: BADGES & CONTROLES */}
                <div className="flex items-center justify-between gap-2 border-b border-zinc-800/50 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-800 text-zinc-300 font-bold uppercase tracking-wider">
                      {leg.category || 'EXECUTION'}
                    </span>

                    {leg.verificationMethod && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-900 text-zinc-400 border border-zinc-800 font-semibold uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-zinc-500" />
                        {leg.verificationMethod}
                      </span>
                    )}

                    {isItemDemon && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-red-950 text-red-400 border border-red-800/60 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Flame className="w-3 h-3 text-red-500" /> DEMON MODE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs font-bold ${isItemDemon ? 'text-red-400' : 'text-iron-volt'}`}>
                      x{itemOdd.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveLeg(leg._id)}
                      disabled={isSubmitting}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Remove Leg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* TÍTULO / TAREA */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-tight">
                    {leg.task || leg.title}
                  </h4>
                  {leg.selectedVariantName && (
                    <p className="text-[10px] font-mono text-iron-volt/80 mt-0.5">
                      VARIANT: {leg.selectedVariantName}
                    </p>
                  )}
                </div>

                {/* TARGET / DETALLES DE LA INSTRUCCIÓN */}
                {(leg.target || leg.description) && (
                  <div className="bg-zinc-950/60 p-2 border border-zinc-900/80 text-[11px] font-mono text-zinc-400 leading-relaxed">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase block mb-0.5">TARGET OBJECTIVE:</span>
                    {leg.target || leg.description}
                  </div>
                )}

                {/* FOOTER INTERNO DE LA PIERNA */}
                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-1">
                  <span>REWARD: <strong className="text-zinc-300">{leg.creditReward || 0} PTS</strong></span>
                  {leg.aiPrompt && (
                    <span className="truncate max-w-[200px] text-zinc-600 italic">
                      AI: {leg.aiPrompt}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* PANEL DE APUESTA Y CALCULADORA Payout */}
        <div className="p-4 bg-zinc-900/30 border-t border-zinc-900 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                WAGER (CREDITS)
              </label>
              <input
                type="number"
                value={wagerInput}
                onChange={(e) => setWagerInput(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm font-mono font-bold text-zinc-100 focus:outline-none focus:border-iron-volt disabled:opacity-50"
              />
              <p className="text-[8px] font-mono text-zinc-500 mt-1">
                AVAILABLE: {userBalance} CREDITS
              </p>
            </div>

            <div className="flex flex-col justify-end text-right">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                ESTIMATED PAYOUT
              </span>
              <p
                className={`text-lg font-black font-mono tracking-tight ${
                  hasDemon ? 'text-red-500' : 'text-iron-volt'
                }`}
              >
                {potentialPayout} <span className="text-xs">PTS</span>
              </p>
              <span className="text-[9px] font-mono text-zinc-500">
                TOTAL MULTIPLIER: x{dynamicMultiplier.toFixed(2)}
              </span>
            </div>
          </div>

          {/* BOTÓN EJECUTAR CONTRATO */}
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || numericWager <= 0 || hasInsufficientFunds}
            className={`w-full py-3 px-4 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 ${
              hasInsufficientFunds
                ? 'bg-zinc-800 text-red-400 border border-red-900/50 cursor-not-allowed'
                : hasDemon
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                : 'bg-iron-volt hover:bg-yellow-400 text-black shadow-[0_0_20px_rgba(255,211,0,0.3)]'
            } disabled:opacity-50`}
          >
            {isSubmitting ? (
              <span className="animate-pulse">EXECUTING CONTRACT...</span>
            ) : hasInsufficientFunds ? (
              <>
                <ShieldAlert className="w-4 h-4" /> INSUFFICIENT BALANCE
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> CONFIRM & TRANSMIT SLIP
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}