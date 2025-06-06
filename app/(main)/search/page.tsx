'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Show, Episode } from '@/lib/types';
import Loading from '@/components/common/Loading';
import ShowCard from '@/components/cards/ShowCard';
import EpisodeCard from '@/components/cards/EpisodeCard';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [shows, setShows] = useState<Show[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setLoading(false);
        setShows([]);
        setEpisodes([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Fetch shows
        const { data: showsData, error: showsError } = await supabase
          .from('shows')
          .select('*')
          .ilike('title', `%${query}%`);
        if (showsError) throw showsError;
        setShows(showsData || []);

        // Fetch episodes
        const { data: episodesData, error: episodesError } = await supabase
          .from('episodes')
          .select('*')
          .ilike('title', `%${query}%`);
        if (episodesError) throw episodesError;
        setEpisodes(episodesData || []);

      } catch (err: any) {
        setError(err.message || 'Failed to perform search.');
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for "{query}"
      </h1>

      {loading && <Loading />}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-8">
          {shows.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Shows</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {shows.map((show) => <ShowCard key={show.id} show={show} />)}
              </div>
            </div>
          )}

          {episodes.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Episodes</h2>
              <div className="space-y-3">
                {episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} showId={episode.show_id} />)}
              </div>
            </div>
          )}

          {shows.length === 0 && episodes.length === 0 && (
            <p className="text-center text-gray-400">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
}


export default function SearchPage() {
    return (
        <Suspense fallback={<Loading />}>
            <SearchResults />
        </Suspense>
    )
} 