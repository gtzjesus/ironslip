/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useUser } from '@clerk/nextjs';
import IronFeed from '@/components/dashboard/feed/IronFeed';
import FeedHeader from '@/components/dashboard/feed/Feedheader';
import StartGrindButton from '@/components/common/StartGrindButton';
import BottomNav from '@/components/common/BottomNav';

export default function DashboardHome() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <main 
      className="h-screen w-full overflow-hidden flex flex-col max-w-2xl mx-auto relative"
      style={{
        backgroundColor: '#0d0b09',
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }}
    >
      <meta name="theme-color" content="#0d0b09" />
      <div className="flex-shrink-0 p-2">
        <FeedHeader />
      </div>

      <div className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide pb-28">
        <div className="grid grid-cols-1 items-start">
          <IronFeed isSignedIn={!!isSignedIn} />
        </div>
      </div>

      {/* 🔴 BOTÓN FLOTANTE LLAMATIVO SI NO ESTÁ LOGUEADO (ARRIBA DE LA NAVBAR) */}
      {!isSignedIn && (
        <div className="fixed bottom-18 left-0 right-0 px-4 z-[90] flex justify-center pointer-events-none">
          <div className="w-full flex justify-center pointer-events-auto">
            <StartGrindButton className="max-w-md w-full shadow-[0_0_40px_rgba(255,211,0,0.5)] border-2" />
          </div>
        </div>
      )}

      {/* NAVBAR INFERIOR */}
      <BottomNav />
    </main>
  );
}