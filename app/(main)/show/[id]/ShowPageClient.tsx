'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Show } from '@/lib/types';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ShowIdFallback } from '@/components/ui/ShowIdFallback';
import EpisodeCard from '@/components/cards/EpisodeCard';

interface ShowPageClientProps {
  id: string;
}

export default function ShowPageClient({ id }: ShowPageClientProps) {
  const [show, setShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const { data, error } = await supabase
          .from('shows')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setShow(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch show');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const { data: episodesData, error: episodesError } = await supabase
          .from('episodes')
          .select('*')
          .eq('show_id', id)
          .order('season_number', { ascending: true })
          .order('episode_number', { ascending: true });

        if (episodesError) throw episodesError;
        setEpisodes(episodesData || []);
      } catch (err) {
        console.error('Failed to fetch episodes:', err);
      }
    };

    if (id) {
      fetchEpisodes();
    }
  }, [id]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !show) {
    return <ShowIdFallback showId={id} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{show.title}</h1>
        {show.description && (
          <p className="text-gray-300">{show.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes.map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            showId={id}
          />
        ))}
      </div>
    </div>
  );
} 