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
    <main className="h-screen w-full overflow-hidden flex flex-col bg-black max-w-2xl mx-auto border-x border-zinc-900">
      <div className="flex-shrink-0 p-4 pb-0">
        <LegsHeader />
      </div>

      <div className="flex-1 mt-4 overflow-y-auto scrollbar-hide overscroll-contain touch-pan-y px-2">
        {loading ? (
          <div className="flex items-center">
            <p className="px-6 text-iron-volt font-mono text-[10px] animate-pulse tracking-[0.3em]">
              CONNECTING_
            </p>
          </div>
        ) : (
          /* Added pb-28 here to clear the BottomNav completely */
          <div className="grid gap-1 pb-28">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any  */}
            {legs.map((leg: any) => (
              <LegCard
                key={leg._id}
                leg={leg}
                onClick={(l) => setSelectedLeg(l)}
              />
            ))}
            {/* End of list indicator */}
            <div className="mt-6 flex flex-col items-center opacity-20">
              <div className="w-full h-[1px] bg-iron-volt mb-2" />
              <p className="font-mono text-[8px] text-iron-volt uppercase tracking-widest text-center">
                SYSTEM_STABLE // END_OF_TRANSMISSION
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
