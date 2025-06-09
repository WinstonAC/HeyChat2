'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Show } from '@/lib/types'; // Assuming types are in lib/types.ts

interface ShowCardProps {
  show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
  return (
    <Link href={`/show/${show.id}`} className="block">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 w-full">
        {show.poster_url ? (
          <Image
            src={show.poster_url}
            alt={show.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#222]">
            <span className="text-[#999]">No Poster</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
          <p className="text-white font-semibold truncate">{show.title}</p>
          {show.platform && <span className="text-xs text-zinc-400">{show.platform}</span>}
        </div>
      </div>
    </Link>
  );
};

export default ShowCard; 