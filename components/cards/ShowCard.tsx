'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Show } from '@/lib/types'; // Assuming types are in lib/types.ts

interface ShowCardProps {
  show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
  return (
    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white/5 flex flex-col">
      {show.poster_url ? (
        <img
          src={show.poster_url}
          alt={show.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#222]">
          <span className="text-[#999]">No Poster</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <p className="text-white font-semibold truncate text-base text-left">
          {show.title}
        </p>
        {show.platform && (
          <span className="text-xs text-gray-400">{show.platform}</span>
        )}
      </div>
    </div>
  );
};

export default ShowCard; 