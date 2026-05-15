'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Trash2, AlertTriangle, ChevronRight } from 'lucide-react';

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
      {/* 1. COMPACT DOCK */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-[64px] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[90] px-2"
          >
            <div
              onClick={() => setIsExpanded(true)}
              className={`cursor-pointer relative overflow-hidden border-t-2 border-x-2 p-3 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.6)] active:scale-[0.98] transition-transform ${hasDemon ? 'bg-iron-volt border-iron-red' : 'bg-iron-volt border-black'}`}
            >
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent h-[200%] animate-scanline pointer-events-none" />

              <div className="relative z-10 flex items-center gap-3">
                <div className="bg-black p-2">
                  <Zap
                    className={`w-4 h-4 ${hasDemon ? 'text-iron-red animate-pulse' : 'text-iron-volt'}`}
                  />
                </div>
                <div>
                  <p className="text-[9px] font-black font-mono leading-none text-black/60 uppercase">
                    SYSTEM_QUEUE
                  </p>
                  <p className="text-sm font-black italic uppercase text-black">
                    {activeSlip.length} / 5 LEGS
                  </p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-4 text-black font-black">
                <div className="text-right">
                  <p className="text-[8px] font-mono text-black/50 uppercase">
                    Yield
                  </p>
                  <p className="text-xl italic leading-none">
                    {totalPayout} CR
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 animate-bounce-x" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FULL-SCREEN TACTICAL OVERLAY (Consistent with LegExpansion) */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-iron-volt w-full max-w-md p-6 relative flex flex-col gap-4 border-4 border-black shadow-[0_0_50px_rgba(250,204,21,0.4)] max-h-[90vh]"
            >
              {/* EXIT BUTTON - Matches LegExpansion style */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-2 right-2 bg-black text-iron-volt font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-2 z-[110] hover:bg-iron-red hover:text-white transition-colors border border-white/10"
              >
                [ ABORT_REVIEW ]
              </button>

              {/* HEADER SECTION */}
              <div className="relative">
                <p className="font-mono text-[10px] font-black text-black/40 uppercase tracking-widest">
                  Protocol_Manifest_v4.0
                </p>
                <h2 className="text-5xl font-black italic uppercase leading-[0.8] tracking-tighter text-black">
                  SLIP_CORE
                </h2>
                <span className="absolute -top-4 -left-4 text-6xl font-black italic text-black/5 opacity-20 pointer-events-none uppercase">
                  REVIEW
                </span>
              </div>

              {/* DATA HUD - THE BLACK BOX */}
              <div className="bg-black p-5 shadow-inner border-b-4 border-iron-red/50">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-iron-volt/50 font-mono text-[9px] uppercase tracking-widest">
                    Total_Credits
                  </p>
                  {hasDemon && (
                    <div className="bg-iron-red text-white text-[8px] px-2 py-0.5 font-black animate-pulse">
                      INFESTED
                    </div>
                  )}
                </div>
                <h3 className="text-6xl font-black italic text-iron-volt leading-none tracking-tighter">
                  {totalPayout}
                  <span className="text-xl ml-2 text-white/50">CR</span>
                </h3>
                <div className="mt-4 flex gap-4 border-t border-iron-volt/10 pt-2">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">
                      Multiplier
                    </span>
                    <span className="text-white font-black italic">
                      x{multiplier.toFixed(1)}
                    </span>
                  </div>
                  {hasDemon && (
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono text-iron-red uppercase">
                        Demon_Bonus
                      </span>
                      <span className="text-iron-red font-black italic">
                        +0.5x
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* SCROLLABLE OBJECTIVES LIST */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {activeSlip.map((leg) => (
                  <div
                    key={leg._id}
                    className="group relative bg-black/5 border-2 border-black p-3 flex justify-between items-center overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-black translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 pointer-events-none opacity-5" />

                    <div className="relative z-10 flex items-center gap-3">
                      <div
                        className={`w-1.5 h-8 ${leg.isDemon || leg.difficulty === 'demon' ? 'bg-iron-red animate-pulse shadow-[0_0_10px_red]' : 'bg-black'}`}
                      />
                      <div>
                        <h4 className="font-black italic uppercase text-md leading-none text-black">
                          {leg.task}
                        </h4>
                        <p className="font-mono text-[8px] font-bold text-black/50 mt-1 uppercase">
                          REWARD: +{leg.creditReward} CR
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveLeg(leg._id)}
                      className="relative z-10 p-2 text-black/30 hover:text-iron-red transition-all active:scale-90"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* FINAL ACTION */}
              <div className="mt-auto pt-4 border-t border-black/10">
                <button
                  className="w-full bg-black text-iron-volt py-5 font-black italic text-3xl uppercase tracking-tighter hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl flex flex-col items-center leading-none"
                  onClick={() => alert('CONTRACT_INITIALIZED')}
                >
                  INITIALIZE_SLIP
                  <span className="text-[9px] font-mono mt-1 opacity-40 tracking-[0.4em]">
                    AWAITING_BIO_SYNC
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
