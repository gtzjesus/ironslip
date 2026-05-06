'use client';
import SlipHeader from '@/app/components/common/Slipheader';
import { useLegs } from '@/hooks/useLegs';

export default function SlipsPage() {
  const { legs, loading } = useLegs();

  return (
    <main className="h-screen w-full overflow-hidden flex flex-col p-4 bg-black max-w-2xl mx-auto">
      <div className="flex-shrink-0">
        <SlipHeader />
      </div>

      <div className="flex-1 mt-2">
        {loading ? (
          <p className="text-iron-volt font-mono text-[13px] animate-pulse">
            CONNECTING_TO_IRON_DATABASE...
          </p>
        ) : (
          <div className="grid gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {legs.map((leg: any) => (
              <div
                key={leg._id}
                className="border border-zinc-800 bg-zinc-950 p-4 mb-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-black italic text-2xl uppercase tracking-tighter">
                    {leg.task}
                  </h3>
                  <div className="bg-iron-volt px-2 py-1">
                    <span className="text-black font-mono text-xs font-black">
                      +{leg.creditReward || 0}CR
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 mb-3">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">
                    Weight:{' '}
                    <span className="text-white">
                      {leg.weightRequirement || 'N/A'}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">
                    Proof:{' '}
                    <span className="text-iron-volt">
                      {leg.verificationMethod}
                    </span>
                  </div>
                </div>

                {/* The Action Button */}
                <button className="w-full py-2 border border-iron-volt text-iron-volt font-mono text-[10px] font-black uppercase hover:bg-iron-volt hover:text-black transition-all">
                  INITIALIZE_SLIP
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
