'use client';
import SlipHeader from '@/app/components/dashboard/legs/Legsheader';
import LegCard from '@/app/components/dashboard/legs/LegCard';
import { useLegs } from '@/hooks/useLegs';

export default function LegsPage() {
  const { legs, loading } = useLegs();

  return (
    <main className="h-screen w-full overflow-hidden flex flex-col p-4 bg-black max-w-2xl mx-auto border-x border-zinc-900">
      <div className="flex-shrink-0">
        <SlipHeader />
      </div>

      <div className="flex-1 mt-4 overflow-y-auto scrollbar-hide pb-10">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-iron-volt font-mono text-[10px] animate-pulse tracking-[0.2em]">
              CONNECTING_
            </p>
          </div>
        ) : (
          <div className="grid gap-2">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {legs?.map((leg: any) => (
              <LegCard key={leg._id} leg={leg} />
            ))}
            {legs?.length === 0 && (
              <p className="text-zinc-600 text-center font-mono text-[10px] mt-20 uppercase tracking-widest">
                No_Contracts_Available
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
