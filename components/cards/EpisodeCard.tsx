'use client';

import Link from 'next/link';
import { Episode } from '@/lib/types';
import { PlayCircle, MessageSquare } from 'lucide-react';

interface EpisodeCardProps {
  episode: Episode;
  showId: string; // showId is still needed for the link construction
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, showId }) => {
  return (
    <Link href={`/show/${showId}/episode/${episode.id}`} passHref>
      <div className="block bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition-colors group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-400">
              Season {episode.season_number}, Episode {episode.episode_number}
            </p>
            <h4 className="text-lg font-bold text-white mt-1">{episode.title}</h4>
            <p className="text-sm text-gray-300 mt-2 line-clamp-2">
              {episode.description}
            </p>
          </div>
          <PlayCircle className="h-10 w-10 text-gray-500 group-hover:text-white transition-colors" />
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400 mt-3 pt-3 border-t border-zinc-700/50">
           <div className="flex items-center gap-1">
                <MessageSquare size={14} />
                <span>View Comments</span>
           </div>
        </div>
      </div>
    </Link>
  );
};

export default EpisodeCard; 