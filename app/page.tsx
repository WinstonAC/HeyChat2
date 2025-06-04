'use client';

import { useEffect, useState } from 'react';
import ShowCard from '@/components/ShowCard';
import type { Show } from '@/lib/types';

async function fetchShows(): Promise<Show[]> {
  try {
    const response = await fetch('/api/shows');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.shows || []; // Assuming the API returns { shows: [...] }
  } catch (error) {
    console.error("Failed to fetch shows:", error);
    return []; // Return empty array on error
  }
}

export default function HomePage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadShows = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedShows = await fetchShows();
        setShows(fetchedShows);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      }
      setLoading(false);
    };
    loadShows();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Explore TV Shows</h1>
      
      {loading && (
        <div className="text-center">
          <p className="text-xl text-gray-400">Loading shows...</p>
          {/* You can add a spinner component here */}
        </div>
      )}

      {error && (
        <div className="text-center p-4 bg-red-900 border border-red-700 rounded-md">
          <p className="text-xl text-white">Error loading shows:</p>
          <p className="text-sm text-red-200">{error}</p>
          <p className="text-sm text-red-200 mt-2">Make sure your API endpoint at /api/shows is running and returning the correct data structure.</p>
        </div>
      )}

      {!loading && !error && shows.length === 0 && (
        <div className="text-center">
          <p className="text-xl text-gray-400">No shows found.</p>
          <p className="text-sm text-gray-500">Check if the API is returning any shows or if there's an issue with the data.</p>
        </div>
      )}

      {!loading && !error && shows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      )}
    </div>
  );
} 