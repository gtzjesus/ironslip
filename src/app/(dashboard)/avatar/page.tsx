'use client';
import QuickSlip from '@/components/dashboard/common/QuickSlip';
import AvatarCanvas from '@/components/dashboard/avatar/AvatarCanvas'; // 👈 Importamos tu nuevo canvas
import { useUser, SignOutButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';

export default function AvatarPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-[#c4a000]">
        <meta name="theme-color" content="#000000" />
        <h2 className="font-black italic uppercase text-2xl">Access_Restricted</h2>
        <p className="font-mono text-[10px] mt-2">Initialize via Feed Terminal</p>
        <QuickSlip isSignedIn={!!isSignedIn} />
      </div>
    );
  }

  return (
    <div className="p-6 pt-12 max-w-2xl mx-auto min-h-screen space-y-6">
      <meta name="theme-color" content="#000000" />

      {/* HEADER */}
      <motion.header
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <p className="text-[#c4a000] font-mono text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
          <UserCheck className="w-3 h-3" /> Identity_Found
        </p>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
          Avatar
        </h2>
      </motion.header>

      {/* CLERK USER IDENTITY CARD */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative p-6 bg-zinc-900 border-l-4 border-[#c4a000] overflow-hidden"
      >
        <div className="relative z-10 flex items-center gap-6">
          <img
            src={user.imageUrl}
            alt="avatar"
            className="w-16 h-16 border border-[#c4a000] p-1 grayscale"
          />
          <div>
            <p className="text-xl font-black uppercase italic text-white leading-none">
              {user.username || 'Unknown_Operator'}
            </p>
            <p className="text-[9px] font-mono text-[#c4a000] mt-1.5 tracking-[0.2em]">
              STATUS: ACTIVE_RECRUIT
            </p>
          </div>
        </div>
        <span className="absolute -bottom-4 -right-2 text-white/5 font-black text-6xl italic select-none">
          IRON
        </span>
      </motion.div>

      {/* 🚀 EL CORE: VISOR 3D DIRECTO DE BLENDER */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <AvatarCanvas />
      </motion.div>

      {/* REGLAS DE TIENDA / SKINS PROXIMAMENTE */}
      <div className="p-4 border border-zinc-900 bg-zinc-950 flex flex-col gap-1 font-mono text-[10px] text-zinc-500">
        <p className="text-[#c4a000] uppercase font-bold">[ SYSTEM_MEMORANDUM ]</p>
        <p>Los ítems ganados en tus Daily Slips se sincronizarán directamente en este espacio.</p>
      </div>

      {/* TERMINATE SESSION */}
      <SignOutButton>
        <button className="w-full py-4 border border-[#c4a000]/10 text-zinc-500 hover:text-[#c4a000] hover:border-[#c4a000]/30 font-mono text-[9px] uppercase tracking-[0.3em] transition-all">
          Terminate_Session
        </button>
      </SignOutButton>
    </div>
  );
}