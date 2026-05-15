'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, ShieldAlert, Target, Trash2 } from 'lucide-react';

interface SlipNavbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeSlip: any[];
  onRemoveLeg: (id: string) => void;
}

export default function SlipNavbar({
  activeSlip,
  onRemoveLeg,
}: SlipNavbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (activeSlip.length === 0) return null;

  const hasDemon = activeSlip.some(
    (leg) => leg.isDemon || leg.difficulty === 'demon',
  );
  const baseCredits = activeSlip.reduce(
    (sum, leg) => sum + (leg.creditReward || 0),
    0,
  );
  const multiplier = 1 + activeSlip.length * 0.1;
  const totalPayout = Math.floor(
    baseCredits * (hasDemon ? multiplier + 0.5 : multiplier),
  );

  return (
    <>
      {/* 1. LA BARRA COMPACTA (DOCK) */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-[64px] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[90] px-2"
          >
            <div
              onClick={() => setIsExpanded(true)}
              className={`cursor-pointer relative overflow-hidden border-t-2 border-x-2 p-3 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)] ${hasDemon ? 'bg-iron-volt border-iron-red' : 'bg-iron-volt border-black'}`}
            >
              <div className="relative z-10 flex items-center gap-3">
                <div className="bg-black p-2">
                  <Zap
                    className={`w-4 h-4 ${hasDemon ? 'text-iron-red animate-pulse' : 'text-iron-volt'}`}
                  />
                </div>
                <div>
                  <p className="text-[9px] font-black font-mono leading-none text-black/60 uppercase text-left">
                    Slip_Queue
                  </p>
                  <p className="text-sm font-black italic uppercase text-black">
                    {activeSlip.length} / 5 LEGS
                  </p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[8px] font-black font-mono text-black/50 uppercase">
                    Yield
                  </p>
                  <p className="text-xl font-black italic leading-none text-black">
                    {totalPayout} CR
                  </p>
                </div>
                <div className="bg-black text-iron-volt px-4 py-2 font-black italic text-xs uppercase">
                  REVIEW
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. EL FULL-SCREEN REVIEW VIEW */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col p-6 overflow-hidden"
          >
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
              <div className="h-full w-full border-[100px] border-zinc-900 rounded-full scale-150 blur-3xl" />
            </div>

            {/* HEADER */}
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-iron-volt font-mono text-xs tracking-[0.3em] uppercase">
                  MISION_MANIFEST
                </p>
                <h2 className="text-5xl font-black italic text-white uppercase leading-none tracking-tighter">
                  THE_SLIP
                </h2>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="bg-zinc-800 text-white p-3 border border-white/10 active:bg-iron-red transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* TOTAL PAYOUT DISPLAY */}
            <div className="mt-8 mb-6 p-6 border-2 border-dashed border-zinc-800 bg-zinc-950 flex flex-col items-center relative overflow-hidden">
              {hasDemon && (
                <div className="absolute top-0 left-0 w-full h-1 bg-iron-red animate-pulse" />
              )}
              <p className="text-zinc-500 font-mono text-[10px] uppercase">
                Est_Total_Reward
              </p>
              <h3 className="text-7xl font-black italic text-iron-volt tracking-tighter">
                {totalPayout}
                <span className="text-2xl ml-2">CR</span>
              </h3>
              <div className="flex gap-4 mt-2">
                <p className="text-zinc-400 font-mono text-[9px] uppercase tracking-widest">
                  Multiplier: x{multiplier.toFixed(1)}
                </p>
                {hasDemon && (
                  <p className="text-iron-red font-mono text-[9px] uppercase font-black">
                    Demon_Bonus: +0.5x
                  </p>
                )}
              </div>
            </div>

            {/* LIST OF SELECTED LEGS */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar pb-10">
              {activeSlip.map((leg) => (
                <div
                  key={leg._id}
                  className={`p-4 border-l-4 flex justify-between items-center ${leg.isDemon ? 'bg-zinc-900 border-iron-red' : 'bg-zinc-900/50 border-iron-volt'}`}
                >
                  <div>
                    <p className="text-zinc-500 font-mono text-[8px] uppercase">
                      {leg.category}
                    </p>
                    <h4 className="text-white font-black italic uppercase text-lg leading-tight">
                      {leg.task}
                    </h4>
                    <p className="text-iron-volt font-mono text-[9px] mt-1">
                      +{leg.creditReward} CREDITS
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveLeg(leg._id)}
                    className="p-2 text-zinc-600 hover:text-iron-red transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* CTA BUTTON */}
            <div className="relative z-10 pt-4">
              <button
                className="w-full bg-iron-volt text-black py-5 font-black italic text-3xl uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_40px_rgba(250,204,21,0.2)] active:scale-[0.98]"
                onClick={() => alert('CONTRACT_INITIALIZED')}
              >
                DEPLOY_PROTOCOL
              </button>
              <p className="text-center text-[8px] font-mono text-zinc-600 mt-3 uppercase tracking-widest">
                By clicking, you accept full liability for slip failure.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
