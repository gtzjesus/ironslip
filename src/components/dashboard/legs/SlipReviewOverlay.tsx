/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { executeSlipContract } from '@/actions/supabase/slips';
import { useSound } from '@/hooks/useSound';
import { X, Trash2, ShieldAlert, CheckCircle2, Zap, Flame, ShieldCheck, Skull, Activity } from 'lucide-react';

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

      if (typeof window !== 'undefined') {
        localStorage.removeItem('iron_slip_draft');
      }

      if (onConfirmSuccess) {
        onConfirmSuccess(result);
      }

      window.location.href = '/slips';
    } catch (err) {
      console.error('💥 Error launching slip:', err);
      alert('Network error while processing slip transaction.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center bg-black/90 backdrop-blur-xl p-0 sm:p-4 animate-fadeIn">
      {/* CONTENEDOR PRINCIPAL: Fullscreen en móvil, Modal centrado en Desktop */}
      <div
        className={`w-full max-w-2xl h-[100dvh] sm:h-auto sm:max-h-[90vh] bg-zinc-950 flex flex-col relative overflow-hidden transition-all border-0 sm:border ${
          hasDemon
            ? 'border-red-600/70 shadow-[0_0_50px_rgba(220,38,38,0.35)]'
            : 'border-iron-volt/60 shadow-[0_0_50px_rgba(255,211,0,0.25)]'
        }`}
      >
        {/* EFECTO GLOW AMBIENTAL SIFÓNICO (Sin dependencias de tailwind.config) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className={`absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] ${
              hasDemon ? 'from-red-600 via-transparent to-transparent' : 'from-iron-volt via-transparent to-transparent'
            } animate-spin`}
            style={{ animationDuration: '20s' }}
          />
          {/* Línea de escáner superior */}
          <div
            className={`w-full h-[2px] opacity-70 animate-pulse ${
              hasDemon ? 'bg-gradient-to-r from-transparent via-red-500 to-transparent' : 'bg-gradient-to-r from-transparent via-iron-volt to-transparent'
            }`}
          />
        </div>

        {/* ENCABEZADO CYBERPUNK */}
        <div className="relative z-10 p-4 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span
                className={`absolute w-4 h-4 rounded-full animate-ping opacity-75 ${
                  hasDemon ? 'bg-red-600' : 'bg-iron-volt'
                }`}
              />
              <span
                className={`relative w-2.5 h-2.5 rounded-full ${
                  hasDemon ? 'bg-red-500' : 'bg-iron-volt'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                  FINAL STAGE // CONTRACT EXECUTION
                </span>
              </div>
              <h2 className="font-mono text-sm sm:text-base font-black uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                {hasDemon ? (
                  <>
                    <Flame className="w-5 h-5 text-red-500 animate-bounce" />
                    <span className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                      DEMON SLIP
                    </span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-iron-volt" />
                    <span className="text-iron-volt drop-shadow-[0_0_8px_rgba(255,211,0,0.5)]">
                      IRON SLIP
                    </span>
                  </>
                )}
                <span className="text-zinc-500 text-xs font-normal">
                  ({activeSlip.length}/5)
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LISTA COMPLETA DE LEGS */}
        <div className="relative z-10 flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
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
                className={`p-3.5 bg-zinc-900/40 border backdrop-blur-sm transition-all relative group ${
                  isItemDemon
                    ? 'border-red-900/60 bg-gradient-to-r from-red-950/20 to-zinc-900/40'
                    : 'border-zinc-800/90 hover:border-zinc-700'
                }`}
              >
                {/* FILA SUPERIOR */}
                <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-zinc-800/90 text-zinc-300 font-bold uppercase tracking-wider border border-zinc-700/50">
                      {leg.category || 'EXECUTION'}
                    </span>

                    {leg.verificationMethod && (
                      <span className="text-[9px] font-mono px-2 py-0.5 bg-zinc-950 text-zinc-400 border border-zinc-800 font-semibold uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-zinc-500" />
                        {leg.verificationMethod}
                      </span>
                    )}

                    {isItemDemon && (
                      <span className="text-[9px] font-mono px-2 py-0.5 bg-red-950/80 text-red-400 border border-red-800/80 font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                        <Skull className="w-3 h-3 text-red-500" /> DEMON MODE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-sm font-black tracking-tight ${
                        isItemDemon ? 'text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.4)]' : 'text-iron-volt'
                      }`}
                    >
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
                <div className="mb-2">
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-100 uppercase tracking-tight">
                    {leg.task || leg.title}
                  </h4>
                  {leg.selectedVariantName && (
                    <p className="text-[10px] font-mono text-iron-volt/90 mt-0.5">
                      VARIANT: {leg.selectedVariantName}
                    </p>
                  )}
                </div>

                {/* TARGET / DETALLES DE LA INSTRUCCIÓN */}
                {(leg.target || leg.description) && (
                  <div className="bg-zinc-950/80 p-2.5 border border-zinc-800/80 text-[11px] font-mono text-zinc-300 leading-relaxed mb-2">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase block mb-0.5 tracking-wider">
                      TARGET OBJECTIVE:
                    </span>
                    {leg.target || leg.description}
                  </div>
                )}

                {/* FOOTER INTERNO */}
                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1">
                    REWARD:{' '}
                    <strong className="text-zinc-200">
                      {leg.creditReward || 0} PTS
                    </strong>
                  </span>
                  {leg.aiPrompt && (
                    <span className="truncate max-w-[180px] sm:max-w-[250px] text-zinc-500 italic">
                      AI: {leg.aiPrompt}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* PANEL DE APUESTA Y BOTÓN DE CONFIRMACIÓN */}
        <div className="relative z-20 p-4 bg-zinc-950 border-t border-zinc-800/80 shadow-[0_-10px_20px_rgba(0,0,0,0.8)] space-y-3 shrink-0">
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <Activity className="w-3 h-3 text-zinc-500" /> WAGER ALLOCATION
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={wagerInput}
                  onChange={(e) => setWagerInput(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-zinc-400 px-3 py-2 text-base font-mono font-black text-zinc-100 focus:outline-none disabled:opacity-50 transition-colors"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-zinc-500">
                  PTS
                </span>
              </div>
              <p className="text-[9px] font-mono text-zinc-500 mt-1">
                BAL: <strong className="text-zinc-300">{userBalance}</strong> CREDITS
              </p>
            </div>

            <div className="flex flex-col justify-end text-right">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1">
                ESTIMATED PAYOUT
              </span>
              <p
                className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
                  hasDemon
                    ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                    : 'text-iron-volt drop-shadow-[0_0_10px_rgba(255,211,0,0.4)]'
                }`}
              >
                {potentialPayout.toLocaleString()}{' '}
                <span className="text-xs">PTS</span>
              </p>
              <span className="text-[9px] font-mono text-zinc-400">
                MULT: <strong className="text-zinc-200">x{dynamicMultiplier.toFixed(2)}</strong>
              </span>
            </div>
          </div>

          {/* BOTÓN CON EFECTO DE PULSO Y LUZ */}
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || numericWager <= 0 || hasInsufficientFunds}
            className={`w-full py-3.5 px-4 font-mono text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-200 active:scale-[0.98] ${
              hasInsufficientFunds
                ? 'bg-zinc-900 text-red-400 border border-red-900/60 cursor-not-allowed'
                : hasDemon
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.5)] active:shadow-none'
                : 'bg-iron-volt hover:bg-yellow-400 text-black shadow-[0_0_25px_rgba(255,211,0,0.4)] active:shadow-none'
            } disabled:opacity-50`}
          >
            {isSubmitting ? (
              <span className="animate-pulse flex items-center gap-2">
                <Activity className="w-4 h-4 animate-spin" /> EXECUTING CONTRACT...
              </span>
            ) : hasInsufficientFunds ? (
              <>
                <ShieldAlert className="w-4 h-4" /> INSUFFICIENT BALANCE
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> LOCK CONTRACT & TRANSMIT
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}