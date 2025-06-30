"use client";
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
const Navbar = () => {
    const [user, setUser] = useState(null);
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
    return (<nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
            HeyChat
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
            Profile
          </Link>
          <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup" className="text-gray-300 hover:text-white transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>);
};
export default Navbar;
