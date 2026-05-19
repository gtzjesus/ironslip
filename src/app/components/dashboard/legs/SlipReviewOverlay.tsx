/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface SlipReviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlip: any[];
  onRemoveLeg: (id: string) => void;
  totalPayout: number;
  multiplier: number;
  hasDemon: boolean;
  minReviewsRequired: number;
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
}: SlipReviewOverlayProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      // Fast backdrop fade to instantly isolate the HUD view
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-xl overflow-hidden p-0"
    >
      <motion.div
        // Video-game style horizontal sweep entry and exit
        initial={{ x: '-100vw' }}
        animate={{ x: 0 }}
        exit={{ x: '100vw' }}
        transition={{ type: 'spring', damping: 28, stiffness: 150 }}
        className="bg-iron-volt w-full h-full max-w-2xl relative flex flex-col overflow-hidden text-black shadow-[0_0_100px_rgba(250,204,21,0.5)]"
      >
        {/* Fondo Industrial */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none flex gap-4 rotate-12 scale-150">
          {[...Array(60)].map((_, i) => (
            <div key={i} className="w-10 h-[200%] bg-black" />
          ))}
        </div>

        {/* HEADER */}
        <div className="p-8 pb-4 relative z-10 flex justify-between items-end border-b-4 border-black/10">
          <div>
            <p className="font-mono text-xs tracking-[0.5em] font-black text-black/40 uppercase mb-1 text-left">
              PROTOCOL_DECRYPTED
            </p>
            <h2 className="text-6xl font-black italic uppercase leading-none tracking-tighter">
              REVIEW_SLIP
            </h2>
          </div>
          <button
            onClick={onClose}
            className="bg-black text-iron-volt p-4 shadow-2xl active:scale-90 transition-transform mb-1 font-mono text-xs font-bold"
          >
            [ CLOSE ]
          </button>
        </div>

        {/* CONTENIDO SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide relative z-10">
          {/* PAYOUT BOX */}
          <div className="mb-10 p-8 bg-black flex flex-col items-center relative shadow-[20px_20px_0px_rgba(0,0,0,0.2)]">
            <p className="text-iron-volt/50 font-mono text-xs uppercase tracking-[0.3em] mb-2 w-full text-left">
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
          </div>

          {/* LISTA DE LEGS */}
          <div className="space-y-4">
            {activeSlip.map((leg) => (
              <div
                key={leg._id}
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
                  onClick={() => {
                    onRemoveLeg(leg._id);
                    if (activeSlip.length - 1 < minReviewsRequired) {
                      onClose();
                    }
                  }}
                  className="bg-zinc-800 p-2 text-white hover:bg-iron-red transition-colors"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BOTÓN FINAL */}
        <div className="p-8 bg-black relative z-20">
          <button
            className="w-full bg-iron-volt text-black py-6 font-black italic text-5xl uppercase tracking-tighter hover:bg-white transition-all active:scale-[0.97] flex flex-col items-center leading-none"
            onClick={() => alert('CONTRACT_INITIALIZED')}
          >
            <span>EXECUTE</span>
            <span className="text-[10px] font-mono mt-2 opacity-60 tracking-[0.8em] font-black">
              LOCKED_AND_LOADED
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}