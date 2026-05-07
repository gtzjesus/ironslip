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
    <main className="h-screen w-full overflow-hidden flex flex-col p-4 bg-black max-w-2xl mx-auto">
      <div className="flex-shrink-0">
        <LegsHeader />
      </div>

      <div className="flex-1 mt-4 overflow-y-auto scrollbar-hide">
        {loading ? (
          <p className="text-iron-volt font-mono text-[10px] animate-pulse">
            CONNECTING_
          </p>
        ) : (
          <div className="grid gap-1">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {legs.map((leg: any) => (
              <LegCard
                key={leg._id}
                leg={leg}
                onClick={(l) => setSelectedLeg(l)}
              />
            ))}
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
