'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../AuthProvider';
import { supabase } from '../../lib/supabaseClient';

export default function Header() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-16 bg-black/80 backdrop-blur-sm flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Image src="/HeyChat.png" alt="HeyChat logo" width={32} height={32} />
        <span className="text-lg font-bold">HeyChat</span>
      </div>
      {user && (
        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Logout">
          <LogOut size={22} />
        </button>
      )}
    </header>
  );
} 