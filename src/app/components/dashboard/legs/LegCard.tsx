'use client';

interface LegProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leg: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (leg: any) => void;
}

export default function LegCard({ leg, onClick }: LegProps) {
  const isDemon = leg.isDemon;

  return (
    <button
      onClick={() => onClick(leg)}
      className={`relative w-full text-left border-2 p-4 mb-2 overflow-hidden transition-all active:scale-95 ${
        isDemon
          ? 'bg-iron-volt border-iron-red'
          : 'bg-zinc-950 border-zinc-800 hover:border-iron-volt'
      }`}
    >
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <p
            className={`font-mono text-[8px] uppercase tracking-widest ${isDemon ? 'text-black/60' : 'text-zinc-500'}`}
          >
            {isDemon ? '👹 DEMON_LEG' : leg.category}
          </p>
          <h3
            className={`font-black italic text-xl uppercase tracking-tighter ${isDemon ? 'text-black' : 'text-white'}`}
          >
            {leg.task}
          </h3>
        </div>

        <div className="text-right">
          <p
            className={`font-black italic text-xl ${isDemon ? 'text-iron-red animate-pulse' : 'text-iron-volt'}`}
          >
            +{leg.creditReward}
          </p>
          <p
            className={`text-[6px] font-mono uppercase ${isDemon ? 'text-black/50' : 'text-zinc-500'}`}
          >
            Credits
          </p>
        </div>
      </div>
    </button>
  );
}
