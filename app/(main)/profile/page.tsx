'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Loading from '@/components/common/Loading';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen max-w-screen-sm mx-auto bg-black text-white px-4 pt-16 pb-20 pb-safe">
        <Loading />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen max-w-screen-sm mx-auto bg-black text-white px-4 pt-16 pb-20 pb-safe">
        <div className="text-center py-8">
          <p className="text-red-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-screen-sm mx-auto bg-black text-white px-4 pt-16 pb-20 pb-safe">
      <div className="bg-zinc-900 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Profile
        </h1>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-zinc-400">Email</p>
            <p className="text-lg text-white">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">Last Signed In</p>
            <p className="text-sm text-zinc-300">
              {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button 
            onClick={handleLogout} 
            className="min-w-[44px] min-h-[44px] px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-150 ease-in-out disabled:opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 