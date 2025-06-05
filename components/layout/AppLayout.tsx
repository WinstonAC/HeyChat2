'use client';

import React from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
  showBackButtonInHeader?: boolean;
}

export default function AppLayout({
  children,
  showNav = true,
  showHeader = true,
  headerTitle = 'HeyChat',
  showBackButtonInHeader = false,
}: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {showHeader && <Header title={headerTitle} showBack={showBackButtonInHeader} />}
      <main 
        className={`flex-grow 
                  ${showHeader ? 'pt-16' : ''} 
                  ${showNav ? 'pb-16' : ''}`}
      >
        <div className="p-4 h-full">
          {children}
        </div>
      </main>
      {showNav && <BottomNavigation />}
    </div>
  );
} 