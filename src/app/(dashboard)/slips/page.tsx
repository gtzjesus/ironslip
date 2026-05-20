'use client';
import { useEffect, useState } from 'react';
import { slipStorage, LocalUserSlip } from '@/lib/slipStorage';

export default function SlipsPage() {
  const [activeContracts, setActiveContracts] = useState<LocalUserSlip[]>([]);

  useEffect(() => {
    // Read the committed entries from memory on load
    setActiveContracts(slipStorage.getSlips());
  }, []);

  return (
    <main className="min-h-screen w-full overflow-y-auto flex flex-col bg-black max-w-2xl mx-auto border-x border-zinc-900 px-4 py-8">
      
      {/* HUD Header Terminal */}
      <div className="mb-8 border-b border-zinc-800 pb-4">
        <p className="font-mono text-[10px] text-zinc-500 tracking-[0.4em] uppercase">SYSTEM_MANIFEST</p>
        <h1 className="text-3xl font-black italic text-white uppercase tracking-tight">ACTIVE_CONTRACTS</h1>
      </div>

      {activeContracts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-900 rounded-3xl">
          <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest mb-4">NO_ACTIVE_SLIPS_FOUND</p>
          <a href="/legs" className="text-xs bg-zinc-900 text-iron-volt border border-zinc-800 font-mono uppercase px-4 py-2 rounded-xl hover:bg-white hover:text-black transition-all">
            Deploy New Slip
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {activeContracts.map((contract) => (
            <div 
              key={contract.id} 
              className={`p-6 rounded-2xl border bg-zinc-950 flex flex-col relative overflow-hidden ${
                contract.type === 'DEMON' ? 'border-red-900/50' : 'border-zinc-800'
              }`}
            >
              {/* Background ID stamp */}
              <div className="absolute right-4 top-2 text-[45px] font-black italic opacity-[0.02] select-none font-sans text-white pointer-events-none">
                {contract.id}
              </div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                    contract.type === 'DEMON' ? 'bg-red-950 text-red-500 border border-red-900/40' : 'bg-zinc-900 text-zinc-400'
                  }`}>
                    {contract.type} SYSTEM
                  </span>
                  <h3 className="text-xl font-black italic text-white tracking-tight mt-2">{contract.id}</h3>
                </div>
                
                <div className="text-right font-mono">
                  <span className="text-[10px] text-zinc-500 block">TARGET_YIELD</span>
                  <span className="text-xl font-black text-iron-volt font-sans">{contract.totalPayout} CR</span>
                </div>
              </div>

              {/* Legs Container inside the Slip Card */}
              <div className="space-y-2 mt-2 relative z-10">
                {contract.legs.map((leg) => (
                  <div key={leg._id} className="flex justify-between items-center bg-zinc-900/50 border border-zinc-900 rounded-xl p-3">
                    <span className="text-sm font-bold text-zinc-300 italic uppercase">{leg.task}</span>
                    <span className="text-xs font-mono text-zinc-500">+{leg.creditReward} CR</span>
                  </div>
                ))}
              </div>

              {/* Status Tracking Information */}
              <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between items-center font-mono text-[10px]">
                <span className="text-zinc-500">
                  DEPLOYED: {new Date(contract.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                  <span className="text-orange-500 font-black tracking-widest">{contract.status}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </main>
  );
}