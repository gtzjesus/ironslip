/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo } from 'react';
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
  const [activeSlip, setActiveSlip] = useState<any[]>([]);

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

  return (
    <main className="h-screen w-full overflow-hidden flex flex-col bg-black max-w-2xl mx-auto border-x border-zinc-900 relative">
      <div className="flex-shrink-0 p-4 pb-0">
        <LegsHeader />
        {isLoaded && isSignedIn && (
          <LegFilterNav
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        )}
      </div>

      <div className="flex-1 mt-4 overflow-y-auto scrollbar-hide overscroll-contain touch-pan-y px-2">
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

      <SlipNavbar
        activeSlip={activeSlip}
        onRemoveLeg={(id) =>
          setActiveSlip((prev) => prev.filter((l) => l._id !== id))
        }
      />

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