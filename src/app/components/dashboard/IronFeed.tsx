'use client';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const FEED_DATA = [
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
];

export default function IronFeed({ isSignedIn }: { isSignedIn: boolean }) {
  const statusColor = isSignedIn ? 'text-iron-volt' : 'text-iron-red';

  return (
    <section className="flex flex-col h-[200px]">
      <h3
        className={`text-[10px] font-mono ${statusColor} uppercase tracking-[0.2em] mb-4 flex items-center gap-2 transition-colors`}
      >
        <Activity className="w-3 h-3 animate-pulse" />
        Iron_feed
      </h3>

      <div className="relative flex-grow overflow-hidden [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
        <div
          className={`bg-zinc-900/10 border-l ${isSignedIn ? 'border-iron-volt/20' : 'border-iron-red/20'} pl-4 space-y-6 transition-colors`}
        >
          {FEED_DATA.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div
                className={`absolute -left-[21px] top-1 w-2 h-2 rounded-full ${item.highlight ? (isSignedIn ? 'bg-iron-volt shadow-[0_0_8px_#FFD300]' : 'bg-iron-red shadow-[0_0_8px_#FF0000]') : 'bg-zinc-800'}`}
              />
              <p className="text-[9px] font-mono text-zinc-600 tabular-nums">
                {item.time}
              </p>
              <p className="text-[13px] text-zinc-400 leading-tight">
                <span className="text-white font-bold italic">{item.user}</span>{' '}
                {item.action}{' '}
                <span
                  className={
                    item.highlight
                      ? isSignedIn
                        ? 'text-iron-volt'
                        : 'text-iron-red'
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
  );
}
