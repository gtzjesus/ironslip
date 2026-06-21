/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMemo } from 'react';
// 🔥 IMPORTAMOS TU HOOK DE SONIDO
import { useSound } from '@/hooks/useSound';

interface LegFilterNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  legs: any[]; // 👈 Recibimos la lista completa de Sanity
}

export default function LegFilterNav({
  activeCategory,
  onCategoryChange,
  legs,
}: LegFilterNavProps) {
  // 🔥 INICIALIZAMOS EL MOTOR DE AUDIO
  const { playSound } = useSound();
  
  // 🧠 CÁLCULO DINÁMICO: Extrae categorías únicas de tus ejercicios
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
    <div className="mt-5 flex overflow-x-auto gap-2 pb-5 scrollbar-hide no-scrollbar ">
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
              flex-shrink-0 px-3 py-2 font-mono text-[10px] uppercase tracking-widest border transition-all duration-200
              ${
                isActive
                  ? 'bg-iron-volt text-black border-iron-volt font-black shadow-[0_0_10px_rgba(250,204,21,0.2)]'
                  : 'bg-transparent text-zinc-600 border-zinc-800'
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