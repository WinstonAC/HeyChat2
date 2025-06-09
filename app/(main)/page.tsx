'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import ShowCard from '@/components/cards/ShowCard';
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Show } from '@/lib/types';

const HomeFeed = () => {
  const [activeTab, setActiveTab] = useState('Trending');
  const [trendingShows, setTrendingShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Show[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const tabs = ['Trending', 'Following', 'Latest'];

  useEffect(() => {
    const fetchTrendingShows = async () => {
      try {
        // First try to get shows ordered by created_at
        const { data, error } = await supabase
          .from('shows')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching shows:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn('No shows found in database');
          setTrendingShows([]);
        } else {
          setTrendingShows(data);
        }
      } catch (err) {
        console.error('Error in fetchTrendingShows:', err);
        setError('Failed to load shows. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingShows();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('shows')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(10);

        if (error) {
          console.error('Search error:', error);
          throw error;
        }

        setSearchResults(data || []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to perform search');
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Set up debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch(searchQuery);
  };

  return (
    <div className="min-h-screen max-w-screen-sm mx-auto bg-black text-white px-4 pt-16 pb-20 pb-safe">
      {/* Header */}
      <div className="sticky top-0 bg-black border-b border-gray-800 p-4 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">HeyChat</h1>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative w-full mb-4 mt-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search shows, episodes, or users"
          className="w-full h-11 px-4 rounded-md bg-zinc-900 text-white placeholder-zinc-500 pl-10 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </form>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="mb-6">
          {isSearching ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-900 rounded-lg p-4 animate-pulse">
                  <div className="h-4 w-3/4 bg-zinc-800 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Search Results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchResults.map((show) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-zinc-500">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      )}

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
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900 rounded-lg p-4 animate-pulse">
                <div className="h-4 w-3/4 bg-zinc-800 rounded mb-2" />
                <div className="h-3 w-1/2 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-purple-600 hover:bg-purple-700"
            >
              Try Again
            </Button>
          </div>
        ) : !searchQuery.trim() && activeTab === 'Trending' && (
          trendingShows.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingShows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-500">No shows available right now.</p>
          )
        )}
        {!loading && !searchQuery.trim() && activeTab !== 'Trending' && (
          <p className="text-center text-zinc-500 py-8">{activeTab} feed coming soon...</p>
        )}
      </div>
    </div>
  );
};

export default HomeFeed; 