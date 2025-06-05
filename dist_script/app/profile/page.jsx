'use client';
// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabaseClient'; // Assuming you have this for Supabase
// import { User } from '@supabase/supabase-js';
// import { useRouter } from 'next/navigation';
export default function ProfilePage() {
    // const [user, setUser] = useState<User | null>(null);
    // const [loading, setLoading] = useState(true);
    // const router = useRouter();
    // useEffect(() => {
    //   const fetchUser = async () => {
    //     const { data: { session }, error } = await supabase.auth.getSession();
    //     if (error) {
    //       console.error("Error fetching session:", error);
    //       router.push('/login');
    //       return;
    //     }
    //     if (session?.user) {
    //       setUser(session.user);
    //     } else {
    //       router.push('/login'); // Redirect to login if no user
    //     }
    //     setLoading(false);
    //   };
    //   fetchUser();
    // }, [router]);
    // const handleLogout = async () => {
    //   await supabase.auth.signOut();
    //   router.push('/');
    // };
    // if (loading) {
    //   return (
    //     <div className="container mx-auto px-4 py-8 text-center">
    //       <p className="text-xl text-gray-400">Loading profile...</p>
    //     </div>
    //   );
    // }
    // if (!user) {
    //   // This case should ideally be handled by the redirect in useEffect
    //   return (
    //     <div className="container mx-auto px-4 py-8 text-center">
    //       <p className="text-xl text-red-500">Please login to view your profile.</p>
    //       {/* Optionally, add a link to login page */}
    //     </div>
    //   );
    // }
    return (<div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-gray-800 shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          User Profile
        </h1>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Email:</p>
            {/* <p className="text-lg text-white">{user.email}</p> */}
            <p className="text-lg text-white">user@example.com (placeholder)</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">User ID:</p>
            {/* <p className="text-sm text-gray-300 break-all">{user.id}</p> */}
            <p className="text-sm text-gray-300 break-all">placeholder-user-id</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Last Signed In:</p>
            {/* <p className="text-sm text-gray-300">
          {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
        </p> */}
             <p className="text-sm text-gray-300">N/A (placeholder)</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button 
    // onClick={handleLogout} 
    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-150 ease-in-out disabled:opacity-50" title="Logout functionality to be implemented" disabled // Enabled once auth is wired
    >
            Logout (Coming Soon)
          </button>
        </div>
         <p className="mt-4 text-center text-xs text-gray-500">
          (User data and logout will be wired to Supabase auth later)
        </p>
      </div>
    </div>);
}
