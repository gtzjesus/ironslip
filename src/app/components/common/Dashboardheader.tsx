'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';

export default function Dashboardheader() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return <div className="h-24" />;

  const statusColor = isSignedIn ? 'text-iron-volt' : 'text-iron-red';
  const borderColor = isSignedIn ? 'border-iron-volt/30' : 'border-iron-red/30';
  const statusLabel = isSignedIn ? 'ACCESS_GRANTED' : 'ACCESS_RESTRICTED';

  const userName = isSignedIn
    ? user?.username || user?.firstName
    : 'Unidentified user';

  // --- EMAIL LOGIC UPDATE ---
  // We grab the full email, then split it at the '@' and take the first part [0]
  const fullEmail = user?.primaryEmailAddress?.emailAddress;
  const userHandle = isSignedIn && fullEmail ? fullEmail.split('@')[0] : null;

  return (
    <header
      className={`mb-4 flex justify-between items-end border-b ${borderColor} pb-2 transition-colors duration-700`}
    >
      <div>
        <motion.p
          key={statusLabel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${statusColor} mb-2 font-mono text-[8px] tracking-[0.2em] font-black italic uppercase ${!isSignedIn ? 'animate-pulse' : ''}`}
        >
          {statusLabel}
        </motion.p>

        <div>
          <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none">
            {userName}
          </h2>

          <AnimatePresence mode="wait">
            {isSignedIn && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                /* Using a prefix like ID_ makes it feel more like a terminal */
                className="text-xl font-black italic uppercase tracking-tighter leading-none"
              >
                {userHandle}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="text-right ">
        <p className="text-zinc-500 font-mono text-[6px] font-black italic  uppercase tracking-widest">
          Level
        </p>
        <p
          className={`text-xl font-black italic transition-colors duration-500 ${
            isSignedIn ? 'text-iron-volt' : 'text-zinc-800'
          }`}
        >
          {isSignedIn ? '01' : 'NULL'}
        </p>
      </div>
    </header>
  );
}
