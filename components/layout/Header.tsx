'use client';

import { ChevronLeft, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabaseClient';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export default function Header({ title, showBack = false }: HeaderProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 bg-gray-800 shadow-md text-white">
      <div className="flex items-center">
        {showBack ? (
          <>
            <button 
              onClick={() => router.back()} 
              className="mr-2 p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold truncate">{title}</h1>
          </>
        ) : (
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image src="/HeyChat.png" alt="HeyChat logo" width={32} height={32} />
              <span className="text-lg font-bold">HeyChat</span>
            </div>
          </Link>
        )}
      </div>
      <div className="flex items-center">
        {user && (
          <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Logout">
            <LogOut size={22} />
          </button>
        )}
      </div>
    </header>
  );
} 