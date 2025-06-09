'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import type { Show, Episode } from '@/lib/types';

export default function Page() {
  const params = useParams();
  const [show, setShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowAndEpisodes = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        setError(null);

        // Fetch show data
        const { data: showData, error: showError } = await supabase
          .from('shows')
          .select('*')
          .eq('id', params.id)
          .single();

        if (showError) throw showError;
        setShow(showData);

        // Fetch episodes
        const { data: episodesData, error: episodesError } = await supabase
          .from('episodes')
          .select('*')
          .eq('show_id', params.id)
          .order('season', { ascending: true })
          .order('episode_number', { ascending: true });

        if (episodesError) throw episodesError;
        setEpisodes(episodesData || []);

        // Set initial season to first available
        if (episodesData && episodesData.length > 0) {
          setSelectedSeason(episodesData[0].season.toString());
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load show');
      } finally {
        setLoading(false);
      }
    };

    fetchShowAndEpisodes();
  }, [params.id]);

  if (!params.id) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <p>Show Not Found</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-3/4 bg-zinc-800 rounded" />
          <div className="h-4 w-1/2 bg-zinc-800 rounded" />
          <div className="h-10 w-full bg-zinc-800 rounded" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-zinc-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <p className="text-red-500">{error || 'Show not found'}</p>
        <Link href="/" className="text-purple-500 hover:text-purple-400">
          Return to Home
        </Link>
      </div>
    );
  }

  // Get unique seasons
  const seasons = [...new Set(episodes.map(ep => ep.season))].sort((a, b) => a - b);
  
  // Filter episodes by selected season
  const seasonEpisodes = episodes.filter(ep => ep.season.toString() === selectedSeason);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-black border-b border-gray-800 p-4 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-zinc-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold truncate">{show.title}</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-48">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${show.image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Show Info */}
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{show.title}</h2>
            <p className="text-sm text-zinc-400">{episodes.length} episodes</p>
          </div>
        </div>
        <p className="text-sm text-zinc-300">{show.description}</p>
      </div>

      {/* Season Selector */}
      <div className="px-4 pb-4">
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-zinc-900 text-white border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {seasons.map(season => (
            <option key={season} value={season}>
              Season {season}
            </option>
          ))}
        </select>
      </div>

      {/* Episodes List */}
      <div className="px-4 pb-24">
        {seasonEpisodes.length > 0 ? (
          <div className="space-y-4">
            {seasonEpisodes.map((episode) => (
              <div key={episode.id} className="bg-zinc-900 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Episode {episode.episode_number}</h3>
                    <p className="text-sm text-zinc-400">{episode.title}</p>
                    {episode.air_date && (
                      <p className="text-xs text-zinc-500 mt-1">
                        {new Date(episode.air_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/chats?show_id=${show.id}&episode_id=${episode.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm"
                    aria-label={`Join discussion for ${episode.title}`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Join Chat
                  </Link>
                </div>
                {episode.description && (
                  <p className="text-sm text-zinc-300 mt-2">{episode.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-zinc-500 py-8">No episodes found for this season.</p>
        )}
      </div>
    </div>
  );
} 