/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

interface LegProps {
  leg: any;
  onClick: (leg: any) => void;
  isSignedIn: boolean;
  isAlreadyInSlip: boolean; // 🟢 NUEVA PROP: Controla si este ejercicio ya está en juego
}

export default function LegCard({ leg, onClick, isSignedIn, isAlreadyInSlip }: LegProps) {
  // 🧠 Evaluamos si el documento ya viene forzado como demon o si es regular
  const isDemon = leg.isDemon === true || leg.difficulty === 'demon';

  // ⚡️ EXTRACTOR DINÁMICO REWARD
  const displayReward = isDemon
    ? (leg.demonReward ?? leg.creditReward ?? 350)
    : (leg.regularReward ?? leg.creditReward ?? 100);

  // 🛡️ Si ya está en el slip, congelamos clicks y alteramos los estilos visuales
  const isDisabled = !isSignedIn || isAlreadyInSlip;

  return (
    <button
      onClick={() => !isDisabled && onClick(leg)}
      disabled={isDisabled}
      className={`relative w-full text-left border-[0.5px] p-4 px-2 mb-1 overflow-hidden transition-all ${
        isAlreadyInSlip
          ? 'border-zinc-800 bg-zinc-900/10 opacity-40 cursor-not-allowed' // 🔒 ESTILO BLOQUEADO SI YA ESTÁ EN EL SLIP
          : isDemon
          ? 'border-iron-red bg-zinc-950/20 cursor-pointer'
          : 'bg-zinc-950 border-zinc-800 cursor-pointer'
      } ${!isSignedIn ? 'cursor-default' : ''}`}
    >
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <p
            className={`font-mono text-[8px] uppercase tracking-widest ${
              isAlreadyInSlip
                ? 'text-zinc-600'
                : isDemon
                ? 'animate-pulse text-iron-red'
                : 'text-zinc-500'
            }`}
          >
            {isAlreadyInSlip ? '🔒' : isDemon ? 'DEMON 👹' : (leg.category || 'LIFTING')}
          </p>

          {/* TASK NAME */}
          <h3
            className={`font-black italic text-xl uppercase tracking-tighter transition-all duration-500 ${
              isAlreadyInSlip
                ? 'text-zinc-500 line-through' // Tacha el texto sutilmente si ya se usó
                : isDemon
                ? 'text-iron-red'
                : 'text-white'
            } ${!isSignedIn ? 'blur-[5px] select-none opacity-50' : ''}`}
          >
            {leg.task}
          </h3>
        </div>

        <div className="text-right flex flex-col items-end justify-center">
          {/* REWARD OR STATUS */}
          {isAlreadyInSlip ? (
            <span className="text-[10px] font-mono uppercase font-bold text-iron-volt tracking-widest bg-iron-volt/10 px-2 py-0.5 border border-iron-volt/20">
              [ IN SLIP ]
            </span>
          ) : (
            <p
              className={`font-black italic text-sm transition-all duration-500 ${
                isDemon ? 'text-iron-red' : 'text-iron-volt'
              } ${!isSignedIn ? 'blur-[4px] select-none' : ''}`}
            >
              +{displayReward}
            </p>
          )}

          {!isSignedIn && (
            <p className="text-[6px] font-mono uppercase text-iron-red mt-1">[ LOCKED ]</p>
          )}
        </div>
      </div>

      {/* Subtle Scanline Overlay for Non-Users */}
      {!isSignedIn && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent pointer-events-none" />
      )}
    </button>
  );
}