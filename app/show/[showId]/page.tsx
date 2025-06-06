'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import type { Show, Episode } from '@/lib/types';
import AppLayout from '@/components/layout/AppLayout';

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
    return (
      <AppLayout showHeader={true} headerTitle="Loading..." showBack={true}>
        <p className="text-center">Loading show details...</p>
      </AppLayout>
    );
  }

  if (error || !show) {
    return (
      <AppLayout showHeader={true} headerTitle="Error" showBack={true}>
        <p className="text-center text-red-500">{error || 'Show not found.'}</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout showHeader={true} headerTitle={show.title} showBack={true}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Episodes</h2>
        {episodes.length > 0 ? (
          <div className="space-y-3">
            {episodes.map((episode) => (
              <Link
                key={episode.id}
                href={`/show/${showId}/season/${episode.season_number}/episode/${episode.id}`}
                className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold">S{episode.season_number}E{episode.episode_number}: {episode.title}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <p>No episodes found for this show.</p>
        )}
      </div>
    </AppLayout>
  );
} 