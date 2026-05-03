'use client';
import { motion } from 'framer-motion';
import { Zap, Lock } from 'lucide-react';

const SLIPS = [
  { id: 1, task: 'Early Bird Session', xp: '+50', difficulty: 'Easy' },
  { id: 2, task: 'Code 3 Commits', xp: '+150', difficulty: 'Medium' },
  { id: 3, task: 'Deep Work: 2 Hours', xp: '+300', difficulty: 'Hard' },
];

export default function DailySlips({ isSignedIn }: { isSignedIn: boolean }) {
  const statusColor = isSignedIn ? 'text-iron-volt' : 'text-iron-red';

  return (
    <section className="my-10">
      <h3
        className={`text-[10px] font-mono ${statusColor} uppercase tracking-[0.2em] mb-4 flex items-center gap-2 transition-colors`}
      >
        <Zap
          className={`w-3 h-3 ${isSignedIn ? 'text-iron-volt' : 'text-iron-red'} animate-pulse`}
        />
        Available_Parlay_Slips
      </h3>

      <div className="relative [mask-image:linear-gradient(to_top,transparent,black_15%,black_85%,transparent)] py-4">
        <div className="space-y-4">
          {SLIPS.map((slip, i) => (
            <motion.div
              key={slip.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`relative bg-zinc-900/50 border ${isSignedIn ? 'border-white/5' : 'border-iron-red/20'} p-5 rounded-sm flex justify-between items-center group cursor-pointer overflow-hidden`}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-800 text-zinc-400">
                    ID_{slip.id}
                  </span>
                  <p
                    className={`text-sm font-black uppercase italic tracking-wider transition-colors ${isSignedIn ? 'group-hover:text-iron-volt' : 'group-hover:text-iron-red'}`}
                  >
                    {slip.task}
                  </p>
                </div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-2">
                  <span
                    className={
                      slip.difficulty === 'Hard'
                        ? 'text-iron-red'
                        : 'text-zinc-500'
                    }
                  >
                    {slip.difficulty}
                  </span>
                  <span className="text-zinc-800">•</span>
                  <span className={statusColor}>{slip.xp} XP</span>
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-end gap-1">
                <Lock
                  className={`w-4 h-4 transition-all ${isSignedIn ? 'text-zinc-700 group-hover:text-iron-volt' : 'text-iron-red animate-pulse'}`}
                />
                <span
                  className={`text-[8px] font-mono ${isSignedIn ? 'text-zinc-600 group-hover:text-iron-volt/50' : 'text-iron-red/50'}`}
                >
                  {isSignedIn ? 'LOCK_IN' : 'RESTRICTED'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
