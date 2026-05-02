'use client';

export default function ShopPage() {
  return (
    <div className="p-6 pt-12">
      <header className="mb-8">
        <p className="text-iron-volt font-mono text-[10px] tracking-[0.3em] uppercase">
          Marketplace
        </p>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">
          Iron <span className="text-iron-volt">Gear</span>
        </h2>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-square bg-zinc-900 border border-white/5 p-4 flex flex-col justify-end"
          >
            <div className="w-full h-24 bg-zinc-800 mb-2 animate-pulse" />
            <p className="text-[10px] font-mono text-zinc-500 uppercase">
              Item_{i}
            </p>
            <p className="text-xs font-bold text-iron-volt">500 CREDITS</p>
          </div>
        ))}
      </div>
    </div>
  );
}
