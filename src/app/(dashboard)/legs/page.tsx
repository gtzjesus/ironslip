'use client';
import { useState } from 'react';
import { useLegs } from '@/hooks/useLegs';
import LegsHeader from '@/app/components/dashboard/legs/Legsheader';
import LegCard from '@/app/components/dashboard/legs/LegCard';
import LegExpansion from '@/app/components/dashboard/legs/LegExpansion';

export default function LegsPage() {
  const { legs, loading } = useLegs();
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [selectedLeg, setSelectedLeg] = useState<any>(null);

  return (
    /* h-screen + flex-col ensures the app fits the window exactly */
    <main className="h-screen w-full overflow-hidden flex flex-col bg-black max-w-2xl mx-auto border-x border-zinc-900">
      {/* Header is fixed at the top */}
      <div className="flex-shrink-0 p-4 pb-0">
        <LegsHeader />
      </div>

      {/* LIST CONTAINER: 
        1. overflow-y-auto enables scrolling.
        2. scrollbar-hide (from your globals) keeps it clean.
        3. overscroll-contain prevents the "bounce" from moving the whole browser.
      */}
      <div className="flex-1 mt-4 overflow-y-auto scrollbar-hide overscroll-contain touch-pan-y px-2">
        {loading ? (
          <div className=" flex items-center">
            <p className="text-iron-volt font-mono text-[10px] animate-pulse tracking-[0.3em]">
              CONNECTING_
            </p>
          </div>
        ) : (
          <div className="grid gap-1 ">
            {' '}
            {/* Added heavy bottom padding for the scroll "finish" */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {legs.map((leg: any) => (
              <LegCard
                key={leg._id}
                leg={leg}
                onClick={(l) => setSelectedLeg(l)}
              />
            ))}
            {/* End of list indicator - makes it feel like a terminal */}
            <div className="mt-2 flex flex-col items-center opacity-20">
              <div className="w-full h-[1px] bg-iron-volt mb-2" />
              <p className="font-mono text-[8px] text-iron-volt uppercase tracking-widest">
                --- END_OF_TRANSMISSION ---
              </p>
            </div>
          </div>
        )}
      </div>

      {/* The Videogame Expansion Modal */}
      {selectedLeg && (
        <LegExpansion leg={selectedLeg} onClose={() => setSelectedLeg(null)} />
      )}
    </main>
  );
}
