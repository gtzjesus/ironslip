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
    <div className="mt-8 flex overflow-x-auto gap-2 pb-5 scrollbar-hide no-scrollbar ">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`
              flex-shrink-0 px-3 py-2 font-mono text-[10px] uppercase tracking-widest border transition-all duration-200
              ${
                isActive
                  ? ' bg-iron-volt text-black border-iron-volt font-black italic shadow-[0_0_10px_rgba(250,204,21,0.2)]'
                  : 'bg-transparent text-zinc-600 border-zinc-800 '
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
