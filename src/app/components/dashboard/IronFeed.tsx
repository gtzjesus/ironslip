'use client';

import { motion } from 'framer-motion';
import { Activity, Terminal } from 'lucide-react';

const FEED_DATA = [
  {
    id: 1,
    user: 'User_772',
    action: 'locked in',
    target: '@Midnight_Session',
    time: '02:45 PM',
    highlight: true,
    meta: 'REQ_ID: 9928',
  },
  {
    id: 2,
    user: 'Iron_Beast',
    action: 'reached',
    target: 'Level 50',
    time: '02:10 PM',
    highlight: false,
    meta: 'XP_SYNC_COMPLETE',
  },
  {
    id: 3,
    user: 'SYSTEM',
    action: 'dropped',
    target: 'New Gear',
    time: '01:55 PM',
    highlight: false,
    meta: 'GLOBAL_DROP',
  },
  {
    id: 4,
    user: 'Ghost_Ops',
    action: 'completed',
    target: 'Daily_Slip_03',
    time: '01:30 PM',
    highlight: true,
    meta: 'REWARD_CLAIMED',
  },
  {
    id: 5,
    user: 'Operator_X',
    action: 'active',
    target: 'Training_Grounds',
    time: '01:15 PM',
    highlight: false,
    meta: 'LOC: SECTOR_G',
  },
  {
    id: 6,
    user: 'Alpha_9',
    action: 'extracted',
    target: '500_XP',
    time: '12:45 PM',
    highlight: true,
    meta: 'SIG_STRENGTH: 98%',
  },
];

export default function IronFeed({ isSignedIn }: { isSignedIn: boolean }) {
  const statusColor = isSignedIn ? 'text-iron-volt' : 'text-iron-red';
  const borderColor = isSignedIn ? 'border-iron-volt/20' : 'border-iron-red/20';

  return (
    <section className="flex flex-col h-[400px] w-full">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-4 px-1">
        <div>
          <h3
            className={`text-[10px] font-mono ${statusColor} uppercase tracking-[0.2em] flex items-center gap-2`}
          >
            <Activity className="w-3 h-3 animate-pulse" />
            Iron_Feed
          </h3>
        </div>
        <Terminal className="w-3 h-3 text-zinc-700" />
      </div>

      {/* INTERACTIVE SCROLL AREA */}
      <div
        className="flex-grow overflow-y-auto overflow-x-hidden space-y-2 pr-2 
                   scrollbar-hide hover:scrollbar-default
                   [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {FEED_DATA.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileTap={{ scale: 0.98 }}
            className={`relative group p-3 bg-zinc-900/40 border-l-2 ${item.highlight ? (isSignedIn ? 'border-iron-volt' : 'border-iron-red') : 'border-zinc-800'} 
                       hover:bg-zinc-800/60 transition-all duration-200 cursor-pointer overflow-hidden`}
          >
            {/* Background Accent for Highlighted items */}
            {item.highlight && (
              <div
                className={`absolute inset-0 opacity-[0.03] pointer-events-none ${isSignedIn ? 'bg-iron-volt' : 'bg-iron-red'}`}
              />
            )}

            <div className="flex justify-between items-start mb-1">
              <span className="text-white font-black italic text-xs uppercase tracking-tight">
                {item.user}
              </span>
              <span className="text-[8px] font-mono text-zinc-600 tabular-nums uppercase">
                {item.time}
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-none lowercase">
              {item.action}{' '}
              <span className={item.highlight ? statusColor : 'text-zinc-200'}>
                {item.target}
              </span>
            </p>

            <div className="mt-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[7px] font-mono text-zinc-700 tracking-tighter">
                {item.meta}
              </span>
              <div
                className={`h-[1px] flex-grow mx-2 ${borderColor} opacity-30`}
              />
              <span className={`text-[7px] font-mono ${statusColor}`}>
                VIEW_DETAILS
              </span>
            </div>
          </motion.div>
        ))}

        {/* BOTTOM SPACER FOR MASKING */}
        <div className="h-10" />
      </div>
    </section>
  );
}
