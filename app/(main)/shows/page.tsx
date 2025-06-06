'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Show } from '@/lib/types';
import ShowCard from '@/components/cards/ShowCard';
import Loading from '@/components/common/Loading';

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const { data, error } = await supabase
          .from('shows')
          .select('*')
          .order('title', { ascending: true });

        if (error) {
          throw error;
        }
        setShows(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch shows.');
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  return (
    <div className="p-4">
      {loading && <Loading />}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          {shows.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {shows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No shows found.</p>
          )}
        </>
      )}
    </div>
  );
} 