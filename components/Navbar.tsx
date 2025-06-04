"use client";

import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between p-6 bg-gray-800 text-white">
      <div className="flex items-center">
        <Link href="/" legacyBehavior>
          <a>
            <Image src="/logo.png" alt="HeyChat Logo" width={100} height={40} />
          </a>
        </Link>
      </div>
      <div>
        {user ? (
          <button onClick={handleLogout} className="mr-4">Logout</button>
        ) : (
          <>
            <Link href="/login" legacyBehavior><a className="mr-4">Login</a></Link>
            <Link href="/signup" legacyBehavior><a>Sign Up</a></Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 