'use client';

import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { Zap } from 'lucide-react'; // For that 'Credit' vibe

export default function LegsHeader() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return <div className="h-24" />;

  // Using your 'Iron Gold/Volt' color for currency
  const accentColor = isSignedIn ? 'text-[#c4a000]' : 'text-iron-red';
  const borderColor = isSignedIn ? 'border-[#c4a000]/30' : 'border-iron-red/30';

  return (
    <header
      className={`mb-4 flex justify-between items-end border-b ${borderColor} pb-2  transition-colors duration-700`}
    >
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${accentColor} mb-2 font-mono text-[8px] tracking-[0.3em] font-black italic uppercase `}
        >
          {isSignedIn ? 'build your slip with' : 'OFFLINE'}
        </motion.p>

        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
            Iron Legs
          </h2>
          <span className="text-zinc-600 font-mono text-[10px] italic uppercase">
            _
          </span>
        </div>
      </div>

      {/* BALANCE SECTION */}
      <div className="text-right flex flex-col items-end">
        <p className="text-zinc-500 font-mono text-[6px] font-black italic uppercase tracking-widest mb-1">
          Iron_Credits
        </p>
        <div className="flex items-center gap-2">
          <Zap
            className={`w-3 h-3 ${isSignedIn ? 'text-[#c4a000] fill-[#c4a000]' : 'text-zinc-800'}`}
          />
          <p
            className={`text-2xl font-black italic tracking-tighter ${isSignedIn ? 'text-white' : 'text-zinc-800'}`}
          >
            {isSignedIn ? '1,250' : '--.----'}
          </p>
        </div>
      </div>
    </header>
  );
}
