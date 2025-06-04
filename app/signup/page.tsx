"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    console.log('Signup attempt with:', { email }); // Don't log password
    // Placeholder for Supabase email signup logic
    // try {
    //   // const { error } = await supabase.auth.signUp({ email, password });
    //   // if (error) throw error;
    //   // setSuccess('Signup successful! Please check your email to confirm.');
    //   // setEmail(''); setPassword(''); setConfirmPassword(''); // Clear form
    // } catch (err: any) {
    //   setError(err.message || 'Failed to sign up. Please try again.');
    // }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setError('Signup functionality will be wired to Supabase later.');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm rounded-t-md"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm rounded-b-md"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-700 border border-red-500 text-red-100 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-700 border border-green-500 text-green-100 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Success: </strong>
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-500 hover:text-blue-400">
            Sign in
          </Link>
        </p>
        <p className="mt-1 text-center text-xs text-gray-500">
          (Signup will be wired to Supabase later)
        </p>
      </div>
    </div>
  );
} 