'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';

/**
 * Dashboardheader Component
 * Handles the display of user identity, auth status, and level.
 * Logic is encapsulated here to keep the main page clean.
 */
export default function Dashboardheader() {
  const { isSignedIn, user, isLoaded } = useUser();

  // 1. Loading Guard: Prevents layout shift while Clerk initializes
  if (!isLoaded) return <div className="h-24" />; // Placeholder height

  // 2. Dynamic UI Config based on Auth Status
  const statusColor = isSignedIn ? 'text-iron-volt' : 'text-iron-red';
  const statusLabel = isSignedIn ? 'ACCESS_GRANTED' : 'ACCESS_RESTRICTED';

  // Identify user or fallback to guest
  const userName = isSignedIn
    ? user?.username || user?.firstName
    : 'Unidentified user';

  const userEmail = isSignedIn ? user?.primaryEmailAddress?.emailAddress : null;

  return (
    <header className="mb-8 flex justify-between items-end border-b border-white/5 pb-6">
      <div>
        {/* Status Badge: Pulses when restricted to grab attention */}
        <motion.p
          key={statusLabel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${statusColor} font-mono text-[10px] tracking-[0.3em] uppercase ${!isSignedIn ? 'animate-pulse' : ''}`}
        >
          {statusLabel}
        </motion.p>

        <div className="">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
            {userName}
          </h2>

          {/* Email Display: Only renders when identity is verified */}
          <AnimatePresence mode="wait">
            {isSignedIn && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm font-mono text-zinc-500 lowercase tracking-tight"
              >
                {userEmail}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Level Indicator */}
      <div className="text-right">
        <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest">
          Level
        </p>
        <p
          className={`text-3xl font-black italic transition-colors duration-500 ${
            isSignedIn ? 'text-white' : 'text-zinc-800'
          }`}
        >
          {isSignedIn ? '01' : 'NULL'}
        </p>
      </div>
    </header>
  );
}
