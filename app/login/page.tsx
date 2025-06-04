"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      router.push('/show/and-just-like-that');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form 
        onSubmit={handleLogin} 
        className="p-6 mt-8 bg-white rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Login</h2>
        <label className="block mb-2">
          <span className="text-gray-700">Email:</span>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required 
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Password:</span>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required 
          />
        </label>
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
} 