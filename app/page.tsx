'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center text-center px-4">
      <header className="mb-12">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Welcome to <span className="text-blue-500">HeyChat</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          Discover, discuss, and dive deep into your favorite TV shows. Join the conversation and never miss a moment.
        </p>
      </header>

      <main className="mb-12">
        <p className="text-md md:text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          HeyChat is your ultimate companion for tracking episodes, sharing insights, and connecting with fellow fans. 
          Explore a vast library of shows and find your next binge-watch obsession.
        </p>
        <Link href="/shows" legacyBehavior>
          <a className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105">
            Browse Shows
          </a>
        </Link>
      </main>

      <footer className="mt-auto py-8">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} HeyChat. All rights reserved.
        </p>
      </footer>
    </div>
  );
} 