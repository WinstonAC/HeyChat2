'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, MessageSquare, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home },
  { href: '/shows', icon: LayoutGrid },
  { href: '/chats', icon: MessageSquare },
  { href: '/profile', icon: User },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between w-full fixed bottom-0 left-0 right-0 px-4 py-2 bg-black pb-safe z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center text-xs no-underline"
          >
            <item.icon
              className={`h-6 w-6 ${
                isActive ? 'text-accent' : 'text-zinc-400'
              }`}
            />
            <span
              className={`mt-1 ${
                isActive ? 'text-accent' : 'text-zinc-400'
              }`}
            >
              {item.href === '/'
                ? 'Home'
                : item.href.replace('/', '').charAt(0).toUpperCase() +
                  item.href.slice(2)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
