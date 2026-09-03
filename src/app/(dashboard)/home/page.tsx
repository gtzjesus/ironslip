'use client';

import { useUser } from '@clerk/nextjs';
import IronFeed from '@/components/dashboard/feed/IronFeed';
import FeedHeader from '@/components/dashboard/feed/Feedheader';

export default function DashboardHome() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <main 
      className="h-screen w-full overflow-hidden flex flex-col  max-w-2xl mx-auto"
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

      <div className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="grid grid-cols-1 items-start">
          <IronFeed isSignedIn={!!isSignedIn} />
        </div>
      </div>
    </main>
  );
}