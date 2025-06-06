'use client';

import Link from 'next/link';
import { Tv } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black flex flex-col items-center justify-center text-center px-4">
      <main className="flex flex-col items-center justify-center flex-grow">
        <Tv className="w-24 h-24 text-accent" />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mt-6">
          HEY CHAT
        </h1>
        <div className="mt-8">
          <Link href="/shows" className="bg-accent text-black font-bold py-3 px-6 rounded-lg hover:bg-accent-hover transition-colors duration-300">
            Browse Shows
          </Link>
        </div>
      </main>
    </div>
  );
} 