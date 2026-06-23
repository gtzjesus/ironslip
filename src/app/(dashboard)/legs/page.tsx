/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { SlidersHorizontal, ChevronUp } from 'lucide-react';
import { useLegs } from '@/hooks/useLegs';
import { useUser } from '@clerk/nextjs';
import LegsHeader from '@/components/dashboard/legs/Legsheader';
import LegCard from '@/components/dashboard/legs/LegCard';
import LegExpansion from '@/components/dashboard/legs/LegExpansion';
import LegFilterNav from '@/components/dashboard/legs/LegFilterNav';
import SlipNavbar from '@/components/dashboard/legs/SlipNavbar';

import { getUserBalance } from '@/actions/supabase/slips';

export default function LegsPage() {
  const { legs, loading } = useLegs();
  const { isLoaded, isSignedIn } = useUser();
  const [selectedLeg, setSelectedLeg] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);

  // 🧠 SOLUCIÓN AL ERROR: Inicialización perezosa (Lazy State).
  // Lee de localStorage antes del primer render, evitando renders en cascada.
  const [activeSlip, setActiveSlip] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem('iron_slip_draft');
      if (savedDraft) {
        try {
          return JSON.parse(savedDraft);
        } catch (error) {
          console.error('Failed parsing slip draft initialization:', error);
        }
      }
    }
    return [];
  });

  // Sincronización bancaria en vivo
  useEffect(() => {
    async function syncWallet() {
      if (isLoaded && isSignedIn) {
        const res = await getUserBalance();
        if (res.success) {
          setUserBalance(res.credits);
        } else {
          console.error('Failed to sync live wallet credits:', res.error);
        }
      }
    }
    syncWallet();
  }, [isLoaded, isSignedIn]);

  // Sincronizar cambios del slip hacia localStorage (Único efecto de almacenamiento activo)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('iron_slip_draft', JSON.stringify(activeSlip));
    }
  }, [activeSlip, isLoaded]);

  // Filtrado de Legs en memoria
  const filteredLegs = useMemo(() => {
    if (activeCategory === 'all') return legs;
    return legs.filter((leg: any) => leg.category === activeCategory);
  }, [legs, activeCategory]);

  // Búsqueda ultrarrápida O(1) de elementos activos en el slip
  const activeSlipIds = useMemo(() => {
    return new Set(activeSlip.map((item: any) => item._id.split('-')[0]));
  }, [activeSlip]);

  // Modificador del slip congelado en caché para evitar re-renders innecesarios
  const toggleLegInSlip = useCallback((mutatedLeg: any) => {
    setActiveSlip((prevSlip) => {
      const exists = prevSlip.some((l) => l._id === mutatedLeg._id);

      if (exists) {
        return prevSlip.filter((l) => l._id !== mutatedLeg._id);
      } else {
        if (prevSlip.length >= 5) {
          alert('MAX_CAPACITY: 5_LEGS');
          return prevSlip;
        }
        return [...prevSlip, mutatedLeg];
      }
    });
  }, []);

  const handleClearSlipData = useCallback(() => {
    setActiveSlip([]);
    localStorage.removeItem('iron_slip_draft');
  }, []);

  const handleRemoveLeg = useCallback((id: string) => {
    setActiveSlip((prev) => prev.filter((l) => l._id !== id));
  }, []);

  const isFilteringActive = activeCategory !== 'all';

  return (
    <main className="h-screen w-full overflow-hidden flex flex-col bg-black max-w-2xl mx-auto border-x border-zinc-900 relative">
      <meta name="theme-color" content="#000000" />

      {/* HEADER & FILTROS */}
      <div className="flex-shrink-0 p-4 pb-0 flex flex-col">
        <div className="w-full">
          <LegsHeader userBalance={userBalance} />
        </div>

        {isLoaded && isSignedIn && (
          <div className="flex flex-col justify-between items-center w-full">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded border transition-all duration-200 active:scale-95 ${
                  showFilters
                    ? 'bg-zinc-900 border-zinc-800 text-white'
                    : isFilteringActive
                      ? 'border-iron-volt/50 text-iron-volt shadow-[0_0_10px_rgba(163,230,53,0.1)] bg-zinc-950'
                      : 'border-zinc-900 text-zinc-500 hover:text-zinc-400 bg-transparent'
                }`}
              >
                {showFilters ? (
                  <>
                    <span>hide filters</span>
                    <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <span>
                      {isFilteringActive ? 'filters active' : 'show filters'}
                    </span>
                    <SlidersHorizontal className="w-2.5 h-2.5" />
                  </>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="w-full overflow-x-auto overflow-y-hidden">
                <LegFilterNav
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  legs={legs}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONTENEDOR PRINCIPAL SCROLLABLE */}
      <div className="flex-1 mt-3 overflow-y-auto scrollbar-hide overscroll-contain touch-pan-y px-2">
        {loading || !isLoaded ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-iron-volt font-mono text-[10px] animate-pulse tracking-[0.3em]">
              CONNECTING
            </p>
          </div>
        ) : (
          <div className="grid gap-1 pb-32">
            {filteredLegs.map((leg: any) => (
              <LegCard
                key={leg._id}
                leg={leg}
                isSignedIn={!!isSignedIn}
                onClick={setSelectedLeg}
                isAlreadyInSlip={activeSlipIds.has(leg._id)}
              />
            ))}
            <div className="mt-8 flex flex-col items-center opacity-20">
              <div className="w-full h-[1px] bg-iron-volt mb-2" />
              <p className="font-mono text-[8px] text-iron-volt uppercase tracking-widest text-center">
                End_of_transmission
              </p>
            </div>
            <div className="h-40 w-full flex-shrink-0" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* FOOTER NAV COMANDOS */}
      <SlipNavbar
        activeSlip={activeSlip}
        onRemoveLeg={handleRemoveLeg}
        clearSlipData={handleClearSlipData}
        userBalance={userBalance}
      />

      {/* MODAL DETALLE DE PIERNA */}
      {selectedLeg && (
        <LegExpansion
          leg={selectedLeg}
          onClose={() => {
            // 🔥 SOLUCIÓN DEFINITIVA: Retrasamos el desmontaje 10ms
            // para que el click físico muera en el modal y no traspase al fondo.
            setTimeout(() => {
              setSelectedLeg(null);
            }, 10);
          }}
          onToggleSlip={toggleLegInSlip}
          isInSlip={activeSlipIds.has(selectedLeg._id)}
          currentSlipItems={activeSlip}
        />
      )}
    </main>
  );
}
