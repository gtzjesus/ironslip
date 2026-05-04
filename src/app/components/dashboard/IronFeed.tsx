'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Terminal, Lock as LockIcon } from 'lucide-react';

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
  const [mounted, setMounted] = useState(false);

  // We use useEffect, but we wrap the state change in a microtask (setTimeout)
  // to ensure it happens AFTER the paint, satisfying the "no cascading" rule.
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const statusColor = isSignedIn ? 'text-iron-volt' : 'text-iron-red';
  const borderColor = isSignedIn ? 'border-iron-volt/20' : 'border-iron-red/20';

  return (
    <section className="flex flex-col h-[200px] w-full relative">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-5 px-1">
        <div>
          <h3
            className={`text-[10px] font-mono ${statusColor} uppercase tracking-[0.2em] flex items-center gap-2`}
          >
            <Activity className="w-3 h-3 animate-pulse" />
            {isSignedIn ? 'Iron_Feed' : 'Iron_Feed'}
          </h3>
        </div>
        <Terminal className="w-3 h-3 text-zinc-700" />
      </div>

      <div className="relative flex-grow overflow-hidden group">
        {/* THE FEED AREA */}
        <div
          className={`flex-grow h-full overflow-y-auto overflow-x-hidden space-y-2 pr-2 transition-all duration-1000 ease-in-out
                   ${!mounted ? 'opacity-0' : 'opacity-100'} 
                   ${!isSignedIn ? 'blur-[8px] grayscale opacity-30 select-none pointer-events-none scale-[0.98]' : 'blur-0 opacity-100'}`}
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        >
          {FEED_DATA.map((item) => (
            <motion.div
              key={item.id}
              initial={false}
              className={`relative p-3 bg-zinc-900/40 border-l-2 ${item.highlight ? (isSignedIn ? 'border-iron-volt' : 'border-iron-red') : 'border-zinc-800'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-white font-black italic text-xs uppercase tracking-tight">
                  {item.user}
                </span>
                <span className="text-[8px] font-mono text-zinc-600 uppercase tabular-nums">
                  {item.time}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-none lowercase">
                {item.action}{' '}
                <span
                  className={item.highlight ? statusColor : 'text-zinc-200'}
                >
                  {item.target}
                </span>
              </p>
            </motion.div>
          ))}
          <div className="h-8" />
        </div>

        {/* OVERLAY FOR LOGGED OUT USERS */}
        <AnimatePresence>
          {mounted && !isSignedIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className="animate-pulse bg-black/60 border border-iron-red/30 p-3 backdrop-blur-md flex flex-col items-center gap-3 shadow-[0_0_50px_rgba(255,0,0,0.15)]"
              >
                <div className="relative">
                  <LockIcon className="w-3 h-3 text-iron-red animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-iron-red/20 blur-lg " />
                </div>

                <p className="text-[7px] font-mono text-iron-red/50 uppercase tracking-[0.2em]">
                  authenticate
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
