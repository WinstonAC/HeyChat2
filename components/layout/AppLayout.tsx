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
      <Header />
      <main className="flex-grow pt-16 pb-16">
        <div className="p-4 h-full">
          {children}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
} 