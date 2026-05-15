'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Trash2, AlertTriangle } from 'lucide-react';

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
      {/* 1. COMPACT DOCK (Mantenemos el original para que resalte en el feed negro) */}
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
              className={`cursor-pointer relative overflow-hidden border-t-2 border-x-2 p-3 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.6)] ${hasDemon ? 'bg-iron-volt border-iron-red' : 'bg-iron-volt border-black'}`}
            >
              <div className="relative z-10 flex items-center gap-3">
                <div className="bg-black p-2">
                  <Zap
                    className={`w-4 h-4 ${hasDemon ? 'text-iron-red animate-pulse' : 'text-iron-volt'}`}
                  />
                </div>
                <div>
                  <p className="text-[9px] font-black font-mono leading-none text-black/60 uppercase">
                    Slip_Queue
                  </p>
                  <p className="text-sm font-black italic uppercase text-black">
                    {activeSlip.length} / 5 LEGS
                  </p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-4 text-black">
                <div className="text-right">
                  <p className="text-[8px] font-black font-mono text-black/50 uppercase">
                    Yield
                  </p>
                  <p className="text-xl font-black italic leading-none">
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

      {/* 2. FULL-SCREEN YELLOW REVIEW (Versión Inversa) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            className=" brightness-[0.6] fixed inset-0 z-[100] bg-iron-volt flex flex-col p-6 overflow-hidden text-black"
          >
            {/* Background Texture (Líneas industriales sutiles) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex gap-4 rotate-12 scale-150">
              {[...Array(50)].map((_, i) => (
                <div key={i} className="w-8 h-[200%] bg-black" />
              ))}
            </div>

            {/* HEADER */}
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="font-mono text-[10px] tracking-[0.4em] uppercase font-black text-black/40">
                  CLASSIFIED_SLIP_v2.0
                </p>
                <h2 className="text-5xl font-black italic uppercase leading-none tracking-tighter">
                  REVIEW_CORE
                </h2>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="bg-black text-iron-volt p-3 shadow-xl active:scale-90 transition-transform"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* TOTAL PAYOUT (Inverso: Fondo negro en pantalla amarilla) */}
            <div className="mt-8 mb-6 p-6 bg-black flex flex-col items-center relative overflow-hidden shadow-2xl">
              <p className="text-iron-volt/50 font-mono text-[10px] uppercase tracking-widest">
                Total_Contract_Value
              </p>
              <h3 className="text-7xl font-black italic text-iron-volt tracking-tighter">
                {totalPayout}
                <span className="text-2xl ml-2 text-white">CR</span>
              </h3>
              <div className="flex gap-4 mt-2">
                <p className="text-white/40 font-mono text-[9px] uppercase tracking-[0.2em]">
                  Mult: x{multiplier.toFixed(1)}
                </p>
                {hasDemon && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-iron-red animate-pulse" />
                    <p className="text-iron-red font-mono text-[9px] uppercase font-black">
                      DEMON_ACTIVE
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* LIST OF SELECTED LEGS */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 no-scrollbar pb-10 relative z-10">
              <p className="text-[9px] font-black font-mono mb-2 text-black/40 uppercase tracking-widest">
                Selected_Objectives:
              </p>
              {activeSlip.map((leg) => (
                <div
                  key={leg._id}
                  className="bg-black/5 border-2 border-black p-4 flex justify-between items-center group active:bg-black/10 transition-colors"
                >
                  <div className="flex gap-4 items-center">
                    <div
                      className={`w-2 h-10 ${leg.isDemon ? 'bg-iron-red animate-pulse' : 'bg-black'}`}
                    />
                    <div>
                      <h4 className="font-black italic uppercase text-lg leading-tight tracking-tight">
                        {leg.task}
                      </h4>
                      <p className="font-mono text-[9px] font-black uppercase text-black/60 tracking-tighter">
                        Reward:{' '}
                        <span className="text-black">
                          +{leg.creditReward} CR
                        </span>
                        {leg.category}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveLeg(leg._id)}
                    className="p-2 hover:bg-iron-red hover:text-white transition-all rounded-none"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* CTA BUTTON (El botón final en negro sólido) */}
            <div className="relative z-10 pt-4">
              <button
                className="w-full bg-black text-iron-volt py-5 font-black italic text-4xl uppercase tracking-tighter hover:bg-zinc-900 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:scale-[0.98] flex flex-col items-center leading-none"
                onClick={() => alert('CONTRACT_LOCKED')}
              >
                <span>INITIATE_SLIP</span>
                <span className="text-[8px] font-mono mt-1 opacity-50 tracking-[0.5em]">
                  NO_REVERSAL_POSSIBLE
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
