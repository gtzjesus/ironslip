/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
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
  clearSlipData: () => void; // Added callback to wipe the deck clean after execution
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

    // 1. Commit the custom configuration to local storage
    slipStorage.saveSlip({
      title: `${hasDemon ? 'DEMON' : 'IRON'} PARLAY`,
      type: hasDemon ? 'DEMON' : 'IRON',
      totalPayout,
      multiplier,
      legs: activeSlip.map(leg => ({
        _id: leg._id,
        task: leg.task,
        creditReward: leg.creditReward,
        isDemon: leg.isDemon
      }))
    });

    // 2. Wipe the draft state clean
    clearSlipData();
    onClose();

    // 3. Push user right into the active monitoring desk
    router.push('/slips');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-xl overflow-hidden p-0"
    >
      <motion.div
        initial={{ x: '-100vw' }}
        animate={{ x: 0 }}
        exit={{ x: '100vw' }}
        transition={{ type: 'spring', damping: 28, stiffness: 150 }}
        className="bg-iron-volt w-full h-full max-w-2xl relative flex flex-col overflow-hidden text-black shadow-[0_0_100px_rgba(250,204,21,0.5)]"
      >
        {/* Striped Industrial Background Accent */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none flex gap-4 rotate-12 scale-150">
          {[...Array(60)].map((_, i) => (
            <div key={i} className="w-10 h-[200%] bg-black" />
          ))}
        </div>

        {/* HEADER */}
        <div className="p-8 pb-4 relative z-10 flex justify-between items-end border-b-4 border-black/10">
          <div>
            <p className="mb-2 font-mono text-[8px] tracking-[0.3em] font-black italic uppercase">
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

        {/* CONTENT WINDOW */}
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
                <p className="text-red-500 font-mono text-[10px] uppercase font-black animate-pulse">
                  ! HAZARD_ACTIVE !
                </p>
              )}
            </div>
          </div>

          {/* PARLAY CONFIGURATION LIST */}
          <div className="space-y-4">
            {activeSlip.map((leg) => (
              <div
                key={leg._id}
                className="bg-black text-iron-volt p-5 flex justify-between items-center border-r-8 border-black hover:border-red-600 transition-all shadow-lg"
              >
                <div className="flex gap-5 items-center text-left">
                  <div className={`w-3 h-12 ${leg.isDemon ? 'bg-red-500 animate-pulse' : 'bg-white'}`} />
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
                  className="bg-zinc-800 p-2 text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL COMMIT BUTTON */}
        <div className="p-8 bg-black relative z-20">
          <button
            className="w-full bg-iron-volt text-black py-6 font-black italic text-5xl uppercase tracking-tighter hover:bg-white transition-all active:scale-[0.97] flex flex-col items-center leading-none"
            onClick={handleExecuteContract}
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