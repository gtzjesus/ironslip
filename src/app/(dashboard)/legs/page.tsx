/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
// ◄ OPTIMIZED: Framer Motion imports are completely stripped out to save bundle size and memory overhead
import { SlidersHorizontal, ChevronUp } from 'lucide-react'; 
import { useLegs } from '@/hooks/useLegs';
import { useUser } from '@clerk/nextjs';
import LegsHeader from '@/components/dashboard/legs/Legsheader';
import LegCard from '@/components/dashboard/legs/LegCard';
import LegExpansion from '@/components/dashboard/legs/LegExpansion';
import LegFilterNav from '@/components/dashboard/legs/LegFilterNav';
import SlipNavbar from '@/components/dashboard/legs/SlipNavbar'; 

// 🔥 IMPORTAMOS TU MOTOR FINANCIERO REAL
import { getUserBalance } from '@/actions/supabase/slips';

export default function LegsPage() {
  const { legs, loading } = useLegs();
  const { isLoaded, isSignedIn } = useUser();
  const [selectedLeg, setSelectedLeg] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeSlip, setActiveSlip] = useState<any[]>([]);

  // 🧠 EL BALANCE EMPIEZA EN 0 Y SE LLENA CON DATA REAL DE SUPABASE
  const [userBalance, setUserBalance] = useState<number>(0);

  // 🔥 SINCRONIZACIÓN BANCARIA EN VIVO
  useEffect(() => {
    async function syncWallet() {
      if (isLoaded && isSignedIn) {
        const res = await getUserBalance();
        if (res.success) {
          setUserBalance(res.credits); // ⚡️ Inyección de tus créditos reales de la base de datos
        } else {
          console.error('Failed to sync live wallet credits:', res.error);
        }
      }
    }
    syncWallet();
  }, [isLoaded, isSignedIn]);

  // Manejo de borradores locales en localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('iron_slip_draft');
    if (savedDraft) {
      try {
        setActiveSlip(JSON.parse(savedDraft));
      } catch (error) {
        console.error('Failed parsing slip draft:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('iron_slip_draft', JSON.stringify(activeSlip));
    }
  }, [activeSlip, isLoaded]);

  const filteredLegs = useMemo(() => {
    if (activeCategory === 'all') return legs;
    return legs.filter((leg: any) => leg.category === activeCategory);
  }, [legs, activeCategory]);

  const toggleLegInSlip = (leg: any) => {
    const exists = activeSlip.find((l) => l._id === leg._id);
    if (exists) {
      setActiveSlip(activeSlip.filter((l) => l._id !== leg._id));
    } else {
      if (activeSlip.length >= 5) return alert('MAX_CAPACITY: 5_LEGS');
      setActiveSlip([...activeSlip, leg]);
    }
  };

  const handleClearSlipData = () => {
    setActiveSlip([]);
    localStorage.removeItem('iron_slip_draft');
  };

  const isFilteringActive = activeCategory !== 'all';

  return (
    <main className="h-screen w-full overflow-hidden flex flex-col bg-black max-w-2xl mx-auto border-x border-zinc-900 relative">
      {/* 📱 SAFARI TINT FORCE: Case 1 */}
      <meta name="theme-color" content="#000000" />
      
      {/* 1. MASTER STACKED NAVIGATION CELL BAR PACK */}
      <div className="flex-shrink-0 p-4 pb-0 flex flex-col">
        <div className="w-full">
          {/* ⚡️ LE PASAMOS EL BALANCE TOTALMENTE DINÁMICO AL HEADER */}
          <LegsHeader userBalance={userBalance} />
        </div>

        {/* ROW BRAVO: Second Navbar Sub-Dock */}
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
                    <span>{isFilteringActive ? 'filters active' : 'show filters'}</span>
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

      {/* 2. CORE SCROLLABLE MATRIX CARD AREA */}
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
              onClick={(l) => setSelectedLeg(l)}
              isAlreadyInSlip={activeSlip.some((item: any) => item._id.includes(leg._id))}
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

      {/* SOLID STATIC MINIMALIST FOOTER FIXED COMMAND CAP */}
      <SlipNavbar
        activeSlip={activeSlip}
        onRemoveLeg={(id) =>
          setActiveSlip((prev) => prev.filter((l) => l._id !== id))
        }
        clearSlipData={handleClearSlipData} 
        userBalance={userBalance}
      />

      {/* DETAILED EXPANSION WINDOW MODAL SCREEN */}
      {selectedLeg && (
        <LegExpansion
          leg={selectedLeg}
          onClose={() => setSelectedLeg(null)}
          onToggleSlip={toggleLegInSlip}
       isInSlip={activeSlip.some((item) => item._id.includes(selectedLeg._id))}
        />
      )}
    </main>
  );
}