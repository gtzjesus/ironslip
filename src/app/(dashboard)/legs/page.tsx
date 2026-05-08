'use client';
import { useState, useMemo } from 'react';
import { useLegs } from '@/hooks/useLegs';
import { useUser } from '@clerk/nextjs';
import LegsHeader from '@/app/components/dashboard/legs/Legsheader';
import LegCard from '@/app/components/dashboard/legs/LegCard';
import LegExpansion from '@/app/components/dashboard/legs/LegExpansion';
import LegFilterNav from '@/app/components/dashboard/legs/LegFilterNav';

export default function LegsPage() {
  const { legs, loading } = useLegs();
  const { isLoaded, isSignedIn } = useUser();
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [selectedLeg, setSelectedLeg] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredLegs = useMemo(() => {
    if (activeCategory === 'all') return legs;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return legs.filter((leg: any) => leg.category === activeCategory);
  }, [legs, activeCategory]);

  return (
    <main className="h-screen w-full overflow-hidden flex flex-col bg-black max-w-2xl mx-auto border-x border-zinc-900">
      <div className="flex-shrink-0 p-4 pb-0">
        <LegsHeader />

        {/* ONLY SHOW FILTER TO SIGNED IN USERS */}
        {isLoaded && isSignedIn && (
          <LegFilterNav
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        )}
      </div>

      <div className="flex-1 mt-4 overflow-y-auto scrollbar-hide overscroll-contain touch-pan-y px-2">
        {loading || !isLoaded ? (
          <div className="flex items-center">
            <p className="px-6 text-iron-volt font-mono text-[10px] animate-pulse tracking-[0.3em]">
              CONNECTING_
            </p>
          </div>
        ) : (
          <div className="grid gap-1 pb-28">
            {filteredLegs.length > 0 ? (
              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              filteredLegs.map((leg: any) => (
                <LegCard
                  key={leg._id}
                  leg={leg}
                  isSignedIn={!!isSignedIn}
                  onClick={(l) => setSelectedLeg(l)}
                />
              ))
            ) : (
              <div className="py-20 flex flex-col items-center opacity-30">
                <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.4em]">
                  NO_DATA
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-col items-center opacity-20">
              <div className="w-full h-[1px] bg-iron-volt mb-2" />
              <p className="font-mono text-[8px] text-iron-volt uppercase tracking-widest text-center">
                End_of_transmission
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedLeg && (
        <LegExpansion leg={selectedLeg} onClose={() => setSelectedLeg(null)} />
      )}
    </main>
  );
}
