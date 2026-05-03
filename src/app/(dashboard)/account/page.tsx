'use client';
import { useUser, useClerk, SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { LogOut, ShieldAlert, UserCheck } from 'lucide-react';

export default function AccountPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) return null;

  // --- LOGGED OUT STATE (Identity Required) ---
  if (!isSignedIn) {
    return (
      <div className="p-6 pt-12 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <header className="mb-8">
            <p className="text-iron-red font-mono text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2">
              <ShieldAlert className="w-3 h-3 animate-pulse" />{' '}
              Identity_Required
            </p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">
              Login to <span className="text-iron-red">Access</span>
            </h2>
          </header>

          <div className="bg-zinc-900/50 border border-white/5 p-2 rounded-sm shadow-2xl">
            <SignIn
              routing="hash"
              appearance={{
                elements: {
                  card: 'bg-transparent shadow-none border-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton:
                    'bg-zinc-800 border-white/5 text-white hover:bg-zinc-700 transition-all',
                  formButtonPrimary:
                    'bg-iron-red hover:bg-white text-black font-black uppercase italic transition-all',
                  footer: 'hidden',
                },
              }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // --- LOGGED IN STATE (Operator Profile) ---
  return (
    <div className="p-6 pt-12 max-w-2xl mx-auto">
      <header className="mb-8">
        <p className="text-iron-volt font-mono text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
          <UserCheck className="w-3 h-3" /> Operator_Profile
        </p>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">
          Settings
        </h2>
      </header>

      <div className="space-y-6">
        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 p-5 bg-zinc-900 border-l-2 border-iron-volt shadow-lg"
        >
          <img
            src={user.imageUrl}
            alt="avatar"
            className="w-14 h-14 rounded-full border-2 border-iron-volt/20 p-1"
          />
          <div>
            <p className="text-lg font-black uppercase italic leading-none">
              {user.username || user.firstName}
            </p>
            <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">
              {user.primaryEmailAddress?.emailAddress}
            </p>
            <p className="text-[9px] font-mono text-iron-volt mt-0.5">
              ID: #{user.id.slice(-6).toUpperCase()}
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => signOut({ redirectUrl: '/home' })}
            className="group w-full py-4 bg-zinc-900/50 border border-white/5 text-[10px] font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-iron-red/10 hover:border-iron-red hover:text-iron-red transition-all duration-300"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            Terminate_Session
          </button>
        </div>

        <div className="pt-10 opacity-20 pointer-events-none">
          <p className="text-[8px] font-mono uppercase text-center tracking-[0.5em]">
            IronSlip_System_v.1.0.4
          </p>
        </div>
      </div>
    </div>
  );
}
