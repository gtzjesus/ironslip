'use client';

import { useUser } from '@clerk/nextjs';
import QuickSlip from '@/components/dashboard/common/QuickSlip';
import IronFeed from '@/components/dashboard/feed/IronFeed';
import FeedHeader from '@/components/dashboard/feed/Feedheader';

export default function DashboardHome() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <main className="h-screen w-full overflow-hidden flex flex-col p-2 bg-black max-w-2xl mx-auto">
      <meta name="theme-color" content="#000000" />
      <div className="flex-shrink-0 p-2">
        <FeedHeader />
      </div>

      <div className="flex-grow overflow-y-auto overflow-x-hidden pb-24 scrollbar-hide">
        <div className="grid grid-cols-1 gap-8 items-start">
          <IronFeed isSignedIn={!!isSignedIn} />
          <QuickSlip isSignedIn={!!isSignedIn} />
        </div>
      </div>
    </main>
  );
}