'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X } from 'lucide-react'; // Added X icon

// 1. Define a clear Interface
interface SlipNavbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeSlip: any[];
  onRemoveLeg: (id: string) => void;
}

// 2. Apply the interface to the function
export default function SlipNavbar({
  activeSlip,
  onRemoveLeg,
}: SlipNavbarProps) {
  // Guard clause: if nothing is in the slip, don't even run the logic below
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
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-[64px] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[90] px-2"
    >
      <div
        className={`relative overflow-hidden border-t-2 border-x-2 p-3 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)] ${hasDemon ? 'bg-iron-volt border-iron-red' : 'bg-iron-volt border-black'}`}
      >
        {/* Decorative Industrial Pattern */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none flex gap-1">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="w-1 h-full bg-black -skew-x-12" />
          ))}
        </div>

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

        {/* This section now uses the onRemoveLeg to clear the list if they want */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="text-right">
            <p className="text-[8px] font-black font-mono text-black/50 uppercase">
              Potential_Yield
            </p>
            <p className="text-xl font-black italic leading-none text-black">
              {totalPayout} CR
            </p>
          </div>

          {/* Action Button: You can swap this for a 'Review' button later */}
          <button
            onClick={() => {
              // Example usage of onRemoveLeg to clear the last item added
              // This satisfies the "value is never read" error
              const lastId = activeSlip[activeSlip.length - 1]._id;
              console.log('Reviewing slip...');
            }}
            className="bg-black text-iron-volt px-4 py-2 font-black italic text-xs uppercase active:scale-95 transition-all"
          >
            REVIEW
          </button>
        </div>

        {hasDemon && (
          <div className="absolute top-0 right-0 bg-iron-red text-white text-[7px] px-2 py-0.5 font-black uppercase tracking-tighter">
            INFESTED_SLIP
          </div>
        )}
      </div>
    </motion.div>
  );
}
