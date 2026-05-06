'use client';
import SlipHeader from '@/app/components/common/Slipheader';
import { useLegs } from '@/hooks/useLegs';

export default function LegsPage() {
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
                className="relative border border-zinc-800 bg-zinc-950 p-4 mb-2 overflow-hidden group"
              >
                {/* Background Category Watermark */}
                <span className="absolute -bottom-2 -right-2 text-4xl font-black italic opacity-5 text-zinc-500 uppercase">
                  {leg.category}
                </span>

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-zinc-500 font-mono text-[8px] uppercase tracking-[0.2em] mb-1">
                      {leg.avatarAction || 'Standard'} {leg.category}
                    </p>
                    <h3 className="text-white font-black italic text-2xl uppercase tracking-tighter leading-none">
                      {leg.task}
                    </h3>
                  </div>

                  {/* PAYOUT HIGHLIGHT */}
                  <div className="text-right">
                    <p className="text-iron-volt font-black italic text-xl leading-none">
                      +{leg.creditReward}
                    </p>
                    <p className="text-[6px] font-mono text-iron-volt/50 uppercase">
                      Credits
                    </p>
                  </div>
                </div>

                {/* THE MAIN REQUIREMENT - Highlighted Hard */}
                <div className="mt-4 bg-zinc-900 border-l-2 border-iron-volt p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-mono text-[8px] uppercase">
                      Requirement:
                    </span>
                    <span className="text-white font-black italic text-lg uppercase tracking-tight">
                      {leg.requirementValue} {leg.requirementUnit}
                    </span>
                  </div>
                </div>

                {/* PROOF TYPE */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-iron-volt animate-pulse" />
                  <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
                    Verification: {leg.verificationMethod} Required
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
