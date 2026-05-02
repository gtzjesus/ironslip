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
          <p className="text-iron-volt font-mono text-[10px] tracking-[0.3em] uppercase">
            ACCESS_RESTRICTED
          </p>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">
            Unidentified user
          </h2>
        </div>

        <div className="text-right">
          <p className="text-zinc-500 font-mono text-[9px] uppercase">Level</p>
          <p className="text-2xl font-black italic text-white">null</p>
        </div>
      </header>

      {/* Grid for Stats/Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section>
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
            <div className=" flex justify-end text-black">→</div>
          </motion.div>
        </section>
        {/* THE IRON FEED */}
        <section className=" flex flex-col">
          <h3 className="text-[10px] font-mono text-iron-volt uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Activity className="w-3 h-3 animate-pulse" />
            Iron_feed
          </h3>

          {/* Fade Mask Container */}
          <div className="relative flex-grow overflow-hidden [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
            <div className="bg-zinc-900/10 border-l border-iron-volt/20 pl-4 space-y-6">
              {[
                {
                  user: 'User_772',
                  action: 'locked in',
                  target: '@Midnight_Session',
                  time: '02:45 PM',
                  highlight: true,
                },
                {
                  user: 'Iron_Beast',
                  action: 'reached',
                  target: 'Level 50',
                  time: '02:10 PM',
                  highlight: false,
                },
                {
                  user: 'SYSTEM',
                  action: 'dropped',
                  target: 'New Gear',
                  time: '01:55 PM',
                  highlight: false,
                },
                {
                  user: 'Ghost_9',
                  action: 'completed',
                  target: 'Morning_Grind',
                  time: '11:20 AM',
                  highlight: true,
                },
                {
                  user: 'Admin',
                  action: 'verified',
                  target: 'Weekly_Leaderboard',
                  time: '10:05 AM',
                  highlight: false,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {/* The Dot */}
                  <div
                    className={`absolute -left-[21px] top-1 w-2 h-2 rounded-full ${item.highlight ? 'bg-iron-volt shadow-[0_0_8px_#FFD300]' : 'bg-zinc-800'}`}
                  />

                  <p className="text-[9px] font-mono text-zinc-600 tabular-nums">
                    {item.time}
                  </p>
                  <p className="text-[13px] text-zinc-400 leading-tight">
                    <span className="text-white font-bold italic">
                      {item.user}
                    </span>{' '}
                    {item.action}{' '}
                    <span
                      className={
                        item.highlight
                          ? 'text-iron-volt font-medium'
                          : 'text-zinc-200'
                      }
                    >
                      {item.target}
                    </span>
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* DAILY SLIPS SECTION */}
      {/* DAILY SLIPS SECTION */}
      <section className="my-10">
        <h3 className="text-[10px] font-mono text-iron-volt uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Zap className="w-3 h-3 text-iron-volt animate-pulse" />
          Available_Parlay_Slips
        </h3>

        {/* Fade Mask for Slips */}
        <div className="relative [mask-image:linear-gradient(to_top,transparent,black_15%,black_85%,transparent)] py-4">
          <div className="space-y-4">
            {dailySlips.map((slip, i) => (
              <motion.div
                key={slip.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.1,
                  ease: [0.215, 0.61, 0.355, 1], // Clean "Pop" easing
                }}
                whileHover={{
                  scale: 1.02,
                  borderColor: 'rgba(255, 211, 0, 0.5)',
                  backgroundColor: 'rgba(24, 24, 27, 0.8)',
                }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-zinc-900/50 border border-white/5 p-5 rounded-sm flex justify-between items-center group cursor-pointer overflow-hidden"
              >
                {/* Animated Volt "Charging" Background */}
                <motion.div
                  className="absolute inset-0 bg-iron-volt/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    background: [
                      'rgba(255,211,0,0.05)',
                      'rgba(255,211,0,0.15)',
                      'rgba(255,211,0,0.05)',
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded-uppercase">
                      ID_{slip.id}
                    </span>
                    <p className="text-sm font-black uppercase italic tracking-wider group-hover:text-iron-volt transition-colors">
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
                    <span className="text-iron-volt">{slip.xp} XP</span>
                  </p>
                </div>

                <div className="relative z-10 flex flex-col items-end gap-1">
                  <Lock className="w-4 h-4 text-zinc-700 group-hover:text-iron-volt group-hover:rotate-12 transition-all" />
                  <span className="text-[8px] font-mono text-zinc-600 group-hover:text-iron-volt/50">
                    LOCK_IN
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
