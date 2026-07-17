/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

interface VariantItemProps {
  v: any;
  index: number;
  isExpanded: boolean;
  isSelected: boolean;
  isDemon: boolean; // <--- AGREGAMOS ESTA LÍNEA DE VUELTA
  onToggleAccordion: () => void;
  onToggleSelection: (e: React.MouseEvent) => void;
}

export default function VariantItem({
  v,
  index,
  isExpanded,
  isSelected,
  isDemon,
  onToggleAccordion,
  onToggleSelection,
}: VariantItemProps) {
  
  // Aquí usamos isDemon (que viene del slip) O isDemonSupported (que viene del schema)
  const isDemonLeg = isDemon || v.isDemonSupported === true;

  return (
    <div className={`transition-none border-[0.5px] overflow-hidden ${
      isDemonLeg 
        ? 'border-red-400 ' 
        : isSelected ? 'border-iron-volt bg-zinc-900/90' : 'border-zinc-900/80 bg-zinc-900/30'
    }`}>
      {/* CABECERA */}
      <div 
        className="p-4 flex justify-between items-center cursor-pointer select-none"
        onClick={onToggleAccordion}
      >
        <div className="flex items-center gap-3">
         
          <span className={`font-black uppercase tracking-tight text-sm ${
            isDemonLeg ? 'text-red-500' : isSelected ? 'text-iron-volt' : 'text-zinc-300'
          }`}>
            {v.name} {isDemonLeg && ' 😈'}
          </span>
        </div>
        <span className="text-[10px] text-zinc-600">{isExpanded ? '▲' : '▼'}</span>
      </div>

      {/* CUERPO */}
      {isExpanded && (
        <div className="border-t border-zinc-800/50 p-4 bg-black/40 space-y-3">
          <div>
            <span className="text-zinc-500 text-xs uppercase tracking-wider">Target </span>
            <p className="text-zinc-200 font-bold uppercase text-sm">{v.target}</p>
          </div>

          <button
            onClick={onToggleSelection}
            className={`w-full py-2.5 font-mono text-[11px] font-black uppercase border ${
              isDemonLeg 
                ? 'bg-red-600 border-red-600 text-black hover:bg-red-500'
                : isSelected 
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