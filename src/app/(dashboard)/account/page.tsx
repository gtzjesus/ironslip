'use client';

export default function AccountPage() {
  return (
    <div className="p-6 pt-12">
      <header className="mb-8">
        <p className="text-iron-volt font-mono text-[10px] tracking-[0.3em] uppercase">
          Operator Profile
        </p>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">
          Settings
        </h2>
      </header>

      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-white/5">
          <div className="w-12 h-12 rounded-full bg-iron-volt" />
          <div>
            <p className="text-sm font-bold uppercase">Jesus Gtz</p>
            <p className="text-[10px] font-mono text-zinc-500">
              ID: #0001-IRONSLIP
            </p>
          </div>
        </div>

        <button className="w-full py-3 bg-zinc-800 text-xs font-mono uppercase tracking-widest hover:bg-red-900/20 hover:text-red-500 transition-all">
          Logout Session
        </button>
      </div>
    </div>
  );
}
