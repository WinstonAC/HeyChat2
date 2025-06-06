'use client';

import { ChevronLeft, LogOut } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../AuthProvider';
import { supabase } from '../../lib/supabaseClient';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };
  
  // Determine header properties based on path
  const isSubPage = pathname.startsWith('/show/') || pathname.startsWith('/profile');
  let title = 'HeyChat';
  if (pathname === '/shows') {
    title = 'Browse Shows';
  } else if (isSubPage) {
    // This is a simplification. A real app might use a global state
    // or context to set the title from the page component itself.
    title = "Details";
  }


  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 bg-black border-b border-white/10 text-white">
      <div className="flex items-center">
        {isSubPage ? (
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
              <span className="text-lg font-bold">{title}</span>
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