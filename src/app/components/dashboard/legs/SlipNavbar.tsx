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
      {/* 1. COMPACT DOCK */}
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
              <div className="relative z-10 flex items-center gap-3 text-left">
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

      {/* 2. FULL-SCREEN "MATRIX REVEAL" OVERLAY */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-xl overflow-hidden p-0"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
                exit: { opacity: 0 },
              }}
              className="bg-iron-volt w-full h-full max-w-2xl relative flex flex-col overflow-hidden text-black shadow-[0_0_100px_rgba(250,204,21,0.5)]"
            >
              {/* Fondo Industrial */}
              <div className="absolute inset-0 opacity-[0.08] pointer-events-none flex gap-4 rotate-12 scale-150">
                {[...Array(60)].map((_, i) => (
                  <div key={i} className="w-10 h-[200%] bg-black" />
                ))}
              </div>

              {/* HEADER */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="p-8 pb-4 relative z-10 flex justify-between items-end border-b-4 border-black/10"
              >
                <div>
                  <p className="font-mono text-xs tracking-[0.5em] font-black text-black/40 uppercase mb-1 text-left">
                    PROTOCOL_DECRYPTED
                  </p>
                  <h2 className="text-6xl font-black italic uppercase leading-none tracking-tighter">
                    REVIEW_SLIP
                  </h2>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="bg-black text-iron-volt p-4 shadow-2xl active:scale-90 transition-transform mb-1 font-mono text-xs font-bold"
                >
                  [ CLOSE ]
                </button>
              </motion.div>

              {/* CONTENIDO SCROLLABLE */}
              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide relative z-10">
                {/* PAYOUT BOX */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  className="mb-10 p-8 bg-black flex flex-col items-center relative shadow-[20px_20px_0px_rgba(0,0,0,0.2)]"
                >
                  <p className="text-iron-volt/50 font-mono text-xs uppercase tracking-[0.3em] mb-2 text-center w-full text-left">
                    EST_YIELD
                  </p>
                  <h3 className="text-8xl font-black italic text-iron-volt tracking-tighter leading-none">
                    {totalPayout}
                    <span className="text-3xl ml-2 text-white">CR</span>
                  </h3>
                  <div className="w-full h-[2px] bg-iron-volt/20 my-4" />
                  <div className="flex justify-between w-full">
                    <p className="text-white font-mono text-[10px] uppercase tracking-widest italic text-left">
                      Mult: x{multiplier.toFixed(1)}
                    </p>
                    {hasDemon && (
                      <p className="text-iron-red font-mono text-[10px] uppercase font-black animate-pulse">
                        ! HAZARD_ACTIVE !
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* LISTA DE LEGS */}
                <div className="space-y-4">
                  {activeSlip.map((leg) => (
                    <motion.div
                      key={leg._id}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      className="bg-black text-iron-volt p-5 flex justify-between items-center border-r-8 border-black hover:border-iron-red transition-all shadow-lg"
                    >
                      <div className="flex gap-5 items-center text-left">
                        <div
                          className={`w-3 h-12 ${leg.isDemon ? 'bg-iron-red animate-pulse' : 'bg-white'}`}
                        />
                        <div>
                          <h4 className="font-black italic uppercase text-2xl leading-none tracking-tight text-white mb-1">
                            {leg.task}
                          </h4>
                          <p className="font-mono text-[10px] font-black uppercase text-iron-volt/60 tracking-widest">
                            VALUE: +{leg.creditReward} CR
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveLeg(leg._id)}
                        className="bg-zinc-800 p-2 text-white hover:bg-iron-red transition-colors"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* BOTÓN FINAL */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="p-8 bg-black relative z-20"
              >
                <button
                  className="w-full bg-iron-volt text-black py-6 font-black italic text-5xl uppercase tracking-tighter hover:bg-white transition-all active:scale-[0.97] flex flex-col items-center leading-none"
                  onClick={() => alert('CONTRACT_INITIALIZED')}
                >
                  <span>EXECUTE</span>
                  <span className="text-[10px] font-mono mt-2 opacity-60 tracking-[0.8em] font-black">
                    LOCKED_AND_LOADED
                  </span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
