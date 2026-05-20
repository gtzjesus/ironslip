'use client';

const CATEGORIES = [
  { label: 'ALL', value: 'all' },
  { label: 'IRON', value: 'iron' },
  { label: 'CARDIO', value: 'cardio' },
  { label: 'LIFESTYLE', value: 'lifestyle' },
  { label: 'WILDCARD', value: 'wildcard' },
];

interface LegFilterNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function LegFilterNav({
  activeCategory,
  onCategoryChange,
}: LegFilterNavProps) {
  return (
    /* ◄ FIXED Layout Box: Added explicit left-padding (pl-5) to anchor 'ALL' away from the screen edge, 
       and an extended right-padding (pr-12) so the last element has breathing room on overflow drag. */
    <div className="py-4 flex overflow-x-auto gap-3 pb-3 scrollbar-hide no-scrollbar -mx-4 px-4 pl-5 pr-12 touch-pan-x overscroll-contain">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`
              flex-shrink-0 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.15em] border transition-all duration-200 rounded-md active:scale-95
              ${
                isActive
                  ? 'bg-iron-volt text-black border-iron-volt font-black italic shadow-[0_4px_20px_rgba(163,230,53,0.25)]'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-900'
              }
            `}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}