'use client';

import { useUser } from '@clerk/nextjs';
import { Zap } from 'lucide-react';

interface LegsHeaderProps {
  userBalance: number;
}

export default function LegsHeader({ userBalance }: LegsHeaderProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div className="h-24" />;

  // Manteniendo tus colores de acento tácticos
  const accentColor = isSignedIn ? 'text-[#c4a000]' : 'text-iron-red';
  const borderColor = isSignedIn ? 'border-[#c4a000]/30' : 'border-iron-red/30';

  return (
    <header
      className={`mb-4 flex justify-between items-end border-b ${borderColor} pb-2 transition-colors duration-700`}
    >
      <div>
        <p
          className={`${accentColor} mb-2 font-mono text-[10px] tracking-[0.3em] font-black italic uppercase`}
        >
          {isSignedIn ? '' : 'OFFLINE'}
        </p>

        <div className="flex items-baseline gap-1">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none text-white">
            Iron legs 
          </h2>
          <span className="text-zinc-600 font-mono text-[10px] italic uppercase">
            _
          </span>
        </div>
      </div>

      {/* BALANCE SECTION REAL */}
      <div className="text-right flex flex-col items-end">
        <div className="flex items-center gap-1">
          <Zap
            className={`w-3 h-3 ${isSignedIn ? 'text-[#c4a000] fill-[#c4a000]' : 'text-zinc-800'}`}
          />
          <p
            className={`text-2xl font-black italic tracking-tighter ${isSignedIn ? 'text-white' : 'text-zinc-800'}`}
          >
            {isSignedIn ? userBalance.toLocaleString() : '--.----'}
          </p>
        </div>
      </div>
    </header>
  );
}
