'use client';

import { useUser } from '@clerk/nextjs';
import QuickSlip from '@/app/components/dashboard/QuickSlip';
import IronFeed from '@/app/components/dashboard/IronFeed';
import DailySlips from '@/app/components/dashboard/DailySlips';
import Dashboardheader from '@/app/components/common/Dashboardheader';

export default function DashboardHome() {
  const { isSignedIn, isLoaded } = useUser();

  // Prevent UI flickering while Clerk loads the session
  if (!isLoaded) return null;

  return (
    <main className="p-6 pt-12 max-w-2xl mx-auto mb-20">
      {/* 1. IDENTITY & STATUS SECTION */}
      <Dashboardheader />

      {/* 2. CORE ACTIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Pass isSignedIn as a boolean prop to child components */}
        <IronFeed isSignedIn={!!isSignedIn} />
        <QuickSlip isSignedIn={!!isSignedIn} />
      </div>

      {/* 3. LIST DATA SECTION */}
      {/* <DailySlips isSignedIn={!!isSignedIn} /> */}
    </main>
  );
}
