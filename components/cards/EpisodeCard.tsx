'use client';

import Link from 'next/link';
import type { Episode } from '@/lib/types';
import { PlayCircle, MessageSquare } from 'lucide-react';

interface EpisodeCardProps {
  episode: Episode;
  showId: string;
}

export default function EpisodeCard({ episode, showId }: EpisodeCardProps) {
  return (
    <Link 
      href={`/show/${showId}/episode/${episode.id}`}
      className="block p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">
            S{episode.season_number}E{episode.episode_number}: {episode.title}
          </h3>
          {episode.description && (
            <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
              {episode.description}
            </p>
          )}
        </div>
        <div className="w-8 h-8 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
} 