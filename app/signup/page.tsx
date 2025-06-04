"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for verification!');
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form 
        onSubmit={handleSignup} 
        className="p-6 mt-8 bg-white rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Sign Up</h2>
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
          className="w-full py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
} 