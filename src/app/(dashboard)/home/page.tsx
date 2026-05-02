'use client';
import { motion } from 'framer-motion';

export default function DashboardHome() {
  return (
    <div className="p-6 pt-12">
      {/* Header Section */}
      <header className="mb-8">
        <p className="text-iron-volt font-mono text-[10px] tracking-[0.3em] uppercase">
          Status: Active
        </p>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">
          Welcome back, <span className="text-iron-volt">Operator</span>
        </h2>
      </header>

      {/* Grid for Stats/Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-white/5 p-6 rounded-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 bg-iron-volt text-black font-black italic text-xs">
            LIVE
          </div>
          <p className="text-zinc-500 font-mono text-xs uppercase mb-2">
            Weekly Grind
          </p>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-iron-volt w-[65%]" />
          </div>
          <p className="mt-2 text-[10px] text-zinc-400 font-mono">
            65% TO NEXT REWARD
          </p>
        </motion.div>

        {/* Quick Slip Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-iron-volt p-6 rounded-sm flex flex-col justify-between group cursor-pointer"
        >
          <h3 className="text-black font-black italic text-2xl uppercase leading-none">
            Generate <br /> New Slip
          </h3>
          <div className="mt-4 flex justify-end text-black">→</div>
        </motion.div>
      </div>

      {/* Activity Feed placeholder */}
      <div className="mt-12">
        <h3 className="text-xs font-mono uppercase tracking-widest border-b border-white/10 pb-2 mb-4 text-zinc-500">
          Recent Missions
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2 border-b border-white/5"
            >
              <span className="text-sm font-bold uppercase italic">
                Operation_Iron_Link_{i}
              </span>
              <span className="text-iron-volt font-mono text-[10px]">
                +150 XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
