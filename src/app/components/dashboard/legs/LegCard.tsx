'use client';

interface LegProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leg: any;
}

export default function LegCard({ leg }: LegProps) {
  // Variables de estilo condicional para no ensuciar el JSX
  const isDemon = leg.isDemon;

  const cardStyles = isDemon
    ? 'bg-iron-volt border-iron-red shadow-[0_0_20px_rgba(217,255,0,0.3)]'
    : 'bg-zinc-950 border-zinc-800 group-hover:border-iron-volt/50';

  const textPrimary = isDemon ? 'text-black' : 'text-white';
  const textSecondary = isDemon ? 'text-black/60' : 'text-zinc-500';
  const requirementBg = isDemon
    ? 'bg-black/10 border-black'
    : 'bg-zinc-900/50 border-iron-volt';

  return (
    <div
      className={`relative border-2 ${cardStyles} p-4 mb-2 overflow-hidden transition-all duration-300`}
    >
      {/* SCAN LINE EFFECT - En Demon es roja para que contraste */}
      <div
        className={`absolute top-0 left-0 w-full h-[1px] ${isDemon ? 'bg-iron-red/40 shadow-[0_0_10px_#ff0000]' : 'bg-iron-volt/20 shadow-[0_0_10px_#d9ff00]'} animate-[scan_4s_linear_infinite] pointer-events-none z-20`}
      />

      {/* Watermark de Categoría */}
      <span
        className={`absolute -bottom-2 -right-2 text-4xl font-black italic uppercase pointer-events-none select-none ${isDemon ? 'opacity-10 text-black' : 'opacity-5 text-zinc-500'}`}
      >
        {leg.category}
      </span>

      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p
              className={`${textSecondary} font-mono text-[8px] uppercase tracking-[0.2em] mb-1 font-bold`}
            >
              {isDemon
                ? '👹 DEMON_PROTOCOL'
                : `${leg.avatarAction || 'Standard'} ${leg.category}`}
            </p>
            <h3
              className={`${textPrimary} font-black italic text-2xl uppercase tracking-tighter leading-none`}
            >
              {leg.task}
            </h3>
          </div>

          {/* Payout - ROJO en Demon Mode */}
          <div className="text-right">
            <p
              className={`font-black italic text-xl leading-none ${isDemon ? 'text-iron-red animate-pulse' : 'text-iron-volt'}`}
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

        {/* Bloque de Requerimiento */}
        <div
          className={`mt-4 ${requirementBg} border-l-2 p-2 transition-colors`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`${textSecondary} font-mono text-[8px] uppercase font-bold`}
            >
              Requirement:
            </span>
            <span
              className={`${textPrimary} font-black italic text-lg uppercase tracking-tight`}
            >
              {leg.requirementValue} {leg.requirementUnit}
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDemon ? 'bg-iron-red' : 'bg-iron-volt'}`}
            />
            <span
              className={`text-[8px] font-mono uppercase tracking-widest font-bold ${isDemon ? 'text-black/70' : 'text-zinc-400'}`}
            >
              {leg.verificationMethod} Required
            </span>
          </div>
          <span
            className={`text-[8px] font-mono uppercase italic font-bold ${isDemon ? 'text-black/60' : 'text-zinc-600'}`}
          >
            {leg.timeLimit || 24}H Limit
          </span>
        </div>
      </div>
    </div>
  );
}
