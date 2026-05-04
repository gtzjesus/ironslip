'use client';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { SignInButton } from '@clerk/nextjs';

export default function QuickSlip({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <SignInButton mode="modal">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileTap={{ scale: 0.95 }}
        className={`${isSignedIn ? 'bg-iron-volt' : 'bg-iron-red'} p-5 rounded-sm flex flex-col justify-between group cursor-pointer transition-colors duration-200 min-h-[120px]`}
      >
        <h3 className="text-black font-black italic text-2xl uppercase leading-none">
          {isSignedIn ? (
            <>
              Generate <br /> New Slip
            </>
          ) : (
            <>
              log in to <br /> build slip
            </>
          )}
        </h3>
        <div className="flex justify-end text-black">
          {isSignedIn ? (
            <span className="text-xl">→</span>
          ) : (
            <Lock className="w-4 h-4 animate-pulse" />
          )}
        </div>
      </motion.div>
    </SignInButton>
  );
}
