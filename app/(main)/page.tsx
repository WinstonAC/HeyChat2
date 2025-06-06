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
        setError(err.message || "Failed to fetch trending shows.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingShows();
  }, [activeTab]);

  return (
    <div className="max-w-md mx-auto w-full min-h-screen bg-black text-white px-4 pt-16 pb-20">
      {/* Search Bar */}
      <div className="relative w-full mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#999999]" />
        </div>
        <input
          type="text"
          placeholder="Search shows, episodes, or users"
          className="w-full px-4 py-2 rounded-md bg-[#222222] border border-white/10 text-white placeholder-gray-500 pl-10"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-8 border-b border-white/10 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 text-sm font-medium transition-colors
              ${
                activeTab === tab
                  ? 'text-[#9b87f5] border-b-2 border-[#9b87f5]'
                  : 'text-[#999999] hover:text-white'
              }
            `}
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 mx-auto mb-4">
              {trendingShows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          ) : (
            <p className="text-center text-[#999999]">No trending shows right now.</p>
          )
        )}
        {!loading && activeTab !== 'Trending' && (
          <p className="text-center text-[#999999] py-8">{activeTab} feed coming soon...</p>
        )}
      </div>
    </div>
  );
};

export default HomeFeed; 