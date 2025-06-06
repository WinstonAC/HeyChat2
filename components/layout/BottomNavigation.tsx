'use client';

import Link from 'next/link';
import { Home, Tv, MessageCircle, User } from 'lucide-react';

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-zinc-800 flex justify-around items-center z-50">
      <Link href="/" className="flex flex-col items-center text-white hover:text-purple-400 transition-all duration-200">
        <Home className="h-6 w-6" />
        <span className="text-xs">Home</span>
      </Link>
      <Link href="/shows" className="flex flex-col items-center text-white hover:text-purple-400 transition-all duration-200">
        <Tv className="h-6 w-6" />
        <span className="text-xs">Shows</span>
      </Link>
      <Link href="/conversation" className="flex flex-col items-center text-white hover:text-purple-400 transition-all duration-200">
        <MessageCircle className="h-6 w-6" />
        <span className="text-xs">Chats</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center text-white hover:text-purple-400 transition-all duration-200">
        <User className="h-6 w-6" />
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation; 