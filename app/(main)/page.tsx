'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import type { Show } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import Loading from '@/components/common/Loading';
import ShowCard from '@/components/cards/ShowCard';

const HomeFeed = () => {
  const [activeTab, setActiveTab] = useState('Trending');
  const [trendingShows, setTrendingShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tabs = ['Trending', 'For You', 'Following'];

  useEffect(() => {
    const fetchTrendingShows = async () => {
      if (activeTab !== 'Trending') {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('shows')
          .select('*')
          .order('title', { ascending: true })
          .limit(12);
        if (error) throw error;
        setTrendingShows(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch trending shows.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingShows();
  }, [activeTab]);

  return (
    <div className="min-h-screen max-w-screen-sm mx-auto bg-black text-white px-4 pt-16 pb-20 pb-safe">
      {/* Search Bar */}
      <div className="relative w-full mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-500" />
        </div>
        <input
          type="text"
          placeholder="Search shows, episodes, or users"
          className="w-full h-11 px-4 rounded-md bg-zinc-900 text-white placeholder-zinc-500 pl-10"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-between mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-xs py-2 transition-colors duration-200
              ${activeTab === tab
                ? 'text-accent border-b-2 border-accent'
                : 'text-zinc-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Feed Content */}
      <div>
        {loading && <Loading />}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && activeTab === 'Trending' && (
          trendingShows.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingShows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-500">No trending shows right now.</p>
          )
        )}
        {!loading && activeTab !== 'Trending' && (
          <p className="text-center text-zinc-500 py-8">{activeTab} feed coming soon...</p>
        )}
      </div>
    </div>
  );
};

export default HomeFeed; 