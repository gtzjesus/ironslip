/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

interface VariantItemProps {
  v: any;
  index: number;
  isExpanded: boolean;
  isSelected: boolean;
  isDemon: boolean;
  onToggleAccordion: () => void;
  onToggleSelection: (e: React.MouseEvent) => void;
  onToggleDemon: (e: React.MouseEvent) => void;
}

export default function VariantItem({
  v,
  index,
  isExpanded,
  isSelected,
  isDemon,
  onToggleAccordion,
  onToggleSelection,
  onToggleDemon,
}: VariantItemProps) {
  return (
    <div className={`transition-none border-[0.5px] overflow-hidden ${
      isSelected ? 'border-iron-volt bg-zinc-900/90' : 'border-zinc-900/80 bg-zinc-900/30'
    }`}>
      {/* CABECERA DEL ACORDEÓN */}
      <div 
        className="p-4 flex justify-between items-center cursor-pointer select-none"
        onClick={onToggleAccordion}
      >
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 border flex items-center justify-center font-mono text-[10px] ${
            isSelected ? 'bg-iron-volt text-black border-iron-volt font-black' : 'border-zinc-700'
          }`}>
            {isSelected ? '✓' : ''}
          </div>
          <span className={`font-black uppercase tracking-tight text-sm ${isSelected ? 'text-iron-volt' : 'text-zinc-300'}`}>
            {v.name}
          </span>
        </div>
        <span className="text-[10px] text-zinc-600">{isExpanded ? '▲' : '▼'}</span>
      </div>

      {/* CUERPO DEL ACORDEÓN (Renderizado instantáneo sin lag) */}
      {isExpanded && (
        <div className="border-t border-zinc-800/50 p-4 bg-black/40 space-y-3">
          <div>
            <span className="text-zinc-500 text-xs uppercase tracking-wider">Target </span>
            <p className="text-zinc-200 font-bold uppercase text-sm">{v.target}</p>
          </div>

          {v.isDemonSupported && (
            <div 
              onClick={onToggleDemon}
              className={`p-3 flex justify-between items-center border cursor-pointer ${
                isDemon ? 'bg-red-950/40 border-red-500' : 'bg-zinc-950 border-zinc-800'
              }`}
            >
              <div>
                <span className={`font-black italic text-[11px] ${isDemon ? 'text-red-500' : 'text-zinc-500'}`}>
                  {isDemon ? '😈 DEMON MODE ACTIVE' : 'DEMON MODE'}
                </span>
              </div>
              <div className={`w-8 h-4 ${isDemon ? 'bg-red-600' : 'bg-zinc-800'}`}>
                <div className={`bg-white w-3 h-3 transition-transform ${isDemon ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
          )}

          <button
            onClick={onToggleSelection}
            className={`w-full py-2.5 font-mono text-[11px] font-black uppercase border ${
              isSelected 
                ? 'bg-red-950/20 border-red-900/60 text-red-400' 
                : 'bg-zinc-900 border-zinc-800 text-iron-volt'
            }`}
          >
            {isSelected ? 'REMOVE' : 'ACTIVATE'}
          </button>
        </div>
      )}
    </div>
  );
}