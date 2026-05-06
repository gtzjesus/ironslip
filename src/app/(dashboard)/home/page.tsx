'use client';

import { useUser } from '@clerk/nextjs';
import QuickSlip from '@/app/components/dashboard/common/QuickSlip';
import IronFeed from '@/app/components/dashboard/feed/IronFeed';
import Dashboardheader from '@/app/components/dashboard/feed/Feedheader';

export default function DashboardHome() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    /** * max-w-md: Keeps the layout "Phone sized" even on 4K monitors
     * items-center: Centers the phone-column in the middle of the screen
     */
    <main className="h-screen w-full overflow-hidden flex flex-col p-2 bg-black max-w-2xl mx-auto">
      <div className="flex-shrink-0 p-2">
        <Dashboardheader />
      </div>

      <div className="flex-grow overflow-y-auto overflow-x-hidden  pb-24 scrollbar-hide">
        {/* Changed from grid-cols-2 to grid-cols-1 to force stacking */}
        <div className="grid grid-cols-1 gap-8 items-start">
          <IronFeed isSignedIn={!!isSignedIn} />
          <QuickSlip isSignedIn={!!isSignedIn} />
        </div>
      </div>
    </main>
  );
}
