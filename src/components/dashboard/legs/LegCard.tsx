'use client';

interface LegProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leg: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (leg: any) => void;
  isSignedIn: boolean; // Add this prop
}

export default function LegCard({ leg, onClick, isSignedIn }: LegProps) {
  // 🔬 DETECTOR DE BASE DE DATOS (Abre F12 en tu navegador para auditar la data real)
  console.log("DATOS DE LA LEG EN CARD:", leg);

  // 🧠 Evaluamos si el documento ya viene forzado como demon o si es regular
  const isDemon = leg.isDemon === true || leg.difficulty === 'demon';

  // ⚡️ EXTRACTOR DINÁMICO: Si no encuentra los nuevos campos, busca el viejo por si hay caché, o mete un fallback duro
  const displayReward = isDemon
    ? (leg.demonReward ?? leg.creditReward ?? 350)
    : (leg.regularReward ?? leg.creditReward ?? 100);

  return (
    <button
      onClick={() => isSignedIn && onClick(leg)} // Only click if signed in
      className={`relative w-full text-left border-[0.5px] p-4 px-2 mb-1 overflow-hidden transition-all ${
        isDemon
          ? 'border-iron-red bg-zinc-950/20'
          : 'bg-zinc-950 border-zinc-800'
      } ${!isSignedIn ? 'cursor-default' : 'cursor-pointer '}`}
    >
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <p
            className={`font-mono text-[8px] uppercase tracking-widest ${
              isDemon ? 'animate-pulse text-iron-red' : 'text-zinc-500'
            }`}
          >
            {isDemon ? 'DEMON 👹' : (leg.category || 'LIFTING')}
          </p>

          {/* BLURRED TASK NAME */}
          <h3
            className={`font-black italic text-xl uppercase tracking-tighter transition-all duration-500 ${
              isDemon ? 'text-iron-red' : 'text-white'
            } ${!isSignedIn ? 'blur-[5px] select-none opacity-50' : ''}`}
          >
            {leg.task}
          </h3>
        </div>

        <div className="text-right">
          {/* 🎯 EL REWARD CORREGIDO AQUÍ */}
          <p
            className={`font-black italic text-sm transition-all duration-500 ${
              isDemon ? 'text-iron-red' : 'text-iron-volt'
            } ${!isSignedIn ? 'blur-[4px] select-none' : ''}`}
          >
            +{displayReward}
          </p>

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