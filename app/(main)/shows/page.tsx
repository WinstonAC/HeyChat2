'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Show } from '@/lib/types';
import ShowCard from '@/components/cards/ShowCard';
import Loading from '@/components/common/Loading';
import FilterPill from '@/components/ui/FilterPill';
import { ChevronDown } from 'lucide-react';
import { SearchBar } from '@/components/common/SearchBar';

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [platforms, setPlatforms] = useState<string[]>(['All']);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const { data, error } = await supabase.from('shows').select('platform').neq('platform', null);
        const platforms = data ? [...new Set(data.map((item) => item.platform))] : [];
        if (error) {
          console.error('Failed to fetch platforms:', error);
          setPlatforms(['All']);
        } else {
          setPlatforms(['All', ...platforms]);
        }
      } catch (err) {
        console.error("Failed to fetch platforms:", err);
      }
    };
    fetchPlatforms();
  }, []);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from('shows').select('*');

        if (activeFilter !== 'All') {
          query = query.eq('platform', activeFilter);
        }
        
        const { data, error } = await query.order('title', { ascending: true });

        if (error) throw error;
        setShows(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch shows.');
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [activeFilter]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">What We're Watching</h1>
      
      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {platforms.map((platform) => (
            <FilterPill
              key={platform}
              label={platform}
              isActive={activeFilter === platform}
              onClick={() => setActiveFilter(platform)}
            />
          ))}
        </div>
        <button className="flex items-center gap-1 text-sm font-semibold bg-zinc-800 px-3 py-2 rounded-full hover:bg-zinc-700">
          Popular
          <ChevronDown size={16} />
        </button>
      </div>

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