'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export default function Header({ title, showBack = false }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 bg-gray-800 shadow-md text-white">
      <div className="flex items-center">
        {showBack && (
          <button 
            onClick={() => router.back()} 
            className="mr-2 p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-semibold truncate">{title}</h1>
      </div>
      <div className="flex items-center">
        {/* Placeholder for future elements like profile icon or settings */}
        {/* <div className="w-8 h-8 bg-gray-700 rounded-full"></div> */}
      </div>
    </header>
  );
} 