'use client';

import { useUser } from '@clerk/nextjs';
import { Zap } from 'lucide-react';

interface LegsHeaderProps {
  userBalance: number;
}

export default function LegsHeader({ userBalance }: LegsHeaderProps) {
  const { isSignedIn, isLoaded } = useUser();

  // Si aún está cargando o el usuario no ha iniciado sesión, no renderizamos nada
  if (!isLoaded) return <div className="h-24" />;
  if (!isSignedIn) return null;

  return (
    <header className="mb-4 flex justify-between items-end border-b border-[#c4a000]/30 pb-2 transition-colors duration-700">
      <div>
        <p className="text-[#c4a000] mb-2 font-mono text-[10px] tracking-[0.3em] font-black italic uppercase">
          {/* Vacío u online */}
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
          <Zap className="w-3 h-3 text-[#c4a000] fill-[#c4a000]" />
          <p className="text-2xl font-black italic tracking-tighter text-white">
            {userBalance.toLocaleString()}
          </p>
        </div>
      </div>
    </header>
  );
}