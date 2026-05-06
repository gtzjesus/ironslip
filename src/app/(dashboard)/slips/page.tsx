'use client';

import SlipHeader from '@/app/components/common/Slipheader';

export default function SlipsPage() {
  return (
    <main className="h-screen w-full overflow-hidden flex flex-col p-2 bg-black max-w-2xl mx-auto">
      <div className="flex-shrink-0 p-2">
        <SlipHeader />
      </div>
    </main>
  );
}
