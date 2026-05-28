'use client';
import QuickSlip from '@/components/dashboard/common/QuickSlip';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { UserCheck, Zap, Construction } from 'lucide-react';

export default function AvatarPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-[#c4a000]">
        {/* 📱 SAFARI TINT FORCE: Case 1 */}
        <meta name="theme-color" content="#000000" />
        
        <h2 className="font-black italic uppercase text-2xl">
          Access_Restricted
        </h2>
        <p className="font-mono text-[10px] mt-2">
          Initialize via Feed Terminal
        </p>

        <QuickSlip isSignedIn={!!isSignedIn} />
        
      </div>
    );
  }

  return (
    <div className="p-6 pt-12 max-w-2xl mx-auto min-h-screen">
      {/* 📱 SAFARI TINT FORCE: Case 2 */}
      <meta name="theme-color" content="#000000" />

      <motion.header
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-8"
      >
        <p className="text-[#c4a000] font-mono text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
          <UserCheck className="w-3 h-3" /> Identity_Found
        </p>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
          Avatar
        </h2>
      </motion.header>

      <div className="space-y-6">
        {/* AVATAR PREVIEW CARD */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative p-8 bg-zinc-900 border-l-4 border-[#c4a000] overflow-hidden"
        >
          <div className="relative z-10 flex items-center gap-6">
            <img
              src={user.imageUrl}
              alt="avatar"
              className="w-20 h-20 rounded-none border-2 border-[#c4a000] p-1 grayscale  transition-all duration-500"
            />
            <div>
              <p className="text-2xl font-black uppercase italic text-white leading-none">
                {user.username || 'Unknown_Operator'}
              </p>
              <p className="text-[10px] font-mono text-[#c4a000] mt-2 tracking-[0.2em]">
                STATUS: ACTIVE_RECRUIT
              </p>
            </div>
          </div>
          {/* Background decorative text */}
          <span className="absolute -bottom-4 -right-2 text-white/5 font-black text-7xl italic select-none">
            IRON
          </span>
        </motion.div>

        {/* WORK IN PROGRESS SECTION */}
        <div className="p-10 border border-white/5 bg-white/5 flex flex-col items-center justify-center text-zinc-600 italic">
          <Construction className="w-6 h-6 mb-2 opacity-20" />
          <p className="font-mono text-[9px] uppercase tracking-widest text-center">
            Avatar_Customization_Module <br /> [ Under_Construction ]
          </p>
        </div>

        {/* TERMINATE SESSION */}
        <SignOutButton>
          <button className="w-full py-4 border border-[#c4a000]/20 text-[#c4a000] font-mono text-[10px] uppercase tracking-[0.3em]  transition-all">
            Terminate_Session
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}