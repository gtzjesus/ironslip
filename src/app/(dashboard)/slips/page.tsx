'use client';

export default function SlipsPage() {
  return (
    <div className="p-6 pt-12">
      <header className="mb-8">
        <p className="text-iron-volt font-mono text-[10px] tracking-[0.3em] uppercase">
          Active Slips
        </p>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">
          Your <span className="text-iron-volt">Slips</span>
        </h2>
      </header>

      <div className="border-2 border-dashed border-zinc-800 rounded-lg h-64 flex flex-col items-center justify-center text-zinc-600">
        <p className="font-mono text-xs uppercase tracking-widest">
          No active slips found
        </p>
        <button className="mt-4 text-iron-volt text-[10px] font-mono border border-iron-volt px-4 py-2 hover:bg-iron-volt hover:text-black transition-colors">
          + GENERATE NEW
        </button>
      </div>
    </div>
  );
}
