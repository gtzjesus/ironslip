/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { executeSlipContract } from '@/actions/supabase/slips';
import { getUserAvatarSkin } from '@/actions/supabase/avatar';
import { useSound } from '@/hooks/useSound';
import AvatarCanvas from '@/components/dashboard/avatar/AvatarCanvas';
import { Trash2, Activity, AlertCircle, ShieldAlert, ShieldCheck } from 'lucide-react';

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
  const [is3DReady, setIs3DReady] = useState(false);
  const [avatarSkin, setAvatarSkin] = useState<string>('/models/avatar.glb');
  const [currentAnimIndex, setCurrentAnimIndex] = useState(0);
  const { playSound } = useSound();

  // 1️⃣ Cargar skin dinámica desde Supabase al abrir el modal
  useEffect(() => {
    let isMounted = true;
    async function loadSkin() {
      try {
        const res = await getUserAvatarSkin();
        if (isMounted && res?.avatarSkin) {
          setAvatarSkin(res.avatarSkin);
        }
      } catch (err) {
        console.error('Failed fetching dynamic skin for review overlay:', err);
      } finally {
        if (isMounted) {
          setIs3DReady(true);
        }
      }
    }
    if (isOpen) {
      loadSkin();
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // 2️⃣ Loop dinámico de animaciones de los legs activos
  const activeAnimations = activeSlip
    .map((leg) => leg.animationKey)
    .filter(Boolean);

  const animationsList = activeAnimations.length > 0 
    ? activeAnimations 
    : [hasDemon ? 'flexing' : 'breathingidle'];

  useEffect(() => {
    if (animationsList.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAnimIndex((prevIndex) => (prevIndex + 1) % animationsList.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [animationsList]);

  const currentAnimationKey = animationsList[currentAnimIndex] || (hasDemon ? 'flexing' : 'breathingidle');

  // OCULTAR NAVBAR GLOBAL MIENTRAS EL MODAL ESTÉ ABIERTO
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('hide-global-nav');
    } else {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('hide-global-nav');
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('hide-global-nav');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const numericWager = Math.max(0, parseInt(wagerInput, 10) || 0);
  const hasMinLegs = activeSlip.length >= 3;

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
    if (isSubmitting || numericWager <= 0 || hasInsufficientFunds || !hasMinLegs) return;

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
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden"
      onClick={onClose}
    >
      {/* AVATAR 3D AL FONDO */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-20 scale-110 transition-all duration-700">
        {is3DReady && (
          <AvatarCanvas
            avatarUrl={avatarSkin}
            activeAnimation={currentAnimationKey}
          />
        )}
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div
        className="w-full h-full max-w-xl relative z-10 bg-[#0a0908]/90 backdrop-blur-md flex flex-col overflow-hidden border-[0.5px] border-zinc-800 pointer-events-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ENCABEZADO TÁCTICO CON BOTÓN ROJO [ x ] */}
        <div className="px-4 py-3.5 relative z-20 flex justify-between items-center border-b border-zinc-900 bg-[#0a0908]/95 shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className={`font-black italic text-lg uppercase tracking-tight ${hasDemon ? 'text-[#E5B2B2]' : 'text-[#B89223]'}`}>
              {hasDemon ? 'DEMON CONTRACT' : 'IRON CONTRACT'}
            </h2>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border ${hasMinLegs ? 'border-zinc-800 bg-zinc-900 text-zinc-400' : 'border-amber-500/40 bg-amber-950/20 text-amber-400'}`}>
              {activeSlip.length}/5 {hasMinLegs ? 'READY' : '(MIN 3)'}
            </span>
          </div>

          <button
            onClick={() => {
              playSound('close');
              setTimeout(() => onClose(), 100);
            }}
            disabled={isSubmitting}
            className="text-white bg-[#6E1717] hover:bg-[#801B1B] transition-colors px-2.5 py-1 text-[9px] font-mono font-bold uppercase active:scale-95 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] border border-black disabled:opacity-50"
          >
            [ x ]
          </button>
        </div>

        {/* LISTA DE LEGS CON SU DESCRIPCIÓN SUAVE ABAJO */}
        <div className="relative z-10 flex-1 overflow-y-auto p-3 space-y-2.5">
          {activeSlip.map((leg, idx) => {
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
                key={leg._id || idx}
                className="group relative flex flex-col p-3 bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 transition-all backdrop-blur-xs"
              >
                {/* Línea lateral indicadora de tipo */}
                <div className={`absolute left-0 inset-y-0 w-[2px] ${isItemDemon ? 'bg-[#6E1717]' : 'bg-[#B89223]'}`} />

                {/* FILA SUPERIOR: Título, Categoría y Multiplicador */}
                <div className="flex items-center justify-between gap-2 pl-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono text-zinc-600 font-bold shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black uppercase tracking-tight text-zinc-200 truncate">
                        {leg.task || leg.title}
                      </h4>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wide truncate flex items-center gap-1.5">
                        <span>{leg.category || 'EXECUTION'}</span>
                        {isItemDemon && <span className="text-red-400 font-bold">· DEMON</span>}
                        {leg.verificationMethod && <span className="text-zinc-600">· {leg.verificationMethod}</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`font-mono text-xs font-black ${isItemDemon ? 'text-red-400' : 'text-[#B89223]'}`}>
                      x{itemOdd.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveLeg(leg._id)}
                      disabled={isSubmitting}
                      className="text-zinc-600 hover:text-red-400 transition-colors p-1 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* DESCRIPCIÓN SUAVE ABAJO */}
                {(leg.target || leg.description) && (
                  <div className="mt-2 ml-2 pl-2.5 border-l border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase tracking-wider leading-relaxed">
                    {leg.target || leg.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PANEL INFERIOR COMPACTO */}
        <div className="relative z-20 p-3.5 bg-[#0a0908] border-t border-zinc-900 space-y-2.5 shrink-0">
          <div className="flex items-center justify-between gap-3 bg-zinc-950/80 p-2.5 border border-zinc-900">
            <div>
              <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest mb-0.5">
                ENTRY FEE (BAL: {userBalance})
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={wagerInput}
                  onChange={(e) => setWagerInput(e.target.value)}
                  disabled={isSubmitting}
                  className="w-24 bg-transparent text-sm font-mono font-black text-white focus:outline-none"
                />
                <span className="text-[10px] font-mono text-zinc-500">PTS</span>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest mb-0.5">
                POTENTIAL PAYOUT (x{dynamicMultiplier.toFixed(2)})
              </span>
              <p className={`text-base font-black tracking-tight ${hasDemon ? 'text-red-400' : 'text-[#B89223]'}`}>
                {potentialPayout.toLocaleString()} PTS
              </p>
            </div>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || numericWager <= 0 || hasInsufficientFunds || !hasMinLegs}
            className={`w-full py-3 font-mono text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              !hasMinLegs || hasInsufficientFunds
                ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed'
                : hasDemon
                ? 'bg-[#6E1717] hover:bg-[#801B1B] text-white border-red-900'
                : 'bg-[#B89223] hover:bg-[#c9a130] text-black border-yellow-600/50'
            }`}
          >
            {isSubmitting ? (
              <span className="animate-pulse flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 animate-spin" /> SIGNING...
              </span>
            ) : !hasMinLegs ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> ADD {3 - activeSlip.length} MORE LEG(S)
              </>
            ) : hasInsufficientFunds ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> INSUFFICIENT BALANCE
              </>
            ) : (
              <>
                SIGN CONTRACT & INITIATE
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}