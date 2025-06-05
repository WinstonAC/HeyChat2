'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, MessageSquare, User } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shows', label: 'Shows', icon: Film },
  { href: '/conversation', label: 'Chats', icon: MessageSquare },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-gray-800 border-t border-gray-700 shadow-t-md">
      <div className="flex items-center justify-around h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} legacyBehavior>
              <a className={`flex flex-col items-center justify-center w-full h-full p-2 transition-colors duration-200 
                            ${isActive ? 'text-blue-500' : 'text-gray-400 hover:text-blue-400'}`}>
                <item.icon size={24} className={`mb-0.5 ${isActive ? 'fill-current' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 