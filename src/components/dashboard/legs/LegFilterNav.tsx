/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMemo } from 'react';
import { useSound } from '@/hooks/useSound';

interface LegFilterNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  legs: any[];
}

export default function LegFilterNav({
  activeCategory,
  onCategoryChange,
  legs,
}: LegFilterNavProps) {
  const { playSound } = useSound();
  
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(legs.map((l) => l.category || 'lifting')));
    return [
      { label: 'ALL', value: 'all' },
      ...uniqueCategories.map((cat) => ({ 
        label: cat, 
        value: cat 
      }))
    ];
  }, [legs]);

  return (
    <div className="mx-0.5 flex overflow-x-auto gap-1.5 scrollbar-hide no-scrollbar py-1">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => {
              if (!isActive) {
                playSound('open-card');
              }
              onCategoryChange(cat.value);
            }}
            className={`
              flex-shrink-0 px-3.5 py-2 font-mono text-[10px] uppercase tracking-widest italic transition-all duration-150 border-2
              ${
                isActive
                  ? 'bg-[#B89223] text-black border-black font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
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