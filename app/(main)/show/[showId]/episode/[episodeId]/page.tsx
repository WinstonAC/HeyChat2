'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Episode, Show } from '@/lib/types';
import Loading from '@/components/common/Loading';
import Image from 'next/image';
import FilterPill from '@/components/ui/FilterPill';
import CommentList from '@/components/comments/CommentList';
import ThreadList from '@/components/threads/ThreadList';

export default function EpisodePage({ params }: { params: { showId: string, episodeId: string } }) {
  const { showId, episodeId } = params;
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Comments');

  useEffect(() => {
    if (!episodeId || !showId) return;

    const fetchEpisodeData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch episode details
        const { data: episodeData, error: episodeError } = await supabase
          .from('episodes')
          .select('*')
          .eq('id', episodeId)
          .single();
        if (episodeError) throw episodeError;
        setEpisode(episodeData);

        // Fetch show details for context
        const { data: showData, error: showError } = await supabase
          .from('shows')
          .select('*')
          .eq('id', showId)
          .single();
        if (showError) throw showError;
        setShow(showData);

      } catch (err: any) {
        setError(err.message || 'Failed to fetch episode data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeData();
  }, [episodeId, showId]);

  if (loading) return <Loading />;
  if (error || !episode || !show) return <p className="p-4 text-center text-red-500">{error || 'Episode not found.'}</p>;

  return (
    <div>
      {show.poster_url && (
         <div className="relative w-full h-48">
          <Image src={show.poster_url} alt={`${show.title} poster`} layout="fill" objectFit="cover" className="opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
      )}
      <div className="p-4 -mt-24 relative z-10">
        <h2 className="text-lg font-semibold text-gray-300">{show.title}</h2>
        <h1 className="text-3xl font-bold mt-1">
          S{episode.season_number} E{episode.episode_number}: {episode.title}
        </h1>
        <p className="text-sm text-gray-400 mt-2">{episode.description}</p>
      </div>

      <div className="p-4">
        <div className="flex items-center border-b border-zinc-800">
          <FilterPill label="Comments" isActive={activeTab === 'Comments'} onClick={() => setActiveTab('Comments')} />
          <FilterPill label="Threads" isActive={activeTab === 'Threads'} onClick={() => setActiveTab('Threads')} />
        </div>
        <div className="mt-6">
          {activeTab === 'Comments' && (
            <CommentList episodeId={episode.id} />
          )}
          {activeTab === 'Threads' && (
            <ThreadList episodeId={episode.id} />
          )}
        </div>
      </div>
    </div>
  );
} 