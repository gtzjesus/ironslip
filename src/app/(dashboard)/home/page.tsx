'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import QuickSlip from '@/app/components/dashboard/QuickSlip';
import IronFeed from '@/app/components/dashboard/IronFeed';
import DailySlips from '@/app/components/dashboard/DailySlips';

export default function DashboardHome() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const statusColor = isSignedIn ? 'text-iron-volt' : 'text-iron-red';
  const statusLabel = isSignedIn ? 'ACCESS_GRANTED' : 'ACCESS_RESTRICTED';
  const userName = isSignedIn
    ? user?.username || user?.firstName
    : 'Unidentified user';
  const userEmail = isSignedIn
    ? user?.primaryEmailAddress?.emailAddress
    : 'Buggy_User';

  return (
    <div className="p-6 max-w-2xl mx-auto ">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <motion.p
            key={statusLabel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${statusColor} font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse`}
          >
            {statusLabel}
          </motion.p>
          <br />

          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
            {userName}
          </h2>

          {/* ADDED EMAIL DISPLAY HERE */}
          <AnimatePresence>
            {isSignedIn && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-black italic uppercase tracking-tighter leading-none"
              >
                {userEmail}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="text-right">
          <p className="text-zinc-500 font-mono text-[9px] uppercase">Level</p>
          <p
            className={`text-2xl font-black italic transition-colors ${isSignedIn ? 'text-white' : 'text-zinc-800'}`}
          >
            {isSignedIn ? '1' : 'null'}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <QuickSlip isSignedIn={!!isSignedIn} />
        <IronFeed isSignedIn={!!isSignedIn} />
      </div>

      <DailySlips isSignedIn={!!isSignedIn} />
    </div>
  );
}
