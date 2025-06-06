'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Show, Episode } from '@/lib/types';
import EpisodeCard from '@/components/cards/EpisodeCard';
import Loading from '@/components/common/Loading';

export default function ShowPage({ params }: { params: { showId: string } }) {
  const { showId } = params;
  const [show, setShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!showId) return;

    const fetchShowData = async () => {
      setLoading(true);
      try {
        // Fetch show details
        const { data: showData, error: showError } = await supabase
          .from('shows')
          .select('id, title')
          .eq('id', showId)
          .single();

        if (showError) throw showError;
        setShow(showData);

        // Fetch episodes for the show
        const { data: episodesData, error: episodesError } = await supabase
          .from('episodes')
          .select('*')
          .eq('show_id', showId)
          .order('season_number', { ascending: true })
          .order('episode_number', { ascending: true });

        if (episodesError) throw episodesError;
        setEpisodes(episodesData || []);

      } catch (err: any) {
        setError(err.message || 'Failed to fetch show data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowData();
  }, [showId]);

  if (loading) {
    return <Loading />;
  }

  if (error || !show) {
    return <p className="text-center text-red-500">{error || 'Show not found.'}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Episodes</h2>
      {episodes.length > 0 ? (
        <div className="space-y-3">
          {episodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} showId={showId} />
          ))}
        </div>
      ) : (
        <p>No episodes found for this show.</p>
      )}
    </div>
  );
} 