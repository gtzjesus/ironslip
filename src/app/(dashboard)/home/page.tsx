'use client';
import { motion } from 'framer-motion';
import { Activity, Zap, Lock, ChevronRight } from 'lucide-react';

export default function DashboardHome() {
  const dailySlips = [
    { id: 1, task: 'Early Bird Session', xp: '+50', difficulty: 'Easy' },
    { id: 2, task: 'Code 3 Commits', xp: '+150', difficulty: 'Medium' },
    { id: 3, task: 'Deep Work: 2 Hours', xp: '+300', difficulty: 'Hard' },
  ];

  return (
    <div className="p-6 pt-12 max-w-2xl mx-auto mb-20">
      {/* HEADER */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <p className="text-iron-red font-mono text-[10px] tracking-[0.3em] uppercase">
            ACCESS: RESTRICTED
          </p>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">
            Unidentified user
          </h2>
        </div>

        <div className="text-right">
          <p className="text-zinc-500 font-mono text-[9px] uppercase">Level</p>
          <p className="text-2xl font-black italic text-white">0</p>
        </div>
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
      {/* DAILY SLIPS SECTION */}
      <section className="my-5">
        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Zap className="w-3 h-3 text-iron-volt" /> Daily_Available_Slips
        </h3>
        <div className="space-y-3">
          {dailySlips.map((slip) => (
            <motion.div
              key={slip.id}
              whileTap={{ scale: 0.98 }}
              className="bg-zinc-900 border border-white/5 p-4 rounded-sm flex justify-between items-center group cursor-pointer hover:border-iron-volt/50 transition-colors"
            >
              <div>
                <p className="text-xs font-bold uppercase italic tracking-wide group-hover:text-iron-volt">
                  {slip.task}
                </p>
                <p className="text-[9px] font-mono text-zinc-500 uppercase">
                  {slip.difficulty} • {slip.xp} XP
                </p>
              </div>
              <Lock className="w-4 h-4 text-zinc-700 group-hover:text-iron-volt" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* THE IRON FEED */}
      <section>
        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Activity className="w-3 h-3 text-iron-volt" /> Global_Iron_Feed
        </h3>
        <div className="bg-zinc-900/30 border-l border-iron-volt/20 pl-4 space-y-6 relative">
          {/* Feed Item 1 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-iron-volt shadow-[0_0_8px_#FFD300]" />
            <p className="text-[10px] font-mono text-zinc-500">02:45 PM</p>
            <p className="text-sm text-zinc-300">
              <span className="text-white font-bold italic underline decoration-iron-volt/30">
                User_772
              </span>{' '}
              locked in{' '}
              <span className="text-iron-volt">@Midnight_Session</span>
            </p>
          </div>

          {/* Feed Item 2 */}
          <div className="relative opacity-70">
            <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-zinc-800" />
            <p className="text-[10px] font-mono text-zinc-500">02:10 PM</p>
            <p className="text-sm text-zinc-300">
              <span className="text-white font-bold italic">Iron_Beast</span>{' '}
              just reached{' '}
              <span className="text-iron-volt italic">Level 50</span>
            </p>
          </div>

          {/* Feed Item 3 */}
          <div className="relative opacity-40">
            <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-zinc-800" />
            <p className="text-[10px] font-mono text-zinc-500">01:55 PM</p>
            <p className="text-sm text-zinc-300">
              New Gear dropped in the{' '}
              <span className="text-white underline decoration-white/20">
                Marketplace
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* XP PROGRESS MODULE */}
      <div className="mt-8 p-4 bg-zinc-900/80 border-t-2 border-iron-volt shadow-[0_-10px_20px_-10px_rgba(255,211,0,0.1)]">
        <div className="flex justify-between items-end mb-2">
          <div className="flex gap-2 items-baseline">
            <span className="text-3xl font-black italic tracking-tighter">
              LVL 0
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase pb-1">
              Novice_Operator
            </span>
          </div>
          <span className="text-[10px] font-mono text-iron-volt italic">
            75 / 100 XP
          </span>
        </div>

        {/* The Bar */}
        <div className="h-1 w-full bg-zinc-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-iron-volt shadow-[0_0_10px_#FFD300]"
          />
        </div>
      </div>
    </div>
  );
}
