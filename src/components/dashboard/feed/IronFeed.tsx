/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Activity, Terminal, Lock as LockIcon } from 'lucide-react';

const FEED_DATA = [
  {
    id: 1,
    user: 'User_772',
    action: 'locked in',
    target: '@Midnight_Session',
    time: '02:45 PM',
    highlight: true,
  },
  {
    id: 2,
    user: 'Iron_Beast',
    action: 'reached',
    target: 'Level 50',
    time: '02:10 PM',
    highlight: false,
  },
  {
    id: 3,
    user: 'SYSTEM',
    action: 'dropped',
    target: 'New Gear',
    time: '01:55 PM',
    highlight: false,
  },
  {
    id: 4,
    user: 'Ghost_Ops',
    action: 'completed',
    target: 'Daily_Slip_03',
    time: '01:30 PM',
    highlight: true,
  },
  {
    id: 5,
    user: 'Operator_X',
    action: 'active',
    target: 'Training_Grounds',
    time: '01:15 PM',
    highlight: false,
  },
  {
    id: 6,
    user: 'Alpha_9',
    action: 'extracted',
    target: '500_XP',
    time: '12:45 PM',
    highlight: true,
  },
];

export default function IronFeed({ isSignedIn }: { isSignedIn: boolean }) {
  const statusColor = isSignedIn ? 'text-iron-volt' : 'text-iron-red';

  return (
    <section 
      className="flex flex-col h-full w-full relative px-2 "
      style={{
        backgroundColor: '#0d0b09',
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-end mb-4  flex-shrink-0">
        <div>
          <h3
            className={`text-[10px] font-mono ${statusColor} uppercase tracking-[0.2em] flex items-center gap-2`}
          >
            <Activity className="w-3 h-3" />
            Iron_Feed
          </h3>
        </div>
        <Terminal className="w-3 h-3 text-zinc-700" />
      </div>

      <div className="relative flex-grow overflow-hidden flex flex-col">
        {/* FEED LIST - NO ANIMATIONS */}
        <div
          className={`flex-grow h-full overflow-y-auto overflow-x-hidden space-y-1 pr-2 scrollbar-hide
                    ${!isSignedIn ? 'blur-md grayscale opacity-30 select-none pointer-events-none' : 'opacity-100'}`}
        >
          {FEED_DATA.map((item) => (
            <div
              key={item.id}
              className={`relative p-3 bg-zinc-950 border-[0.5px] ${
                item.highlight
                  ? isSignedIn
                    ? 'border-iron-volt'
                    : 'border-iron-red'
                  : 'border-zinc-800'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-white font-black italic text-xl uppercase tracking-tighter">
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
            </div>
          ))}
          <div className="h-8" />
        </div>

        {/* STATIC LOCK OVERLAY */}
        {!isSignedIn && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-zinc-950 border border-iron-red/30 p-4 shadow-[0_0_20px_rgba(255,0,60,0.15)] flex flex-col items-center gap-3">
              <LockIcon className="w-4 h-4 text-iron-red" />
              <p className="text-[7px] font-mono text-iron-red/60 uppercase tracking-[0.2em]">
                authentication_needed
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}