/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { motion } from 'framer-motion';
import { Trash2, ShieldAlert } from 'lucide-react';
import { slipStorage } from '@/lib/slipStorage';
import { useRouter } from 'next/navigation';

interface SlipReviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlip: any[];
  onRemoveLeg: (id: string) => void;
  totalPayout: number;
  multiplier: number;
  hasDemon: boolean;
  minReviewsRequired: number;
  clearSlipData: () => void;
}

export default function SlipReviewOverlay({
  isOpen,
  onClose,
  activeSlip,
  onRemoveLeg,
  totalPayout,
  multiplier,
  hasDemon,
  minReviewsRequired,
  clearSlipData,
}: SlipReviewOverlayProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleExecuteContract = () => {
    if (activeSlip.length === 0) return;

    slipStorage.saveSlip({
      title: `${hasDemon ? 'DEMON' : 'IRON'} PARLAY`,
      type: hasDemon ? 'DEMON' : 'IRON',
      totalPayout,
      multiplier,
      legs: activeSlip.map(leg => ({
        _id: leg._id,
        task: leg.task,
        creditReward: leg.creditReward,
        isDemon: leg.isDemon || leg.difficulty === 'demon'
      }))
    });

    clearSlipData();
    onClose();
    router.push('/slips');
  };

  return (
    // 1. BACKDROP FADE (Dark tactical overlay mask)
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden p-0"
    >
      {/* 2. MAIN HUB DRAWER: Now dark bg-zinc-950 with thin tactical color borders */}
      <motion.div
        initial={{ x: '-100vw' }}
        animate={{ x: 0 }}
        exit={{ x: '100vw' }}
        // ⚡ LIGHTNING FAST ANIMATION: Instant horizontal sweep execution
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.18 }}
        className={`w-full h-full max-w-2xl relative flex flex-col overflow-hidden bg-zinc-950 text-white border-x-[0.5px] ${
          hasDemon 
            ? 'border-iron-red/40 shadow-[0_0_80px_rgba(239,68,68,0.15)]' 
            : 'border-iron-volt/30 shadow-[0_0_80px_rgba(163,230,53,0.08)]'
        }`}
      >
        {/* Zebra Industrial Background Accent Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex gap-4 rotate-12 scale-150">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="w-8 h-[200%] bg-white" />
          ))}
        </div>

        {/* HEADER SECTION - Left Untouched as Requested */}
        <div className="p-8 pb-4 relative z-10 flex justify-between items-end border-b-4 border-black/10">
          <div>
            <p className="mb-2 font-mono text-[8px] tracking-[0.3em] font-black italic uppercase text-zinc-500">
              lock in your
            </p>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
               {hasDemon ? 'DEMON' : 'IRON'} SLIP
            </h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white font-mono text-[12px] uppercase tracking-[0.4em] bg-red-600 px-2 py-1 z-[100] shadow-md active:scale-90 transition-all border border-white/10"
          >
            [ X ]
          </button>
        </div>

        {/* SCROLLABLE VIEWFIELD WINDOW */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide relative z-10 space-y-5">
          
          {/* TACTICAL YIELD HEADS-UP PROFILE BOX */}
          <div className={`p-4 bg-zinc-900/40 border-[0.5px] rounded-xl flex items-center justify-between relative overflow-hidden ${
            hasDemon ? 'border-iron-red/30 bg-gradient-to-r from-red-950/10 to-transparent' : 'border-zinc-800'
          }`}>
            <div className="flex flex-col leading-none">
              <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.2em] mb-1">
                EST_COMPUTED_YIELD
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className={`text-5xl font-black italic tracking-tighter leading-none ${
                  hasDemon ? 'text-iron-red' : 'text-iron-volt'
                }`}>
                  {totalPayout}
                </h3>
                <span className="text-xs font-mono font-bold text-zinc-400">CR</span>
              </div>
            </div>

            <div className="flex flex-col items-end text-right font-mono leading-none gap-2">
              <div className="bg-zinc-950 px-2.5 py-1.5 border border-zinc-800 rounded text-[10px] text-zinc-400">
                MULT: <span className={hasDemon ? 'text-iron-red font-bold' : 'text-iron-volt font-bold'}>x{multiplier.toFixed(2)}</span>
              </div>
              {hasDemon && (
                <div className="flex items-center gap-1 text-iron-red text-[8px] font-black tracking-widest animate-pulse">
                  <ShieldAlert className="w-3 h-3" /> HAZARD_MODIFIER_ACTIVE
                </div>
              )}
            </div>
          </div>

          {/* PARLAY CONGO CARD TRACK MATRIX (Compact & Cohesive Layout) */}
          <div className="space-y-1">
            <p className="text-[9px] font-mono font-bold text-zinc-500 tracking-[0.2em] uppercase mb-2 pl-1">
              CONTRACT_COMPONENTS ({activeSlip.length} / 5 LEGS)
            </p>

            {activeSlip.map((leg) => {
              const isLegDemon = leg.isDemon === true || leg.difficulty === 'demon';
              return (
                <div
                  key={leg._id}
                  className={`bg-zinc-950 p-3.5 px-3 flex justify-between items-center border-[0.5px] rounded-xl transition-all ${
                    isLegDemon
                      ? 'border-iron-red/40 hover:border-iron-red shadow-[0_0_15px_rgba(239,68,68,0.03)]'
                      : 'border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  {/* Left Side Group */}
                  <div className="flex gap-3.5 items-center text-left leading-none">
                    {/* Compact Accent Indicator Pillar */}
                    <div className={`w-1 h-8 rounded-full ${isLegDemon ? 'bg-iron-red animate-pulse' : 'bg-iron-volt'}`} />
                    
                    <div className="flex flex-col justify-center leading-none">
                      <h4 className="font-black italic uppercase text-lg tracking-tight text-white mb-1.5">
                        {leg.task}
                      </h4>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                        VALUE: <span className={isLegDemon ? 'text-iron-red/95 font-bold' : 'text-iron-volt/90'}>+{leg.creditReward} CR</span>
                      </p>
                    </div>
                  </div>

                  {/* Operational Removal Command Switch */}
                  <button
                    onClick={() => {
                      onRemoveLeg(leg._id);
                      if (activeSlip.length - 1 < minReviewsRequired) {
                        onClose();
                      }
                    }}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/60 text-zinc-400 hover:bg-red-950/40 hover:text-iron-red hover:border-iron-red/40 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER COMMIT RUNTIME PANEL */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-900 relative z-20">
          <button
            className={`w-full text-black py-4 font-black italic text-3xl uppercase tracking-tighter transition-all active:scale-[0.98] flex flex-col items-center justify-center leading-none rounded-xl ${
              hasDemon 
                ? 'bg-iron-red hover:bg-red-500 shadow-[0_0_25px_rgba(239,68,68,0.25)]' 
                : 'bg-iron-volt hover:bg-white shadow-[0_0_25px_rgba(163,230,53,0.15)]'
            }`}
            onClick={handleExecuteContract}
          >
            <span>EXECUTE CONTRACT</span>
            <span className="text-[8px] font-mono mt-1.5 tracking-[0.6em] font-black text-black/60">
              TRANSMISSION_READY_LOCKED
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}