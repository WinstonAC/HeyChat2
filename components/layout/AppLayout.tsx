'use client';

import React from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* <Header /> ← sticky, black bg, z-50 */}
      <Header />
      {/* <main> ← max-w-md, centered, full height, bg-black */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      {/* <BottomNavigation /> ← fixed bottom-0, black bg */}
      <BottomNavigation />
    </div>
  );
} 