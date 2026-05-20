/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { SlidersHorizontal, ChevronUp } from 'lucide-react'; 
import { useLegs } from '@/hooks/useLegs';
import { useUser } from '@clerk/nextjs';
import LegsHeader from '@/app/components/dashboard/legs/Legsheader';
import LegCard from '@/app/components/dashboard/legs/LegCard';
import LegExpansion from '@/app/components/dashboard/legs/LegExpansion';
import LegFilterNav from '@/app/components/dashboard/legs/LegFilterNav';
import SlipNavbar from '@/app/components/dashboard/legs/SlipNavbar'; 

export default function LegsPage() {
  const { legs, loading } = useLegs();
  const { isLoaded, isSignedIn } = useUser();
  const [selectedLeg, setSelectedLeg] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Drives the visibility of the secondary filter drawer bar below the main header
  const [showFilters, setShowFilters] = useState(false);

  const [activeSlip, setActiveSlip] = useState<any[]>([]);

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
      
      {/* 1. MASTER STACKED NAV HOUSING */}
      <div className="flex-shrink-0 p-4 pb-0 flex flex-col">
        
        {/* ROW ALPHA: Primary Header Cell left entirely untouched for title & user balances */}
        <div className="w-full">
          <LegsHeader />
        </div>

        {/* ROW BRAVO: Second Navbar Sub-Dock (Houses the tactical filter trigger & sliding deck) */}
        {isLoaded && isSignedIn && (
          <div className=" flex flex-col justify-between items-center w-full">
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

            {/* DYNAMIC SECONDARY SLIDE DRAWER CONTAINER */}
            <AnimatePresence initial={false}>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'tween', ease: 'easeInOut', duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <LegFilterNav
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 2. MAIN SCROLLABLE MATRIX LIST FRAME */}
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

      {/* FIXED FOOTER NAV SLIP SYSTEM */}
      <SlipNavbar
        activeSlip={activeSlip}
        onRemoveLeg={(id) =>
          setActiveSlip((prev) => prev.filter((l) => l._id !== id))
        }
        clearSlipData={handleClearSlipData} 
      />

      {/* PERSISTENT FULL-SCREEN COMPONENT SHUTTER MODAL */}
      {selectedLeg && (
        <LegExpansion
          leg={selectedLeg}
          onClose={() => setSelectedLeg(null)}
          onToggleSlip={toggleLegInSlip}
          isInSlip={activeSlip.some((l) => l._id === selectedLeg._id)}
        />
      )}
    </main>
  );
}