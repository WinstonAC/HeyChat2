'use client';

import React from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col max-w-screen-sm mx-auto px-4">
      <Header />
      <main className="flex-1 pt-[72px] pb-[80px]">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
