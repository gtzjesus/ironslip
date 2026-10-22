/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
  const [userBalance, setUserBalance] = useState<number>(0);

  const [isGridView, setIsGridView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iron_slip_view_mode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('iron_slip_view_mode', JSON.stringify(isGridView));
    }
  }, [isGridView]);

  useEffect(() => {
    let isMounted = true;
    async function syncWallet() {
      if (isLoaded && isSignedIn) {
        const res = await getUserBalance();
        if (isMounted) {
          if (res.success) {
            setUserBalance(res.credits);
          } else {
            console.error('Failed to sync live wallet credits:', res.error);
          }
        }
      }
    }
    syncWallet();
    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('iron_slip_draft', JSON.stringify(activeSlip));
    }
  }, [activeSlip, isLoaded]);

  const filteredLegs = useMemo(() => {
    if (activeCategory === 'all') return legs;
    return legs.filter((leg: any) => leg.category === activeCategory);
  }, [legs, activeCategory]);

  const activeSlipIds = useMemo(() => {
    return new Set(activeSlip.map((item: any) => item._id.split('-')[0]));
  }, [activeSlip]);

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

  const handleConfirmSuccess = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('iron_slip_draft');
    }
    setActiveSlip([]);
    window.location.href = '/slips';
  }, []);

  return (
    <div 
      className="w-full h-screen max-w-2xl mx-auto border-x border-zinc-900/60 relative flex flex-col"
      style={{
        backgroundColor: '#0d0b09',
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }}
    >
      <meta name="theme-color" content="#0d0b09" />

      {/* HEADER FIX (NO SE MUEVE) */}
      <div className="flex-shrink-0 p-2 pb-0 flex flex-col z-20 bg-[#0d0b09]">
        <LegsHeader userBalance={userBalance} />

        {isLoaded && isSignedIn && (
          <div className="w-full border-b border-zinc-900 flex items-center justify-between gap-2 pr-1">
            <div className="overflow-x-auto overflow-y-hidden scrollbar-hide flex-1">
              <LegFilterNav
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                legs={legs}
              />
            </div>

            <button
              onClick={() => setIsGridView((prev) => !prev)}
              className="flex-shrink-0 px-2.5 py-1.5 bg-zinc-900/80 border border-zinc-800 hover:border-iron-volt/60 text-zinc-400 hover:text-iron-volt font-mono text-[9px] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95 my-1 cursor-pointer"
            >
              {isGridView ? 'GRID' : '2X2'}
            </button>
          </div>
        )}
      </div>

      {/* ÁREA DE SCROLL FORZADA EXPLICITAMENTE CON INLINE STYLES */}
      <div 
        className="flex-1 px-2 pt-3 scrollbar-hide"
        style={{
          overflowY: 'scroll',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y'
        }}
      >
        {loading || !isLoaded ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-iron-volt font-mono text-[10px] animate-pulse tracking-[0.3em]">
              CONNECTING
            </p>
          </div>
        ) : (
          <div className={`pb-40 ${isGridView ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-1'}`}>
            {filteredLegs.map((leg: any) => (
              <div key={leg._id} className="w-full">
                <LegCard
                  leg={leg}
                  isSignedIn={!!isSignedIn}
                  onClick={setSelectedLeg}
                  isAlreadyInSlip={activeSlipIds.has(leg._id)}
                  isGridView={isGridView}
                />
              </div>
            ))}

            <div className="col-span-full mt-8 flex flex-col items-center opacity-20">
              <div className="w-full h-[1px] bg-iron-volt mb-2" />
              <p className="font-mono text-[8px] text-iron-volt uppercase tracking-widest text-center">
                End_of_transmission
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER NAV */}
      <SlipNavbar
        activeSlip={activeSlip}
        onRemoveLeg={handleRemoveLeg}
        clearSlipData={handleClearSlipData}
        userBalance={userBalance}
        onConfirmSuccess={handleConfirmSuccess}
      />

      {selectedLeg && (
        <LegExpansion
          leg={selectedLeg}
          onClose={() => {
            setTimeout(() => {
              setSelectedLeg(null);
            }, 10);
          }}
          onToggleSlip={toggleLegInSlip}
          isInSlip={activeSlipIds.has(selectedLeg._id)}
          currentSlipItems={activeSlip}
          userBalance={userBalance}
          onRemoveLeg={handleRemoveLeg}
          clearSlipData={handleClearSlipData}
          onConfirmSuccess={handleConfirmSuccess}
        />
      )}
    </div>
  );
}