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
    /** * h-screen: Locks the page to the device height
     * overflow-hidden: Disables the "document" scroll
     * flex-col: Allows us to stack the header and content
     */
    <main className="h-screen w-full overflow-hidden flex flex-col bg-black px-6 pt-2 max-w-2xl mx-auto">
      {/* 1. IDENTITY & STATUS SECTION (STAYS FIXED) */}
      <div className="flex-shrink-0">
        <Dashboardheader />
      </div>

      {/* 2. SCROLLABLE CONTENT AREA 
          flex-grow: Fills remaining space
          overflow-y-auto: Only this section scrolls if content overflows
      */}
      <div className="flex-grow overflow-y-auto overflow-x-hidden pr-1 pb-20 scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <IronFeed isSignedIn={!!isSignedIn} />
          <QuickSlip isSignedIn={!!isSignedIn} />
        </div>

        {/* 3. LIST DATA SECTION */}
        <div className="mt-4">
          {/* <DailySlips isSignedIn={!!isSignedIn} /> */}
        </div>
      </div>
    </main>
  );
}
