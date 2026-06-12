"use client";

import dynamic from 'next/dynamic';

const CoffeeCupLoader = dynamic(() => import('@/components/CoffeeCupLoader'), { ssr: false });

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)]">
      <div className="flex flex-col items-center gap-6">
        <CoffeeCupLoader />
        
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center text-xl font-medium text-amber-800 dark:text-amber-400 tracking-wide animate-pulse">
            <span>Memuat data...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
