'use client';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function QuickSlip({ isSignedIn }: { isSignedIn: boolean }) {
  // 1. We define the inner content so we don't repeat code
  const ButtonContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileTap={{ scale: 0.95 }}
      className={`${isSignedIn ? 'bg-iron-volt' : 'bg-iron-red'} p-3 rounded-sm flex flex-col justify-between group cursor-pointer transition-colors duration-200 min-h-[100px]`}
    >
      <h3 className="text-black font-black italic text-xl uppercase leading-none">
        {isSignedIn ? (
          <>
            build new <br /> iron Slip
          </>
        ) : (
          <>
            log in to <br /> Build slip
          </>
        )}
      </h3>
      <div className="flex justify-end text-black">
        {isSignedIn ? (
          <span className="text-xl font-black italic">→</span>
        ) : (
          <Lock className="w-4 h-4 animate-pulse" />
        )}
      </div>
    </motion.div>
  );

  // 2. If signed in, wrap in Link to navigate to /legs
  if (isSignedIn) {
    return (
      <Link href="/legs" className="block no-underline">
        {ButtonContent}
      </Link>
    );
  }

  // 3. If NOT signed in, wrap it in the SignUpButton
  return <SignUpButton mode="modal">{ButtonContent}</SignUpButton>;
}
