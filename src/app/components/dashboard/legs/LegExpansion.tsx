'use client';

export default function LegExpansion({
  leg,
  onClose,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leg: any;
  onClose: () => void;
}) {
  if (!leg) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* THE MODAL CONTENT - Using your CSS classes */}
      <div className="cl-modalContent w-full max-w-md p-6 relative flex flex-col gap-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-iron-volt font-mono text-xs uppercase tracking-widest"
        >
          [ X ] CANCEL_CONTRACT
        </button>

        <div className="space-y-1">
          <p className="text-iron-black/60 font-mono text-[10px] uppercase font-bold tracking-widest">
            Objective_Deployment // {leg.category}
          </p>
          <h2 className="text-iron-black font-black italic text-4xl uppercase tracking-tighter leading-none">
            {leg.task}
          </h2>
        </div>

        <div className="bg-iron-black p-4 space-y-4">
          <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
            <span className="text-zinc-500 font-mono text-[10px] uppercase">
              Requirement
            </span>
            <span className="text-iron-volt font-black italic text-2xl uppercase">
              {leg.requirementValue} {leg.requirementUnit}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-500 font-mono text-[10px] uppercase">
              Time_Limit
            </span>
            <span className="text-white font-mono text-sm uppercase">
              {leg.timeLimit || 24} Hours
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-500 font-mono text-[10px] uppercase">
              Proof_Type
            </span>
            <span className="text-white font-mono text-sm uppercase">
              {leg.verificationMethod}
            </span>
          </div>
        </div>

        {/* Start Button */}
        <button
          className="w-full bg-iron-volt py-4 text-iron-black font-black italic text-xl uppercase shadow-[0_5px_0_#b29400] active:translate-y-1 active:shadow-none transition-all"
          onClick={() => alert('Leg Added to Slip!')}
        >
          Initialize_Leg_01
        </button>

        <p className="text-iron-black/40 font-mono text-[8px] text-center uppercase">
          Warning: Failure to verify will result in contract bust.
        </p>
      </div>
    </div>
  );
}
